
    // set the dimensions and margins of the graph
    const margin = {top: 30, right: 0, bottom: 30, left: 50},
    width = 500 - margin.left - margin.right,
    height = 210 - margin.top - margin.bottom;


    //Read the data
    //d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered.csv").then( function(data) {
        d3.csv("top10_intarr_perc.csv").then( function(data) {
    // group the data: I want to draw one line per group
    const sumstat = d3.group(data, d => d.Country) // nest function allows to group the calculation per level of a factor
            // What is the list of groups?
    allKeys = new Set(data.map(d=>d.Country))

            data.forEach(function(d) {
                d.date = d3.timeParse("%m-%Y")(d.Month)

            })




            // Add an svg element for each group. The will be one beside each other and will go on the next row when no more room available
    const svg = d3.select("#smallmult")
    .selectAll("uniqueChart")
    .data(sumstat)
    .enter()
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
    `translate(${margin.left},${margin.top})`);

    // Add X axis --> it is a date format
    const x = d3.scaleTime()
    .domain(d3.extent(data, function(d) { return d.date; })).nice()
    .range([ 0, width ]);
    svg
    .append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(5))
    console.log(d3.extent(data, function(d) { return d.date; }));

    //Add Y axis
    const y = d3.scaleLinear()
        .domain([d3.min(data, function(d) { return +d.perc; }), d3.max(data, function(d) { return +d.perc; })])
        .range([ height, 0 ]);
        svg.append("g")
        .call(d3.axisLeft(y).ticks(5))
        .append("text")
            .attr("font-size","8.5px")
            .attr("transform", "rotate(-90)")
            .attr("y", -35)
            .attr("x", -30)
            .attr("stroke", "black")
            .style("opacity", 0.8)

            .style('font-family','arial')
            .text("% Change in International Arr.");

    // color palette
    const color = d3.scaleOrdinal()
    //.domain(allKeys)
    .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

    // Draw the line
    svg
    .append("path")
    .attr("fill", "none")
    //.attr("stroke", function(d){ return color(d[0]) })
    //only red look kinda bleak
    .attr("stroke", "#45a5f3")
    .attr("stroke-width", 1.9)
    .attr("d", function(d){
    return d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(+d.perc); })
    (d[1])
})

    // Add titles
    svg
    .append("text")
    .attr("text-anchor", "start")
    .attr("y", -5)
    .attr("x", 0)
    .text(function(d){ return(d[0])})
    //.style("fill", function(d){ return color(d[0]) })

})
