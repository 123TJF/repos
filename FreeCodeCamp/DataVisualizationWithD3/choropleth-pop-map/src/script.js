/* Updated FCC task.        */
/* 1. Improved Color Scale  */
/* 2. Improved Legend       */
/* With the FCC tests       */
const WIDTH  = 960;
const HEIGHT = 600;

// Size of the color squares used in legend
const boxSize = 35; 

const mapSource  = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
const dataSource = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'

// https://observablehq.com/@d3/color-schemes - Cool
const colors=
["#6e40aa","#5e57cb","#4775de","#2f96e0","#1eb8d0","#1ad5b1","#28ea8d","#4af56c","#79f659","#aff05b"]

function setColorScale(dataset) {
  const arrayOfPercents = dataset.map(d => d.bachelorsOrHigher).sort(function(a, b) { return a - b } );
  const unique = [ ... new Set(arrayOfPercents)]
  
  var colorScale = d3.scaleQuantile()
    .domain(unique)
    .range(colors);

  return colorScale;
}

function drawTitles() {
  const container = d3.select('body')

  container.append('h1')
    .attr('id', 'title')
    .style('font-size', '24px')
    .text('United States Educational Attainment');
  
  container.append('h2')
    .attr('id', 'description')
    .style('font-size', '16px')
    .text('Percentage of adults age 25 and older with a bachelor\'s degree or higher (2010-2014)');
}

function drawLegend(colorScale) {
  const legend = d3.select('#legend')
  
  const domain  = colorScale.domain();
  const range   = colorScale.range();

  const xStart=WIDTH-(range.length*boxSize);
  const yStart=0;
  
  let entries = legend.selectAll('g.legendEntry')
    .data(colorScale.range())
    .enter()
    .append('g').attr('class', 'legendEntry');
  
  entries.append('rect')  
      .attr('x', function(d, i ) { return( xStart+(i*boxSize)) } )
      .attr('y', yStart)
      .attr('width', boxSize)
      .attr('height', boxSize)
      .attr('fill', function(d){return d;}); 
  
  entries.append('text')
        .attr('x', function(d, i ) { return( (xStart+(i*boxSize)+2) ) } )
        .attr('y', yStart+(boxSize/2))
        .style('font-size', '10px')
        .text(
           function(d,i) {
              let extent=colorScale.invertExtent(d);
              return ('<' + Math.round(extent[1]) + '%')
           } );
}

// Function called when mouse is over a rect
// Pass attributes as an 'attr', 'val' pair in an array
function showToolTip(event, display, arr) {
  // loop through an array of 'extra' attributes, such as ID's
  for (let x=0; x<arr.length; x+=2) {
    d3.select('#tooltip').attr(arr[x], arr[+1]) 
  }
  d3.select('#tooltip')
    .style('opacity', 0)  
    .html(display)
    // Tooltip needs to be well away from the mouse pos, otherwise interferes
    .style('left', event.pageX + 20 + 'px')
    .style('top', event.pageY  - 30 + 'px')
    .style('opacity', 1)  
}

// Function called when mouse leaving a rect
function hideToolTip() {
  d3.select('#tooltip')
    .style('opacity', 0)
}

function drawStates(mapData, path) {
  canvas = d3.select('#svg-chart');
  
  canvas
    .append('path') 
    .datum(
        topojson.mesh(mapData, mapData.objects.states, function (a, b) {
          return a !== b;
    }))
    .attr('class','state')
    .attr('d', path)
    .attr('style', 'stroke-width:2; stroke:red')
    .style('fill', 'transparent'); 
}

function drawCounties(mapData, eData, path, colorScale) {
  canvas = d3.select('#svg-chart');
  canvas.append('g')
    .attr('class', 'counties')
    .selectAll('path')
    .data(topojson.feature(mapData, mapData.objects.counties).features)
    .enter()
    .append('path')
    .attr('class','county')
    .attr( 'd', path)
    .attr('style', 'stroke-width:2; stroke:transparent')
    .style('fill', (d) => {
      let object = eData.filter(edu => (edu.fips === d.id));
      return (colorScale(object[0].bachelorsOrHigher));
    })
    .attr('data-fips', (d) => d.id)
    .attr('data-education',  (d) => {
      let object = eData.filter(edu => (edu.fips === d.id));
      return (object[0].bachelorsOrHigher);
    })
    .on('mouseover', (event, d) => {
      let object = eData.filter(edu => (edu.fips === d.id));
      let display = object[0].area_name + "<BR>" + object[0].bachelorsOrHigher + "%"
      showToolTip(event, display, ['data-education',object[0].bachelorsOrHigher])
    })
  
  // Define the action to remove tooltip. 
  // The action to show tooltip is just above 
  // so keep this together.
  d3.select('#container-grid').on('mouseout', (d) => hideToolTip() )   
}

function drawMap(mapData, eData, colorScale) {
    
  const path = d3.geoPath().projection(null);
  
  drawStates(mapData, path);
  drawCounties(mapData, eData, path, colorScale);
}

function setupToolTip() {
  // Div used for the tooltip
  d3.select('body')
    .append('div')
    .attr('id','tooltip')
    .style('position', 'absolute')
    .style('background-color', 'black')
    .style('color', 'white')
    .style('opacity', 0);
}

function drawCanvas(mapData, eData) {
  const width = WIDTH,
        height = HEIGHT;
  
  // Titles 1st to get them at top of screen
  drawTitles();
  
  // This DIV houses the SVG canvas 
  // and is frequently used so 
  // define early.
  const container = d3.select('body')
  .append('div')
  .attr('id', 'container-grid')
  
  const canvas  = d3.select('#container-grid');
  
  // Legend canvas
  canvas.append('svg')
    .attr('id','legend')
    .attr('height', boxSize)
    .attr('width',  WIDTH);
  
  // The SVG drawing canvas
  canvas.append('svg')
    .attr('id', 'svg-chart')
    .attr('width', WIDTH)
    .attr('height', HEIGHT);
  
  const colorScale = setColorScale(eData);
  drawMap(mapData, eData, colorScale);
  drawLegend(colorScale);
  setupToolTip();
}

// Main Code: Import data then hand to display function
Promise.all([d3.json(mapSource), d3.json(dataSource)])
  .then(data => drawCanvas(data[0],data[1]))
  .catch(err => console.log(err));
