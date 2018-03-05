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
      .attr("stop-color", "white")
      .attr("stop-opacity", 1);

  legend.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", function () {
          if (inOut == "In") {
              return d3.hsl(hueIn, 1, 0.6);
          } else {
              return d3.hsl(hueOut, 1, 0.6);
          }
      })
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

  function precisionRound(number, precision) {
      var factor = Math.pow(10, precision);
      var a = Number(( Math.round(number * factor) / factor).toFixed((-1)*precision) );
      return a;
  }

  // Append labels
  var maxLabel = d3.format(".2s")(precisionRound(maxRefugees, 2 - maxRefugees.toString().length));
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