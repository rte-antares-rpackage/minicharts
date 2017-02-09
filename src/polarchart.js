(function() {
  'use strict';

  var d3 = require("d3");
  var Chart = require("./chart.js");

  module.exports = Polarchart;

  Polarchart.prototype = Object.create(Chart.prototype);

  function Polarchart(el, data, options) {
    var defaults = {
      type: "area"
    }
    //debugger;
    Chart.call(this, el, data, options, defaults);

    this._draw();
  }

  Polarchart.prototype._processOptions = function(options) {
    options = Chart.prototype._processOptions.call(this, options, this._options);

    options.height = options.width;

    if (options.maxValue === "auto") {
      var max = options.minValue === "auto"? d3.min(data): options.minValue;
      var max = d3.max(data);

      if (max < 0 && min < 0) options.maxValue = 0;
      else options.maxValue = max;
    }

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
