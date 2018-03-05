// var chosenYear=2015;
var scaleSlider;
var svgSlider;
var scaleSliderGlobal;
var valueSlider;
var rangeSlider = false;



d3.slider = function module() {
  "use strict";

  var div, min = 0, max = 100, svgGroup, classPrefix, axis,
  height=40, rect,
  rectHeight = 12,
  tickSize = 6,
  margin = {top: 25, right: 25, bottom: 15, left: 25},
  ticks = 0, tickValues, scale, tickFormat, dragger, width,
  // range = false,
  callbackFn, stepValues, focus;


  function slider(selection) {
    selection.each(function() {
      div = d3.select(this).classed('d3slider', true);

      width = parseInt(div.style("width"), 10)-(margin.left
                                                + margin.right);

      valueSlider = valueSlider || min;
      scaleSliderGlobal = d3.scale.linear().domain([min, max]).range([0, width])
      .clamp(true);

      scaleSlider = d3.scale.linear().domain([1951,2016]).range([margin.left, width+margin.right])
      .clamp(true);

      // SVG
      svgSlider = div.append("svg")
      .attr("class", "d3slider-axis")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left +
            "," + margin.top + ")");

      // Range rect
      svgSlider.append("rect")
      .attr("class", "d3slider-rect-range")
      .attr("width", width)
      .attr("height", rectHeight);

      // Range rect
      if (rangeSlider) {
        svgSlider.append("rect")
        .attr("class", "d3slider-rect-value")
        .attr("width", scaleSliderGlobal(valueSlider))
        .attr("height", rectHeight);
      }

      // Axis
      var axis = d3.svg.axis()
      .scale(scaleSliderGlobal)
      .orient("bottom");

      if (ticks != 0) {
        axis.ticks(ticks);
        axis.tickSize(tickSize);
      } else if (tickValues) {
        axis.tickValues(tickValues);
        axis.tickSize(tickSize);
      } else {
        axis.ticks(0);
        axis.tickSize(0);
      }
      if (tickFormat) {
        axis.tickFormat(tickFormat);
      }

      svgSlider.append("g")
      .attr("transform", "translate(0," + rectHeight + ")")
      .call(axis)
      //.selectAll(".tick")
      //.data(tickValues, function(d) { return d; })
      //.exit()
      //.classed("minor", true);

      var values = [valueSlider];
      dragger = svgSlider.selectAll(".dragger")
      .data(values)
      .enter()
      .append("g")
      .attr("class", "dragger")
      .attr("transform", function(d) {
        return "translate(" + scaleSliderGlobal(d) + ")";
      })


      var displayValue = null;
      if (tickFormat) {
        displayValue = tickFormat(valueSlider);

      } else {
        displayValue = d3.format(".0f")(valueSlider);
      }

      dragger.append("text")
      .attr("x", 0)
      .attr("y", -15)
      .attr("text-anchor", "middle")
      .attr("class", "draggertext")
      .text(displayValue);

      dragger.append("circle")
      .attr("class", "dragger-outer")
      .attr("r", 10)
      .attr("transform", function(d) {
        return "translate(0,6)";
      });

      dragger.append("circle")
      .attr("class", "dragger-inner")
      .attr("r", 4)
      .attr("transform", function(d) {
        return "translate(0,6)";
      });


      // Enable dragger drag
      var dragBehaviour = d3.behavior.drag();
      dragBehaviour.on("drag", slider.drag);
      dragger.call(dragBehaviour);

      // Move dragger on click
      svgSlider.on("click", slider.click);

    });
  }

  slider.draggerTranslateFn = function() {
    return function(d) {
      return "translate(" + scale(d) + ")";
    }
  }

  slider.click = function() {
    // if (d3.event.offsetX < 40){
    //   var pos =  (d3.event.layerX || d3.event.offsetX) ;
    // } else {
      var pos =  d3.event.offsetX ||  d3.event.layerX ;
    // }

    // console.log( d3.event.offsetX ||  d3.event.layerX );
    slider.move(pos+margin.left);
  }

  slider.drag = function() {
    var pos = d3.event.x;
    slider.move(pos+margin.left);
  }
  var olddisplayValue = null;

  slider.move = function(pos) {

    var l,u;
    var newValue = scaleSliderGlobal.invert(pos - margin.left);

    // find tick values that are closest to newValue
    // lower bound
    if (stepValues != undefined) {
      l = stepValues.reduce(function(p, c, i, arr){
        if (c < newValue) {
          return c;
        } else {
          return p;
        }
      });

      // upper bound
      if (stepValues.indexOf(l) < stepValues.length-1) {
        u = stepValues[stepValues.indexOf(l) + 1];
      } else {
        u = l;
      }
      // set values
      var oldValue = valueSlider;
      valueSlider = ((newValue-l) <= (u-newValue)) ? l : u;
    } else {
      var oldValue = valueSlider;
      valueSlider = newValue;
    }
    var values = [valueSlider];

    // Move dragger
    svgSlider.selectAll(".dragger").data(values)
    .attr("transform", function(d) {
      return "translate(" + scaleSliderGlobal(d) + ")";
    });

    var displayValue = null;
    if (tickFormat) {
      //olddisplayValue = displayValue;
      displayValue = tickFormat(valueSlider);

    } else {
     // olddisplayValue = displayValue;
      displayValue = d3.format(".0f")(valueSlider);

    }
    if (olddisplayValue!=null && olddisplayValue != displayValue) {
      // console.log(displayValue);
      thisYear = displayValue;
      drawLegend(maxRefugees[thisYear], thisYear);

      // updateSankey($("#countryName").text(),thisYear);
      updateSankey(currentCountryName,thisYear);
      updateGrid();
<<<<<<< HEAD
		
		
      //$("#barChartYear").html(thisYear);
		
	  // Changing the year in the second column description.
	  $("#barChartYear").html(thisYear);
		
      // Changing the value (number of refugees) in the second column description.
      //$("#nRefugees").html(d.Value);	
		
		
      //$("#nRefugees").html(d.Value);	
		
=======


      $("#barChartYear").html(thisYear);
      //$("#nRefugees").html(d.Value);

>>>>>>> 21b5d5626608e154f81c6773ac539272f270c765
    }  //console.log(displayValue);
    olddisplayValue = displayValue;
    svgSlider.selectAll(".dragger").select("text")
    .text(displayValue);


    if (rangeSlider) {
      svgSlider.selectAll(".d3slider-rect-value")
      .attr("width", scaleSliderGlobal(valueSlider));
    }

    if (callbackFn) {
      callbackFn(slider);
    }
  }

  // Getter/setter functions
  slider.min = function(_) {
    if (!arguments.length) return min;
    min = _;
    return slider;
  };

  slider.max = function(_) {
    if (!arguments.length) return max;
    max = _;
    return slider;
  };

  slider.classPrefix = function(_) {
    if (!arguments.length) return classPrefix;
    classPrefix = _;
    return slider;
  }

  slider.tickValues = function(_) {
    if (!arguments.length) return tickValues;
    tickValues = _;
    return slider;
  }

  slider.ticks = function(_) {
    if (!arguments.length) return ticks;
    ticks = _;
    return slider;
  }

  slider.stepValues = function(_) {
    if (!arguments.length) return stepValues;
    stepValues = _;
    return slider;
  }

  slider.tickFormat = function(_) {
    if (!arguments.length) return tickFormat;
    tickFormat = _;
    return slider;
  }

  slider.value = function(_) {
    if (!arguments.length) return valueSlider;
    valueSlider = _;
    return slider;
  }

  slider.showRange = function(_) {
    if (!arguments.length) return rangeSlider;
    rangeSlider = _;
    return slider;
  }

  slider.callback = function(_) {
    if (!arguments.length) return callbackFn;
    callbackFn = _;
    return slider;
  }


  slider.getYear = function(){
    return thisYear;
  }

  slider.setValue = function(newValue) {
    var pos = scaleSliderGlobal(newValue) + margin.left;
    slider.move(pos);
  }

  slider.mousemove = function() {
    var pos = d3.mouse(this)[0];
    var val = slider.getNearest(scaleSliderGlobal.invert(pos), stepValues);
    focus.attr("transform", "translate(" + scale(val) + ",0)");
    focus.selectAll("text").text(val);
  }

  slider.getNearest = function(val, arr) {
    var l = arr.reduce(function(p, c, i, a){
      if (c < val) {
        return c;
      } else {
        return p;
      }
    });
    var u = arr[arr.indexOf(l)+1];
    var nearest = ((valueSlider-l) <= (u-valueSlider)) ? l : u;
    return nearest;
  }

  slider.destroy = function() {
    div.selectAll('svg').remove();
    return slider;
  }

  return slider;

};
