const assert = require('assert');
const expect = require('chai').expect;
const should = require('chai').should();
const sinon = require('sinon')

const knex = require("knex");
const request = require('request');

var fakeGoogleAPI = { createClient: (key )=> {
  return {
    geocode: function () {}
  }
}};

var spy = sinon.spy();
var mock = sinon.mock(fakeGoogleAPI);
sinon.stub(knex, 'raw').resolves({});

var closest = require('./index');



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

describe('stubbed request', () => {
  before(function(done){
    sinon
      .stub(request, 'get')
      .yields(null, null, JSON.stringify({query: {"address": "1600 Amitheatre"}}));
    done();
  });
 it('should respond with a single movie', (done) => {
    request.get(`localhost:8080/zip?`, (err, res, body) => {
      console.log(err)
      res.statusCode.should.equal(200);
      res.headers['content-type'].should.contain('application/json');
      body = JSON.parse(body);
      body.status.should.eql('success');
      body.data[0].should.include.keys(
        'id', 'name', 'genre', 'rating', 'explicit'
      );
      body.data[0].name.should.eql('The Land Before Time');
      done();
    });
  })
  afterEach(() => {
    request.get.restore();
  });
})

describe('GET /api/v1/movies/:id', () => {
  it('should respond with a single movie', (done) => {
    request.get(`localhost:8080 /zip?`, (err, res, body) => {
      console.log(err)
      res.statusCode.should.equal(200);
      res.headers['content-type'].should.contain('application/json');
      body = JSON.parse(body);
      body.status.should.eql('success');
      body.data[0].should.include.keys(
        'id', 'name', 'genre', 'rating', 'explicit'
      );
      body.data[0].name.should.eql('The Land Before Time');
      done();
    });
  });
  it('should throw an error if the movie does not exist', (done) => {
    request.get(`${base}/api/v1/movies/999`, (err, res, body) => {
      res.statusCode.should.equal(404);
      res.headers['content-type'].should.contain('application/json');
      body = JSON.parse(body);
      body.status.should.eql('error');
      body.message.should.eql('That movie does not exist.');
      done();
    });
  });
});