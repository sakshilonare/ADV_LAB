d3.csv("gw-maharashtra-2020.csv", d3.autoType).then(data => {
    // Set up SVG dimensions
    const width = 500;
    const height = 300;
    const margin = { top: 40, right: 20, bottom: 100, left: 80 };
    const lowValueThreshold = 1000;
    const highValueThreshold = 200000;

    // Select the chart container and set up SVG
    const svg = d3.select("#bar-chart")
                  .append("svg")
                  .attr("width", width)
                  .attr("height", height);

    // Define the scales
    const x = d3.scaleBand()
                .domain(data.map(d => d["Name of District"]))
                .range([margin.left, width - margin.right])
                .padding(0.1);

    const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => Math.min(highValueThreshold, d["Total Annual Extraction"]))])
                .nice()
                .range([height - margin.bottom, margin.top]);

    // Append the bars to the SVG
    svg.selectAll(".bar")
       .data(data)
       .enter()
       .append("rect")
       .attr("class", "bar")
       .attr("x", d => x(d["Name of District"]))
       .attr("y", d => y(d["Total Annual Extraction"]))
       .attr("width", x.bandwidth())
       .attr("height", d => height - margin.bottom - y(d["Total Annual Extraction"]))
       .attr("fill", "#FF5722");

    // Add x-axis and label
    svg.append("g")
       .attr("transform", `translate(0, ${height - margin.bottom})`)
       .call(d3.axisBottom(x))
       .selectAll("text")
       .attr("font-size", 8)
       .attr("transform", "rotate(-45)")
       .style("text-anchor", "end")
       .attr("dx", "-0.8em")
       .attr("dy", "0.15em");

    svg.append("text")
       .attr("class", "axis-label")
       .attr("x", width / 2)
       .attr("y", height - 10)
       .attr("font-size", 10)
       .attr("font-weight", "bold")
       .style("text-anchor", "middle")
       .text("District");

    // Add y-axis and label
    svg.append("g")
       .attr("transform", `translate(${margin.left}, 0)`)
       .attr("font-size", 8)
       .call(d3.axisLeft(y));

    svg.append("text")
       .attr("class", "axis-label")
       .attr("x", -height / 2)
       .attr("y", 20)
       .attr("transform", "rotate(-90)")
       .attr("font-size", 10)
       .attr("font-weight", "bold")
       .style("text-anchor", "middle")
       .text("Total Annual Extraction (Million Cubic Meters)");
});