    // Initialize slider
    var Slider = d3.slider().min(1951).max(2016).ticks(10).showRange(true).value(2015).tickFormat(d3.format("d"));

    // Render the slider in the div
    d3.select('#slider').call(Slider);
