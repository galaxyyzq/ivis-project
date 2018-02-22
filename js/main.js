
// Example click event with Jquery
$("#clickButton").on("click", function(){
  getCountriesFromYear(2000, function(res){
    console.log(res);
  });
});

// Toggle map when button clicked
$("#toggleMap").on("click",function(){
  $("#map-holder").toggle();
})


// Get our current data in a list with each element as our year
d3.csv("data/data_10years_sorted_country.csv", function(data){
  var countryWithYears = [];
  var thisCountry;
  var prevCountry = data[0];
  var countryArray = [];
  data.forEach(function(d,i){
    // console.log(d)
    thisCountry = d;
    if(thisCountry.Country != prevCountry.Country || data[i+1] === undefined){
      countryWithYears.push(countryArray)
      countryArray = [];
    }
    else{
      countryArray.push(thisCountry)
    }
    prevCountry = thisCountry;

  })
  console.log(countryWithYears)
});

// drawBars("#right-side-bar-chart",xComp="letter",yComp="frequency",yAxisTitle="",height=200,width=500, xP=0, yP=0, showAxis=true)