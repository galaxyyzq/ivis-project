// Sort in alphabetical order
function alphabeticalOrder(a,b) {
	return a[0].Country > b[0].Country;
}

window.checkModelData = function(ele)
{
	var name = $(ele).val().replace(" ", "");
	if(name === "") return;
	var data = findDataForCountry(name);
	var squareRef = findCountrySquare(name);
	selectSquare(squareRef, thisYear, data);
	updateFigures(squareRef, thisYear, data);
}

// Chenge is triggered when value is selected
$("#search-countries").bind('change', function () {
    window.checkModelData(this);
});

// Using the global variable countryData
function addCountriesToDropdown(data) {
	data = data.sort(alphabeticalOrder);

	$("#search-options").empty();
	$.each(data, function(i,d){
		$("#search-options").append("<option value='"+d[0].Country+"'></option>");
	});
}