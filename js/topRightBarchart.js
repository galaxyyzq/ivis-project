// top right bar chart global vars. Need to check what has to be global
var barSvg;
var xHack;
var yHack;
var xAxisHack;
var xAxisHack2;
var yAxisHack;
var yAxisHack2;
var prevClickedBar;


function mouseOverContryName(x){
	x.innerHTML = currentCountryName;
	x.style.color = "black";	
}

function mouseOutContryName(x){
	x.innerHTML = "Hover here to get Country's Name"
	x.style.color = "lightgray";
}

function initTopRightBarChart() {
  // These variables has to be set in drawBarsHack too.
  var marginHack = {top: 40, right: 0, bottom: 100, left: 150};
  var widthHack = 1000;
  var heightHack = 500;
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
      .tickFormat(function(d, i) {
        if(d !== xDomain[xDomain.length-1])
          return i % 3 === 0 ? d : null;
        return d;
      })
      .scale(xHack)
      .orient("bottom")

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
      .style("font-size", 25)
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".0em")
      .attr("transform", function(d) {
          return "rotate(-90)"
      });

  yAxisHack2= barSvg.append("g")
      .attr("class", "y axis")
      .call(yAxisHack)
  
  yAxisHack2
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      
  
  //d3.select("#countryName").text("Country name")
}

// Top right bar chart
function drawBarsHack(barHolderSelector,xComp="Year",yComp="Value",yAxisTitle="",height=100,width=100, xP=0, yP=0, showAxis=false, data){
  // var marginHack = {top: 0, right: 0, bottom: 50, left: 100};
  var widthHack = 1000;
  var heightHack = 500;
  var xDomain = data.map(x => x.Year);

  var yDomain = d3.max(data, function(d) {return d.Value; })
  yHack.domain([0, yDomain]);
  yAxisHack2
  .call(yAxisHack)
    .selectAll("text")
      .style("text-anchor", "end")
      .style("font-size", 20)
      .transition().duration(100)
      .attr("dx", "-.8em")
      .attr("dy", ".15em")

    var theBars = barSvg.selectAll(".bar")
      // Link each bar to it's year, needed to keep year selected during transition
      .data(data, function(d) {return d.Year})

    theBars.enter()
      .append("rect")
        .on("click",function(d,i){

          if(this !== prevClickedBar){
            d3.select(this)
              .attr("fill", "green")
            d3.select(prevClickedBar)
              .attr("fill", "black")
            prevClickedBar = this;
          }

          thisYear = d.Year;
          drawLegend(maxRefugees[thisYear], thisYear);
          
          // rects
          //   .transition()
          //   .duration(1000)
          //   .style("fill", function (d, i) {
          //       if (d.length == 0) {
          //           return "white"; // Some countries have invalid data
          //       } else {
          //           //var numRefugees = 1; // For logarithmic scale
          //           var numRefugees = 0; // For some countries there is no data for all the years

          //           for (j = 0; j < d.length; j++) {
          //               if (d[j].Year == thisYear) {
          //                   numRefugees = d[j].Value;
          //               }
          //           }
          //           //var t = Math.log(numRefugees) / Math.log(Math.max.apply(Math, refugeesArray)); // For a log scale
          //           var t = numRefugees / maxRefugees[thisYear];
          //           return d3.hsl(230, 1, 0.6 * t + (1 - t)*0.99); // Interpolation in L
          //       }
          //   });
          updateSankey(d.Country,thisYear);


          updateGrid();
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
        .attr("height", 0)
        .attr("y", heightHack)
        // The transition times are ignored, not sure why
        .transition().delay(2000).duration(1000) 
        .attr("x", function(d) { return xHack(d.Year); })
        .attr("width", xHack.rangeBand())
        .attr("y", function(d) { return yHack(d.Value); })
        .attr("height", function(d) {
            return heightHack - yHack(d.Value);
        })

    theBars
      // .attr("class", "bar")
      // Need delay in order to wait for xAxis transition
      // Otherwise it looks choppy
      .transition().delay(500).duration(300) 
      .attr("x", function(d) { return xHack(d.Year); })
      .attr("width", xHack.rangeBand())
      .attr("y", function(d) { return yHack(d.Value); })
      .attr("height", function(d) {
          return heightHack - yHack(d.Value);
    });

    // Remove bars that don't exist
    theBars.exit()
      .attr("fill", "red")
      .transition().delay(200).duration(300) 
      .attr("height", 0)
      .attr("y", heightHack)
      .remove();
  }
////// Top right bar chart END //////
