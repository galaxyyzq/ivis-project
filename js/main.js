
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

console.log("Hej2")