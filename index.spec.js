var assert = require('assert');
var expect = require('chai').expect;
var should = require('chai').should();

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