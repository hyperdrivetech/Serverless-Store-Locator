"use strict";

const googleMapsClient = require("@google/maps").createClient({
  key: process.env["GOOGLE_MAPS_API_KEY"],
  Promise: Promise
});

const DISTANCE_RADIUS = 10; // Described in 10 Miles or 10 Km
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

const environment = process.env.ENVIRONMENT || "development";
const config = require("./knexfile.js")[environment];

const db = knex(config);
const st = knexPostgis(db);

exports.closest = async (request, response) => {
  let res, query_address;
  const { zip, address, units } = request.query;
  query_address = address || "1600 Amphitheatre Parkway, Mountain View, CA";
  if (!zip && !query_address) {
    return response.status(400).send({
      "status:": 400,
      msg: "must include zip or address query param'"
    });
  }

  const query_units = units || "mi";
  if (!query_units && zip) {
    return response
      .status(400)
      .send({ "status:": 400, msg: "supported units are 'mi' or 'km'" });
  }

  try {
    if (query_address && address) {
      res = await find_via_address(query_address, units);
    } else if (zip) {
      res = await find_via_address(zip, units);
    }
  } catch {
    return response
      .status(400)
      .send({ "status:": 400, msg: "no related address/zipcode found" });
  }

  return response.status(200).send({ status: 200, msg: res });
};

async function find_via_address(address, units) {
  let coord = await query_google(address);
  let distance, dis;
  let d = coord[0].geometry.location;
  if (units == "km") {
    distance = 1000 * DISTANCE_RADIUS;
  } else {
    distance = 1000 * 1.60934 * DISTANCE_RADIUS;
  }

  // select * from "stores" where ST_DWithin(geom::geography, ST_geomFromText('SRID=4326;POINT(lat lng)'), 1609*10) limit 10
  let origin = st.geomFromText(`SRID=4326;POINT(${d.lat} ${d.lng})`);
  let res = await db
    .select({
      distance: st.distance("geom", origin),
      ...STORE_ALIAS
    })
    .from("stores")
    .where(st.dwithin(knex.raw("geom::geography"), origin, distance.toFixed(0)))
    .orderBy("distance")
    .limit(10);

  if (res.length > 1) {
    res[0]["distance"] = res[0]["distance"] * 1000;
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
