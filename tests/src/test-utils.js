(function() {
  'use strict';

  var utils = require("../../src/utils.js");

  QUnit.module("utils", function() {

    QUnit.module("mergeOptions", function() {
      QUnit.test("merge properties of two objects", function(assert) {
        var opts = {a:1, b:2};
        var defaults = {c:3, d:4};
        var res = utils.mergeOptions(opts, defaults);
        ["a", "b", "c", "d"].forEach(function(k) {
          assert.ok(res.hasOwnProperty(k));
        })
      });

      QUnit.test("does not overhide properties of first object", function(assert) {
        var opts = {a:1, b:2};
        var defaults = {b:3, c:4};
        var res = utils.mergeOptions(opts, defaults);
        assert.equal(res.b, opts.b);
      });

      QUnit.test("does not modify its input objects", function(assert) {
        var opts = {a:1, b:2};
        var defaults = {c:3, d:4};
        var res = utils.mergeOptions(opts, defaults);

        for (var k in opts) {
          assert.notOk(defaults.hasOwnProperty(k));
        }
        for (var k in defaults) {
          assert.notOk(opts.hasOwnProperty(k));
        }
      });
    });

    QUnit.module("toArray", function() {
      QUnit.test("returns x if x is an array", function(assert) {
        var x = [1, 2, 3];
        assert.equal(x, utils.toArray(x));
      });

      QUnit.test("transforms a scalar in array of length 1", function(assert) {
        var x = 1;
        var xa = utils.toArray(x);
        assert.equal(xa.constructor, Array);
        assert.equal(xa.length, 1);
        assert.equal(xa[0], x);
      })

      QUnit.skip("does something if x is undefined")
    })

    QUnit.module("toFunction", function() {
      QUnit.test("returns x if x is a function", function(assert) {
        var f = function(d, i) {return d};
        assert.equal(f, utils.toFunction(f));
      });

      QUnit.test("returns a function that always return x if x is a scalar", function(assert) {
        var x = 1;
        var f = utils.toFunction(x);
        assert.equal(typeof f, "function");
        assert.equal(f(0, 0), x);
        assert.equal(f(1, 2), x);
      });

      QUnit.test("returns a function that returns elements of an array", function(assert) {
        var x = [1, 2, 3];
        var f = utils.toFunction(x);
        assert.equal(typeof f, "function");
        for (var i = 0; i < x.length; i++) {
          assert.equal(f(0, i), x[i]);
          assert.equal(f(1, i), x[i]);
        }
      });

      QUnit.skip("does something if is undefined", function(assert) {});
    });

  });

}());
