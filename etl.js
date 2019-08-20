const csv = require("csv-parser");
const fs = require("fs");
const results = [];
const wstream = fs.createWriteStream('knex/seed.sql');

const knex = require("knex");
const knexPostgis = require("knex-postgis");

const environment = process.env.ENVIRONMENT || "development";
const config = require("./knexfile.js")[environment];

const db = knex(config);

// Check if table exists if not create
// db.schema.dropTable('stores');
db.schema.hasTable("stores").then(function(exists) {
  if (!exists) {
    console.log('executing creation')
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
    })
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
        .toString()
        wstream.write(sql+'\;\n')
        return sql;
    }).on("end",  () => {
        console.log('This many results finished:', results.length)
        wstream.end()
    })


db.schema.hasTable("points").then(function(exists) {
  if (!exists) {
    return db.schema.createTable("points", function(t) {
      t.increments("id").primary();
      t.specificType("geom", "geometry(point, 4326)");
    });
  }
});

// install postgis functions in knex.postgis;
const st = knexPostgis(db);
/* or:
 * knexPostgis(db);
 * const st = db.postgis;
 */

// insert a point
const sql1 = db
  .insert({
    geom: st.geomFromText("POINT(-71.064544 42.28787)", 4326)
  })
  .into("points")
  .toString();
console.log(sql1);
// insert into "points" ("geom", "id") values (ST_geomFromText('Point(0 0)'), '1')

// find all points return point in wkt format
// const sql2 =
// console.log('res:', sql2);
// select "id", ST_asText("geom") as "geom" from "points"

// x = async () => {
//   res = await db.select("id", st.asText("geom")).from("points");
//   console.log(res);
// };

// x();
