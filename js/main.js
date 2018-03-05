// window.parent.document.body.style.zoom = 0.5;
// Example click event with Jquery
$("#clickButton").on("click", function(){
  getCountriesFromYear(2000, function(res){
    console.log(res);
  });
});

// Toggle map when button clicked
$("#toggleMap").on("click",function(){
    $("#map-holder").toggle();
    $("#country-grid").toggle();
})


$("#inOutToggle").on("click", function() {
  if(inOut === "In") inOut = "Out";
  else inOut = "In";

  loadCountryData();
})

// drawBars("#right-side-bar-chart",xComp="letter",yComp="frequency",yAxisTitle="",height=200,width=500, xP=0, yP=0, showAxis=true)


// When we click on the 'Info' button.
$("#infoLink").on("click", function() {
  $("#contentRow").css('display', 'none');
  $("#information").css('display', 'inline-block');	
})


// When we click on the 'Away from home' button.
$("#awayFromHomeLink").on("click", function() {
  $("#contentRow").css('display', 'inline');
  $("#information").css('display', 'none');	
})

$("#logScaleToggle").on("click", function () {
  if (scaleForY === "linear"){
    scaleForY = "Out";
    $("#logScaleToggle").text("Use Linear Scale");
  }else{
    scaleForY = "linear";
    $("#logScaleToggle").text("Use Log Scale");
  } 
  initGrid();
  updateTopRightBarChart("#right-side-bar-chart", xComp = "letter", yComp = "frequency", yAxisTitle = "", height = 200, width = 500, xP = 0, yP = 0, showAxis = true, dataForUpdate, scaleForY)  
  
})
