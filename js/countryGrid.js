
// Dimensions of the useful area inside the SGV

var margin = { top: 62, right: 20, bottom: 20, left: 20 };
var width  = 1110; 
var height = 550;

var squareWidthHeight = 54;
var squareMarginX = 8;
//var numRows = Math.floor(width/(squareWidthHeight+squareMarginX) );
var numRows = 18;

var squareHoverSizeIncrease = 50;
var zoomOffset = 5;


var countryGridSVG = d3.select("#country-grid")
  //.attr("width", width)
  //.attr("height", height)
  .attr("width",  width  + margin.left + margin.right)
  .attr("height", height + margin.top  + margin.bottom)
.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .attr("id", "g_container"); // We give the <g> an id because we'll later create a rec inside of it
							  //  that will represent the useful area.
  
// Changing SVG background Color
//$("#country-grid").css('background-color', 'yellow');

// Creating a rect inside the <g> that contains everything so we can fill it with color
var g_container = d3.select("#g_container")
	.append("rect")
    .attr("width",  width+"px")
    .attr("height", height+"px")
    .attr("fill", "pink");

// Creating a rect inside the <g> that will draw a cool border
var a = 20;
var g_container = d3.select("#g_container")
	.append("rect")
	.attr("x", -a/2)
	.attr("y", -a/2)
    .attr("width",  width  + a +"px")
    .attr("height", height + a +"px")
    .attr("stroke-width", 1) // border
    .attr("stroke", "gray")
    //.attr("fill", "lightblue")
    .attr("fill", "white")
	.attr("rx", 10);




function zoomInSquare(d,i) {
  var currentX = +d3.select(this).select("rect").attr("x"), // Current x position of square in parent
      currentY = +d3.select(this).select("rect").attr("y"), // Current y position of square in parent
      w = +d3.select(this).select("rect").attr("width"),    // Current width of square in parent
      h = +d3.select(this).select("rect").attr("height");	
  
  // With translate and scale, all children will be affected as well. 
  // Transformation are from left to right, just like in computer graphics with matrix multiplications.
  d3.select(this)
    .attr("transform", `translate(${currentX - 0.3*w},${currentY - 0.4*h}) scale(1.3,1.3) translate(-${currentX},-${currentY})`);
}

function zoomOutSquare() {
  var currentX = +d3.select(this).select("rect").attr("x"), // Current x position of square in parent
      currentY = +d3.select(this).select("rect").attr("y"); // Current y position of square in parent

    d3.select(this)
      .attr("transform", `translate(${currentX},${currentY}) scale(1,1) translate(-${currentX},-${currentY})`);
}


// Reading data and creating the squares
d3.csv("data/1951-data.csv", function(error, data){
  if(error) throw error;

  // Create g element for each data point
  var square = countryGridSVG.selectAll(".rect-container")
      .data(data).enter()
    .append("g")
      .attr("class", "rect-container")
      // Id is used to reference the square in the bar chart script
  	  .attr("id", function(d,i) {return "square-" + i; })
      .on("mouseenter", zoomInSquare)   // This will trigger only for parent node
      .on("mouseleave", zoomOutSquare)  // This will trigger only for parent node

  // Append a square svg element in each g container
  square
    .append("rect")
      .attr("width", squareWidthHeight)
      .attr("height", squareWidthHeight)
      .attr("stroke-width", 3) // border
      //.attr("stroke", "black")
	  .attr("stroke", function(d,i){ 
	  	console.log(i + "	"+ Math.floor(i/numRows) + "	"+i%numRows)
	  	if(i%numRows >= 0 && i%numRows<=3 )
		{
			return "red"
		}
	  	else if(i%numRows >= 4 && i%numRows<=6 )
		{
			return "green"
		}
	  	else if(i%numRows >= 7 && i%numRows<=10 )
		{
			return "#5D32D2"
			//return "blue"
		}	  
	  	else if(i%numRows >= 10 && i%numRows<=13 )
		{
			return "black"
		}	
	  	else if(i%numRows >= 13 && i%numRows<=18 )
		{
			return "brown"
		}		  	  
	  	return "white" })
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


