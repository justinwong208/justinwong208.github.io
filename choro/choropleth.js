

    // The svg
    const svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

    svg.append("rect")
    .attr("y", 100)
    .attr("width", "100%")
    .attr("height", "500")
    .attr("fill", "#89CFF0");

    // Map and projection
    const path = d3.geoPath();
    const projection = d3.geoMercator()
    .scale(100)
    .center([0,20])
    .translate([width / 2, height / 2]);

    // Data and color scale
    let data = new Map()
    const colorScale = d3.scaleThreshold()
    .domain([125,250,375,500,625,750,875,1000])
    ///CHANGE THIS FROM d3.schemeYlOrRd[5] to actual hexcode from the website
    ///take the lowest one out and replace with grey
    ///also take the
    //.range(d3.schemeYlOrRd[5]);
    .range(["#808080","#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#bd0026","#800026"]);

    // Load external data and boot
    Promise.all([
    //d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
    d3.json("update.geo.json"),
    d3.csv("num_of_bans.csv", function(d) {
    data.set(d.code, +d.pop)
})
    ]).then(function(loadData){
    let topo = loadData[0]

    //tool tip

    // create a tooltip
    var Tooltip = d3.select("#svg1")
    .append("svg")
    .style("opacity", 1)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "50px")
    .style("border-radius", "50px")
    .style("padding", "5px")

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
    Tooltip
    .style("opacity", 1)
    d3.select(this)
    .style("stroke", "white")
    //.style("opacity", 1)


}
    var mousemove = function(d) {
    Tooltip
    .html("The exact value of<br>this cell is: " + d.id)
    .style("left", (d3.mouse(this)[0] + 90) + "px")
    .style("top", (d3.mouse(this)[1]) + "px")

}
    var mouseleave = function(d) {
    Tooltip
    .style("opacity", 0)
    d3.select(this)
    .style("stroke", "black")
    //.style("opacity", 0.8)
}

    // Draw the map
    svg.append("g")
    .selectAll("path")
    .data(topo.features)
    .join("path")
    // draw each country
    .attr("d", d3.geoPath()
    .projection(projection)
    )
    // set the color of each country
    .style("stroke", "black")

    .attr("fill", function (d) {
    d.total = data.get(d.id) || 0;
    return colorScale(d.total);
})
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)

    //title
    svg.append("text")
    .attr("transform", "translate(100, 0")
    .attr("x", 15)
    .attr("y", 125)
    .attr("font-size", "15px")
    .text("Days with Government Policies Enforcing at least Quarantining on International Arrivals between Jan 2020 - April 2022 ")
    //legend
    var linear = d3.scaleLinear()
    .domain([125,250,375,500,625,750,875,1000])
    .range(["#ffeda0","#fed976","#feb24c","#fd8d3c","#fc4e2a","#e31a1c","#bd0026","#800026"]);

    svg.append("g")
    .attr("class", "legendLinear")
    .attr("transform", "translate(350,525)");

    var legendLinear = d3.legendColor()
    .labelFormat(d3.format("d"))
    .title("Days")
    .titleWidth(50)
    .shapeWidth(40)
    .cells(8)
    .orient('horizontal')
    .scale(linear);

    svg.select(".legendLinear")
    .call(legendLinear);

})


