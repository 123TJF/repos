const HEIGHT = 500;
const WIDTH  = 1000;
const PADDING = 60;

const dataSource = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"

function setUpChart() {
  const body = d3.select("body");

  // Tooltip - a div hanging from the document body
  body.append("div")
      .attr("id","tooltip")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("opacity", 0);
  
  // The graphics canvas
  body.append("div")
    .attr("id", "svg-div")
    .append("svg")
        .attr("width",  WIDTH)
        .attr("height", HEIGHT)
  
  const canvas = d3.select("svg")
      // Mouse Out event on the SVG to remove tooltip from SVG
      // Done here as if added to rectangle it disapears too quickly
      .on("mouseout",function() { hideToolTip() })
  
  // Title
  canvas.append("text")
        .attr("x", PADDING + 50)
        .attr("y", PADDING - 20)
        .attr("id", "title")
        .style("font-size", "24px")
        .text("United States GDP");
  
  return canvas;
}

function setScale(dataset) {
  const timeArr         = dataset.map (item => new Date(item[0]) )
  const SCREEN_RANGE_X  = [PADDING, WIDTH-PADDING];
  const SCREEN_RANGE_Y = [HEIGHT-PADDING, PADDING];
  
  const minX       = d3.min(timeArr, (d) => d);
  const maxX       = d3.max(timeArr, (d) => d);
  const maxY       = d3.max(dataset, (d) => d[1])
  const yScale     = d3.scaleLinear().domain([0, maxY]).range(SCREEN_RANGE_Y)
  const xTimeScale = d3.scaleTime().domain([minX, maxX]).range(SCREEN_RANGE_X)

  return [ xTimeScale, yScale]
}

function addAxis(canvas, xScale, yScale) {
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  canvas.append("g")
      .attr("id", "x-axis")
      .attr("transform", "translate(0," + (HEIGHT - PADDING) + ")")
      .call(xAxis)
  
  canvas.append("g")
       .attr("transform", "translate(" + PADDING + ",0)")
       .attr("id", "y-axis")
       .call(yAxis)
}

function showToolTip(event, d) {
   d3.select('#tooltip')
     .style('opacity', 0)  
     .attr("data-date", d[0])
     .html(d.join(', '))
     .style('left', event.clientX + 'px')
     .style('top', event.clientY + 10 + 'px')
     .style('opacity', 1)  
}
function hideToolTip() {
  d3.select('#tooltip')
    .style('opacity', 0)
}

function drawChart(canvas, dataset, xScale, yScale) {
  canvas.selectAll("rect")
       .data(dataset)
       .enter()
       .append("rect").attr("class", "bar")
         .attr("x", (d, i) => xScale( new Date(d[0])) )
         .attr("y", (d, i) => { return( yScale(d[1]) ) } )
         .attr("width", ((WIDTH-(PADDING*2))/(dataset.length-1)))
         .attr("height", (d, i) => { 
          return (
              ((HEIGHT-yScale(d[1])-PADDING)<0) ? 0 : HEIGHT-yScale(d[1])-PADDING) 
          } )
         .attr("data-date", (d) => d[0])
         .attr("data-gdp", (d) => d[1])
         .on('mouseover', function (event, d) {
            showToolTip(event, d)
          })
}
  
// Main Code
const req = new XMLHttpRequest();

      req.open("GET",dataSource,true);
      req.send();
      req.onload = function() {
    const json    = JSON.parse(req.responseText);
    const dataset = json.data;
    
    let xScale, yScale; 
        
    const canvas     = setUpChart();
    [xScale, yScale] = setScale(dataset);
    addAxis(canvas, xScale, yScale);
    drawChart(canvas, dataset, xScale, yScale);
}