    // Initialize slider
    var Slider = d3.slider().min(2008).max(2016).ticks(10).showRange(true).value(2015)
    .tickValues([2008,2009,2010,2011,2012,2013,2014,2015,2016]).stepValues([2008,2009,2010,2011,2012,2013,2014,2015,2016]);

    console.log(d3.slider().getYear());
    // Render the slider in the div
    d3.select('#slider').call(Slider);
