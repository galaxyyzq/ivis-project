// Map view
var widthMap = 962,
    heightMap = 502;

var projection = d3.geo.mercator()
    .scale(153)
    .translate([widthMap / 2, heightMap / 1.5]);

var zoom = d3.behavior.zoom()
    .scaleExtent([1, 20])
    .on("zoom", zoomed);

var svgMap = d3.select("#map-holder").append("svg")
    .attr("width", widthMap)
    .attr("height", heightMap)
    //track where user clicked down
    .on("mousedown", function () {
        d3.event.preventDefault();    
    })
    .call(zoom);

//for tooltip 
var offsetL = document.getElementById('map-holder').offsetLeft + 10;
var offsetT = document.getElementById('map-holder').offsetTop + 10;

var pathMap = d3.geo.path()
    .projection(projection);

var tooltipMap = d3.select("#map-holder")
    .append("div")
    .attr("class", "tooltip hidden");

//need this for correct panning
var g = svgMap.append("g");

//det json data and draw it
d3.json("data/old/custom.geo.json", function (error, world) {
    if (error) return console.error(error);
    console.log(world.features)
    //countries
    g.append("g")
        .attr("class", "boundary")
        .selectAll("boundary")
        .data(world.features)
        .enter().append("path")
        .attr("name", function (d) { return d.properties.name; })
        .attr("id", function (d) { return d.id; })
        .on('click', selected)
        .on("mousemove", showTooltip)
        .on("mouseout", function (d, i) {
            tooltipMap.classed("hidden", true);
        })
        .attr("d", pathMap);
 
});

function showTooltip(d) {
    label = d.properties.name;
    var mouse = d3.mouse(svgMap.node())
        .map(function (d) { return parseInt(d); });
    tooltipMap.classed("hidden", false)
        .attr("style", "left:" + (mouse[0] + offsetL) + "px;top:" + (mouse[1] + offsetT) + "px")
        .html(label);
}

function selected() {
    d3.select('.selected').classed('selected', false);
    d3.select(this).classed('selected', true);
}


function zoomed() {
    var t = d3.event.translate;
    s = d3.event.scale;
    var h = 0;

    t[0] = Math.min(
        (widthMap / heightMap) * (s - 1),
        Math.max(widthMap * (1 - s), t[0])
    );

    t[1] = Math.min(
        h * (s - 1) + h * s,
        Math.max(heightMap * (1 - s) - h * s, t[1])
    );

    zoom.translate(t);

    g.attr("transform", "translate(" + t + ")scale(" + s + ")");

    //adjust the stroke width based on zoom level
    d3.selectAll(".boundary")
        .style("stroke-width", 1 / s);

}