// Map view
var widthMap = 800,
    heightMap = 400;

var projection = d3.geo.mercator()
    .scale(100)
    .translate([widthMap / 2, heightMap / 1.5]);

var zoom = d3.behavior.zoom()
    .scaleExtent([1, 20])
    .on("zoom", zoomed);

var svgMap, g;

//for tooltip 
var offsetL = document.getElementById('map-holder').offsetLeft + 10;
var offsetT = document.getElementById('map-holder').offsetTop + 10;

var pathMap = d3.geo.path()
    .projection(projection);

var tooltipMap = d3.select("#map-holder")
    .append("div")
    .attr("class", "tooltip hidden");

function drawMap() {
    
    // Delete old map
    d3.select("#map-holder").selectAll("svg").remove();

    // Add new svg
    svgMap = d3.select("#map-holder").append("svg")
        .attr("width", widthMap)
        .attr("height", heightMap)
        //track where user clicked down
        .on("mousedown", function () {
            d3.event.preventDefault();
        })
        .call(zoom);

    //need this for correct panning
    g = svgMap.append("g");

    //det json data and draw it
    d3.json("data/old/custom.geo.json", function (error, world) {
        if (error) return console.error(error);
        // console.log(world.features)
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
                //tooltipMap.classed("hidden", true);
                tooltipMap.style('display', 'none');

            })
            .attr("d", pathMap)
            .attr("fill", function (d) {
                data = findDataForCountry(d.properties.name);
                if (data == null) {
                    return "#DEB887";
                } else {
                    return changeFillColor(data, thisYear);
                }
            })
            .attr("class", function (d) {
                if (prev_clicked_name == d.properties.name) {
                    return "selected";
                }
            });

    });
}

function showTooltip(d) {
    label = d.properties.name;
    var mouse = d3.mouse(svgMap.node())
        .map(function (d) { return parseInt(d); });
    //tooltipMap.classed("hidden", false)
    tooltipMap.style('display', 'block')
        .attr("style", "left:" + (mouse[0] + offsetL) + "px;top:" + (mouse[1] + offsetT) + "px")
        .html(label);
}

function selected(d) {
    d3.select('.selected').classed('selected', false);
    d3.select(this).classed('selected', true);
    thisCountry = d.properties.name;
    prev_clicked_name = thisCountry;

    console.log(thisCountry);
    var data = findDataForCountry(thisCountry);
    //updateFigures(null, thisYear, data);

    // Update the title above the barchart
    currentCountryName = thisCountry;

    // Update the barchart
    updateTopRightBarChart("#right-side-bar-chart", xComp = "letter", yComp = "frequency", yAxisTitle = "", height = 200, width = 500, xP = 0, yP = 0, showAxis = true, data)

    // Update the sankey diagram
    updateSankey(thisCountry, thisYear);
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
