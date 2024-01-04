/* Version used for FCC data visualisation challenge */
/* Without the FCC test suite                        */
const HEIGHT = 500;
const WIDTH  = 1200;
const PADDING = 100;

const dataSource = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"

// Month mapping used in the Y scale
const monthNames = ["January", "February", "March", "April", "May", "June", 
                    "July", "August", "September", "October", "November", "December" ]

// Mapping of colours to temperature
const colors = [ [2, "blue"], 
                 [4, "#4169E1"], 
                 [6, "#00BFFF"],
                 [8, "#E6E6FA"],
                 [10,"#FFA500"],
                 [12,"red"]];

// Returns a color based on the temparature
function colorChart(temperature) {
  for (let x=0; x<colors.length;x++) {
    if (temperature<=colors[x][0]) return colors[x][1]
  }
  return "red";
}

// Add a key to the two colors used - two small rectangles + two labels
function addLegend() {
  const canvas    = d3.select("#svg_chart");
  const legend    = canvas.append("svg").attr("id","legend");
  const boxSize   = 35; // Size of the color squares
  const txtOffset = 25; // Offset from the color squares
  const boxYPos   = boxSize*2;           // Where to position the boxes based on size
  const txtYPos   = boxSize*2-txtOffset; // Where to position text based on size
  
  // Just a label
  legend.append("text")
    .attr("x", PADDING+boxSize)
    .attr("y", HEIGHT-10)
    .style("font-size", "16px")
    .text("Legend - temperature/color mapping")
  
  // Loops round building boxes and number to represent the legend key
  for (let x=0; x<colors.length; x++) {
      // Colored square
      legend.append("rect")
         .attr("x", PADDING+((x+1)*boxSize))
         .attr("y", HEIGHT-boxYPos)
         .attr("width", boxSize)
         .attr("height", boxSize)
        .style('fill', colorChart(colors[x][0]))
      // 'tick' mark
      legend.append("line")
         .attr("x1", PADDING+((x+2)*boxSize))
         .attr("y1", HEIGHT-boxYPos)
         .attr("x2", PADDING+((x+2)*boxSize))
         .attr("y2", HEIGHT-txtOffset)
         .style("stroke","black")
         .style("stroke-width", 1)
      // Scale value
      legend.append("text")
        .attr("x", PADDING+((x+2)*boxSize-12))
        .attr("y", HEIGHT-txtOffset)
        .style("font-size", "10px")
        .text(colors[x][0]);
  }
}

// Chart Title(s)
function setChartTitles(temperature) {
  const canvas = d3.select("#svg_chart")
  canvas.append("text")
        .attr("x", PADDING + 50)
        .attr("y", PADDING - 50)
        .attr("id", "title")
        .style("font-size", "24px")
        .text("Monthly Global Land-Surface Temperature");
  canvas.append("text")
        .attr("x", PADDING + 50)
        .attr("y", PADDING - 30)
        .attr("id", "description")
        .style("font-size", "16px")
        .text("1753 - 2015: base temperature "+temperature);
}

function setUpChart(temperature) {
  // A div containing the SVG, used to position in the HTML body
  d3.select("body").append("div")
    .attr("id", "svg-div")
    .append("svg").attr("id","svg_chart")
      .attr("width",  WIDTH)
      .attr("height", HEIGHT)
  
  // Div used for the tooltip
  d3.select("body").append("div")
      .attr("id","tooltip")
      .style("position", "absolute")
      //.style("z-index", "10")
      .style("opacity", 0)
  
  setChartTitles(temperature)
  addLegend()
}

function setScale(dataset) {
  const SCREEN_RANGE_X = [PADDING, WIDTH-PADDING];
  const SCREEN_RANGE_Y = [PADDING, HEIGHT-PADDING];
  
  // Store years in an array for easier manipulation
  const yearArr = dataset.map (d => new Date(d.year+"-01-01") )

  const minX = d3.min(yearArr, (d) => d );
  const maxX = d3.max(yearArr, (d) => d );
  const minY = d3.min(dataset, (d) => d.month );
  const maxY = d3.max(dataset, (d) => d.month );
  
  const xScale = d3.scaleTime().domain([minX, maxX]).range(SCREEN_RANGE_X)
  // min and max adjusted by 0.5 to allow for height of 'boxes' to display
  const yScale = d3.scaleLinear().domain([minY-0.5, maxY+0.5]).range(SCREEN_RANGE_Y)
  
  return [ xScale, yScale ]
}

function addAxis(xScale, yScale) {
  const canvas = d3.select("#svg_chart")
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale)
    .tickFormat((d,i) => monthNames[d-1])
  
  // Places xAxis at bottom of screen, taking into account reverse co-ords and margin
  canvas.append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + (HEIGHT - PADDING) + ")")
    .call(xAxis)
  
  // Place yAxis to the left, taking into account the margin
  canvas.append("g")
    .attr("transform", "translate(" + PADDING + ",0)")
    .attr("id", "y-axis")
    .call(yAxis)
  
  // yAxis Label
  canvas.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", PADDING-50)
    .attr("x",0 - (HEIGHT/ 2))
    .attr("id", "y_axis_label")
    .style("font-size", "20px")
    .style("text-anchor", "middle")
    .text("Months")
  
   // xAxis Label
   canvas.append("text")
    .attr("y", HEIGHT-50)
    .attr("x", WIDTH/2)
    .attr("id", "x_axis_label")
    .style("font-size", "20px")
    .style("text-anchor", "middle")
    .text("Years")
}

// Function called when mouse is over a rect
function showToolTip(base, event, d) { 
  d3.select('#tooltip')
    .attr("data-year", d.year)
    .style('opacity', 0)  
    .html(monthNames[d.month-1]+" "+d.year+" <BR> "+Math.round(100*(base+d.variance))/100+"&deg;C")
    .style('left', event.pageX + 'px')
    .style('top', event.pageY + 10 + 'px')
    .style('opacity', 1)  
}

// Function called when mouse leaving a rect
function hideToolTip(event) {
  d3.select('#tooltip')
    .style('opacity', 0)
}

function drawChart(dataset, xScale, yScale) {
  const base  = dataset.baseTemperature;
  const temps = dataset.monthlyVariance;
  
  // Build an array of years - used to calc the width
  let   years = temps.map(i => i.year).filter((year, index, arr) => arr.indexOf(year) == index)
  const rectWidth = (WIDTH-(PADDING*2)) / (years.length)

  // Builds colored rectangles
  d3.select("#svg_chart").selectAll("rect")
    .data(temps)
    .enter()
      .append("rect")
        .attr("class", "cell")
        .attr("x", (d) => { return xScale( new Date(d.year+"-01-01") ) })
        // offset y from tick mark by 0.5 to allow for size of the box
        .attr("y", (d) => { return yScale( d.month-0.5 ) })
        .attr("width", rectWidth)
        .attr("height", (d) => {
          return(
            // Rectangle is offset above and below the tick mark
            // achieved by adding 1 (.5 below, .5 above )
            yScale( d.month+0.5)-yScale( d.month-0.5 )
          )
        })
        .attr("data-month", (d) => d.month -1)
        .attr("data-year",  (d) => d.year)
        .attr("data-temp",  (d) => base + d.variance)
        .style("fill",      (d) => colorChart(base+d.variance) )
        .on("mouseover",    function (event, d) {
            return(showToolTip(base, event, d))
         })
  
      // Mouse Out event on the SVG to remove tooltip from SVG
      // Done here as if added to rectangle it disapears too quickly
      d3.select("#svg_chart")
        .on("mouseout",function() { hideToolTip(event) })
}

// Main Code
const req = new XMLHttpRequest();
 req.open("GET",dataSource,true);
 req.send();
 req.onload = function() {
    let xScale, yScale;
    const jsondata = JSON.parse(req.responseText);
    setUpChart(jsondata.baseTemperature);
    [xScale, yScale] = setScale(jsondata.monthlyVariance);
    addAxis(xScale, yScale);
    drawChart(jsondata, xScale, yScale);
 }