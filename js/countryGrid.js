// var dataChart = [10,30,50,20,23,12,32];

var margin = { top: 70, right: 100, bottom: 10, left: 80 },
  width = 2000 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var squareWidthHeight = 100;
var squareMarginX = 10;
var numRows = 10;
var squareHoverSizeIncrease = 50;
var zoomOffset = 5;

svg = d3.select("#country-grid")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

function zoomInSquare(d,i) {
  var currentX = +d3.select(this).attr("x"),
      currentY = +d3.select(this).attr("y"),
      w = +d3.select(this).attr("width"),
      h = +d3.select(this).attr("height");	
  
  // With translate and scale, all children will be affected as well. 
  // Transformation are from left to right, just like in computer graphics with matrix multiplications.
  d3.select(this.parentNode)
  .attr("transform", `translate(${currentX},${currentY}) scale(1.3,1.3) translate(-${currentX},-${currentY})`);
    // .attr("transform", `translate(${currentX - 0.3*w},${currentY-0.4*h}) scale(1.3,1.3) translate(-${currentX},-${currentY})`);
}

function zoomOutSquare() {
  console.log("LEAVING")
  var currentX = +d3.select(this).attr("x"), // Current x position
      currentY = +d3.select(this).attr("y"), // Current y position
      w = +d3.select(this).attr("width"),    // Current width
      h = +d3.select(this).attr("height")    // Current height
      mouseCoord = d3.mouse(this);           // Mouse position

  // Debug squares at mouse leave position
  svg.append("rect")
    .attr("width", 2)
    .attr("height", 2)
    .attr("x", mouseCoord[0])
    .attr("y", mouseCoord[1])
    .attr("fill", "blue")


  // Check if mouse is within the square
  var isInsideX = mouseCoord[0] < (currentX + squareWidthHeight*1.3) && mouseCoord[0] > currentX;
  var isInsideY = mouseCoord[1] < (currentY + squareWidthHeight*1.3) && mouseCoord[1] > currentY;

  // console.log("id", d3.select(this.parentNode).attr("id"))
  // console.log("Xpos:",mouseCoord[0],". SquarePos+Width: ",currentX - 0.3*w + squareWidthHeight*1.3)
  // console.log("Ypos:",mouseCoord[1],". SquarePos+Height: ",currentY - 0.4*h + squareWidthHeight*1.3)
  console.log(d3.select(this.parentNode).attr("id"),isInsideX, isInsideY)

  // console.log(isInsideX, isInsideY, currentX + squareWidthHeight, currentY + squareWidthHeight, mouseCoord)

  if(!isInsideX || !isInsideY){
    d3.select(this.parentNode)
      .attr("transform", `translate(${currentX},${currentY}) scale(1,1) translate(-${currentX},-${currentY})`);
  }
}

d3.csv("data/1951-data.csv", function(error, data){
  if(error) throw error;

  // Create g element for each data point
  var square = svg.selectAll(".rect-container")
      .data(data).enter()
    .append("g")
      .attr("class", "rect-container")
      // Id is used to reference the square in the bar chart script
  	  .attr("id", function(d,i) {return "square-" + i; })

  // Append a square svg element in each g container
  square
    .append("rect")
      .attr("width", squareWidthHeight)
      .attr("height", squareWidthHeight)
      .attr("stroke-width", 3)
      .attr("stroke", "black")
      .on("mouseover", zoomInSquare)
      .on("mouseleave", zoomOutSquare)
      .attr("x", function(d,i) { return i%numRows * (squareWidthHeight + squareMarginX); })
      .attr("y", function(d,i) { return Math.floor(i/numRows) * (squareWidthHeight + squareMarginX); })
      .attr("fill", "white");
  
  // Add a bar chart in each square
	square
		.each(function(d,i) {
			var barHolderSelector = "#"+d3.select(this).attr("id");
			var x = +d3.select(this).selectAll("rect").attr("x");
      var y = +d3.select(this).selectAll("rect").attr("y");

      // Call function from 'bars.js'
      drawBars(barHolderSelector,
        xComp = "letter",
        yComp = "frequency",
        yAxisTitle = "",
        height = squareWidthHeight,
        width = squareWidthHeight,
        x,
        y
      );
		});
});


