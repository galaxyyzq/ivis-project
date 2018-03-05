// change barHolderSelector for the bar holder,
// i.e for id="barHolder" use #barHolder
// change the squareX component name and squareY component name also the yAxisTitle
// to update the bars, use
// initBars(data)

var squareX;
var squareY;
var xRangeSquare;
var startingYear = 1951;

/*
* barHolderSelctor is the id of the element that holds the barchart
* height is the height of the bar chart
* width is the width of the bar chart
* data is the data that's shown in the bar chart
*/
function initBars(barHolderSelector, height, width, data,scaleForY) {

	// The range we are using, 2017 - 1951 = 66
  xRangeSquare = [];
  for(i = 0; i < 66; i++){
    xRangeSquare.push(i);
  }

	// Use linear scale for so we can have small squares
	// Ordinal only uses whole numbers which we can't use
	squareX = d3.scale.linear()
		.range([0, width*0.95]) // If we use the whole width the bars will go outside the square
		.domain([0, xRangeSquare[xRangeSquare.length-1]]);
	if(scaleForY=="linear"){
		squareY = d3.scale.linear()
			.domain([0, 2541249])
			.range([height, 0]);
	}else{
		squareY = d3.scale.log()
			.base(10)
			.domain([1, 10000000])
			.range([height, 0]);
	}
	
  d3.select(barHolderSelector)
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("id", "bar-holder")

	// drawBarsInSquare(data, height, barHolderSelector)
	data.forEach(function (d) {
		d.Value = scaleForY == "linear" ? +d.Value: Math.max(+d.Value, 1);
		d.Year = +d.Year;
	});

	var barSvg = d3.select(barHolderSelector).select("#bar-holder");

	var theBars = barSvg.selectAll(".bar")
		.data(data).enter()
		.append("rect")
		.attr("class", "bar")
		.attr("x", function (d) {
			// Scale down d.Year to [0, 66]
			return squareX(d.Year - startingYear);
		})
		.attr("width", 2)
		.attr("y", function (d) { return squareY(d.Value); })
		.attr("height", function (d) {
			return height - squareY(d.Value);
		})
		
}

function drawBarsInSquare(data, height, barHolderSelector) {

	

	// Update the bars here!
	// When we switch from linear to exponential etc
		
	// squareY = d3.scale.linear()
	// .range([height, 0])
	// .domain([0, 2541249]);

}
