/**
 * @fileOverview Base API Surface tests.
 */
var chai = require('chai');
var expect = chai.expect;

var file = require('../..');

describe('Base API Surface', function() {
  it('should provide expected methods', function() {
    expect(file.mkdir).to.be.a('function');
    expect(file.write).to.be.a('function');
    expect(file.writeAsync).to.be.a('function');
    expect(file.exists).to.be.a('function');
    expect(file.existsAsync).to.be.a('function');
    expect(file.isLink).to.be.a('function');
    expect(file.isDir).to.be.a('function');
    expect(file.isDirAsync).to.be.a('function');
    expect(file.isFile).to.be.a('function');
    expect(file.isPathAbsolute).to.be.a('function');
    expect(file.arePathsEquivalent).to.be.a('function');
    expect(file.doesPathContain).to.be.a('function');
    expect(file.isPathCwd).to.be.a('function');
    expect(file.isPathInCwd).to.be.a('function');
    expect(file.copy).to.be.a('function');
    expect(file.read).to.be.a('function');
    expect(file.readAsync).to.be.a('function');
    expect(file.readJSON).to.be.a('function');
    expect(file.readYaml).to.be.a('function');
  });
});
