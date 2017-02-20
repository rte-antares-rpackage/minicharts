(function() {
  'use strict';

  var minicharts = require("../../src/minicharts.js");
  // Custom assert. Definitions below
  QUnit.assert.canCreateChart = canCreateChart;
  QUnit.assert.shapesAreVisible = shapesAreVisible;

  // Counter used to create a new DOM element for each test. Results can then
  // be visually inspected.
  var idTest = 0;

  // Perform some generic tests on each chart type.
  QUnit.module("minicharts", function() {
    testChart("Polarchart");

    testChart("Piechart");
    // Labels on pie chart when one slice is larger than 50% (#1)
    QUnit.test("Label displayed on pie chart with one large value", function(assert) {
      var chart = QUnit.assert.canCreateChart("Piechart", [100, 1000], {labels: "auto"});
      var done = assert.async();
      setTimeout(function(){
        var labels = $(chart.el + " svg .labels-container");
        assert.ok(labels[0].getBBox().height == 0);
        assert.ok(labels[1].getBBox().height > 0);
        done();
      }, 30);
    });

    testChart("Barchart");
    // Check negative values are correctly handled by barcharts
    QUnit.test("Create barchart with negative values", function(assert) {
      var chart = QUnit.assert.canCreateChart("Barchart", [-1, 2, 3]);
    });

    QUnit.test("can set minValue and maxValue", function(assert) {
      var chart = QUnit.assert.canCreateChart(
        "Barchart",
        [0, 0.5, 1],
        {minValue: -2, maxValue:2, transitionTime: 0}
      );
      var done = assert.async();
      setTimeout(function(){
        var shapes = assert.shapesAreVisible(chart.el);
        assert.equal(shapes[0].getBBox().height, 0);
        assert.equal(shapes[1].getBBox().height, 7.5);
        assert.equal(shapes[2].getBBox().height, 15);

        var zeroline = $(chart.el + " line")[0];
        assert.equal("30", zeroline.attributes.y1.value);
        done();
      }, 30);
    })
  });

  // HELPER METHODS
  //----------------------------------------------------------------------------

  /** Custom assert that creates a new chart and checks if it has been effectively
    * added to the DOM.
    * @param {string} type Class name of the chart to create
    * @param {string} selector Css selector of the container element
    * @param {number[]} data Data of the chart
    * @param {Object} options Options of the chart
    *
    * @return Chart object
    */
  function canCreateChart(type, data, options) {
    $("#test-area").append("<span id='chart" + idTest + "'></span>");
    var selector = "#chart" + idTest;
    idTest ++;

    var chart = new minicharts[type](selector, data, options);
    chart.el = selector;
    // Container has been created
    var actual = $(selector + " svg") != null;
    // It contains as many shapes as the length of the data
    var shapes = $(selector + " svg path");
    actual = actual && shapes.length == data.length;

    this.pushResult({
      result: actual,
      actual:actual,
      expected: true,
      message: "Chart has been created"
    });

    return chart;
  }

  /** Custom assert that checks if the shapes have really been created, ie. do
    * they have a width and a height greater than 0.
    * @param {string} selector Css selector of the chart container
    *
    * @return Array of SVG elements representing the data
    */
  function shapesAreVisible(selector) {
    // Each element has non null width and height (unless data is equal to zero)
    var shapes = $(selector + " svg path");
    var actual = true;
    for (var i = 0; i < shapes.length; i++) {
      var bbox = shapes[i].getBBox();
      actual = actual && (bbox.width != 0 || bbox.height != 0);
    }
    this.pushResult({
      result: actual,
      actual:actual,
      expected: true,
      message: "shapes are visible"
    });
    return(shapes);
  }

  /** Launch a serie of generic tests for each chart type.
    * @param {string} type Class name of the chart
    */
  function testChart(type) {
    QUnit.module(type, {
      beforeEach: function() {
        this.data = [1,2,3];
      }
    });

    QUnit.test( "Create chart without options", function( assert ) {
      var self = this;
      var chart = QUnit.assert.canCreateChart(type, this.data);
      assert.equal(chart.constructor, minicharts[type]);
      var done = assert.async();
      setTimeout(function(){
        var shapes = assert.shapesAreVisible(chart.el);
        done();
      }, 30);
    });

    QUnit.test( "Change colors", function( assert ) {
      var self = this;
      var opts = {
        colors: ["rgb(255, 0, 0)", "rgb(0, 255, 0)", "rgb(0, 0, 255)"]
      }

      var chart = QUnit.assert.canCreateChart(type, this.data, opts);

      var done = assert.async();
      setTimeout(function(){
        var shapes = assert.shapesAreVisible(chart.el);
        assert.equal(shapes.length, self.data.length);
        for (var i = 0; i < shapes.length; i++) {
          assert.equal(shapes[i].attributes.fill.value, opts.colors[i]);
        }
        done();
      }, 30);
    });

    QUnit.test( "Display labels", function( assert ) {
      var self = this;
      var opts = {
        labels: "auto"
      }

      var chart = QUnit.assert.canCreateChart(type, this.data, opts);

      var done = assert.async();
      setTimeout(function(){
        assert.shapesAreVisible(chart.el);
        var labels = $(chart.el + " svg .label text");
        assert.equal(labels.length, self.data.length);
        for (var i = 0; i < labels.length; i++) {
          assert.equal(labels[i].textContent, self.data[i]);
        }
        done();
      }, 30);
    });

    QUnit.test( "Custom labels", function( assert ) {
      var self = this;
      var opts = {
        labels: ["a", "b", "c"]
      }

      var chart = QUnit.assert.canCreateChart(type, this.data, opts);

      var done = assert.async();
      setTimeout(function(){
        assert.shapesAreVisible(chart.el);
        var labels = $(chart.el + " svg .label text");
        assert.equal(labels.length, self.data.length);
        for (var i = 0; i < labels.length; i++) {
          assert.equal(labels[i].textContent, opts.labels[i]);
        }
        done();
      }, 30);
    });

    QUnit.test( "Update data", function( assert ) {
      var self = this;
      var opts = {
        labels: "auto"
      }

      var chart = QUnit.assert.canCreateChart(type, this.data, opts);
      self.data = [3,2,1];
      chart.setData(self.data);

      var done = assert.async();
      setTimeout(function(){
        assert.shapesAreVisible(chart.el);
        var labels = $(chart.el + " svg .label text");
        assert.equal(labels.length, self.data.length);
        for (var i = 0; i < labels.length; i++) {
          assert.equal(labels[i].textContent, self.data[i]);
        }
        done();
      }, 30);
    });

    QUnit.test( "Update options", function( assert ) {
      var self = this;
      var opts = {
        colors: ["rgb(255, 0, 0)", "rgb(0, 255, 0)", "rgb(0, 0, 255)"]
      }

      var chart = QUnit.assert.canCreateChart(type, this.data, {transitionTime: 10});
      chart.setOptions(opts);

      var done = assert.async();
      setTimeout(function(){
        var shapes = assert.shapesAreVisible(chart.el);
        assert.equal(shapes.length, self.data.length);
        for (var i = 0; i < shapes.length; i++) {
          assert.equal(shapes[i].attributes.fill.value, opts.colors[i]);
        }
        done();
      }, 60);
    });
  }

}());
