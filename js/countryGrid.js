
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


////// HACK //////
var marginHack = {top: 0, right: 0, bottom: 50, left: 100};
var widthHack = 500;
var heightHack = 300;

var xHack = d3.scale.ordinal()
  .rangeRoundBands([0, widthHack], .1, 1)
  .domain([2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016]);

var yHack = d3.scale.linear()
    .range([heightHack, 0])
    .domain([0, 2541249])

var xAxisHack = d3.svg.axis()
    .scale(xHack)
    .orient("bottom");

var yAxisHack = d3.svg.axis()
    .scale(yHack)
    .orient("left");

var barSvg = d3.select("#right-side-bar-chart")
    .attr("width", widthHack + marginHack.left + marginHack.right)
    .attr("height", heightHack + marginHack.top + marginHack.bottom)
  .append("g")
    .attr("id", "bar-holder")
    .attr("transform", "translate(" + (marginHack.left + 0) + "," + (marginHack.top + 0) + ")");

    barSvg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + heightHack + ")")
    .call(xAxisHack);

barSvg.append("g")
    .attr("class", "y axis")
    .call(yAxisHack)
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")

function drawBarsHack(barHolderSelector,xComp="Year",yComp="Value",yAxisTitle="",height=100,width=100, xP=0, yP=0, showAxis=false, data){	
    
  var theBars = barSvg.selectAll(".bar")
      .data(data, function(d) {return d.Year})
    
    theBars.enter()
      .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return xHack(d.Year); })
        .attr("width", xHack.rangeBand())
        .attr("y", function(d) { return yHack(d.Value); })
        .attr("height", function(d) {
            console.log(yHack(d.Value))
            return heightHack - yHack(d.Value); 
        })

    theBars
      .attr("class", "bar")
      
      .attr("x", function(d) { return xHack(d.Year); })
      .attr("width", xHack.rangeBand())
      .attr("y", function(d) { return yHack(d.Value); })
      .attr("height", function(d) {
          console.log(yHack(d.Value))
          return heightHack - yHack(d.Value); 
      })
  }
////// HACK END //////


function zoomInSquare(d,i) {
  var currentX = +d3.select(this).select("rect").attr("x"), // Current x position of square in parent
      currentY = +d3.select(this).select("rect").attr("y"), // Current y position of square in parent
      w = +d3.select(this).select("rect").attr("width"),    // Current width of square in parent
      h = +d3.select(this).select("rect").attr("height");	
  
  // With translate and scale, all children will be affected as well. 
  // Transformation are from left to right, just like in computer graphics with matrix multiplications.
  d3.select(this)
    .attr("transform", `translate(${currentX - 0.3*w},${currentY - 0.4*h}) scale(1.3,1.3) translate(-${currentX},-${currentY})`);
  
  d3.select("#countryName").text(d[0].Country)
  drawBarsHack("#right-side-bar-chart",xComp="letter",yComp="frequency",yAxisTitle="",height=200,width=500, xP=0, yP=0, showAxis=true, d)
}

function zoomOutSquare() {
  var currentX = +d3.select(this).select("rect").attr("x"), // Current x position of square in parent
      currentY = +d3.select(this).select("rect").attr("y"); // Current y position of square in parent

    d3.select(this)
      .attr("transform", `translate(${currentX},${currentY}) scale(1,1) translate(-${currentX},-${currentY})`);
}

// Get our current data in a list with each element as our year
d3.csv("data/data_10years_sorted_country.csv", function(data){
  var countryWithYears = [];
  var thisCountry;
  var prevCountry = data[0];
  var countryArray = [];
  data.forEach(function(d,i){
    // console.log(d)
    thisCountry = d;
    if(thisCountry.Country != prevCountry.Country || data[i+1] === undefined){
      countryWithYears.push(countryArray)
      countryArray = [];
    }
    else{
      countryArray.push(thisCountry)
    }
    prevCountry = thisCountry;

  })
  data = countryWithYears;

  console.log(data)

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
      .attr("stroke-width", 1) // border
      .attr("stroke", "black")
	  /*
	  .attr("stroke", function(d,i){ 
	  	//console.log(i + "	"+ Math.floor(i/numRows) + "	"+i%numRows)
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
		*/
      .attr("x", function(d,i) { return i%numRows * (squareWidthHeight + squareMarginX); })
      .attr("y", function(d,i) { return Math.floor(i/numRows) * (squareWidthHeight + squareMarginX); })
      //.attr("fill", "white");
	
	  .attr("fill", function(d,i){ 
	  	//console.log(i + "	"+ Math.floor(i/numRows) + "	"+i%numRows)
	  	if(i%numRows >= 0 && i%numRows<=3 )
		{
			return "pink"
		}
	  	else if(i%numRows >= 4 && i%numRows<=6 )
		{
			return "lightgreen"
		}
	  	else if(i%numRows >= 7 && i%numRows<=10 )
		{
			return "#5D32D2"
			//return "blue"
		}	  
	  	else if(i%numRows >= 10 && i%numRows<=13 )
		{
			return "gray"
		}	
	  	else if(i%numRows >= 13 && i%numRows<=18 )
		{
			// orange
			return "#FFA55F"
			//return "brown"
		}		  	  
	  	return "white" });
  
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
        y,
        false,
        d
      );
		});
});





// change barHolderSelector for the bar holder,
// i.e for id="barHolder" use #barHolder
// change the x component name and y component name also the yAxisTitle
// to update the bars, use
// initBars(data)

