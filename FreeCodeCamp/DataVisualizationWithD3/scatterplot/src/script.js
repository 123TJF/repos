const HEIGHT = 500;
const WIDTH  = 1000;
const PADDING = 100;

const dataSource = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"

function setChartTitles() {
  // Chart Title(s)
  d3.select("svg").append("text")
        .attr("x", PADDING + 50)
        .attr("y", PADDING - 50)
        .attr("id", "title")
        .style("font-size", "24px")
        .text("Doping in Professional Bicycle Racing");
  d3.select("svg").append("text")
        .attr("x", PADDING + 50)
        .attr("y", PADDING - 30)
        .attr("id", "sub-title")
        .style("font-size", "16px")
        .text("35 Fastest times up Alpe d'Huez");
  
  // Add a key to the two colors used - two small rectangles + two labels
  d3.select("svg")
      .append("rect")
         .attr("x", WIDTH-(PADDING*3)+5)
         .attr("y", HEIGHT-(PADDING*3)+30)
         .attr("width", 10)
         .attr("height", 10)
        .style('fill', "black")
  d3.select("svg")
      .append("rect")
         .attr("x", WIDTH-(PADDING*3)+5)
         .attr("y", HEIGHT-(PADDING*3)+60)
         .attr("width", 10)
         .attr("height", 10)
        .style('fill', "white")
  d3.select("svg").append("text")
        .attr("x", WIDTH-(PADDING*3)+20)
         .attr("y", HEIGHT-(PADDING*3)+40)
        .attr("id", "sub-title")
        .style("font-size", "16px")
        .text("Riders with alleged doping allegations");
  d3.select("svg").append("text")
        .attr("x", WIDTH-(PADDING*3)+20)
         .attr("y", HEIGHT-(PADDING*3)+70)
        .attr("id", "sub-title")
        .style("font-size", "16px")
        .text("No doping allegations");
}

function setUpChart() {
  // A div containing the SVG, used to position in the HTML body
  d3.select("body").append("div")
    .attr("id", "svg-div")
    .append("svg")
      .attr("width",  WIDTH)
      .attr("height", HEIGHT)
  
  setChartTitles()
  
  // Div used for the tooltip
  d3.select("body").append("div")
      .attr("id","tooltip")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
}

// Converts seconds into a usable time value
function secondsVal(d) {
  const x = new Date(Date.UTC(0)); 
  x.setSeconds(d.Seconds); 
  return(x); 
}

function setScale(dataset) {
  const SCREEN_RANGE_X = [PADDING, WIDTH-PADDING];
  const SCREEN_RANGE_Y = [HEIGHT-PADDING, PADDING];
  
  // Store years in an array for easier manipulation
  const yearArr        = dataset.map (d => new Date(d.Year+"-01-01") )

  const minX = d3.min(yearArr, (d) => d );
  const maxX = d3.max(yearArr, (d) => d );
  const minY = d3.min(dataset, (d) => secondsVal(d));
  const maxY = d3.max(dataset, (d) => secondsVal(d));
  
  const xScale = d3.scaleTime().domain([minX, maxX]).range(SCREEN_RANGE_X)
  const yScale = d3.scaleTime().domain([minY, maxY]).range(SCREEN_RANGE_Y)
  return [ xScale, yScale ]
}

// Format the time axis. placed in a function to make the axis code 
// more legible
function timeAxisFormat(d) {
  let mins = d.getMinutes();
      mins = (mins<10) ? "0"+mins : mins;
  
  let secs = d.getSeconds();
      secs = (secs<10) ? "0"+secs : secs;
  return (mins+":"+secs)        
}

function addAxis(xScale, yScale) {
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale)
    .tickFormat((d,i) => timeAxisFormat(d))
  
  // Places xAxis at bottom of screen, taking into account reverse co-ords and margin
  d3.select("svg").append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + (HEIGHT - PADDING) + ")")
    .call(xAxis)
  
  // Place yAxis to the left, taking into account the margin
  d3.select("svg").append("g")
    .attr("transform", "translate(" + PADDING + ",0)")
    .attr("id", "y-axis")
    .call(yAxis)
  
  // yAxis also needs a title
  d3.select("svg").append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", PADDING-50)
    .attr("x",0 - (HEIGHT/ 2))
    .attr("id", "legend")
    .style("font-size", "20px")
    .style("text-anchor", "middle")
    .text("Time in Minutes")
}

// Function called when mouse is over a circle
function showToolTip(event, d) { 
  d3.select('#tooltip')
     .style('visibility', 'hidden')  
     .attr("data-year", new Date(d.Year+"-01-01"))
     .html(
        d.Name + " <STRONG>" + d.Nationality + "</STRONG>" +
        "<BR>" + d.Year + ", " + d.Time + "<BR>" +
        "<a href="+d.URL+">"+d.Doping+"</a>"
      )
     .style('left', event.clientX + 'px')
     .style('top', event.clientY + 10 + 'px')
     .style('transition-duration', '1s')
     .style('visibility', 'visible')  
}
// Function called when mouse leaving a circle
function hideToolTip() {
  d3.select('#tooltip')
    .style('transition-duration', '.5s')
    .style('visibility', 'hidden')
}

// Function to draw the chart entries (circles)
function drawChart(dataset, xScale, yScale) {
  d3.select("svg").selectAll("circle")
       .data(dataset)
       .enter()
       .append("circle").attr("class", "dot")
         .attr("cx", (d, i) => xScale( new Date(d.Year+"-01-01") ) )
         .attr("cy", (d, i) => yScale( secondsVal(d)) )
         .attr("r", 5)
         .attr("data-xvalue", (d) => new Date(d.Year+"-01-01") )
         .attr("data-yvalue", (d) => secondsVal(d) )
         .style('fill', (d) => (d.Doping === "") ? "black" : "white")
         .on('mouseover', function (event, d) {
            showToolTip(event, d)
          })
          .on('mouseout', function() {
            hideToolTip()
          })
}
  
// Main Code
const req = new XMLHttpRequest();
 req.open("GET",dataSource,true);
 req.send();
 req.onload = function() {
    let xScale, yScale;
    const canvas   = d3.select("svg");
    const jsondata = JSON.parse(req.responseText);
 
    setUpChart();
    [xScale, yScale] = setScale(jsondata);
    addAxis(xScale, yScale);
    drawChart(jsondata, xScale, yScale);
 }