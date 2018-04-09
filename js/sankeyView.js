// Code for drawing a sankey diagram

var marginSankey = { top: 10, right: 10, bottom: 0, left: 10 },
    widthSankey = 600 - marginSankey.left - marginSankey.right,
    heightSankey = 300 - marginSankey.top - marginSankey.bottom;

// Sort countries by number of refugees, return names
function sortCountries(data) {
    var names = [];
    var values = [];
    var sortedValues = [];
    var sortedNames = [];
    var namesLabel;
    if (inOut == "In") {
        namesLabel = "source";
    } else {
        namesLabel = "target";
    }

    data.forEach(function (d, i) {
        names.push(d[namesLabel]);
        values.push(+d.value);
    })
    var help = values.slice(0);
    sortedValues = help.sort(function (a, b) { return (b - a) });
    //console.log("sorted values: ", sortedValues);
    var index = 0;
    var prevIndex = -1;
    for (i = 0; i < values.length; i++) {
        index = values.indexOf(sortedValues[i]);
        if (prevIndex == index) {
            index = values.indexOf(sortedValues[i], index + 1);
        }
        sortedNames.push(names[index]);
        prevIndex = index;
    }
    //console.log("Sorted names: ", sortedNames);
    return sortedNames
}

// Get the top 5 countries of data, return new data structure
function topCountries(data) {
    var sortedNames = sortCountries(data);
    //console.log("names: ", sortedNames);
    var topData = [];
    var sumOthers = 0;
    var isTop = 0;
    var namesLabel;
    if (inOut == "In") {
        namesLabel = "source";
    } else {
        namesLabel = "target";
    }
    data.forEach(function (d, i) {
        for (j = 0; j < 5; j++) {
            if (d[namesLabel] == sortedNames[j]) {
                topData.push({ source: d.source, target: d.target, value: d.value });
                isTop = 1;
            }
        }
        if (isTop == 0) {
            sumOthers = + d.value;
        }
        isTop = 0;
    })
    if (sumOthers != 0) {
        if (inOut == "In") {
            topData.push({ source: "Others", target: data[0].target, value: sumOthers });
        } else {
            topData.push({ source: data[0].source, target: "Others", value: sumOthers });
        }
    }
    //console.log("top 5: ", topData);
    return topData;
}

// Color scheme for the sankey
function getColorScheme(data) {

    //var colorDomain = ["#1a1334", "#26294a", "#01545a", "#017351", "#03c383", "#aad962", "#fbbf45", "#ef6a32", "#ed0345", "#a12a5e", "#710162", "#110141"];
    var colorDomain = ["#01545a", "#03c383", "#aad962", "#fbbf45", "#ef6a32", "#ed0345", "#a12a5e", "#710162", "#110141"];

    var color = d3.scale.ordinal()
        .domain(sortCountries(data))
        .range(colorDomain);

    return color;
}

// Draw the sankey diagram
function drawSankey(data, thisYear) {
    var units = "Refugees";

    var formatNumber = d3.format(",.0f"),    // zero decimal places
        format = function (d) { return formatNumber(d) + " " + units; };

    /* Initialize tooltip */
    //for tooltip 
    var offsetL = document.getElementById('chart').offsetLeft + 30;
    var offsetT = document.getElementById('chart').offsetTop + 30;

    var tooltipSankey = d3.select("#chart")
        .append("div")
        .attr("class", "tooltip hidden");

    function showTooltipSankey(d) {
        var mouse = d3.mouse(sankeySVG.node())
            .map(function (d) { return parseInt(d); });
        tooltipSankey.style('display', 'block')
            .attr("style", "left:" + (mouse[0] + offsetL) + "px;top:" + (mouse[1] + offsetT) + "px")
            .html(d.source.name + " → " + d.target.name + "<br>" + format(d.value));
    }

    //Remove previous sankey
    d3.select("#chart").selectAll("svg").remove();

    // append the svg canvas to the page
    var sankeySVG = d3.select("#chart").append("svg")
        .attr("id", "graph")
        .attr("width", widthSankey + marginSankey.left + marginSankey.right)
        .attr("height", heightSankey + marginSankey.top + marginSankey.bottom)
        .append("g")
        .attr("transform",
        "translate(" + marginSankey.left + "," + marginSankey.top + ")");

    // Set the sankey diagram properties
    var sankey = d3.sankey()
        .nodeWidth(15)
        .nodePadding(20)
        .size([widthSankey, heightSankey-10]);

    var pathSankey = sankey.link();

    var color = getColorScheme(data);

    //set up graph in same style as original example but empty
    graph = { "nodes": [], "links": [] };

    if (inOut == "In") { 
        data.forEach(function (d) {
            graph.nodes.push({ "name": d.source });
            graph.nodes.push({ "name": "" });
            graph.links.push({
                "source": d.source,
                "target": "",
                "value": +d.value
            });
        });
    }else{
        data.forEach(function (d) {
            graph.nodes.push({ "name": "" });
            graph.nodes.push({ "name": d.target });
            graph.links.push({
                "source": "",
                "target": d.target,
                "value": +d.value
            });
        });
    }
    
    

    //Add title in graph
    var ourTarget, direction;
    if (inOut == "In") {
        ourTarget = data[0].target;
        direction = "in";
        d3.select("#Title").text("Origin of refugees in " + thisYear);
    } else {
        ourTarget = data[0].source;
        direction = "from";
        d3.select("#Title").text("Residence of refugees in " + thisYear);
    }
    //d3.select("#Title").text("Refugees " + direction + " " + ourTarget + ". Year:" + thisYear);

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
        .style("stroke-width", function (d) { return Math.max(1, d.dy); })
        .style("stroke", function (d) {
            if (inOut == "In") {
                return d.color = color(d.source.name);
            } else {
                return d.color = color(d.target.name);
            }
        })
        .on("mousemove", showTooltipSankey)
        .on("mouseout", function (d, i) {
            //tooltipMap.classed("hidden", true);
            tooltipSankey.style('display', 'none');

        })
        .sort(function (a, b) { return b.dy - a.dy; });


    // add the link titles
    /*link.append("title")
        .text(function (d) {
            return d.source.name + " → " +
                d.target.name + "\n" + format(d.value);
        });*/ 

    // add in the nodes
    var node = sankeySVG.append("g").selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

    // add the rectangles for the nodes
    node.append("rect")
        .attr("height", function (d) { return d.dy; })
        .attr("width", sankey.nodeWidth())
        .style("fill", function (d) {
            if (d.name == ourTarget) {
                return "#1a1334";
            } else {
                return d.color = color(d.name);
            }
        })
        // .style("stroke", function(d) {
        // return d3.rgb(d.color).darker(2); })
        .append("title")
        .text(function (d) {
            return d.name + "\n" + format(d.value);
        });

    // add in the title for the nodes
    node.append("text")
        .attr("x", -6)
        .attr("y", function (d) { return d.dy / 2; })
        .attr("dy", ".25em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function (d) { return d.name; })
        .filter(function (d) { return d.x < width / 2; })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");
    //});

}

// Called when mouse hovers over a square
function updateSankey(country, thisYear) {
    //console.log("This country: ", country);
    //d3.csv("data/dataforSankeyDiagram.csv", function (error, data) {
    d3.csv("data/treatingRealData/sankeyData" + inOut + ".csv", function (error, data) {
        if (inOut == "In") {
            countryLabel = "Residence";
        } else {
            countryLabel = "Origin";
        }
        var sankeyData = [];
        //var short, long;
        data.forEach(function (d) {
            /*if (d.Year == thisYear) { 
                if (d[countryLabel].length > country.length) {
                    short = country;
                    long = d[countryLabel];
                } else {
                    long = country;
                    short = d[countryLabel];
                }
                if ((long.search(short) != -1 || long==short) && !(long == "S. Sudan" && short == "Sudan")) {
                    sankeyData.push({ source: d.Origin, target: d.Residence, value: d.Value });
                }
            }*/
            if (d[countryLabel] == country && d.Year == thisYear) {
                //console.log(d[countryLabel]);

                sankeyData.push({ source: d.Origin, target: d.Residence, value: d.Value });
            }
        });
        //console.log(sankeyData)
        if (sankeyData.length == 0) {
            //Remove previous sankey
            d3.select("#chart").selectAll("svg").remove();
            // add some text
            d3.select("#Title").text("No data for this year");
        } else {
            //Represent only the top5 countries to simplify the diagram
            drawSankey(topCountries(sankeyData), thisYear);
        }
        
    });

}
