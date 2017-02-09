(function() {
  'use strict';

  QUnit.assert.canCreateChart = function(type, selector, data, options) {
    options = options || {};
    var chart = new minicharts[type](selector, data, options);

    var actual = $(selector + " svg") != null && $(selector + " svg path").length == data;
    this.pushResult({
      result: !actual,
      actual:actual,
      expected: false,
      message: "Chart has been created"
    });

    return chart;
  }

  // Counter used to create a new DOM element for each test. Results can then
  // be visually inspected.
  var idTest = 0;

  testChart("Barchart");
  testChart("Polarchart");
  testChart("Piechart");

  function testChart(type) {
    QUnit.module(type, {
      beforeEach: function() {
        this.data = [1,2,3];
        $("#test-area").append("<span id='chart" + idTest + "'></span>");
        this.el = "#chart" + idTest;
        idTest ++;
      }
    });

    QUnit.test( "Create chart without options", function( assert ) {
      QUnit.assert.canCreateChart(type, this.el, this.data);
    });

    QUnit.test( "Change colors", function( assert ) {
      var self = this;
      var opts = {
        colors: ["rgb(255, 0, 0)", "rgb(0, 255, 0)", "rgb(0, 0, 255)"]
      }

      var chart = QUnit.assert.canCreateChart(type, this.el, this.data, opts);

      var done = assert.async();
      setTimeout(function(){
        var shapes = $(self.el + " svg path");
        assert.equal(shapes.length, self.data.length);
        for (var i = 0; i < shapes.length; i++) {
          assert.equal(shapes[i].attributes.fill.value, opts.colors[i]);
        }
        done();
      }, 750);
    });

    QUnit.test( "Display labels", function( assert ) {
      var self = this;
      var opts = {
        labels: "auto"
      }

      var chart = QUnit.assert.canCreateChart(type, this.el, this.data, opts);

      var done = assert.async();
      setTimeout(function(){
        var labels = $(self.el + " svg .label text");
        assert.equal(labels.length, self.data.length);
        for (var i = 0; i < labels.length; i++) {
          assert.equal(labels[i].textContent, self.data[i]);
        }
        done();
      }, 750);
    });
  }

}());
