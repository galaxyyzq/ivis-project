// top right bar chart global vars. "trbc"
var trbcSVG;
var trbcX;
var trbcY;
var trbcXAxis;
var trbcXAxisAnimate;
var trbcYaxis;
var trbcYaxisAnimate;
var trbcPrevClickedBar;
var trbcWidth = 1000;
var trbcHeight = 500;
var trbcHoverBarColor = "orange";
var trbcClickedColor = "green";
var trbcDefaultBarColor = "black";

function initTopRightBarChart() {
  // These variables has to be set in drawBarsHack too.
  var trbcMargin = {top: 40, right: 0, bottom: 100, left: 150};
  trbcWidth = 1000;
  trbcHeight = 500;
  
  var xDomain = [];
  for(i = 1951; i < 2017; i++){
    xDomain.push(i);
  }

  trbcPrevClickedBar = null;

  trbcX = d3.scale.ordinal()
    .rangeRoundBands([0, trbcWidth], .1, 1)
    .domain(xDomain);

  trbcY = d3.scale.linear()
      .range([trbcHeight, 0])
      .domain([0, 2541249])

  trbcXAxis = d3.svg.axis()
      .tickFormat(function(d, i) {
        if(d !== xDomain[xDomain.length-1])
          return i % 3 === 0 ? d : null;
        return d;
      })
      .scale(trbcX)
      .orient("bottom")

  trbcYaxis = d3.svg.axis()
      .scale(trbcY)
      .orient("left");

  trbcSVG = d3.select("#right-side-bar-chart")
      .attr("width", trbcWidth + trbcMargin.left + trbcMargin.right)
      .attr("height", trbcHeight + trbcMargin.top + trbcMargin.bottom)
    .append("g")
      .attr("id", "bar-holder")
      .attr("transform", "translate(" + (trbcMargin.left + 0) + "," + (trbcMargin.top + 0) + ")");

  trbcXAxisAnimate = trbcSVG.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + trbcHeight + ")")
    .call(trbcXAxis)

  trbcXAxisAnimate
    .selectAll("text")
      .style("font-size", 25)
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".0em")
      .attr("transform", function(d) {
          return "rotate(-90)"
      });

  trbcYaxisAnimate= trbcSVG.append("g")
      .attr("class", "y axis")
      .call(trbcYaxis)

  trbcYaxisAnimate
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")

  d3.select("#countryName").text("Country name")
}

function updateTopRightBarChart(barHolderSelector,xComp="Year",yComp="Value",yAxisTitle="",height=100,width=100, xP=0, yP=0, showAxis=false, data){
  
  // Update yaxis here, when we switch from linear to exponential
  var yDomain = d3.max(data, function(d) {return d.Value; })
  trbcY.domain([0, yDomain]);
  trbcYaxisAnimate
  .call(trbcYaxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .style("font-size", 20)
      .transition().duration(100)
      .attr("dx", "-.8em")
      .attr("dy", ".15em")

		// Set the new data
    var theBars = trbcSVG.selectAll(".bar")
      // Link each bar to it's year, needed to keep year selected during transition
      .data(data, function(d) {return d.Year})

    theBars.enter()
      .append("rect")
        .on("click",function(d,i){
          if(this !== trbcPrevClickedBar){
            d3.select(this)
              .attr("fill", trbcClickedColor)
            d3.select(trbcPrevClickedBar)
              .attr("fill", trbcDefaultBarColor)
            trbcPrevClickedBar = this;
          }

          thisYear = d.Year;
          drawLegend(maxRefugees[thisYear], thisYear);

          //Update the slider when year change in bar chart
          var newYear = scaleSlider(thisYear);
          d3.slider().move(Math.round(newYear));

          updateSankey(d.Country,thisYear);
          updateGrid();
        })
        .on("mouseenter", function(){
            if(this === trbcPrevClickedBar) return;
            d3.select(this)
              .attr("fill", trbcHoverBarColor)
        })
        .on("mouseleave", function(){
          if(this === trbcPrevClickedBar) return;
          d3.select(this)
            .attr("fill", trbcDefaultBarColor)
        })
        .attr("class", "bar")
        .attr("height", 0)
				.attr("y", trbcHeight)
				// Transition for new bars
				.transition().delay(600).duration(500)
        .attr("x", function(d) { return trbcX(d.Year); })
        .attr("width", trbcX.rangeBand())
        .attr("y", function(d) { return trbcY(d.Value); })
        .attr("height", function(d) {
            return trbcHeight - trbcY(d.Value);
        })

		// Update the bars
		theBars
			// Transition for updating bars
      .transition().delay(600).duration(500)
      .attr("x", function(d) { return trbcX(d.Year); })
      .attr("width", trbcX.rangeBand())
      .attr("y", function(d) { return trbcY(d.Value); })
      .attr("height", function(d) {
          return trbcHeight - trbcY(d.Value);
    });

    // Remove bars that don't exist anymore
    theBars.exit()
			.attr("fill", "red")
			// Transition for deleted bars
      .transition().delay(200).duration(300)
      .attr("height", 0)
      .attr("y", trbcHeight)
      .remove();
  }