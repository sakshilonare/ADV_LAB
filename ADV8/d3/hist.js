d3.csv("gw-maharashtra-2020.csv", d3.autoType).then(data => {
    const width = 500, height = 300, margin = { top: 20, right: 30, bottom: 50, left: 60 };

    const svg = d3.select("#histogram").append("svg")
                  .attr("width", width)
                  .attr("height", height);

    // Extract data for "Stage of GW extraction (%)"
    const extractionData = data.map(d => d["Stage of GW extraction (%)"]);

    // Set up the x-scale
    const x = d3.scaleLinear()
                .domain([0, d3.max(extractionData)])
                .nice()
                .range([margin.left, width - margin.right]);

    // Generate histogram bins
    const bins = d3.histogram()
                   .domain(x.domain())
                   .thresholds(x.ticks(10)) // Set the number of bins
                   (extractionData);

    // Set up the y-scale
    const y = d3.scaleLinear()
                .domain([0, d3.max(bins, d => d.length)])
                .nice()
                .range([height - margin.bottom, margin.top]);

    // Append bars for histogram
    svg.selectAll("rect")
       .data(bins)
       .enter()
       .append("rect")
       .attr("x", d => x(d.x0) + 1)
       .attr("y", d => y(d.length))
       .attr("width", d => x(d.x1) - x(d.x0) - 1)
       .attr("height", d => height - margin.bottom - y(d.length))
       .attr("fill", "steelblue");

    // Add x-axis
    svg.append("g")
       .attr("transform", `translate(0, ${height - margin.bottom})`)
       .call(d3.axisBottom(x).ticks(10))
       .append("text")
       .attr("class", "axis-label")
       .attr("x", width / 2)
       .attr("y", 40)
       .attr("font-weight", "bold")
       .attr("fill", "black")
       .style("text-anchor", "middle")
       .text("Stage of GW Extraction (%)");

    // Add y-axis
    svg.append("g")
       .attr("transform", `translate(${margin.left}, 0)`)
       .call(d3.axisLeft(y))
       .append("text")
       .attr("class", "axis-label")
       .attr("x", -height / 2)
       .attr("y", -40)
       .attr("font-weight", "bold")
       .attr("transform", "rotate(-90)")
       .attr("fill", "black")
       .style("text-anchor", "middle")
       .text("Number of Districts");
});