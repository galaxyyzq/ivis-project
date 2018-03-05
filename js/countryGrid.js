
// Finds the specific data for a country
function findDataForCountry(countryName) {
  var dataWeWant;
  countryData.forEach(function(d){
    if(d[0].Country === countryName){
      dataWeWant = d;
      return;
    }
  });
  return dataWeWant;
}


// Find the DOM reference to the specific country square
function findCountrySquare(countryName) {
  var countrySquares =  d3.selectAll(".rect-container");
  var countrySquareRef;
  countrySquares.each(function(d,i) {
    if(d[0].Country === countryName){
      countrySquareRef = countrySquares[0][i];
      return;
    }
  });
  return countrySquareRef;
}


function selectSquare(thisSquare, thisYear, d) {
  if(thisSquare === prev_clicked_element) return;
    d3.select(thisSquare).select("rect")
      .attr("stroke-width", 3)
      .attr("stroke", "orange")
  }

function updateFigures(thisSquare, thisYear, d) {
  if (prev_clicked_element) {
    deselectSquare(prev_clicked_element, true);
  }
  // Mark the square as selected
  d3.select(thisSquare).select("rect")
  .attr("stroke-width", 3)
  .attr("stroke", "green")

  // Update the title above the barchart
  currentCountryName = d[0].Country;
  //d3.select("#countryName").text(d[0].Country)

  // Update the barchart
  updateTopRightBarChart("#right-side-bar-chart", xComp = "letter", yComp = "frequency", yAxisTitle = "", height = 200, width = 500, xP = 0, yP = 0, showAxis = true, d, scaleForY);

  // Update the sankey diagram
  updateSankey(d[0].Country, thisYear);
  dataForUpdate = d;
  prev_clicked_element = thisSquare;
  prev_clicked_name = d[0].Country;
}

function deselectSquare(prev, clicked) {
  if(!clicked) { // If you leave the area with the mouse, check if it's the element clicked
    if(prev === prev_clicked_element) return;
  }
    d3.select(prev).select("rect")
      .attr("stroke-width", 1)
      .attr("stroke", "black") 
}


// Dimensions of the useful area inside the SGV
countryGridSVG = d3.select("#country-grid")
  .attr("width", 100+(squareWidthHeight + squareMarginX)*numRows)
  .attr("height", (Math.floor(222 / numRows)+2) * (squareWidthHeight + squareMarginX))
.append("g")
  .attr("transform", "translate(" + gridMargin.left + "," + gridMargin.top + ")")
  .attr("id", "g_container"); // We give the <g> an id because we'll later create a rec inside of it
                              //  that will represent the useful area.

  // // Creating a rect inside the <g> that contains everything so we can fill it with color
  // var g_container = d3.select("#g_container")
  // 	.append("rect")
  //     .attr("width",  gridWidth+"px")
  //     .attr("height", gridHeight+"px")
  //     .attr("fill", "pink");

  // // Creating a rect inside the <g> that will draw a cool border
  // var a = 20;
  // var g_container = d3.select("#g_container")
  // 	.append("rect")
  // 	.attr("x", -a/2)
  // 	.attr("y", -a/2)
  //     .attr("width",  gridWidth  + a +"px")
  //     .attr("height", gridHeight + a +"px")
  //     .attr("stroke-width", 1) // border
  //     .attr("stroke", "gray")
  //     .attr("fill", "white")
	// 	.attr("rx", 10);
	

// Sort from high to low
function highToLow(a,b) {
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
}

// Change the color mapping inside a square
function changeFillColor(d,i) {
	if (d.length == 0) {
		return "white"; // Some countries have invalid data
	} else {
    if(scaleForY=="linear"){
      var numRefugees = 0; // For some countries there is no data for all the years
    }else{
      var numRefugees = 1; // For logarithmic scale
    }
		for (j = 0; j < d.length; j++) {
				if (d[j].Year == thisYear) {
            numRefugees = d[j].Value;
				}
    }
    var t;
    if (scaleForY == "linear") {
      var t = numRefugees / maxRefugees[thisYear];
		} else {
      numRefugees = Math.max(1, numRefugees);
      t = Math.log(numRefugees) / Math.log(maxRefugees[thisYear]); // For a log scale
    }
		if (inOut == "In") {
		    return d3.hsl(hueIn, 1, 0.6 * t + (1 - t) * 0.99); // Interpolation in L for In mode
		} else {
			return d3.hsl(hueOut, 1, 0.6 * t + (1 - t) * 0.99); // Interpolation in L for Out mode
		}
	}
}

// Call this function if "thisYear" has been updated
function updateGrid() {
  var countrySquares = countryGridSVG.selectAll(".rect-container")
  .data(countryData.sort(highToLow), function(d) {
      return d[0].Country;
  });

  // Update the position of the squares
  countrySquares
    .transition().duration(3000).delay(800)
    .attr("transform", function(d,i){
      var x = i % numRows * (squareWidthHeight + squareMarginX);
      var y = Math.floor(i / numRows) * (squareWidthHeight + squareMarginX);
      return `translate(${x},${y})`;
    });

  // Update the color mapping
  countrySquares
    .select("rect")
    .transition().duration(1000)
    .attr("fill", changeFillColor);
}

function initGrid() {
  // Get the rectangle container and add the data sorted by nr of refugees and asylum-seekers
  countryGridSVG.selectAll(".rect-container").remove();

  var countrySquares = countryGridSVG.selectAll(".rect-container")
    .data(countryData.sort(highToLow), function(d) {
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
          selectSquare(this, thisYear, d);
      })  // This will trigger only for parent node
      .on("mouseleave", function () {
          deselectSquare(this, false);
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
      .attr("stroke-width", function(d){
        if(prev_clicked_name === d[0].Country) return 3;
        else return 1;
      })
      .attr("stroke", function(d) {
        if(prev_clicked_name === d[0].Country) {
          prev_clicked_element = this.parentNode;
          return "green";
        }
        else return "black";
      })
      .transition().duration(500)
      .attr("fill", changeFillColor);

  // Add a bar chart in each square
  countrySquares
    .each(function(d,i) {
      var barHolderSelector = "#"+d3.select(this).attr("id");
      var x = +d3.select(this).selectAll("rect").attr("x");
          var y = +d3.select(this).selectAll("rect").attr("y");
          // Call function from 'bars.js'
          initBars(barHolderSelector, squareWidthHeight, squareWidthHeight, d,scaleForY);
    });

  // Add legend
  drawLegend(maxRefugees[thisYear], thisYear);
}

// Load the data
function loadCountryData() {
  // Get our current data in a list with each element as our year
  d3.csv("data/treatingRealData/barChartData" + inOut + ".csv", function(data){
    var countryWithYears = [];
    var thisCountry;
    var prevCountry = data[0];
    var countryArray = [];
    dataForUpdate = null;
    // For coloring the squares
    var refugeesArray = [];
    data.forEach(function(d,i){
      thisCountry = d;
      if(thisCountry.Country != prevCountry.Country || data[i+1] === undefined){
        if (prev_clicked_name!="" && prev_clicked_name == prevCountry.Country){
          dataForUpdate = countryArray;
        }
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

    });

    countryData = countryWithYears;

    initGrid();
    if (prev_clicked_name == "" || dataForUpdate == null){
      dataForUpdate = countryData[0];
      prev_clicked_element = document.getElementById("square-0");
    }
    updateFigures(prev_clicked_element, thisYear, dataForUpdate);

    // Don't use the global variable so everything is sorted
    addCountriesToDropdown(countryWithYears);
  });
}

// change barHolderSelector for the bar holder,
// i.e for id="barHolder" use #barHolder
// change the x component name and y component name also the yAxisTitle
// to update the bars, use
// initBars(data)

loadCountryData();
// initTopRightBarChart();