// Copyright © 2016 RTE Réseau de transport d’électricité
(function() {
  'use strict';

  var d3 = require("d3");
  var Chart = require("./chart.js");

  module.exports = Barchart;

  // Barchart inherits from Chart
  Barchart.prototype = Object.create(Chart.prototype);
  Barchart.prototype.constructor = Barchart;

  /**
    * @class Barchart
    * @summary Represent data with a barchart
    * @desc Barcharts are polyvalent charts that should be used most of the time.
    * In a barchart individual value are visually easy to compare because the
    * human eye is good at comparing lengths. Moreover barcharts can represent
    * negative values while polar charts can only represent positive values; 
    * @param {string} el CSS selector representing the element that will hold the chart.
    * @param {number[]} data Data the chart has to represent.
    * @param {BarchartOptions} options Options controling graphical aspects of the chart.
    */

  /** @typedef {object} BarchartOptions
    * @memberOf Barchart
    * @prop {number|"auto"} [minValue="auto"] Minimum value data could take. It
    * is important to set this option explicitely if one wants to compare
    * charts and use the same scale on each one. By default `minValue` equals to 0
    * if all data values are positive or the minimum value if some values are
    * negative.
    * @prop {number|"auto"} [maxValue="auto"] Maximum value data could take.It
    * is important to set this option explicitely if one wants to compare
    * charts and use the same scale on each one. By default it equals to 0 if all
    * values are negative or to maximmum value if some value is positive.
    * @prop {number} [width=60] Width of the chart.
    * @prop {number} [height=60] Height of the chart.
    * @prop {number} [transitionTime=750] Duration of the transitions, in milliseconds.
    * @prop {string[]|function}[colors=d3.schemeCategory10] Either an array of
    * colors or a function `(d, i) -> color` where `d` is a data value and `i`
    * is the index of the value.If it is an array with length less than the length
    * of data, then the colors are recycled.
    * @prop {string[]|"none"|"auto"|function}[labels="none"] Labels to display in bars.
    * It can be an array with same length as the data. It can also be a function
    * `(d, i) -> labelText` where `d` is a data value and `i`
    * is the index of the value. Finally it can be equal to "none" to hide labels
    * or "auto" to display in a compact way values.
    * @prop {string|string[]|"auto"|function}[labelColors="auto"] Color of the labels.
    * It can be a single value or an array with same length as the data. It can
    * also be a function `(d, i) -> color` where `d` is a data value and `i`
    * is the index of the value. Finally it can be equal to "auto". In this case,
    * the most readable color is choosen depding on the color of the bar.
    * @prop {number}[labelMinSize=8] Label minimum size in pixels. If there is
    * not enough space for a given label, then it is hidden.
    * @prop {number}[labelMaxSize=24] Label maximum size in pixels.
    * @prop {number}[labelPadding=2] Padding to apply to apply to labels.
    * @prop {string}[labelClass=""] Labels CSS class.
    * @prop {string}[shapeClass=""] bars CSS class.
    * @prop {string}[zeroLineStyle="stroke:#333;stroke-width:1;"] CSS style of the
    * line representing the zero value.
    */

  /** @method setData
    * @desc Update the data represented by the chart
    * @instance
    * @memberOf Barchart
    * @param {number[]} data Data the chart has to represent.
    */

  /** @method setOptions
    * @desc Update the graphical options of a chart
    * @instance
    * @memberOf Barchart
    * @param {BarchartOptions} options Options controling graphical aspects of the chart.
    */

  /** @method update
    * @desc Update simulatenously data and options of a barchart.
    * @instance
    * @memberOf Barchart
    * @param {number[]} data Data the chart has to represent.
    * @param {BarchartOptions} options Options controling graphical aspects of the chart.
    */
  function Barchart(el, data, options) {
    // Default options
    var defaults = {
      minValue: "auto",
      maxValue: "auto",
      zeroLineStyle: "stroke:#333;stroke-width:1;"
    };

    // Call super constructor
    Chart.call(this, el, data, options, defaults);

    // Initialize the zero line
    var scaleFun = d3.scaleLinear()
      .domain([this._options.minValue, this._options.maxValue])
      .range([this._options.height, 0]);

    this._zeroLine = this._container.append("line")
      .attr("x1", 0)
      .attr("y1", scaleFun(0))
      .attr("x2", this._options.width)
      .attr("y2", scaleFun(0))
      .attr("style", this._options.zeroLineStyle);

    this._draw();
  }

  // See comments in chart.js
  Barchart.prototype._processOptions = function(options) {
    options = Chart.prototype._processOptions.call(this, options, this._options);

    // Set min value and max value if necessary.
    if (options.minValue === "auto") {
      var min = d3.min(this._data);
      var max = options.maxValue === "auto"? d3.max(this._data): options.maxValue;

      if (max > 0 && min > 0) options.minValue = 0;
      else options.minValue = min;
    }

    if (options.maxValue === "auto") {
      var max = options.minValue === "auto"? d3.min(this._data): options.minValue;
      var max = d3.max(this._data);

      if (max < 0 && min < 0) options.maxValue = 0;
      else options.maxValue = max;
    }

    return options;
  };

  // See comments in chart.js
  Barchart.prototype._draw = function() {
    var self = this;
    Chart.prototype._draw.call(this);

    var barWidth = (self._options.width - 6) / self._data.length;
    var scaleFun = d3.scaleLinear()
      .domain([self._options.minValue, self._options.maxValue])
      .range([self._options.height, 0]);

    // Update the zero line
    self._zeroLine
      .transition()
      .duration(self._options.transitionTime)
      .attr("x1", 0)
      .attr("y1", scaleFun(0))
      .attr("x2", self._options.width)
      .attr("y2", scaleFun(0))
      .attr("style", self._options.zeroLineStyle);

    // Update bars
    var bar = self._chart.selectAll("path").data(self._data);
    // Add new bars
    function rectPath(x, y, w, h) {
      return ("M" + x + " " + y + "l" + w + " 0l0 " + h + "l" + (-w) + " 0Z")
    }

    bar.enter()
      .append("path")
      .attr("d", function(d, i) {return rectPath((i + 1) * barWidth + 3, scaleFun(0), 0, 0)})
    // Update bars
      .merge(bar)
      .attr("class", self._options.shapeClass)
      .transition()
      .duration(self._options.transitionTime)
      .attr("d", function(d, i) {return rectPath(i * barWidth + 3, scaleFun(0), barWidth, scaleFun(d) - scaleFun(0))})
      .attr("fill", self._options.colorFun);
    // Remove bars
    bar.exit()
      .transition()
      .duration(self._options.transitionTime)
      .attr("x", function(d, i) {return i * barWidth + 3;})
      .attr("y", 0)
      .attr("width", 0)
      .attr("height", 0)
      .remove();

    // Add/ update labels
    function initLabel(label, d, i) {
      label.fillRect(
        i * barWidth + 3, scaleFun(0),
        barWidth, 0,
        self._options.labelPadding,
        "center", d >= 0? "top": "bottom",
        0
      );
    }

    function updateLabel(label, d, i) {
      label.fillRect(
        i * barWidth + 3, d >= 0? scaleFun(d) : scaleFun(0),
        barWidth, Math.abs(scaleFun(d) - scaleFun(0)),
        self._options.labelPadding,
        "center", d >= 0? "top": "bottom",
        self._options.transitionTime);
    }

    this._drawLabels(initLabel, updateLabel);
  }

}());
