
    // set the dimensions and margins of the graph
    const margin = {top: 30, right: 0, bottom: 30, left: 50},
    width = 450 - margin.left - margin.right,
    height = 210 - margin.top - margin.bottom;

    // const tooltip = d3.select("body").append("div")
    //     .attr("class", "tooltip")
    //     .style("opacity", 0);

    //Read the data
    //d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered.csv").then( function(data) {
        d3.csv("top10_intarr_perc.csv", function(data) {
    
            // group the data: I want to draw one line per group
    const sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function(d) { return d.Country;})
        .entries(data);

            // What is the list of groups?
            const allKeys = sumstat.map(function (d) {
                return d.key
            });

            data.forEach(function(d) {
                d.date = d3.timeParse("%m-%Y")(d.Month)

            })


            // let mouseOver = function(d) {
            //     tooltip.style("left", (d3.event.pageX + 15) + "px")
            //         .style("top", (d3.event.pageY - 28) + "px")
            //         .transition().duration(400)
            //         .style("opacity", 1)
            //         // .text(d.properties.name + "  " + 5)
            //         .text(7 + "  " + 7);
            // }
            //
            // let mouseLeave = function() {
            //     tooltip.transition().duration(300)
            //         .style("opacity", 0);
            // }
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
            "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis --> it is a date format
    const x = d3.scaleTime()
    .domain(d3.extent(data, function(d) { return d.date; }))
    .range([ 0, width ]);
    svg
    .append("g")
        .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(6))
    //console.log(d3.extent(data, function(d) { return d.date; }));

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

        //.range(['#cc0001','#45a5f3','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])
    // color palette
            var color = d3.scaleOrdinal()
                .domain(allKeys)
                .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])


            // Draw the line
    svg
    .append("path")
    .attr("fill", "none")
    .attr("stroke", function(d){ return color(d.key) })
    .attr("stroke-width", 1.9)
    .attr("d", function(d){
    return d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(+d.perc); })
    (d.values)
});

    // Add titles
    svg
    .append("text")
    .attr("text-anchor", "start")
    .attr("y", -5)
    .attr("x", 0)
    .text(function(d){ return(d.key)})
    .attr("stroke", "black")
    //.style("fill", function(d){ return color(d.key) })

})
