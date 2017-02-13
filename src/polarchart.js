// Copyright © 2016 RTE Réseau de transport d’électricité
(function() {
  'use strict';

  var d3 = require("d3");
  var Chart = require("./chart.js");

  module.exports = Polarchart;

  Polarchart.prototype = Object.create(Chart.prototype);
  Polarchart.prototype.constructor = Polarchart;

  /**
    * @class Polarchart
    * @summary Represent data with a polar chart
    * @desc Polar charts are nice looking charts especially on a map,
    * but individual values are hard to compare
    * on these charts: the human eye is good to compare lengths, but not
    * to compare agnles, radius or areas. Polar charts should only be used when
    * one wants to point out qualitative results and does not need a precise
    * representation of data. Another limitation compared to barcharts is that
    * polar charts cannot represent negative values.
    * @param {string} el CSS selector representing the element that will hold the chart.
    * @param {number[]} data Data the chart has to represent.
    * @param {PolarchartOptions} options Options controling graphical aspects of the chart.
    */

  /** @typedef {object} PolarchartOptions
    * @memberOf Polarchart
    * @prop {number|"auto"} [maxValue="auto"] Maximum value data could take.It
    * is important to set this option explicitely if one wants to compare
    * charts and use the same scale on each one. By default it equals to the
    * maximum value of the data.
    * @prop {"area"|"radius"|"angle"} [type="area"] What kind of scale to use to
    * represent the data? `angle` produces a pie chart and should be used only to visualize
    * proportions. In other cases, `area` (the default) should generally be
    * prefered. `radius` should only be used when one wants to magnify differences.
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
    * @memberOf Polarchart
    * @param {number[]} data Data the chart has to represent.
    */

  /** @method setOptions
    * @desc Update the graphical options of a chart
    * @instance
    * @memberOf Polarchart
    * @param {PolarchartOptions} options Options controling graphical aspects of the chart.
    */

  /** @method update
    * @desc Update simulatenously data and options of a polar chart.
    * @instance
    * @memberOf Polarchart
    * @param {number[]} data Data the chart has to represent.
    * @param {PolarchartOptions} options Options controling graphical aspects of the chart.
    */

  function Polarchart(el, data, options) {
    var defaults = {
      type: "area",
      maxValue: "auto",
    }

    Chart.call(this, el, data, options, defaults);

    // Center the chart group inside the container
    this._chart
      .attr("transform", "translate(" + this._options.width/2 + "," + this._options.width/2 + ")");

    this._draw();
  }

  Polarchart.prototype._processOptions = function(options) {
    options = Chart.prototype._processOptions.call(this, options, this._options);

    options.height = options.width;

    if (options.maxValue === "auto") {
      options.maxValue = d3.max(this._data);
    }
    //debugger;
    var radius = options.width / 2;
    var pie = d3.pie().sort(null);
    var arc = d3.arc().innerRadius(0);
    var radiusFun;

    if (options.type === "angle") {
      radiusFun = function(d) {return radius}
      pie.value(function(d) {return d});
    } else {
      radiusFun = options.type == "radius" ? d3.scaleLinear() : d3.scalePow().exponent(0.5);
      radiusFun.range([0, radius])
        .domain([0, options.maxValue]);
      pie.value(function(d) {return 1});
    }

    arc.outerRadius(function(d, i) {return radiusFun(d.data)});

    options.radius = radiusFun;
    options.pie = pie;
    options. arc = arc;
    return options;
  }

  Polarchart.prototype._draw = function() {
    var self = this;
    Chart.prototype._draw.call(this);

    // Move center of the chart
    this._chart
      .transition()
      .duration(self._options.transitionTime)
      .attr("transform", "translate(" + self._options.width/2 + "," + self._options.width/2 + ")");

    var slices = this._chart.selectAll("path").data(this._options.pie(this._data));

    // Initialize new slices
    slices.enter()
      .append("path")
      .attr("class", "leaflet-clickable")
      .attr("d", this._options.arc)
      .attr("fill", function(d, i) {return self._options.colorFun(d, i)})
      .each(function(d, i) {
        if (self._data.length == 1) this._current = {startAngle:d.startAngle, endAngle:d.endAngle, data:0}
        else this._current = {startAngle:d.endAngle, endAngle:d.endAngle}
      })
    // Update slices
      .merge(slices)
      .attr("class", function(d, i) {return self._options.shapeClass(d.data, i)})
      .transition()
      .duration(self._options.transitionTime)
      .attrTween("d", arcTween)
      .attr("fill", function(d, i) {return self._options.colorFun(d, i)});
    // Remove slices
    slices.exit().remove();

    function arcTween(a) {
      var i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t) {
        return self._options.arc(i(t));
      };
    }

    // Add/update labels
    // function(arc, radiusFun, d, transitionTime)
    var initLabel, updateLabel;
    if (this._data.length > 1) {
      var data = this._options.pie(this._data);
      initLabel = function(label, d, i) {
        label.fillSlice(self._options.arc, self._options.radius(d), data[i], 0);
      }

      updateLabel = function(label, d, i) {
        label.fillSlice(self._options.arc, self._options.radius(d), data[i],
                        self._options.transitionTime);
      }
    } else {
      initLabel = function(label, d, i) {
        label.fillCircle(self._options.radius(d), 0);
      }

      updateLabel = function(label, d, i) {
        label.fillCircle(self._options.radius(d), self._options.transitionTime);
      }
    }

    this._drawLabels(initLabel, updateLabel);
  }

}());
