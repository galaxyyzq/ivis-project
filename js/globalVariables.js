

// Will hold the country's current being analized
var currentCountryName = "";


//// Country grid////
var thisYear = "2015"; // Default value. It will be changed by a slider
var inOut = "In"; // Can be "In" or "Out". This will be changed by a toggle
var prev_clicked_element = null;
var prev_clicked_name = "";
var maxRefugees = {}; // Max number of refugees in a country for year = thisYear
var rects;
var dataForUpdate = null;
var hueIn = 230; //Hue of the HSL color of the squares for In mode
var hueOut = 40; //Hue of the HSL color of the squares for Out mode

var countryData;
var gridMargin = { top: 10, right: 20, bottom: 20, left: 50 };
var gridWidth  = 1110;
var gridHeight = 680;
var squareWidthHeight = 40;
var squareMarginX = 8;
var numRows = 16;
var squareHoverSizeIncrease = 50;
var zoomOffset = 5;
var countryGridSVG
