/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
// Used examples and understanding outlined in : https://dev.to/hajarnasr/treemaps-with-d3-js-55p7
// to build this treemap. Mainly around how a treemap is handled in D3.
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

// Number of columns used to draw legend.
const LEGEND_COLS = 1;

const dataSets = [
{
  dataType: "kickstarter",
  dataTitle: "Top 100 Most Pledged Kickstarter Campaigns Grouped By Category",
  data: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json" },

{
  dataType: "movie",
  dataTitle: "Top 100 Highest Grossing Movies Grouped By Genre",
  data: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json" },

{
  dataType: "videogame",
  dataTitle: "Top 100 Most Sold Video Games Grouped by Platform",
  data: "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json" }];



/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* Colors generated using: http://vrl.cs.brown.edu/color                   */
colors =
["rgb(104,175,252)", "rgb(113,12,158)", "rgb(151,216,100)", "rgb(159,33,8)", "rgb(93,242,62)",
"rgb(184,89,228)", "rgb(82,233,230)", "rgb(62,60,141)", "rgb(255,168,255)", "rgb(8,87,130)",
"rgb(188,201,198)", "rgb(27,81,29)", "rgb(252,89,49)", "rgb(78,146,87)", "rgb(156,26,84)",
"rgb(253,165,71)", "rgb(114,73,51)", "rgb(225,198,55)", "rgb(255,0,135)", "rgb(253,181,172)"];


/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* rudimentory error checking - record in console and inform user */
function processErr(error) {
  console.log("Houston, we have a problem", error);

  document.
  getElementById("description").
  innerHTML = "Cannot process file. Please check with Site Admin";
}


// When legend entry is highlighted, hightlight the
// data on the main chart.
function highlightItemFromLegend(event, d, color, size) {
  if (event.target.nodeName === "rect") {
    d3.select(event.target).style("fill", color);
  }
  d3.select("#canvas").
  selectAll("rect")
  // https://stackoverflow.com: d3-js-highlight-chart-elements-when-interacting-with-the-legend
  .select(function (i) {return i.data.category === d ? this : null;}).
  style("fill", color);
}

// Tooltip management.
// Display is the text contents of the div used
// to represent the tooltip.
// attrArr is a list of attributes that can be saved to the tooltip 
// legend and is required for a FCC use-case.
function showToolTip(event, display, attrArr) {
  // Array of extra attributes
  // Primarily used to set 'data-value' and satisfy FCC test
  // Can be used on other attributes if required.
  for (let x = 0; x < attrArr.length; x += 2) {
    d3.select('#tooltip').attr(attrArr[x], attrArr[+1]);
  }

  d3.select('#tooltip').
  style('opacity', 0).
  html(display)
  // Tooltip needs to be well away from the mouse pos, 
  // otherwise interferes
  .style('left', event.pageX + 5 + 'px').
  style('top', event.pageY + 5 + 'px').
  style('opacity', 1);
}
function hideToolTip(event, display) {
  d3.select('#tooltip').style('opacity', 0);
}

// Building the main treemap chart.
function buildChart(root, colors, width, height) {

  // the SVG canvas
  const canvas = d3.select("#canvas");

  // set up a viewbox. same width and height as the canvas.
  canvas.attr("viewBox", [0, 0, width, height]);

  // Could be a previous chart, so remove.
  canvas.selectAll("*").remove();

  // Setting width and height.
  canvas.
  attr('width', width).
  attr('height', height);

  let tile = canvas.
  selectAll('g').
  data(root.leaves()).
  enter().
  append('g').
  attr('class', 'group').
  attr('transform', function (d) {return 'translate(' + d.x0 + ',' + d.y0 + ')';}).
  on('mouseover', (event, d) => {
    const contents = d.data.category + ": " + d.data.name + " " + d.data.value;
    showToolTip(event, contents, ['data-value', d.data.value]);
    //d3.select(event.target).style("fill", "red")
  })

  // Mouse events recorded on group. Work better than on rect.
  .on('mousemove', (event, d) => {
    const contents = d.data.category + ": " + d.data.name + " " + d.data.value;
    showToolTip(event, contents, ['data-value', d.data.value]);
  }).
  on('mouseout', (event, d) => {hideToolTip();});

  tile.
  append('rect').
  attr('class', 'tile').
  attr('width', d => d.x1 - d.x0).
  attr('height', d => d.y1 - d.y0).
  attr('fill', d => colors(d.data.category)).
  attr('data-name', function (d) {return d.data.name;}).
  attr('data-category', function (d) {return d.data.category;}).
  attr('data-value', function (d) {return d.data.value;});


  tile.
  append('text').
  attr('class', 'tile-text').
  selectAll('tspan').
  data(function (d) {return d.data.name.split(' ');})

  // https://onelinerhub.com/javascript-d3/how-do-i-use-the-tspan-element-in-d--js
  .enter().
  append("tspan").
  attr("x", 5).
  attr("y", function (d, i) {return i * 10 + 10;}).
  attr("font-size", "12px").
  text(function (d) {return d;});
}

// Now the legend canvas.
function buildLegend(categories, colors) {
  const legendCols = LEGEND_COLS;
  const itemLength = 200;
  const itemHeight = 20;
  const itemBuffer = 5;
  const fullWidth = itemLength * legendCols;

  // the Legend canvas
  const legend = d3.select("#legend").

  attr('width', fullWidth).
  attr('height', (Math.floor(categories.length / legendCols) + 1) * (itemHeight + itemBuffer));

  // Clean canvas on refresh
  legend.selectAll("*").remove();

  let item = legend.
  selectAll('g').
  data(categories).
  enter().
  append('g').
  attr('class', 'group').
  attr('transform', function (d, i) {
    return 'translate(' +
    (itemBuffer + itemLength) * (i % legendCols) + ',' +
    itemHeight * Math.floor(i / legendCols) + ')';
  })
  // Mouse events on the group rather than rect or text.
  .on('mouseover', (event, d) => highlightItemFromLegend(event, d, "red")).
  on('mouseout', (event, d) => highlightItemFromLegend(event, d, colors(d)));

  item.
  append('rect').
  attr('class', 'legend-item').
  attr('width', itemLength).
  attr('height', itemHeight).
  attr('fill', d => colors(d)).
  attr("style", "stroke-width:3;stroke:rgb(0,0,0)");

  item.
  append('text').
  attr('class', 'legend-text').
  attr('x', itemLength / 2).
  attr('y', itemHeight - 5).
  style("font-size", "14px").
  text(function (d) {return d;});
}

function processData(dataseries) {

  // Hierachy takes the data and adds to it: depth, height, and parent.
  // depth: counts how many parents every node has.
  // height: counts how many levels of children every node has.
  // parent: the parent of the node or null for the root node.
  //
  // Make room for the children by telling the heirachy the sorted sizes.
  // Sum children to get one value per catgory
  // Sort these sizes.
  const hierarchy =
  d3.hierarchy(dataseries).
  sum(d => d.value) //sums every child values
  .sort((a, b) => b.value - a.value); // and sort them in descending order

  // Get width and height from the HTML/CSS 
  const canvas = document.querySelector("#canvas");
  const style = getComputedStyle(canvas);
  const width = parseFloat(style.width.replace("px", ""));
  const height = parseFloat(style.height.replace("px", ""));

  // Declare treemap
  const treemap = d3.treemap().
  size([width, height]).
  padding(1);

  // and map the hierachy onto it
  const root = treemap(hierarchy);

  // The first level of the hierachy. Used for Colour mapping
  // and to build the legend
  const categories = dataseries.children.map(d => d.name);

  // Colour mapping
  const colorScale = d3.scaleOrdinal() // the scale function
  .domain(categories) // the data
  .range(colors); // the way the data should be shown 

  buildChart(root, colorScale, width, height);
  buildLegend(categories, colorScale);
  return;
}

/* Update Titles */
function updateTitles(dataEntry) {
  let dataType = dataEntry.dataType;
  dataType = dataType.charAt(0).toUpperCase() + dataType.slice(1);
  document.getElementById("title").innerHTML = dataType;

  let dataDesc = dataEntry.dataTitle;
  document.getElementById("description").innerHTML = dataDesc;
}

/* Called when radio button is chosen from HTML */
function dataSetSelected() {
  const dataType = document.querySelector('input[name="dataset-choice"]:checked').value;

  /* the filter below returns an array with one entry (in this case)
     so get the contents of that entry, which should be the object you need
   */
  const dataEntry = dataSets.filter(obj => {return obj.dataType === dataType;})[0];

  /* Set the chart header and description */
  updateTitles(dataEntry);

  d3.json(dataEntry.data).
  then(data => processData(data)).
  catch(err => processErr(err));
}

/* Startup / Refresh */
dataSetSelected();