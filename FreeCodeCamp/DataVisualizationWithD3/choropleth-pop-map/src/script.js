/* Original submission for FCC data visualisation certificate test */
/* Including FCC testing                                           */
const WIDTH  = 960;
const HEIGHT = 600;

const mapSource  = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'
const dataSource = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'

const DEFUALT_COLOR = 'darkgreen'
const colors = [ [5,  '#edfced'], 
                 [15, '#9ef09e'], 
                 [30, '#5ce65c'],
                 [45, '#27dd27'],
                 [55, '#1bac1b'],
                 [70, '#137c13'],
                 [100, DEFUALT_COLOR]];

// Returns a color based on the value passed
function colorChart(val) {
  for (let x=0; x<colors.length;x++) {
    if (val<=colors[x][0]) return colors[x][1]
  }
  return DEFUALT_COLOR;
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


function drawLegend() {
  const canvas  = d3.select('#container-grid');
  const boxSize = 35; // Size of the color squares
  const legend  = canvas.append('svg')
    .attr('id','legend')
    .attr('height', boxSize)
    .attr('width',  WIDTH);
  const xStart=WIDTH-(colors.length*boxSize);
  const yStart=0;
  
  // Loops round building boxes and number to represent the legend key
  for (let x=0; x<colors.length; x++) {
      // Colored square
      legend.append('rect')
        .attr('x', xStart+((x)*boxSize))
        .attr('y', yStart)
        .attr('width', boxSize)
        .attr('height', boxSize)
        .style('fill', colors[x][1])
    
       legend.append('text')
        .attr('x', xStart+(x*boxSize)+2 )
        .attr('y', yStart+(boxSize/2))
        .style('font-size', '10px')
        .text('<'+colors[x][0])
  }
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

function drawMap(mapData, eData) {
  const width = WIDTH,height = HEIGHT;
  const path = d3.geoPath().projection(null);
  
  drawTitles();
  
  const container = d3.select('body')
    .append('div')
    .attr('id', 'container-grid')

  // Div used for the tooltip
  d3.select('body')
    .append('div')
    .attr('id','tooltip')
    .style('position', 'absolute')
    .style('background-color', 'black')
    .style('color', 'white')
    .style('opacity', 0);
  
  drawLegend();

  const canvas  = d3.select('#container-grid')
    .append('svg')
    .attr('id', 'svg-chart')
    .attr('width', width)
    .attr('height', height);
    
  // States
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
  
   // Counties
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
      return (colorChart(object[0].bachelorsOrHigher));
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
  
  d3.select('#container-grid')
    .on('mouseout', (d) => hideToolTip() )   
}

// Main Code: Import data then hand to display function
Promise.all([d3.json(mapSource), d3.json(dataSource)])
  .then(data => drawMap(data[0],data[1]))
  .catch(err => console.log(err));
