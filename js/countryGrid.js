
//
var dataChart = [10,30,50,20,23,12,32];


var margin = { top: 70, right: 100, bottom: 10, left: 80 },
  width = 2000 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

svg = d3.select("#country-grid")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

var squareWidthHeight = 100;
var squareMarginX = 10;
var numRows = 10;
var squareHoverSizeIncrease = 50;
var zoomOffset = 5;

var xScale = d3.scale.linear()
    .domain([0, 100])
    .range([0, squareWidthHeight])

d3.csv("data/1951-data.csv", function(error, data){
  if(error) throw error;

  // Create g element for each data point
  var square = svg.selectAll(".rect-container")
      .data(data).enter()
    .append("g")
      .attr("class", "rect-container")
  	  .attr("id", function(d,i){return "square_"+i})
      .on("mouseover", function(d){
        // console.log(d3.select(this))
        // d3.select(this).attr("transform", "translate(100,100) scale(1.3,1.3) translate(-100,-100)");
      })
      .on("mouseleave", function(d) {
        // d3.select(this).attr("transform", "scale(1,1)");

      });

  // append a sqare svg element in each g container
  square
    .append("rect")
      .attr("width", squareWidthHeight)
      .attr("height", squareWidthHeight)
      .attr("stroke-width", 3)
      .attr("stroke", "black")
      .on("mouseover", function(d){
        var currentX = +d3.select(this).attr("x")
        var currentY = +d3.select(this).attr("y")
        d3.select(this.parentNode)
          .attr("transform", `translate(${currentX},${currentY}) scale(1.3,1.3) translate(-${currentX},-${currentY})`);
        // d3.select(this)
        //   .attr("x", +currentX - +squareHoverSizeIncrease - +zoomOffset)
        //   .attr("y", +currentY - +squareHoverSizeIncrease - +zoomOffset)
        //   .attr("width", +squareWidthHeight + +squareHoverSizeIncrease)
        //   .attr("height", +squareWidthHeight + +squareHoverSizeIncrease)
      })
      .on("mouseleave", function(d) {
        var currentX = +d3.select(this).attr("x")
        var currentY = +d3.select(this).attr("y")
        d3.select(this.parentNode)
          .attr("transform", `translate(${currentX},${currentY}) scale(1,1) translate(-${currentX},-${currentY})`);
        // var currentX = d3.select(this).attr("x")
        // var currentY = d3.select(this).attr("y")
        // d3.select(this)
        //   .attr("x", +currentX + +squareHoverSizeIncrease + +zoomOffset)
        //   .attr("y", +currentY + +squareHoverSizeIncrease + +zoomOffset)
        //   .attr("width", squareWidthHeight)
        //   .attr("height", squareWidthHeight)
      })
      .attr("x", function(d,i) {
        return i%numRows * (squareWidthHeight + squareMarginX);
      })
      .attr("y", function(d,i) {
        return Math.floor(i/numRows) * (squareWidthHeight + squareMarginX);
      })
      .attr("fill", "white");


	square
		.each(function(d,i) {
			var barHolderSelector = "#"+d3.select(this).attr("id");
			//console.log(barHolderSelector);
			var x = +d3.select(this).selectAll("rect").attr("x");
		  var y = +d3.select(this).selectAll("rect").attr("y");
			// console.log("x= "+x + "	y= " + y);

			drawBars(barHolderSelector,xComp="letter",yComp="frequency",yAxisTitle="",height=100,width=100, x, y)
		});


	/*
	square.selectAll(".bar")
		.data(dataChart).enter()
		.append("rect")
			.attr("class", "bar")
			.attr("width", 20)
			.attr("height", 10)
			.attr("fill", "black");
	*/




});
