// Example click event with Jquery
$("#clickButton").on("click", function(){
  getCountriesFromYear(2000, function(res){
    console.log(res);
  });
});