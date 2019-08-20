const csv = require("csv-parser");
const fs = require("fs");
const results = [];

const SEED_FILE = "knex/seed.sql";
try {
  fs.unlinkSync(SEED_FILE);
} catch (err) {
//   console.error(err);
}
const wstream = fs.createWriteStream(SEED_FILE);

const knex = require("knex");
const knexPostgis = require("knex-postgis");

const environment = process.env.ENVIRONMENT || "development";
const config = require("./knexfile.js")[environment];

const db = knex(config);

// Check if table exists if not create
db.schema.dropTable("stores");
db.schema.hasTable("stores").then(function(exists) {
  if (!exists) {
    return db.schema.createTable("stores", function(t) {
      t.increments("id").primary();
      t.string("store_name", 100);
      t.string("store_location", 100);
      t.text("address");
      t.string("city", 100);
      t.string("state", 100);
      t.string("zip_code", 100);
      t.specificType("geom", "geometry(point, 4326)");
      t.string("latitude", 100);
      t.string("longitude", 100);
      t.string("county", 100);
      t.index(["store_name", "address", "geom"]);
    });
  }
});

fs.createReadStream("seed/test.csv")
  .pipe(
    csv({
      mapHeaders: ({ header, index }) => header.toLowerCase().replace(" ", "_")
    })
  )
  .on("data", row => {
    // console.log(row)
    let data = Object.assign({}, row);
    //   data.geom = `POINT(${data.latitude}, ${data.longitude})`
    data.geom = st.geomFromText(
      `POINT(${data.latitude} ${data.longitude})`,
      4326
    );
    results.push(row);
    let sql = db
      .insert(data)
      .into("stores")
      .toString();
    wstream.write(sql + ";\n");
    return sql;
  })
  .on("end", () => {
    console.log("This many results finished:", results.length);
    wstream.end();
  });
