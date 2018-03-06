// window.parent.document.body.style.zoom = 0.5;
// Example click event with Jquery
$("#clickButton").on("click", function(){
  getCountriesFromYear(2000, function(res){
    console.log(res);
  });
});

// When we click on the 'Info' button.
$("#infoLink").on("click", function() {
  $("#contentRow").css('display', 'none');
  $("#information").css('display', 'inline-block');	
})
$("#infoLink2").on("click", function () {
    $("#contentRow").css('display', 'none');
    $("#information").css('display', 'inline-block');
})

// When we click on the 'Away from home' button.
$("#awayFromHomeLink").on("click", function() {
  $("#contentRow").css('display', 'inline');
  $("#information").css('display', 'none');	
})
$("#awayFromHomeLink2").on("click", function () {
    $("#contentRow").css('display', 'inline');
    $("#information").css('display', 'none');
})

$(function () {
  $('#inOutToggle').change(function () {
    if (inOut === "In") {
      inOut = "Out";
    }else {
      inOut = "In";
    }
    updateBarChartDescription();

    loadCountryData();
  });
  $('#logScaleToggle').change(function () {
    if (scaleForY === "linear") {
      scaleForY = "Out";
      $("#logScaleToggle").text("Use Linear Scale");
    } else {
      scaleForY = "linear";
      $("#logScaleToggle").text("Use Log Scale");
    }
    initGrid();
    updateTopRightBarChart("#right-side-bar-chart", xComp = "letter", yComp = "frequency", yAxisTitle = "", height = 200, width = 500, xP = 0, yP = 0, showAxis = true, dataForUpdate, scaleForY);
    drawMap();
  });
  // Toggle map when button clicked
  $('#toggleMap').change(function () {
    $("#map-holder").toggle();
    $("#country-grid").toggle();
  });
});




// The presentation is due tomorrow, just a quick solution...
function resize(){
	
	if( window.innerWidth < 1800){
		$("#leftColum").attr("class", "col-12");
		$("#rightColum").attr("class", "col-12");		
	}
	else
	{
		$("#leftColum").attr("class", "col-6");
		$("#rightColum").attr("class", "col-6");			
	}
}

window.onresize = resize;