//// Global Variables ////
var thisYear = "2015"; // Default value. It will be changed by a slider
var inOut = "In"; // Can be "In" or "Out". This will be changed by a toggle
var prev_clicked_element = null;
var maxRefugees = {}; // Max number of refugees in a country for year = thisYear
var rects;

function zoomInSquare(thisSquare, thisYear, d) {

  var currentX = d3.transform(d3.select(thisSquare).attr("transform")).translate[0];
  var currentY = d3.transform(d3.select(thisSquare).attr("transform")).translate[1];

  // var currentX = +d3.select(thisSquare).select("rect").attr("x"), // Current x position of square in parent
  //     currentY = +d3.select(thisSquare).select("rect").attr("y"), // Current y position of square in parent
  //     w = +d3.select(thisSquare).select("rect").attr("width"),    // Current width of square in parent
  //     h = +d3.select(thisSquare).select("rect").attr("height");

  // With translate and scale, all children will be affected as well.
  // Transformation are from left to right, just like in computer graphics with matrix multiplications.

    d3.select(thisSquare)
    .transition().duration(100)
    .attr("transform", `translate(${currentX},${currentY}) scale(1.1,1.1) translate(${-currentX},${-currentY})`);
    // .attr("transform", `translate(${currentX-10},${currentY-10})`);
    // .attr("transform", `translate(${currentX - 0.3*w},${currentY - 0.4*h}) scale(1.3,1.3) translate(-${currentX},-${currentY})`);
}

function updateFigures(thisSquare, thisYear, d) {
  if (prev_clicked_element) {
    zoomOutSquare(prev_clicked_element, true);
  }
  // zoomInSquare(thisSquare, thisYear, d);
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

  var currentX = d3.transform(d3.select(prev).attr("transform")).translate[0];
  var currentY = d3.transform(d3.select(prev).attr("transform")).translate[1];

  // var currentX = +d3.select(prev).select("rect").attr("x"), // Current x position of square in parent
  //     currentY = +d3.select(prev).select("rect").attr("y"); // Current y position of square in parent
    d3.select(prev)
      .transition().duration(100)
      // .attr("transform", `translate(${currentX},${currentY}) scale(0.9,0.9) translate(${-currentX},${-currentY})`);
      // .attr("transform", `translate(${currentX},${currentY})`);
      // .attr("transform", `translate(${currentX+10},${currentY+10})`);
}

  // document.getElementById("country-grid").innerHTML = "";
  // Dimensions of the useful area inside the SGV
  var countryData;

  var gridMargin = { top: 62, right: 20, bottom: 20, left: 20 };
  var gridWidth  = 1110;
  var gridHeight = 680;

  var squareWidthHeight = 54;
  var squareMarginX = 8;
  //var numRows = Math.floor(gridWidth/(squareWidthHeight+squareMarginX) );
  var numRows = 18;

  var squareHoverSizeIncrease = 50;
  var zoomOffset = 5;

  var countryGridSVG = d3.select("#country-grid")
    //.attr("gridWidth", gridWidth)
    //.attr("gridHeight", gridHeight)
    .attr("width",  gridWidth  + gridMargin.left + gridMargin.right)
    .attr("height", gridHeight + gridMargin.top  + gridMargin.bottom)
  .append("g")
    .attr("transform", "translate(" + gridMargin.left + "," + gridMargin.top + ")")
    .attr("id", "g_container"); // We give the <g> an id because we'll later create a rec inside of it
  							  //  that will represent the useful area.

  // Changing SVG background Color
  //$("#country-grid").css('background-color', 'yellow');

  // Creating a rect inside the <g> that contains everything so we can fill it with color
  var g_container = d3.select("#g_container")
  	.append("rect")
      .attr("width",  gridWidth+"px")
      .attr("height", gridHeight+"px")
      .attr("fill", "pink");

  // Creating a rect inside the <g> that will draw a cool border
  var a = 20;
  var g_container = d3.select("#g_container")
  	.append("rect")
  	.attr("x", -a/2)
  	.attr("y", -a/2)
      .attr("width",  gridWidth  + a +"px")
      .attr("height", gridHeight + a +"px")
      .attr("stroke-width", 1) // border
      .attr("stroke", "gray")
      //.attr("fill", "lightblue")
      .attr("fill", "white")
  	.attr("rx", 10);

function updateGrid() {
  var countrySquares = countryGridSVG.selectAll(".rect-container")
  .data(countryData.sort(function(a,b) {
      var refugeesA = 0;
      for (j = 0; j < a.length; j++) {
        if (a[j].Year == thisYear) {
            refugeesA = a[j].Value;
        }
      }
      var refugeesB = 0;
      for (j = 0; j < b.length; j++) {
        if (b[j].Year == thisYear) {
            refugeesB = b[j].Value;
        }
      }
      return +refugeesB - +refugeesA;
    }), function(d) {
      return d[0].Country;
    });

      // Update the position of the squares
  countrySquares
  .transition().duration(3000).delay(500)
    .attr("transform", function(d,i){
      var x = i % numRows * (squareWidthHeight + squareMarginX);
      var y = Math.floor(i / numRows) * (squareWidthHeight + squareMarginX);
      return `translate(${x},${y})`;
    });

  countrySquares
    .select("rect")
    .transition().duration(500)
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
}

function drawGrid() {
  // Get the rectangle container and add the data sorted by nr of refugees and asylum-seekers
  var countrySquares = countryGridSVG.selectAll(".rect-container")
    .data(countryData.sort(function(a,b) {
        var refugeesA = 0;
        for (j = 0; j < a.length; j++) {
          if (a[j].Year == thisYear) {
              refugeesA = a[j].Value;
          }
        }
        var refugeesB = 0;
        for (j = 0; j < b.length; j++) {
          if (b[j].Year == thisYear) {
              refugeesB = b[j].Value;
          }
        }
        return +refugeesB - +refugeesA;
      }), function(d) {
        return d[0].Country;
      });
      
  var newRectContainer =  countrySquares.enter()
    .append("g")
      .attr("class", "rect-container")
      // Id is used to reference the square in the bar chart script
      .attr("id", function (d, i) { return "square-" + i; })
      .on("click", function (d, i) {
          updateFigures(this, thisYear, d);
      })   // This will trigger only for parent node (this,thisYear)
      .on("mouseenter", function (d, i) {
          // zoomInSquare(this, thisYear, d);
      })  // This will trigger only for parent node
      .on("mouseleave", function () {
          // zoomOutSquare(this, false);
      })
      .attr("transform", function(d,i){
        var x = i % numRows * (squareWidthHeight + squareMarginX);
        var y = Math.floor(i / numRows) * (squareWidthHeight + squareMarginX);
        return `translate(${x},${y})`;
      });  // This will trigger only for parent node


  // Append a square svg element in each g container with hilight color
  countrySquares
    .append("rect")
      .attr("width", squareWidthHeight)
      .attr("height", squareWidthHeight)
      .attr("stroke-width", 1) // border
      .attr("stroke", "black")
      .transition().duration(500)
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

  // Add a bar chart in each square
  countrySquares
    .each(function(d,i) {
      console.log("Hej");
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
          gridHeight = squareWidthHeight,
          width = squareWidthHeight,
          x,
          y,
          false,
          d
          );
    });

  
  // // Update the position of the squares
  // countrySquares
  //   .transition().duration(3000).delay(500)
  //     .attr("transform", function(d,i){
  //       var x = i % numRows * (squareWidthHeight + squareMarginX);
  //       var y = Math.floor(i / numRows) * (squareWidthHeight + squareMarginX);
  //       return `translate(${x},${y})`;
  //     });


  // Add legend
  drawLegend(maxRefugees[thisYear], thisYear);
}

function loadCountryData() {
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
    countryData = countryWithYears;

    drawGrid();
  });
}


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

loadCountryData();
initTopRightBarChart();