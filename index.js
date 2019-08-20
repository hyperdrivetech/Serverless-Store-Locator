"use strict";

const googleMapsClient = require("@google/maps").createClient({
  key: process.env["GOOGLE_MAPS_API_KEY"],
  Promise: Promise
});

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
      res = await find_via_address(query_address);
    } else if (zip) {
      res = await find_via_zip(zip, units);
    }
  } catch {
    response
      .status(400)
      .send({ "status:": 400, msg: "no related address/zipcode found" });
  }

  console.log(zip, address, units);
  // response.status(200).send({})
  // res = await query_google();
  response.status(200).send(res);
};

async function find_via_zip(zip, units) {
  let coord = await query_google(zip);
  let d = coord[0].geometry.location
  console.log(coord);
  console.log(db.select('*').from('stores').orderBy(st.distance('geom', `SRID=4326;POINT(${d.lat} ${d.lng})`)).limit(10).toString());
  return coord;
}
async function find_via_address(address) {
  let coord = await query_google(address)[0].geometry.location;
  return coord;
}

function query_google(address) {
  return data;

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

// exports.event = (event, callback) => {
//   callback();
// };

var data = [
  {
    address_components: [
      { long_name: "1600", short_name: "1600", types: ["street_number"] },
      {
        long_name: "Amphitheatre Parkway",
        short_name: "Amphitheatre Pkwy",
        types: ["route"]
      },
      {
        long_name: "Mountain View",
        short_name: "Mountain View",
        types: ["locality", "political"]
      },
      {
        long_name: "Santa Clara County",
        short_name: "Santa Clara County",
        types: ["administrative_area_level_2", "political"]
      },
      {
        long_name: "California",
        short_name: "CA",
        types: ["administrative_area_level_1", "political"]
      },
      {
        long_name: "United States",
        short_name: "US",
        types: ["country", "political"]
      },
      { long_name: "94043", short_name: "94043", types: ["postal_code"] }
    ],
    formatted_address: "1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA",
    geometry: {
      location: { lat: 37.4260076, lng: -122.0911298 },
      location_type: "ROOFTOP",
      viewport: {
        northeast: { lat: 37.4273565802915, lng: -122.0897808197085 },
        southwest: { lat: 37.4246586197085, lng: -122.0924787802915 }
      }
    },
    place_id: "ChIJtYuu0V25j4ARwu5e4wwRYgE",
    plus_code: {
      compound_code: "CWG5+CG Mountain View, California, United States",
      global_code: "849VCWG5+CG"
    },
    types: ["street_address"]
  }
];
