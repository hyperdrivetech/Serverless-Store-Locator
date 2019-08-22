"use strict";

const googleMapsClient = require("@google/maps").createClient({
  key: process.env["GOOGLE_MAPS_API_KEY"],
  Promise: Promise
});
const MAGIC_NUMBER = 10 ^ 1000;
const STORE_ATTRIBUTES = [
  "address",
  "city",
  "county",
  "geom",
  "latitude",
  "longitude",
  "state",
  "store_location",
  "store_name",
  "zip_code"
];
const STORE_ALIAS = Object.assign(...STORE_ATTRIBUTES.map(k => ({ [k]: k })));

const knex = require("knex");
const knexPostgis = require("knex-postgis");

const env = process.env.NODE_ENV || "development";
const config = require("./knexfile.js")[env];

const db = knex(config);
const st = knexPostgis(db);

exports.closest = async (request, response) => {
  let res, set_units;
  const { zip, address, units } = request.query;
  if (!zip && !address) {
    return response.status(400).send({
      "status:": 400,
      msg: "must include zip or address query param'"
    });
  }
  // validates type if its km or mi and then if units are not set, allow them to be miles (mi)
  let default_units = units || "mi";
  if (!["km", "mi"].includes(default_units)) {
    return response
      .status(400)
      .send({ "status:": 400, msg: "supported units are 'mi' or 'km'" });
  }

  set_units = units || "mi";
  try {
    if (address) {
      res = await find_via_address(address, default_units || set_units);
    } else if (zip) {
      res = await find_via_address(zip, default_units || set_units);
    }
  } catch (e) {
    return response.status(400).send({ "status:": 400, msg: String(e) });
  }

  return response.status(200).send({ status: 200, msg: res });
};

async function find_via_address(address, units) {
  let coord = await query_google(address);
  let distance,
    multiplier = 1,
    res = [];
  let d = coord[0].geometry.location;

  // select * from "stores" where ST_DWithin(geom::geography, ST_geomFromText('SRID=4326;POINT(lat lng)'), 1609*10) limit 10
  let origin = st.geomFromText(`SRID=4326;POINT(${d.lat} ${d.lng})`);

  if (units == "km") {
    distance = 1000 * MAGIC_NUMBER;
  } else {
    distance = 1000 * 0.62 * MAGIC_NUMBER; // KM to Mile Ratio
  }

  while (res.length === 0) {
    distance = distance * multiplier;
    multiplier *= 10;
    res = await db
      .select({
        distance: st.distance("geom", origin),
        ...STORE_ALIAS
      })
      .from("stores")
      .where(st.dwithin(knex.raw("geom::geography"), origin, distance))
      .orderBy("distance")
      .limit(10);
  }

  if (res.length > 0) {
    res[0]["distance"] = `${(
      (Number(res[0]["distance"]) * MAGIC_NUMBER) /
      multiplier
    ).toFixed(4)} ${units}`;
    return res[0];
  } else {
    return [];
  }
}

function query_google(address) {
  return googleMapsClient
    .geocode({ address })
    .asPromise()
    .then(response => {
      console.log(response.json.results);
      return response.json.results;
    })
    .catch(err => {
      console.log(err);
      return err;
    });
}
