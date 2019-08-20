const csv = require('csv-parser')
const fs = require('fs')
const results = [];
 
fs.createReadStream('data/store-locations.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    console.log(results.slice(5));
  });