//// Global Variables ////
var thisYear = "2015"; // Default value. It will be changed by a slider
var inOut = "In"; // Can be "In" or "Out". This will be changed by a toggle
var prev_clicked_element = null;
var maxRefugees = {}; // Max number of refugees in a country for year = thisYear
var rects;

// top right bar chart global vars. Need to check what has to be global
var barSvg;
var xHack;
var yHack;
var xAxisHack;
var xAxisHack2;
var yAxisHack;
var prevClickedBar;

function initTopRightBarChart() {
  // These variables has to be set in drawBarsHack too.
  var marginHack = {top: 0, right: 0, bottom: 50, left: 100};
  var widthHack = 1000;
  var heightHack = 300;
  var data = [];
  for(i = 1951; i < 2017; i++){
    data.push(i);
  }
  var xDomain = data;
  prevClickedBar = null;

  xHack = d3.scale.ordinal()
    .rangeRoundBands([0, widthHack], .1, 1)
    .domain(xDomain);

  yHack = d3.scale.linear()
      .range([heightHack, 0])
      .domain([0, 2541249])

  xAxisHack = d3.svg.axis()
      .scale(xHack)
      .orient("bottom");

  yAxisHack = d3.svg.axis()
      .scale(yHack)
      .orient("left");

  barSvg = d3.select("#right-side-bar-chart")
      .attr("width", widthHack + marginHack.left + marginHack.right)
      .attr("height", heightHack + marginHack.top + marginHack.bottom)
    .append("g")
      .attr("id", "bar-holder")
      .attr("transform", "translate(" + (marginHack.left + 0) + "," + (marginHack.top + 0) + ")");

  xAxisHack2 = barSvg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + heightHack + ")")
    .call(xAxisHack)

  xAxisHack2
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", function(d) {
          return "rotate(-90)"
      });

  barSvg.append("g")
      .attr("class", "y axis")
      .call(yAxisHack)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
  
  d3.select("#countryName").text("Country name")
}

// Top right bar chart
function drawBarsHack(barHolderSelector,xComp="Year",yComp="Value",yAxisTitle="",height=100,width=100, xP=0, yP=0, showAxis=false, data){
  var marginHack = {top: 0, right: 0, bottom: 50, left: 100};
  var widthHack = 1000;
  var heightHack = 300;
  var xDomain = data.map(x => x.Year);

  // Apply the new domain for this data
  xHack.domain(xDomain);
  xAxisHack2
  .call(xAxisHack)
    .selectAll("text")
      .attr("transform", function(d) {
          return "rotate(-90)"
      })
      .style("text-anchor", "end")
      .transition().duration(100)
      .attr("dx", "-.8em")
      .attr("dy", ".15em")

  var theBars = barSvg.selectAll(".bar")
      // Link each bar to it's year, needed to keep year selected during transition
      .data(data, function(d) {return d.Year})
    theBars.enter()
      .append("rect")
        .on("click",function(d,i){
          thisYear = d.Year;
          drawLegend(maxRefugees[thisYear], thisYear);
          rects
            .transition()
            .duration(1000)
            .style("fill", function (d, i) {
                if (d.length == 0) {
                    return "white"; // Some countries have invalid data
                } else {
                    //var numRefugees = 1; // For logarithmic scale
                    var numRefugees = 0; // For some countries there is no data for all the years

                    for (j = 0; j < d.length; j++) {
                        if (d[j].Year == thisYear) {
                            numRefugees = d[j].Value;
                        }
                    }
                    //var t = Math.log(numRefugees) / Math.log(Math.max.apply(Math, refugeesArray)); // For a log scale
                    var t = numRefugees / maxRefugees[thisYear];
                    return d3.hsl(230, 1, 0.6 * t + (1 - t)*0.99); // Interpolation in L
                }
            });
          updateSankey(d.Country,thisYear);

          if(this == prevClickedBar) return;
          d3.select(this)
            .attr("fill", "green")
          d3.select(prevClickedBar)
            .attr("fill", "black")
          prevClickedBar = this;
        })
        .on("mouseenter", function(){
            if(this === prevClickedBar) return;
            d3.select(this)
              .attr("fill", "blue")
        })
        .on("mouseleave", function(){
          if(this === prevClickedBar) return;
          d3.select(this)
            .attr("fill", "black")
        })
        .attr("class", "bar")
        // This doesn't work. Not sure why
        .transition().duration(500) 
        .attr("x", function(d) { return xHack(d.Year); })
        .attr("width", xHack.rangeBand())
        .attr("y", function(d) { return yHack(d.Value); })
        .attr("height", function(d) {
            return heightHack - yHack(d.Value);
        })

    theBars
      .attr("class", "bar")
      // Need delay in order to wait for xAxis transition
      // Otherwise it looks choppy
      .transition().delay(200).duration(300) 
      .attr("x", function(d) { return xHack(d.Year); })
      .attr("width", xHack.rangeBand())
      .attr("y", function(d) { return yHack(d.Value); })
      .attr("height", function(d) {
          return heightHack - yHack(d.Value);
      })

    // Remove bars that don't exist
    theBars.exit().remove()
  }
////// Top right bar chart END //////

function zoomInSquare(thisSquare, thisYear, d) {

  var currentX = +d3.select(thisSquare).select("rect").attr("x"), // Current x position of square in parent
      currentY = +d3.select(thisSquare).select("rect").attr("y"), // Current y position of square in parent
      w = +d3.select(thisSquare).select("rect").attr("width"),    // Current width of square in parent
      h = +d3.select(thisSquare).select("rect").attr("height");

  // With translate and scale, all children will be affected as well.
  // Transformation are from left to right, just like in computer graphics with matrix multiplications.
    d3.select(thisSquare)
    .transition().duration(100)
    .attr("transform", `translate(${currentX - 0.3*w},${currentY - 0.4*h}) scale(1.3,1.3) translate(-${currentX},-${currentY})`);
}

function updateFigures(thisSquare, thisYear, d) {
  if (prev_clicked_element) {
    zoomOutSquare(prev_clicked_element, true);
  }
  zoomInSquare(thisSquare, thisYear, d);
  d3.select("#countryName").text(d[0].Country)
  drawBarsHack("#right-side-bar-chart", xComp = "letter", yComp = "frequency", yAxisTitle = "", height = 200, width = 500, xP = 0, yP = 0, showAxis = true, d)

  // Update the Sankey diagram for that selected country
  updateSankey(d[0].Country,thisYear);
  prev_clicked_element = thisSquare;
}

function zoomOutSquare(prev, clicked) {
  if(!clicked) { // If you leave the area with the mouse, check if it's the element clicked
    if(prev === prev_clicked_element) return;
  }
  var currentX = +d3.select(prev).select("rect").attr("x"), // Current x position of square in parent
      currentY = +d3.select(prev).select("rect").attr("y"); // Current y position of square in parent
    d3.select(prev)
      .transition().duration(100)
      .attr("transform", `translate(${currentX},${currentY}) scale(1,1) translate(-${currentX},-${currentY})`);
}
function drawGrids(){
  // document.getElementById("country-grid").innerHTML = "";
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

  // Get our current data in a list with each element as our year
  d3.csv("data/treatingRealData/barChartData" + inOut + ".csv", function(data){
    var countryWithYears = [];
    var thisCountry;
    var prevCountry = data[0];
    var countryArray = [];

    // For coloring the squares
    var refugeesArray = [];
    data.forEach(function(d,i){
      thisCountry = d;
      if(thisCountry.Country != prevCountry.Country || data[i+1] === undefined){
        countryWithYears.push(countryArray)
        countryArray = [];
      }
      countryArray.push(thisCountry)

      prevCountry = thisCountry;
      if (d.Year == thisYear) {
          refugeesArray.push(+d.Value);
      }
      if(maxRefugees[d.Year]){
        if(maxRefugees[d.Year] < (+d.Value)){
          maxRefugees[d.Year] = +d.Value;
        }
      }else{
        maxRefugees[d.Year] = +d.Value;
      }

    })
    data = countryWithYears;
    // Create g element for each data point
    var square = countryGridSVG.selectAll(".rect-container")
        .data(data).enter()
        .append("g")
        .attr("class", "rect-container")
        // Id is used to reference the square in the bar chart script
        .attr("id", function (d, i) { return "square-" + i; })
        .on("click", function (d, i) {
            updateFigures(this, thisYear, d);
        })   // This will trigger only for parent node (this,thisYear)
        .on("mouseenter", function (d, i) {
            zoomInSquare(this, thisYear, d);
        })  // This will trigger only for parent node
        .on("mouseleave", function () {
            zoomOutSquare(this, false);
        });  // This will trigger only for parent node


    // Append a square svg element in each g container
    rects = square
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
        .attr("x", function (d, i) { return i % numRows * (squareWidthHeight + squareMarginX); })
        .attr("y", function (d, i) { return Math.floor(i / numRows) * (squareWidthHeight + squareMarginX); })
        //.attr("fill", "white");

        // Two options for coloring the squares. Comment and uncomment for applying one or the other:

        /////////////////////////
        // Color by continents //
        /////////////////////////

  	  /*.attr("fill", function(d,i){
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
  			return "lightblue"
  			//return "#5D32D2"
  			//return "blue"
  		}
  	  	else if(i%numRows >= 10 && i%numRows<=13 )
  		{
  			return "lightgray"
  		}
  	  	else if(i%numRows >= 13 && i%numRows<=18 )
  		{
  			// orange
  			return "#FFA55F"
  			//return "brown"
  		}
  	  	return "white" });*/

        ////////////////////////////////////////////////////
        // Color by amount of refugees in year = thisYear //
        ////////////////////////////////////////////////////

        .attr("fill", function (d, i) {
            if (d.length == 0) {
                return "white"; // Some countries have invalid data
            } else {
                //var numRefugees = 1; // For logarithmic scale
                var numRefugees = 0; // For some countries there is no data for all the years

                for (j = 0; j < d.length; j++) {
                    if (d[j].Year == thisYear) {
                        numRefugees = d[j].Value;
                    }
                }
                //var t = Math.log(numRefugees) / Math.log(Math.max.apply(Math, refugeesArray)); // For a log scale
                var t = numRefugees / maxRefugees[thisYear];
                return d3.hsl(230, 1, 0.6 * t + (1 - t)*0.99); // Interpolation in L
            }
        });

    // Add legend
    drawLegend(maxRefugees[thisYear], thisYear);

      ///////////////////////////////////////////////////////

    // Add a bar chart in each square
  	square
  		.each(function(d,i) {

  			var barHolderSelector = "#"+d3.select(this).attr("id");
  			var x = +d3.select(this).selectAll("rect").attr("x");
        var y = +d3.select(this).selectAll("rect").attr("y");
        // TODO solve the how many years we should show
        if(d.length>50)
          d = d.slice(Math.max(d.length - 50, 1));
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
}

drawGrids();
initTopRightBarChart();

// Legend for the country Grid when coloring by amount of refugees in a country in "thisYear"
function drawLegend(maxRefugees, thisYear) {
    document.getElementById("legendGrid").innerHTML = "";
    var w = 500, h = 70;
    d3.select("#legendGrid").selectAll("svg").remove();

    var key = d3.select("#legendGrid")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("stroke-width", 1)
        .attr("stroke", "gray");

    var legend = key.append("defs")
        .append("svg:linearGradient")
        .attr("id", "gradient")
        .attr("x1", "0%")
        .attr("y1", "100%")
        .attr("x2", "100%")
        .attr("y2", "100%")
        .attr("spreadMethod", "pad");

    legend.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", d3.hsl(230, 1, 1))
        .attr("stop-opacity", 1);

    legend.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", d3.hsl(230, 1, 0.6))
        .attr("stop-opacity", 1);

    key.append("rect")
        .attr("width", w - 200)
        .attr("height", h - 50)
        .style("fill", "url(#gradient)")
        .attr("transform", "translate(100,30)");

    //Append title
    key.append("g")
        .append("text")
        .attr("class", "legendTitle")
        .attr("x", 250)
        .attr("y", 20)
        .style("font-size", "18pt")
        .style("text-anchor", "middle")
        .text("Number of refugees sheltered in " + thisYear); // Change sheltered when toggling to out

    // Append labels

    function precisionRound(number, precision) {
        var factor = Math.pow(10, precision);
        var a = Number(( Math.round(number * factor) / factor).toFixed((-1)*precision) );
        return a;
    }
    var maxLabel = precisionRound(maxRefugees, 2 - maxRefugees.toString().length);
    key.append("g")
        .append("text")
        .attr("class", "legendTitle")
        .attr("x", 100)
        .attr("y", 70)
        .style("font-size", "16pt")
        .style("text-anchor", "middle")
        .text("0");

    key.append("g")
        .append("text")
        .attr("class", "legendTitle")
        .attr("x", 400)
        .attr("y", 70)
        .style("font-size", "16pt")
        .style("text-anchor", "middle")
        .text(maxLabel);
}

// change barHolderSelector for the bar holder,
// i.e for id="barHolder" use #barHolder
// change the x component name and y component name also the yAxisTitle
// to update the bars, use
// initBars(data)
