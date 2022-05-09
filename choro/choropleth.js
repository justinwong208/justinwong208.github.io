// initial setup
const svg = d3.select("#choro"),
width = svg.attr("width"),
height = svg.attr("height"),
path = d3.geoPath(),
data = d3.map(),
worldmap = "update.geo.json",
worldpopulation = "num_of_bans.csv";

svg.append("rect")
.attr("y", 100)
.attr("width", "100%")
.attr("height", "500")
.attr("fill", "#89CFF0");
let centered, world;
//
// // style of geographic projection and scaling
// const projection = d3.geoRobinson()
//         .scale(130)
//         .translate([width / 2, height / 2]);


// Map and projection
//const path = d3.geoPath();
const projection = d3.geoMercator()
.scale(100)
.center([0,20])
.translate([width / 2, height / 2]);
// let data = new Map()
// Define color scale
const colorScale = d3.scaleThreshold()
.domain([125,250,375,500,625,750,875,1000])
///CHANGE THIS FROM d3.schemeYlOrRd[5] to actual hexcode from the website
///take the lowest one out and replace with grey
///also take the
//.range(d3.schemeYlOrRd[5]);
.range(["#808080","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#bd0026","#800026"]);

// Lo

// add tooltip
const tooltip = d3.select("#choro").append("div")
.attr("class", "tooltip")
.style("opacity", 0);
let onearr;
// Load external data and boot
d3.queue()
.defer(d3.json, worldmap)
.defer(d3.csv, worldpopulation, setBan)
.await(ready);

function setBan(d) {
d.one = +d.one;
data.set(d.code, +d.pop);
return d;
}
// Add clickable background
svg.append("rect")
.attr("class", "background")
.attr("width", width)
.attr("height", height)


// ----------------------------
//Start of Choropleth drawing
// ----------------------------

function ready(error, topo) {
// topo is the data received from the d3.queue function (the world.geojson)
// the data from world_population.csv (country code and country population) is saved in data variable


let mouseOver = function(d) {

d3.selectAll(".Country")
    .transition()
    .duration(200)
    .style("opacity", 1.0)
    .style("stroke", "white");
d3.select(this)
    .transition()
    .duration(200)
    .style("opacity", 1)
    .style("stroke", "black");
tooltip.style("left", (d3.event.pageX + 15) + "px")
    .style("top", (d3.event.pageY - 28) + "px")
    .transition().duration(400)
    .style("opacity", 1)
    .text(d.properties.name + ": " + d.total + " Days" )

    console.log("reaching here?" + d.properties.name + d.total)


;

}



let mouseLeave = function() {
d3.selectAll(".Country")
    .transition()
    .duration(200)
    .style("opacity", 1)
    .style("stroke", "black");
tooltip.transition().duration(300)
    .style("opacity", 0);
}

// Draw the map
svg.append("g")
  .selectAll("path")
  .data(topo.features)
  .enter()
  .append("path")
  // draw each country
  // d3.geoPath() is a built-in function of d3 v4 and takes care of showing the map from a properly formatted geojson file, if necessary filtering it through a predefined geographic projection
  .attr("d", d3.geoPath().projection(projection))

  //retrieve the name of the country from data
  .attr("data-name", function(d) {
    return d.properties.name
  })

  // set the color of each country
  .attr("fill", function(d) {
    d.total = data.get(d.id) || 0;
    return colorScale(d.total);
  })

  // add a class, styling and mouseover/mouseleave and click functions
  .style("stroke", "black")
  .attr("class", function(d) {
    return "Country"
  })
  .attr("id", function(d) {
    return d.id
  })
  .style("opacity", 1)
  .on("mouseover", mouseOver)
  .on("mouseleave", mouseLeave);

svg.append("text")
  .attr("transform", "translate(-5, 0)")
  .attr("x", 15)
  .attr("y", 125)
  .attr("font-size", "15px")
  .style('font-family','arial')
  .text("Days with Government Policies Enforcing at least Quarantining on International Arrivals between Jan 2020 - April 2022 ")

const linear = d3.scaleLinear()
  .domain([125, 250, 375, 500, 625, 750, 875, 1000])
  .range(["#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#bd0026", "#800026"]);

svg.append("g")
  .attr("class", "legendLinear")
  .attr("transform", "translate(350,525)");

const legendLinear = d3.legendColor()
  .labelFormat(d3.format("d"))
  .title("Days")
  .titleWidth(50)
  .shapeWidth(40)
  .cells(8)
  .orient('horizontal')
  .scale(linear);

svg.select(".legendLinear")
  .call(legendLinear);

}

