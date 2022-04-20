
    // set the dimensions and margins of the graph
    const margin = {top: 80, right: 60, bottom: 60, left: 120},
    width = 600 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("svg")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Parse the Data
    d3.csv("top10_tourist_country.csv").then( function(data) {



        // Add X axis
    const x = d3.scaleLinear()
    .domain([0, 90])
    .range([ 0, width]);
    svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .append("text")
    .attr("font-size","15px")
    .attr("y", 50)
    .attr("x", width /2)
    .attr("stroke", "black")
    .style("fill", "black")
    .text("International Arrivals (Millions)")

    // Y axis
    const y = d3.scaleBand()
    .range([ 0, height ])
    .domain(data.map(function(d) { return d.group; }))
    .padding(1);
    svg.append("g")
    .call(d3.axisLeft(y))


    // Lines
    svg.selectAll("myline")
    .data(data)
    .join("line")
    .attr("x1", function(d) { return x(d.value1); })
    .attr("x2", function(d) { return x(d.value2); })
    .attr("y1", function(d) { return y(d.group); })
    .attr("y2", function(d) { return y(d.group); })
    .attr("stroke", "grey")
    .attr("stroke-width", "1px")



        // Circles of variable 1
    svg.selectAll("mycircle")
    .data(data)
    .join("circle")
    .attr("cx", function(d) { return x(d.value1); })
    .attr("cy", function(d) { return y(d.group); })
    .attr("r", "6")
    .style("fill", "#69b3a2")

        var Tooltip = d3.select("svg")
            .append("svg")
            .style("opacity", 0)
            .attr("class", ".tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "50px")
            .style("border-radius", "50px")
            .style("padding", "5px")
            .style("font-size", "16px")


        // Three function that change the tooltip when user hover / move / leave a cell
        const mouseover = function (d) {
            Tooltip
                .style("opacity", 1)
            d3.select(this)
                .style("fill", "yellow")
            //.style("opacity", 1)


        };
        const mousemove = (event) => {
            const pos = d3.pointer(event);

            Tooltip
                .html("The value of this cell is:")
                .style("left", (pos[0] + 70) + "px")
                .style("top", (pos[1]) + "px")
            // console.log(pos[0]);
            // console.log(pos[1]);
        };
        const mouseleave = function (d) {
            Tooltip
                .style("opacity", 0)
            d3.select(this)
                .style("fill", "#4C4082")
        };


    // Circles of variable 2
    svg.selectAll("mycircle")
    .data(data)
    .join("circle")
    .attr("cx", function(d) { return x(d.value2); })
    .attr("cy", function(d) { return y(d.group); })
    .attr("r", "6")
    .style("fill", "#4C4082")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        // .append("title")
        //
        // .text( (d) => "Value in 2020 is " + d.value2)

        //TODO
    //Add Hover over name will bring up small popup window that tells value of both circle
    //as well as Percent/actual num difference of 2020 to 2019
})

