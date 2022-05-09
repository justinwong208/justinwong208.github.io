
    // set the dimensions and margins of the graph
    const margin = {top: 80, right: 60, bottom: 60, left: 120},
    width = 600 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const cleve = d3.select(".cleve")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // const tooltip = d3.select("svg").append("div")
    //     .attr("class", "tooltip")
    //     .style("opacity", 0);

    // Parse the Data
    d3.csv("top10_tourist_country.csv").then( function(data) {



        // Add X axis
    const x = d3.scaleLinear()
    .domain([0, 90])
    .range([ 0, width]);
    cleve.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .append("text")
    .attr("font-size","15px")
    .attr("y", 50)
    .attr("x", width /2)
    .attr("stroke", "black")
        .attr("fill", "black")
    .text("International Arrivals (Millions)")

    // Y axis
    const y = d3.scaleBand()
    .range([ 0, height ])
    .domain(data.map(function(d) { return d.group; }))
    .padding(1);
    cleve.append("g")
    .call(d3.axisLeft(y))

    const tooltip = d3.select(".cleve")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")


        // A function that change this tooltip when the user hover a point.
        // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
        const mouseover = function(event, d) {
            tooltip
                .style("opacity", 1)
                .html(`${d.value2} Million(s) International Tourists <br> visted ${d.group} in 2020`)
                .style("left", (event.x)/2 + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                .style("top", (event.y)/2 + "px")
        }

        // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
        const mouseleave = function(event,d) {
            tooltip
                .transition()
                .duration(200)
                .style("opacity", 0)
            gdp1
                .style("opacity", 0)
            gdp2
                .style("opacity", 0)
            gdptext19
                .style("opacity", 0)
            gdptext20
                .style("opacity", 0)
        }


        // Lines
    cleve.selectAll("myline")
    .data(data)
    .join("line")
    .attr("x1", function(d) { return x(d.value1); })
    .attr("x2", function(d) { return x(d.value2); })
    .attr("y1", function(d) { return y(d.group); })
    .attr("y2", function(d) { return y(d.group); })
    .attr("stroke", "grey")
    .attr("stroke-width", "1px")



        // Circles of variable 1
    cleve.selectAll("mycircle")
    .data(data)
    .join("circle")
    .attr("cx", function(d) { return x(d.value1); })
    .attr("cy", function(d) { return y(d.group); })
    .attr("r", "6")
    .style("fill", "#69b3a2")
        .on("mouseover", function(event, d) {
            tooltip
                .style("opacity", 1)
                .html(`${d.value1} Million(s) International Tourists <br> visted ${d.group} in 2019`)
                .style("left", (event.x)/2 + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                .style("top", (event.y)/2 + "px")
            gdp1
                .style("opacity", 0.5)
            gdp2
                .style("opacity", 0.5)
            gdptext20
                .style("opacity", .7)
                .html(`'20 Tourism GDP: ${d.gdp20}%`);

            gdptext19
                .style("opacity", 0.7)
                .html(`'19 Tourism GDP: ${d.gdp19}%`);

        } )
        .on("mouseleave", mouseleave )








    // Circles of variable 2
    cleve.selectAll("mycircle")
    .data(data)
    .join("circle")
    .attr("cx", function(d) { return x(d.value2); })
    .attr("cy", function(d) { return y(d.group); })
    .attr("r", "6")
    .style("fill", "#4C4082")
        .on("mouseover", function(event, d) {
            tooltip
                .style("opacity", 1)
                .html(`${d.value2} Million(s) International Tourists <br> visted ${d.group} in 2020`)
                .style("left", (event.x)/2 + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                .style("top", (event.y)/2 + "px");
            gdp1
                .style("opacity", 0.5)
            gdp2
                .style("opacity", 0.5)
            gdptext20
                .style("opacity", 0.8)
                .html(`'20 Tourism GDP: ${d.gdp20}%`);

            gdptext19
                .style("opacity", 0.8)
                .html(`'19 Tourism GDP: ${d.gdp19}%`);

        } )
        .on("mouseleave", mouseleave )




    cleve.append("text")
    .attr("transform", "translate(100, 0)")
    .attr("x", -125)
    .attr("y", -10)
    .attr("font-size", "18px")
        .style('font-family','arial')
    .text("Top 10 Tourist Countries by International Arrivals 2019 v 2020")

        const ordinal = d3.scaleOrdinal()
            .domain(["2019", "2020"])
            .range(["#69b3a2", "#4C4082"]);


        cleve.append("g")
            .attr("class", "legendOrdinal")
            .attr("transform", "translate(425,150)");

        const legendOrdinal = d3.legendColor()
            .shape("path", d3.symbol().type(d3.symbolCircle).size(150)())
            .shapePadding(10)
            //use cellFilter to hide the "e" cell
            .cellFilter(function (d) {
                return d.label !== "e"
            })
            .scale(ordinal);

        cleve.select(".legendOrdinal")
            .call(legendOrdinal);


        const gdp1 = cleve
            .append("rect")
            .attr("x", 275)
            .attr("y", 350)
            .attr("width", "295")
            .attr("height", "75")
            .attr("fill", "#69b3a2")
            .style("opacity", 0);

        const gdp2 = cleve
            .append("rect")
            .attr("x", 275)
            .attr("y", 450)
            .attr("width", "295")
            .attr("height", "75")
            .attr("fill", "#4C4082")
            .style("opacity", 0);

        const gdptext19 = cleve
            .append("text")
            .style("fill", "black")
            .style("font-size", "17.5px")
            .attr("x", 280)
            .attr("y", 400)
            .style('font-family','arial')
            .attr("stroke", "black")
            .style("opacity", 0)
            .text("'19 Tourism GDP: ")

        const gdptext20 = cleve
            .append("text")
            .style("fill", "black")
            .style("font-size", "19px")
            .attr("x", 280)
            .attr("y", 495)
            .style('font-family','arial')
            .attr("stroke", "black")
            .style("opacity", 0)
            .text("'20 Tourism GDP: ")
        //TODO
    //Add Hover over name will bring up small popup window that tells value of both circle
    //as well as Percent/actual num difference of 2020 to 2019
})


