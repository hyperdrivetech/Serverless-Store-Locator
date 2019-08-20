var assert = require('assert');
var expect = require('chai').expect;
var should = require('chai').should();

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
  

it('should return true if valid', function(){
      var isValid = true;
      //assert.equal(isValid, true);
      expect(isValid).to.be.true;
});
it('should return false if invalid', function(){
      var isValid = false;
      //assert.equal(isValid, false);
      isValid.should.equal(false);
});