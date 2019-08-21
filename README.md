# Postgres  + Postgis + Node + Serverless  example 

# local
docker run --name some-postgis -e POSTGRES_PASSWORD=mysecretpassword -d mdillon/postgis -p 5432:5432

# postgres
# O6zEAlA7cDAcLmO0
gcloud sql connect stores --user=postgres
CREATE EXTENSION postgis;


# setup gcloud
[setup serverless](https://serverless.com/framework/docs/providers/google/guide/credentials#get-credentials--assign-roles)



# local running 
`npm start`

# local development
`npm install -g nodemon`
`nodemon --exec  functions-framework --target=closest`


# Data 
Store Name,Store Location,Address,City,State,Zip Code,Latitude,Longitude,County
Crystal,SWC Broadway & Bass Lake Rd,5537 W Broadway Ave,Crystal,MN,55428-3507,45.0521539,-93.364854,Hennepin County
Duluth,SEC Hwy 53 & Burning Tree Rd,1902 Miller Trunk Hwy,Duluth,MN,55811-1810,46.808614,-92.1681479,St Louis County

```
Find Store
  Your server will locate the nearest store (as the crow flies) from
  store-locations.csv, return the matching store address, as well as
  the distance to that store in JSON format

`select * from "stores" where ST_DWithin("geom::geography", ST_geomFromText('SRID=4326;POINT(37.4260076 -122.0911298)'), '1609') limit 10;`

Usage:
  {server}/closest?zip=<zip>
  {server}/closest?address=<address>
  {server}/closest?zip=<zip>&units=<(mi|km)>

Options:
  ?zip=<zip>            Find nearest store to this zip code. If there are multiple best-matches, return the first.
  ?address=<address>  Find nearest store to this address. If there are multiple best-matches, return the first.
  ?units=(mi|km)        Display units in miles or kilometers [default: mi]

Note:
  addresses should be encoded for the URI
```

Resources
- http://knexjs.org/
- https://devhints.io/knex
- https://www.g9labs.com/2016/04/08/knex-dot-js-and-bookshelf-dot-js-cheat-sheet/
- https://codeburst.io/javascript-unit-testing-using-mocha-and-chai-1d97d9f18e71
- https://postgis.net/docs/ST_DWithin.html
- https://gis.stackexchange.com/questions/76967/what-is-the-unit-used-in-st-distance
- https://stackoverflow.com/questions/25861052/postgis-error-parse-error-invalid-geometry/46467909
- https://github.com/tgriesser/knex/issues/1244
