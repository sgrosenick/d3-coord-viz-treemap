//begin script when window loads
window.onload = setMap();

//set up choropleth map
function setMap(){

    //map frame dimensions
    var width = 960,
        height = 460;
    
    //create new svg container for the map
    var map = d3.select("body")
        .append("svg")
        .attr("class", "map")
        .attr("width", width)
        .attr("height", height);
    
    //create Albers equal area conic projection centered on Europe
    var projection = d3.geoAlbers()
        .center([15.57, 49.91])
        .rotate([-20.48, 0.00, 0])
        .parallels([43.09, 25])
        .scale(650)
        .translate([width / 2, height / 2]);
    
    var path = d3.geoPath()
        .projection(projection);
    
    
    //use queue to parallelize asynchronous data loading
    d3.queue()
        .defer(d3.csv, "data/EuropeMigrantData2015.csv") //load attributes from csv
        .defer(d3.json, "data/EuropeCountries.topojson") //load choropleth data
        .defer(d3.json, "data/WorldCountries.topojson") //load background data
        .await(callback);
    
    function callback(error, csvData, europe, worldCountries){
        //translate europe TopoJSON
        var europeCountries = topojson.feature(europe, europe.objects.EuropeCountries).features,
            worldBorders = topojson.feature(worldCountries, worldCountries.objects.WorldCountries);
        
        //add world countries
        var backgroundCountries = map.append("path")
            .datum(worldBorders)
            .attr("class", "countries")
            .attr("d", path);
        
        //add Europe countries to map
        var countries = map.selectAll(".regions")
            .data(europeCountries)
            .enter()
            .append("path")
            .attr("class", function(d){
                return "regions " + d.properties.sovereignt;
            })
            .attr("d", path);
        
        
        //examine the results
        console.log(europeCountries);
    };
};