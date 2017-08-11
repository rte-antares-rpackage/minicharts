(function() {
  'use strict';

  var assert = require("assert");
  var utils = require("../../src/utils.js");

  describe("utils", function() {

    describe("mergeOptions", function() {
      it("Merges properties of two objects", function() {
        var opts = {a:1, b:2};
        var defaults = {c:3, d:4};
        var res = utils.mergeOptions(opts, defaults);
        ["a", "b", "c", "d"].forEach(function(k) {
          assert.ok(res.hasOwnProperty(k));
        })
      });

      it("does not overhide properties of first object", function() {
        var opts = {a:1, b:2};
        var defaults = {b:3, c:4};
        var res = utils.mergeOptions(opts, defaults);
        assert.equal(res.b, opts.b);
      });

      it("does not modify its input objects", function() {
        var opts = {a:1, b:2};
        var defaults = {c:3, d:4};
        var res = utils.mergeOptions(opts, defaults);

        for (var k in opts) {
          assert.ok(!defaults.hasOwnProperty(k));
        }
        for (var k in defaults) {
          assert.ok(!opts.hasOwnProperty(k));
        }
      });
    });

    describe("toArray", function() {
      it("returns x if x is an array", function() {
        var x = [1, 2, 3];
        assert.equal(x, utils.toArray(x));
      });

      it("transforms a scalar in array of length 1", function() {
        var x = 1;
        var xa = utils.toArray(x);
        assert.equal(xa.constructor, Array);
        assert.equal(xa.length, 1);
        assert.equal(xa[0], x);
      })

      it("does something if x is undefined")
    })

    describe("toFunction", function() {
      it("returns x if x is a function", function() {
        var f = function(d, i) {return d};
        assert.equal(f, utils.toFunction(f));
      });

      it("returns a function that always return x if x is a scalar", function() {
        var x = 1;
        var f = utils.toFunction(x);
        assert.equal(typeof f, "function");
        assert.equal(f(0, 0), x);
        assert.equal(f(1, 2), x);
      });

      it("returns a function that returns elements of an array", function() {
        var x = [1, 2, 3];
        var f = utils.toFunction(x);
        assert.equal(typeof f, "function");
        for (var i = 0; i < x.length; i++) {
          assert.equal(f(0, i), x[i]);
          assert.equal(f(1, i), x[i]);
        }
      });

      it("does something if x is undefined");
    });

  });

}());
