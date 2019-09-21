# Turbo Pancake


This is a tabular dataset of the locations of every store of a major national retail chain. Basic implementation to load and run postgis queries using node and severless.
The implementation can query the dataset and find the nearest store to a provided address or zip code

## NOTICE: STATUS
---
took down the cloudsql instance so its not working but code works fine

# setup gcloud
[setup serverless](https://serverless.com/framework/docs/providers/google/guide/credentials#get-credentials--assign-roles)


# local running 
``` bash
npm install
npm start
```

# local development
``` bash
npm install -g nodemon
docker run --name some-postgis -e POSTGRES_PASSWORD=mysecretpassword -d mdillon/postgis -p 5432:5432
nodemon --exec  functions-framework --target=closest # allows 
```

# local testing
`npm run test` 

# Data Model
Store Name,Store Location,Address,City,State,Zip Code,Latitude,Longitude,County
Crystal,SWC Broadway & Bass Lake Rd,5537 W Broadway Ave,Crystal,MN,55428-3507,45.0521539,-93.364854,Hennepin County
Duluth,SEC Hwy 53 & Burning Tree Rd,1902 Miller Trunk Hwy,Duluth,MN,55811-1810,46.808614,-92.1681479,St Louis County

```
Find Store
  Your server will locate the nearest store (as the crow flies) from
  store-locations.csv, return the matching store address, as well as
  the distance to that store in JSON format

# Example SQL
`select * from "stores" where ST_DWithin("geom::geography", ST_geomFromText('SRID=4326;POINT(37.4260076 -122.0911298)'), '1609') limit 10;`


#  API DOCS
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

# Example Usage
## SUCCESS 200
- https://us-central1-stan-zheng.cloudfunctions.net/closest?address=Aromas%20Coffeehouse%20Bakeshop%20&%20Cafe&units=km
- https://us-central1-stan-zheng.cloudfunctions.net/closest?address=Aromas%20Coffeehouse
- https://us-central1-stan-zheng.cloudfunctions.net/closest?zip=10002
- https://us-central1-stan-zheng.cloudfunctions.net/closest?zip=10002&units=km


``` json
# https://us-central1-stan-zheng.cloudfunctions.net/closest?zip=10002
{
  "status": 200,
  "msg": {
  "distance": "2.5075 km",
  "address": "255 Greenwich St",
  "city": "New York",
  "county": "New York County",
  "geom": "0101000020E61000005C85DE2C6F5B4440614C9FC2B68052C0",
  "latitude": "40.7143303",
  "longitude": "-74.0111548",
  "state": "NY",
  "store_location": "Greenwich & Murray",
  "store_name": "Tribeca",
  "zip_code": "10007-2377"
  }
}
```

## FAIL 400
https://us-central1-stan-zheng.cloudfunctions.net/closest?units=km
https://us-central1-stan-zheng.cloudfunctions.net/closest
https://us-central1-stan-zheng.cloudfunctions.net/closest?address=Aromas%20Coffeehouse%20Bakeshop%20&%20Cafe&units=inches

```
# http://localhost:8080/closest?zip=10002&units=cat
{
"status:": 400,
"msg": "supported units are 'mi' or 'km'"
}
```
NOTES/TODOS 

- solution pings google geocode API and geocodes an address or zip code. 
- Address then compares against the relation postgres database with postgis installed.
- Assumptions 
  - Google Address Geocoding can accept any malformed input and return a pseudo address
  - The address nearby increases distance until it finds it in the size that resembles it.
  - User has ability to deploy a postgres instance with postgis and load the knex/seed.sql dataset after initializing the repo
- the examples above are for tests, sinon and mocking out the application in testing was superfulous. Would require mocking out DB connector and Google Geocoding. Everything is highly cohesive, these tests wouldn't be helpful. Would add a health check likely for the endpoint that would test connectivity pooled.
- The API Quota could be hit 
- DB is not exposed to the internet so its fine to commit the fake dumb password that I own. 
- All of the functions are in one file to make it easier to deploy.


Resources
- http://knexjs.org/
- https://devhints.io/knex
- https://www.g9labs.com/2016/04/08/knex-dot-js-and-bookshelf-dot-js-cheat-sheet/
- https://codeburst.io/javascript-unit-testing-using-mocha-and-chai-1d97d9f18e71
- https://postgis.net/docs/ST_DWithin.html
- https://gis.stackexchange.com/questions/76967/what-is-the-unit-used-in-st-distance
- https://stackoverflow.com/questions/25861052/postgis-error-parse-error-invalid-geometry/46467909
- https://github.com/tgriesser/knex/issues/1244
- https://cloud.google.com/vpc/docs/configure-serverless-vpc-access

# LICENSE
APACHE
