// change barHolderSelector for the bar holder,
// i.e for id="barHolder" use #barHolder
// change the squareX component name and squareY component name also the yAxisTitle
// to update the bars, use
// initBars(data)

var squareX;
var squareY;
var squareBarSvg;
var xRangeSquare;

function initBars(barHolderSelector,xComp="Year",yComp="Value",yAxisTitle="",height=100,width=100, xP=0, yP=0, showAxis=false, data){

  margin = {top: 0, right: 0, bottom: 0, left: 0};

  xRangeSquare = [];
  for(i = 1951; i < 2017; i++){
    xRangeSquare.push(i);
  }

  // squareX = d3.scale.ordinal()
	// 	.rangeRoundBands([0, width], 0)
	// 	.domain(xRangeSquare);

	squareX = d3.scale.linear()
		.range([0, width])
		.domain([0, xRangeSquare[xRangeSquare.length-1] - xRangeSquare[0]]);

	console.log(squareX(10))

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

	if(data[0].Country === "United States of America") console.log(data)

	var theBars = squareBarSvg.selectAll(".bar")
			.data(data).enter()
		.append("rect")
			.attr("class", "bar")
			.attr("x", function(d,i) {
					if(d.Country === "United States of America") console.log(d.Country ,d.Year, d.Year - xRangeSquare[0]);
					// if(i === 0) console.log(d.Year - xRangeSquare[0], squareX(d.Year - xRangeSquare[0]), d.Year)
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