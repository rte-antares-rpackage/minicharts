(function() {
  'use strict';

  var minicharts = require("../../src/minicharts.js");
  var assert = require("assert");

  // Counter used to create a new DOM element for each test. Results can then
  // be visually inspected.
  var idTest = 0;

  // Perform some generic tests on each chart type.
  describe("minicharts", function() {
    describe("Polarchart", function() {
      testChart("Polarchart");
    })

    describe("Piechart", function() {
        testChart("Piechart");

        // Labels on pie chart when one slice is larger than 50% (#1)
        it("correctly displays labels when one value is very large", function(done) {
          var chart = canCreateChart("Piechart", [100, 1000], {labels: "auto"});
          setTimeout(function(){
            var labels = $(chart.el + " svg .labels-container");
            assert.ok(labels[0].getBBox().height == 0);
            assert.ok(labels[1].getBBox().height > 0);
            done();
          }, 30);
        });
    })

    describe("Barchart", function() {
      testChart("Barchart");
      // Check negative values are correctly handled by barcharts
      it("handles negative values", function() {
        var chart = canCreateChart("Barchart", [-1, 2, 3]);
      });

      it("sets minimum and maximum values", function(done) {
        var chart = canCreateChart(
          "Barchart",
          [0, 0.5, 1],
          {minValue: -2, maxValue:2, transitionTime: 0}
        );

        setTimeout(function(){
          var shapes = shapesAreVisible(chart.el);
          assert.equal(shapes[0].getBBox().height, 0);
          assert.equal(shapes[1].getBBox().height, 7.5);
          assert.equal(shapes[2].getBBox().height, 15);

          var zeroline = $(chart.el + " line")[0];
          assert.equal("30", zeroline.attributes.y1.value);
          done();
        }, 30);
      });
    });
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
    var shapes = $(selector + " svg path");
    // Container has been created
    it ("initializes chart elements", function() {
      assert.ok(actual = $(selector + " svg") != null, "Container not initialized");
    })
    it("contains as many shapes as the length of the data", function() {
      assert.equal(shapes.length, data.length);
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

    it("has visible shapes", function() {
      for (var i = 0; i < shapes.length; i++) {
        var bbox = shapes[i].getBBox();
        assert.ok(bbox.width != 0 && bbox.height != 0, "Shape " + i + " is not visible");
      }
    })

    return(shapes);
  }

  /** Launch a serie of generic tests for each chart type.
    * @param {string} type Class name of the chart
    */
  function testChart(type) {
    var data = [1, 2, 3];

    it( "Creates chart without options", function(done) {
      var chart = canCreateChart(type, data);
      assert.equal(chart.constructor, minicharts[type]);
      setTimeout(function(){
        var shapes = shapesAreVisible(chart.el);
        done();
      }, 30);
    });

    it( "Changes colors", function(done) {
      var opts = {
        colors: ["rgb(255, 0, 0)", "rgb(0, 255, 0)", "rgb(0, 0, 255)"]
      };

      var chart = canCreateChart(type, data, opts);

      setTimeout(function(){
        var shapes = shapesAreVisible(chart.el);
        assert.equal(shapes.length, data.length);
        for (var i = 0; i < shapes.length; i++) {
          assert.equal(shapes[i].attributes.fill.value, opts.colors[i]);
        }
        done();
      }, 30);
    });

    it( "Displays labels", function(done) {
      var opts = {
        labels: "auto"
      }

      var chart = canCreateChart(type, data, opts);

      setTimeout(function(){
        shapesAreVisible(chart.el);
        var labels = $(chart.el + " svg .label text");
        assert.equal(labels.length, data.length);
        for (var i = 0; i < labels.length; i++) {
          assert.equal(labels[i].textContent, data[i]);
        }
        done();
      }, 30);
    });

    it( "Displays custom labels", function(done) {
      var opts = {
        labels: ["a", "b", "c"]
      }

      var chart = canCreateChart(type, data, opts);

      setTimeout(function(){
        shapesAreVisible(chart.el);
        var labels = $(chart.el + " svg .label text");
        assert.equal(labels.length, data.length);
        for (var i = 0; i < labels.length; i++) {
          assert.equal(labels[i].textContent, opts.labels[i]);
        }
        done();
      }, 30);
    });

    it( "Updates data", function(done) {
      var opts = {
        labels: "auto"
      }

      var chart = canCreateChart(type, data, opts);
      var newdata = [3,2,1];
      chart.setData(newdata);

      setTimeout(function(){
        shapesAreVisible(chart.el);
        var labels = $(chart.el + " svg .label text");
        assert.equal(labels.length, newdata.length);
        for (var i = 0; i < labels.length; i++) {
          assert.equal(labels[i].textContent, newdata[i]);
        }
        done();
      }, 30);
    });

    it( "Updates options", function(done) {
      var opts = {
        colors: ["rgb(255, 0, 0)", "rgb(0, 255, 0)", "rgb(0, 0, 255)"]
      }

      var chart = canCreateChart(type, data, {transitionTime: 10});
      chart.setOptions(opts);

      setTimeout(function(){
        var shapes = shapesAreVisible(chart.el);
        assert.equal(shapes.length, data.length);
        for (var i = 0; i < shapes.length; i++) {
          assert.equal(shapes[i].attributes.fill.value, opts.colors[i]);
        }
        done();
      }, 60);
    });
  }

}());
