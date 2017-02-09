# Leaflet.d3chart

Leaflet.d3chart is a leaflet plugin for adding to a leaflet map small animated bar charts, pie charts or polar area charts.

It can be used to visualize multiple variables associated to geographical coordinates and to look at the evolution of these variables.

## Usage

You need to include the `leaflet` CSS and javascript files and then the `leaflet.d3chart` javascript file in the head section of your document:

``` xml
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.2/dist/leaflet.css" media="screen" title="leaflet">
<script src="https://unpkg.com/leaflet@1.0.2/dist/leaflet.js" charset="utf-8"></script>
<script src="https://unpkg.com/leaflet.d3chart@0.1.3/dist/leaflet.d3chart.min.js" charset="utf-8"></script>
```

Once these files included, you can create charts with function `L.d3chart()`. All parameters are described [here](https://rte-antares-rpackage.github.io/leaflet.d3chart/-_L.D3chart_.html).

## Example

Here is a sample code that initializes a map and adds to it a barchart that represents three random values. Then the code updates the value every two seconds and redraws the chart.

``` javascript
var center = [48.861415, 2.349326];

var mymap = L.map('map').setView(coord, 13);
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mymap);

// Let us generate fake data
function fakeData() {
  return [Math.Random(), Math.random(), Math.random()];
}

// Create a barchart
var myBarChart = L.d3chart(center, {data: fakeData()});
mymap.addLayer(myBarChart);

// Update data every 2 seconds
setInterval(function() {
  myBarChart.setOptions({data: fakeData()})
}, 2000);
```

![Example of a barchart on a map](img/example_barchart.gif)

You can find more complete examples here:
* [International comparison of PISA scores](https://rte-antares-rpackage.github.io/leaflet.d3chart/tutorial-PISA%20scores.html)
