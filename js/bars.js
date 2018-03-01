// change barHolderSelector for the bar holder,
// i.e for id="barHolder" use #barHolder
// change the x component name and y component name also the yAxisTitle
// to update the bars, use
// initBars(data)

function drawBars(barHolderSelector,xComp="Year",yComp="Value",yAxisTitle="",height=100,width=100, xP=0, yP=0, showAxis=false, data){
  // var barHolderSelector = "body";
  // var xComp = "letter";
  // var yComp = "frequency";
  // var yAxisTitle = "Frequency";

  // var margin = {top: 20, right: 20, bottom: 30, left: 40},
      // width = 960 - margin.left - margin.right,
      // height = 500 - margin.top - margin.bottom;
    //console.log("Drawbars: ", data);
  var margin;
  if(showAxis) margin = {top: 0, right: 0, bottom: 50, left: 50};
  else margin = {top: 0, right: 0, bottom: 0, left: 0};

  var xRange = [];
  for(i = 1951; i < 2017; i++){
    xRange.push(i);
  }

  var x = d3.scale.ordinal()
  	.rangeRoundBands([0, width], .1, 1);

  var y = d3.scale.linear()
      .range([height, 0])
      .domain([0, 2541249]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  //console.log(barHolderSelector);

  var barSvg = d3.select(barHolderSelector)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("id", "bar-holder")
      .attr("transform", "translate(" + (margin.left + xP) + "," + (margin.top + yP) + ")");

    // console.log(data)
    initBars(data)

  function initBars(data) {
    //document.getElementById("bar-holder").innerHTML = "";
    data.forEach(function(d) {
      d.Value = +d.Value;
    });

    // console.log(xRange.map(function(d) { return d.toString(); }));

    x.domain(xRange.map(function(d) { return d.toString();}));
    // x.domain(data.map(function(d) { return d.Year;}));
    // y.domain([0, d3.max(data, function(d) { return d[yComp]; })]);

    if(showAxis){
      barSvg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      barSvg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text(yAxisTitle);
    }

    var theBars = barSvg.selectAll(".bar")
        .data(data).enter()
      .append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { 
            console.log(x(d.Year))
            return x(d.Year); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.Value); })
        .attr("height", function(d) {
            return height - y(d.Value);
        })
        .on("click",function(d){
          // click event for bars
        });

    theBars
        .transition()
        .attr("y", function(d) { return y(d.Value); })
    // barSvg.exit().remove()
    d3.select("input").on("change", change);

    // var sortTimeout = setTimeout(function() {
    //   d3.select("input").property("checked", true).each(change);
    // }, 2000);

    function change() {
      // clearTimeout(sortTimeout);
      // Copy-on-write since tweens are evaluated after a delay.
      var x0 = x.domain(data.sort(this.checked
          ? function(a, b) { return b[yComp] - a[yComp]; }
          : function(a, b) { return d3.ascending(a[xComp], b[xComp]); })
          .map(function(d) { return d[xComp]; }))
          .copy();

      svg.selectAll(".bar")
          .sort(function(a, b) { return x0(a[xComp]) - x0(b[xComp]); });

      var transition = svg.transition().duration(750),
          delay = function(d, i) { return i * 50; };

      transition.selectAll(".bar")
          .delay(delay)
          .attr("x", function(d) { return x0(d[xComp]); });

      transition.select(".x.axis")
          .call(xAxis)
        .selectAll("g")
          .delay(delay);
    }
  }

}
