var units = "Refugees";

var marginSankey = {top: 10, right: 10, bottom: 0, left: 10},
    widthSankey = 500 - marginSankey.left - marginSankey.right,
    heightSankey = 300 - marginSankey.top - marginSankey.bottom;

var formatNumber = d3.format(",.0f"),    // zero decimal places
    format = function (d) { return formatNumber(d) + " " + units; };


// append the svg canvas to the page
var sankeySVG = d3.select("#chart").append("svg")
    .attr("id","graph")
    .attr("width", widthSankey + marginSankey.left + marginSankey.right)
    .attr("height", heightSankey + marginSankey.top + marginSankey.bottom)
  .append("g")
    .attr("transform",
    "translate(" + marginSankey.left + "," + marginSankey.top + ")");

// Set the sankey diagram properties
var sankey = d3.sankey()
    .nodeWidth(15)
    .nodePadding(10)
    .size([widthSankey, heightSankey]);

var pathSankey = sankey.link();

function getColorScheme(data) {
    var names = [];
    var values = [];
    var sortedValues = [];
    var sortedNames = [];

    data.forEach(function (d, i) {
        names.push(d.source);
        values.push(d.value);
    })
    var help = values.slice(0);
    sortedValues = help.sort(function (a, b) { return (b - a) });
    for (i = 0; i < values.length; i++) {
        sortedNames.push(names[values.indexOf(sortedValues[i])]);
    }
    console.log("Sorted names: ", sortedNames);

    var colorDomain = ["#1a1334", "#26294a", "#01545a", "#017351", "#03c383", "#aad962", "#fbbf45", "#ef6a32", "#ed0345", "#a12a5e", "#710162", "#110141"];
    colorDomain.forEach(function (d, i) {
        colorDomain[i] = d3.rgb(d);
    });

    color = d3.scale.ordinal()
        .domain(sortedNames)
        .range(colorDomain);

    return color;
}

// load the data (using the timelyportfolio csv method)
d3.csv("data/sankey.csv", function (error, data) {

    var color = getColorScheme(data);

  //set up graph in same style as original example but empty
  graph = {"nodes" : [], "links" : []};

    data.forEach(function (d) {
      graph.nodes.push({ "name": d.source });
      graph.nodes.push({ "name": d.target });
      graph.links.push({ "source": d.source,
                         "target": d.target,
                         "value": +d.value });
     });

     //Add title in graph
     var ourTarget = data[0].target;
     d3.select("#Title").text("Refugees in " + ourTarget);

     // return only the distinct / unique nodes
     graph.nodes = d3.keys(d3.nest()
       .key(function (d) { return d.name; })
       .map(graph.nodes));

     // loop through each link replacing the text with its index from node
     graph.links.forEach(function (d, i) {
       graph.links[i].source = graph.nodes.indexOf(graph.links[i].source);
       graph.links[i].target = graph.nodes.indexOf(graph.links[i].target);
     });

     //now loop through each nodes to make nodes an array of objects
     // rather than an array of strings
     graph.nodes.forEach(function (d, i) {
       graph.nodes[i] = { "name": d };
     });

  sankey
    .nodes(graph.nodes)
    .links(graph.links)
    .layout(32);

// add in the links
  var link = sankeySVG.append("g").selectAll(".link")
      .data(graph.links)
      .enter().append("path")
      .attr("class", "link")
      .attr("d", pathSankey)
      .style("stroke-width", function(d) { return Math.max(1, d.dy); })
      .style("stroke",function(d){return d.color =color(d.source.name.replace(/ .*/, ""));})
      .sort(function(a, b) { return b.dy - a.dy; });


// add the link titles
  link.append("title")
        .text(function(d) {
    		return d.source.name + " → " +
                d.target.name + "\n" + format(d.value); });

// add in the nodes
  var node = sankeySVG.append("g").selectAll(".node")
      .data(graph.nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) {
		  return "translate(" + d.x + "," + d.y + ")"; });
    // .call(d3.behavior.drag()
    //   .origin(function(d) { return d; })
    //   .on("dragstart", function() {
		//   this.parentNode.appendChild(this); })
    //   .on("drag", dragmove));

// add the rectangles for the nodes
  node.append("rect")
      .attr("height", function(d) { return d.dy; })
      .attr("width", sankey.nodeWidth())
      .style("fill", function(d) {
        if (d.name == ourTarget) {
            return d3.rgb("#404040");
        }else {return d.color = color(d.name.replace(/ .*/, ""));
        }
		   })
      // .style("stroke", function(d) {
		  // return d3.rgb(d.color).darker(2); })
    .append("title")
      .text(function(d) {
		  return d.name + "\n" + format(d.value); });

// add in the title for the nodes
  node.append("text")
      .attr("x", -6)
      .attr("y", function(d) { return d.dy / 2; })
      .attr("dy", ".25em")
      .attr("text-anchor", "end")
      .attr("transform", null)
      .text(function(d) { return d.name; })
    .filter(function(d) { return d.x < width / 2; })
      .attr("x", 6 + sankey.nodeWidth())
      .attr("text-anchor", "start");


// the function for moving the nodes
  function dragmove(d) {
    d3.select(this).attr("transform",
        "translate(" + d.x + "," + (
                d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
            ) + ")");
    sankey.relayout();
    link.attr("d", pathSankey);
  }
});
