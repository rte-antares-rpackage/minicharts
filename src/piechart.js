// Copyright © 2016 RTE Réseau de transport d’électricité
(function() {
  'use strict';
  var Polarchart = require("./polarchart.js");
  module.exports = Piechart;

  Piechart.prototype = Object.create(Polarchart.prototype);
  Piechart.prototype.constructor = Piechart;

  /**
    * @class Piechart
    * @summary Represent data with a pie chart
    * @desc A pie chart is a special case of polar chart where the data values
    * are represented by the angle of the slices. They should only be used to
    * compare qualitatively proportions and compositions. Indeed, human eye is
    * not good at comparing angles so only large differences are visible.
    * @param {string} el CSS selector representing the element that will hold the chart.
    * @param {number[]} data Data the chart has to represent.
    * @param {PiechartOptions} options Options controling graphical aspects of the chart.
    */

  /** @typedef {object} PiechartOptions
    * @memberOf Piechart
    * @prop {number} [width=60] Width of the chart.
    * @prop {number} [height=60] Height of the chart.
    * @prop {number} [transitionTime=750] Duration of the transitions, in milliseconds.
    * @prop {string[]|function}[colors=d3.schemeCategory10] Either an array of
    * colors or a function `(d, i) -> color` where `d` is a data value and `i`
    * is the index of the value.If it is an array with length less than the length
    * of data, then the colors are recycled.
    * @prop {string[]|"none"|"auto"|function}[labels="none"] Labels to display in slices.
    * It can be an array with same length as the data. It can also be a function
    * `(d, i) -> labelText` where `d` is a data value and `i`
    * is the index of the value. Finally it can be equal to "none" to hide labels
    * or "auto" to display in a compact way values.
    * @prop {string|string[]|"auto"|function}[labelColors="auto"] Color of the labels.
    * It can be a single value or an array with same length as the data. It can
    * also be a function `(d, i) -> color` where `d` is a data value and `i`
    * is the index of the value. Finally it can be equal to "auto". In this case,
    * the most readable color is choosen depding on the color of the slice.
    * @prop {number}[labelMinSize=8] Label minimum size in pixels. If there is
    * not enough space for a given label, then it is hidden.
    * @prop {number}[labelMaxSize=24] Label maximum size in pixels.
    * @prop {string}[labelClass=""] Labels CSS class.
    * @prop {string}[shapeClass=""] slices CSS class.
    */

  /** @method setData
    * @desc Update the data represented by the chart
    * @instance
    * @memberOf Piechart
    * @param {number[]} data Data the chart has to represent.
    */

  /** @method setOptions
    * @desc Update the graphical options of a chart
    * @instance
    * @memberOf Piechart
    * @param {PiechartOptions} options Options controling graphical aspects of the chart.
    */

  /** @method update
    * @desc Update simulatenously data and options of a pie chart.
    * @instance
    * @memberOf Piechart
    * @param {number[]} data Data the chart has to represent.
    * @param {PiechartOptions} options Options controling graphical aspects of the chart.
    */
  function Piechart(el, data, options) {
    Polarchart.call(this, el, data, options);
  }

  Piechart.prototype._processOptions = function(options) {
    options = options || {};
    options.type = "angle";
    return Polarchart.prototype._processOptions.call(this, options);
  }

}());
