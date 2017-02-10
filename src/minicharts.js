// Copyright © 2016 RTE Réseau de transport d’électricité
(function() {
  'use strict';

  module.exports.Barchart = require("./barchart.js");
  module.exports.Polarchart = require("./polarchart.js");
  module.exports.Piechart = require("./piechart.js");

  if (window) window.minicharts = module.exports;
}());
