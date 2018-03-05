window.checkModelData = function(ele)
{
	var name = $(ele).val().replace(" ", "");
	if(name === "") return;
	var data = findDataForCountry(name);
	selectSquare(null, thisYear, data);
	updateFigures(null, thisYear, data);


	// var mod = potentialModels[name];
  // if(mod) {
  //     loadModelData(name);
  // }
}

function loadModelData(name) {
    // var mod = potentialModels[name];
    // $("#address").val(potentialModels[name].address);
    // $("#city").val(potentialModels[name].city);
    // $("#state").val(potentialModels[name].state);
    // $("#email").val(potentialModels[name].email);
    // $("#phone").val(potentialModels[name].phone);
    // $("#zip").val(potentialModels[name].zip);
}


// Chenge is triggered when value is selected
$("#search-countries").bind('change', function () {
    window.checkModelData(this);
});


// Using the global variable countryData
function addCountriesToDropdown(data) {
	$.each(data, function(i,d){
		$("#search-options").append("<option value='"+d[0].Country+"'></option>");
	});
}