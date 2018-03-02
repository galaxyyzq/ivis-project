// change barHolderSelector for the bar holder,
// i.e for id="barHolder" use #barHolder
// change the squareX component name and squareY component name also the yAxisTitle
// to update the bars, use
// initBars(data)

var squareX;
var squareY;
var squareBarSvg;
var xRangeSquare;

/*
* barHolderSelctor is the id of the element that holds the barchart
* height is the height of the bar chart
* width is the width of the bar chart
* data is the data that's shown in the bar chart
*/
function initBars(barHolderSelector, height, width, data) {

  margin = {top: 0, right: 0, bottom: 0, left: 0};

  xRangeSquare = [];
  for(i = 1951; i < 2017; i++){
    xRangeSquare.push(i);
  }

	// Use linear scale for so we can have small squares
	// Ordinal only uses whole numbers which we can't use
	squareX = d3.scale.linear()
		.range([0, width*0.95]) // If we use the whole width the bars will go outside the square
		.domain([0, xRangeSquare[xRangeSquare.length-1] - xRangeSquare[0]]);

  squareY = d3.scale.linear()
      .range([height, 0])
      .domain([0, 2541249]);

  squareBarSvg = d3.select(barHolderSelector)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("id", "bar-holder")

  updateSquareBars(data, height)
}

function updateSquareBars(data, height) {

	data.forEach(function(d) {
		d.Value = +d.Value;
		d.Year 	= +d.Year;
	});

	var theBars = squareBarSvg.selectAll(".bar")
			.data(data).enter()
		.append("rect")
			.attr("class", "bar")
			.attr("x", function(d,i) {
					// Use values between "0" and "number of years"
					return squareX(d.Year - xRangeSquare[0]); })
			.attr("width", 2)
			.attr("y", function(d) { return squareY(d.Value); })
			.attr("height", function(d) {
					return height - squareY(d.Value);
			})



			// .on("click",function(d){
			// });

	// theBars
	// 		.transition()
	// 		.attr("y", function(d) { return squareY(d.Value); })

	// squareBarSvg.exit().remove()
	// d3.select("input").on("change", change);
	// function change() {
	// 	// clearTimeout(sortTimeout);
	// 	// Copy-on-write since tweens are evaluated after a delay.
	// 	var x0 = squareX.domain(data.sort(this.checked
	// 			? function(a, b) { return b[yComp] - a[yComp]; }
	// 			: function(a, b) { return d3.ascending(a[xComp], b[xComp]); })
	// 			.map(function(d) { return d[xComp]; }))
	// 			.copy();

	// 	svg.selectAll(".bar")
	// 			.sort(function(a, b) { return x0(a[xComp]) - x0(b[xComp]); });

	// 	var transition = svg.transition().duration(750),
	// 			delay = function(d, i) { return i * 50; };

	// 	transition.selectAll(".bar")
	// 			.delay(delay)
	// 			.attr("x", function(d) { return x0(d[xComp]); });

	// 	transition.select(".x.axis")
	// 			.call(squareXAxis)
	// 		.selectAll("g")
	// 			.delay(delay);
	// }
}