/* Version with improved color chart. */
/* And legend generator               */
/* And the FCC test suite             */
const HEIGHT = 500;
const WIDTH = 1200;
const PADDING = 100;

const dataSource = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

// Month mapping used in the Y scale
const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"];

// https://observablehq.com/@d3/color-schemes - Sequential size 10 Spectral + 2 from RdBu 
const colors =
["#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#5e4fa2", "#2166ac", "#053061"];

// Builds X and Y scales
function setScale(dataset) {

  // Color Scale - based on temperature
  const monthlyVariance = dataset.monthlyVariance;
  const baseTemperature = dataset.baseTemperature;
  const varianceArr = monthlyVariance.map(d => Math.round(baseTemperature + d.variance)).sort(function (a, b) {return a - b;});
  const uniqArr = [...new Set(varianceArr)];

  console.log(uniqArr);
  const colorScale = d3.scaleOrdinal() // the scale function
  .domain(uniqArr) // the data
  .range(colors); // the color scale


  const SCREEN_RANGE_X = [PADDING, WIDTH - PADDING];
  const SCREEN_RANGE_Y = [PADDING, HEIGHT - PADDING];

  // Store years in an array for easier manipulation
  const yearArr = monthlyVariance.map(d => new Date(d.year + "-01-01"));

  const minX = d3.min(yearArr, d => d);
  const maxX = d3.max(yearArr, d => d);
  const minY = d3.min(monthlyVariance, d => d.month);
  const maxY = d3.max(monthlyVariance, d => d.month);

  const xScale = d3.scaleTime().domain([minX, maxX]).range(SCREEN_RANGE_X);

  // min and max adjusted by 0.5 to allow for height of 'boxes' to display
  const yScale = d3.scaleLinear().domain([minY - 0.5, maxY + 0.5]).range(SCREEN_RANGE_Y);

  const scales = {
    x: xScale,
    y: yScale,
    c: colorScale };


  return scales;
}

// Add a key to the two colors used - two small rectangles + two labels
function addLegend(scales) {
  // Retrieve the color scale
  const colorScale = scales.c;

  const canvas = d3.select("#svg_chart");
  const legend = canvas.append("svg").attr("id", "legend");
  const boxSize = 25; // Size of the color squares
  const txtOffset = 25; // Offset from the color squares
  const boxYPos = 65; // Where to position the boxes based on size
  const txtYPos = 65 - txtOffset; // Where to position text based on size
  const scaleDomain = colorScale.domain(); // Need to get the scale values to display

  // Just a label
  legend.append("text").
  attr("x", PADDING + boxSize).
  attr("y", HEIGHT - 5).
  style("font-size", "16px").
  text("Temperature variation/Color mapping");

  let entries = legend.selectAll('g.legendEntry').
  data(colorScale.domain()).
  enter().
  append('g').attr('class', 'legendEntry');

  // Colored Boxes
  entries.append('rect').
  attr('x', function (d, i) {return PADDING + i * boxSize;}).
  attr('y', HEIGHT - boxYPos).
  attr('width', boxSize).
  attr('height', boxSize).
  attr('fill', colorScale);

  // Text description
  entries.append('text').
  attr('x', function (d, i) {return PADDING + i * boxSize + 2;})
  // yStart+(boxSize/2)
  .attr('y', HEIGHT - boxYPos + boxSize - 10).
  style('font-size', '10px').
  text(function (d, i) {return d + "ºC";});
}

// As per function title, adds axis to the chart
function addAxis(scales) {
  // Get data from the scal object
  const xScale = scales.x;
  const yScale = scales.y;

  const canvas = d3.select("#svg_chart");
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale).
  tickFormat((d, i) => monthNames[d - 1]);

  // Places xAxis at bottom of screen, taking into account reverse co-ords and margin
  canvas.append("g").
  attr("id", "x-axis").
  attr("transform", "translate(0," + (HEIGHT - PADDING) + ")").
  call(xAxis);

  // Place yAxis to the left, taking into account the margin
  canvas.append("g").
  attr("transform", "translate(" + PADDING + ",0)").
  attr("id", "y-axis").
  call(yAxis);

  // yAxis Label
  canvas.append("text").
  attr("transform", "rotate(-90)").
  attr("y", PADDING - 50).
  attr("x", 0 - HEIGHT / 2).
  attr("id", "y_axis_label").
  style("font-size", "20px").
  style("text-anchor", "middle").
  text("Months");

  // xAxis Label
  canvas.append("text").
  attr("y", HEIGHT - 50).
  attr("x", WIDTH / 2).
  attr("id", "x_axis_label").
  style("font-size", "20px").
  style("text-anchor", "middle").
  text("Years");
}

// Function called when mouse is over a rect
function showToolTip(base, event, d) {
  d3.select('#tooltip').
  attr("data-year", d.year).
  style('opacity', 0).
  html(monthNames[d.month - 1] + " " + d.year + " <BR> " + Math.round(100 * (base + d.variance)) / 100 + "&deg;C").
  style('left', event.pageX + 'px').
  style('top', event.pageY + 10 + 'px').
  style('opacity', 1);
}

// Function called when mouse leaving a rect
function hideToolTip(event) {
  d3.select('#tooltip').
  style('opacity', 0);
}

// Main chart drawing function
function drawChart(dataset, scales) {
  // Retrieve the scale factors
  const xScale = scales.x;
  const yScale = scales.y;
  const colorScale = scales.c;

  const base = dataset.baseTemperature;
  const temps = dataset.monthlyVariance;

  // Build an array of years - used to calc the chart width
  const years = temps.map(i => i.year).filter((year, index, arr) => arr.indexOf(year) == index);
  const rectWidth = (WIDTH - PADDING * 2) / years.length;

  // Builds colored rectangles
  d3.select("#svg_chart").selectAll("rect").
  data(temps).
  enter().
  append("rect").
  attr("class", "cell").
  attr("x", d => {return xScale(new Date(d.year + "-01-01"));})
  // offset y from tick mark by 0.5 to allow for size of the box
  .attr("y", d => {return yScale(d.month - 0.5);}).
  attr("width", rectWidth).
  attr("height", d => {
    return (
      // Rectangle is offset above and below the tick mark
      // achieved by adding 1 (.5 below, .5 above )
      yScale(d.month + 0.5) - yScale(d.month - 0.5));

  }).
  attr("data-month", d => d.month - 1).
  attr("data-year", d => d.year).
  attr("data-temp", d => base + d.variance).
  style("fill", d => {return colorScale(Math.round(base + d.variance));}).
  on("mouseover", function (event, d) {
    return showToolTip(base, event, d);
  });

  // Mouse Out event on the SVG to remove tooltip from SVG
  // Done here as if added to rectangle it disapears too quickly
  d3.select("#svg_chart").
  on("mouseout", function () {hideToolTip(event);});
}

// Set up canvas and titles
function setUpChart(temperature) {
  // A div containing the SVG, used to position in the HTML body
  d3.select("body")
  // Append a div to house the chart
  .append("div").
  attr("id", "svg-div")

  // Append the SVG chart
  .append("svg").attr("id", "svg_chart").
  attr("width", WIDTH).
  attr("height", HEIGHT);

  // Div used for the tooltip
  d3.select("body").
  append("div").
  attr("id", "tooltip").
  style("position", "absolute").
  style("opacity", 0);


  const canvas = d3.select("#svg_chart");

  // Main title
  canvas.append("text").
  attr("x", PADDING + 50).
  attr("y", PADDING - 50).
  attr("id", "title").
  style("font-size", "24px").
  text("Monthly Global Land-Surface Temperature");

  // sub-title
  canvas.append("text").
  attr("x", PADDING + 50).
  attr("y", PADDING - 30).
  attr("id", "description").
  style("font-size", "16px").
  text("1753 - 2015: base temperature " + temperature);
}

// Main Code
const req = new XMLHttpRequest();
req.open("GET", dataSource, true);
req.send();
req.onload = function () {
  let xScale, yScale;
  const jsondata = JSON.parse(req.responseText);
  const scales = setScale(jsondata);

  setUpChart(jsondata.baseTemperature);
  addAxis(scales);
  addLegend(scales);
  drawChart(jsondata, scales);
};