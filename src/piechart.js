// Copyright © 2016 RTE Réseau de transport d’électricité
(function() {
  'use strict';
  var Polarchart = require("./polarchart.js");
  module.exports = Piechart;

  Piechart.prototype = Object.create(Polarchart.prototype);
  Piechart.prototype.constructor = Piechart;

  function Piechart(el, data, options) {
    Polarchart.call(this, el, data, options);
  }

  Piechart.prototype._processOptions = function(options) {
    options = options || {};
    options.type = "angle";
    return Polarchart.prototype._processOptions.call(this, options);
  }

}());
