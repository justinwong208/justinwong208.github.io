
    // set the dimensions and margins of the graph
    const margin = {top: 30, right: 200, bottom: 50, left: 90},
    width = 900 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#svg3")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
    d3.csv("top10_perc_tourists_forJSON.csv",

    // When reading the csv, I must format variables:
    function(d){
    return { date : d3.timeParse("%Y")(d.Year),
    perc: d.perc,
    country: d.Country
}
}).then(

    // Now I can use this dataset:
    data => {
    // Add X axis --> it is a date format
    const x = d3.scaleTime()
    .domain(d3.extent(data, function(d) { return d.date; }))
    .range([ 0, width ]);
    svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear()
    .domain([d3.min(data, function(d) { return +d.perc; }), d3.max(data, function(d) { return +d.perc; })])
    .range([ height, 0 ]);
    svg.append("g")
    .call(d3.axisLeft(y));
    //Puts all of one country's perc in an array
    const sumstat = d3.group(data, d => d.country);

    // color palette
    const color = d3.scaleOrdinal()
    .range(["#4e79a7","#f28e2c","#e15759","#76b7b2","#59a14f","#edc949","#af7aa1","#ff9da7","#9c755f","#bab0ab"])

    // Draw the line
    svg.selectAll(".line")
    .data(sumstat)
    .join("path")
    .attr("fill", "none")
    .attr("stroke", function(d){ return color(d[0]) })
    .attr("stroke-width", 1.5)
    .attr("d", function(d){
    return d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(+d.perc); })
    (d[1])
})

    // //Display the X-axis label
    // svg.append("g")
    //     .append("text")
    //     .attr("font-size","18px")
    //     .attr("y", height + 40 )
    //     .attr("x", width / 2  - 18)
    //     .attr("stroke", "black")
    //     .text("Year")

    // Display the Y-axis label
    svg.append("g")
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -50)
    .attr("x", -300)
    .attr("stroke", "black")
    .attr("font-size","20px")
    .text("% Change ")

    //Title
    svg.append("g")
    .append("text")
    .attr("font-size","20px")
    .attr("y", 0)
    .attr("x", 50)
    .attr("stroke", "black")
    .text("% Change in International Tourist Arrivals 2018 - 2021")

    //Legend
    const ordinal = d3.scaleOrdinal()
    .domain(["France", "Spain", "United States", "China", "Italy", "Turkey", "Mexico", "Thailand", "Germany", "United Kingdom"])
    .range(["#4e79a7","#f28e2c","#e15759","#76b7b2","#59a14f","#edc949","#af7aa1","#ff9da7","#9c755f","#bab0ab"]);


    svg.append("g")
    .attr("class", "legendOrdinal")
    .attr("transform", "translate(650,20)");

    const legendOrdinal = d3.legendColor()
    .shape("path", d3.symbol().type(d3.symbolCircle).size(25)())
    .shapePadding(8)
    //use cellFilter to hide the "e" cell
    .cellFilter(function (d) {
    return d.label !== "e"
})
    .scale(ordinal)


    svg.select(".legendOrdinal")
    .call(legendOrdinal);
    //Add in the months in between
})

