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
  if(inOut === "In") 
  { 
	  inOut = "Out";
	  
	  // Changing the description of the chart bar in the top right.
	  $("#descriptionSentence").html("Refugees from this country in");	 	  
  }
  else
  {
	  inOut = "In";	  
	  
	  // Changing the description of the chart bar in the top right.
	  $("#descriptionSentence").html("Refugees living in this country in ");	 	  
  }

  console.log("loading", inOut);

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

