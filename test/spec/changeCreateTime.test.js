/**
 * @fileOverview Test the changeCreateTime method.
 */
var path = require('path');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

var moment = require('moment');
var chai = require('chai');
var expect = chai.expect;

var file = require('../..');

describe('changeCreateTime method', function() {
  beforeEach(function () {
    var temp = path.join(__dirname, '../../temp');
    this.testfile = path.join(temp, 'testfile');

    file.mkdir(temp);
    file.write(this.testfile, 'abc');
  });
  it('should change the create time', function() {
    return file.changeCreateTime(this.testfile, '2010-01-01T12:40:45Z')
      .bind(this)
      .then(function() {
        var stat = fs.statSync(this.testfile);
        var newdt = moment(stat.mtime);
        expect(newdt.year()).to.equal(2010);
        expect(newdt.month()).to.equal(0);
        expect(newdt.date()).to.equal(1);
      });
  });
});
