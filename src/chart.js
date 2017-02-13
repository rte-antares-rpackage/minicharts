// Copyright © 2016 RTE Réseau de transport d’électricité
(function() {
  'use strict';

  var d3 = require("d3");
  var tinycolor = require("tinycolor2");
  var utils = require("./utils.js");
  var Label = require("./label.js")

  module.exports = Chart;

  /*  @class Chart
    * Abstract class inherited by other classes
    * @param{string} el
    * @param{number[]} data
    * @param {object} options
    * @param {object} defaults
    *
    */
  function Chart(el, data, options, defaults) {
    this._data = data;

    // Merge options with default options of this class and of the child class
    /**
    * @prop {number} [height=60] width
    * @prop {number} [width=60] height
    * @prop {number} [transitionTime=750] transitionTime
    * @prop {string[]|function} [colors=d3.schemeCategory10] colors
    * @prop {string[]|"none"|"auto"|function} [labels="none"] labels
    * @prop {string[]|"auto"|function} [labelColors="auto"] labelColors
    * @prop {number} [labelMinSize=8] labelMinSize
    * @prop {number} [labelMaxSize=24] labelMaxSize
    * @prop {number} [labelPadding=2] labelPadding
    * @prop {labelClass} [labelClass=""]labelClass
    * @prop {shapeClass} [shapeClass=""] shapeClass
    */
    this._options = {
      width:60,
      height: 60,
      transitionTime: 750,
      colors: d3.schemeCategory10,
      labels: "none",
      labelColors: "auto",
      labelMinSize: 8,
      labelMaxSize: 24,
      labelPadding: 2,
      labelClass: "",
      shapeClass: ""
    };
    this._options = utils.mergeOptions(this._options, defaults || {});
    this._options = this._processOptions(options);

    // Remove everything in the container and create required elements
    d3.select(el).select("*").remove();
    this._container = d3.select(el).append("svg")
      .attr("width", this._options.width)
      .attr("height", this._options.height);
    this._chart = this._container.append("g");
  }

  /*  Update data and options of a chart
    *
    */
  Chart.prototype.update = function(data, options) {
    this._data = data;
    this._options = this._processOptions(options);
    this._draw();
  };

  Chart.prototype.setOptions = function(options) {
    this._options = this._processOptions(options);
    this._draw();
  };

  Chart.prototype.setData = function(data) {
    this._data = data;
    this._draw();
  };

  Chart.prototype._draw = function() {
    var self = this;
    // Update container size
    self._container
      .transition()
      .duration(self._options.transitionTime)
      .attr("width", self._options.width)
      .attr("height", self._options.height);
  };

  Chart.prototype._processOptions = function(options) {
    options = utils.mergeOptions(options, this._options);

    // Convert parameters colors, labels and labelColors to functions
    options.colorFun = utils.toFunction(options.colors);
    options.labelClass = utils.toFunction(options.labelClass);
    options.shapeClass = utils.toFunction(options.shapeClass);

    if (options.labels === "none") {
      options.labelText = null;
    } else if (options.labels === "auto") {
      options.labelText = utils.prettyNumber;
    }  else {
      options.labelText = utils.toFunction(options.labels);
    }

    if (options.labelColors === "auto") {
      options.labelColorFun = function(d, i) {
        return tinycolor.mostReadable(options.colorFun(d, i), ["white", "black"])._originalInput
      };
    } else {
      options.labelColorFun = utils.toFunction(options.labelColorFun);
    }

    return options;
  }

  Chart.prototype._drawLabels = function(initFun, updateFun) {
    var self = this;

    if (self._options.labels === "none") {
      self._chart.selectAll(".labels-container").remove();
      return;
    }


    self._labels = self._chart.selectAll(".labels-container").data(self._data);
    self._labels.enter()
      .append("g")
      .attr("class", "labels-container")
      .each(function(d, i) {
        this._label = new Label(this, self._options.labelStyle, self._options.labelColorFun(d, i),
                                self._options.labelMinSize, self._options.labelMaxSize);
        this._label.updateText(self._options.labelText(d, i))
        initFun(this._label, d, i);
      })

      .merge(self._labels)
      .each(function(d, i) {
        this._label.updateText(self._options.labelText(d, i));
        this._label._text
          .attr("fill", self._options.labelColorFun(d, i))
          .attr("class", self._options.labelClass(d, i));
        updateFun(this._label, d, i);
      });

    self._labels.exit().remove();
  }

}());
