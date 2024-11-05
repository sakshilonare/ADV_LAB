
// Load the data from the CSV file
d3.csv("gw-maharashtra-2020.csv", d3.autoType).then(data => {

    const margin = { top: 40, right: 20, bottom: 60, left: 60 },
        width = 500 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    // Append SVG to the chart div
    const svg = d3.select("#sbar-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);


    // Define subgroups (seasonal recharges) and groups (districts)
    const subgroups = ["Monsoon season recharge from rainfall", "Monsoon season recharge from other sources",
        "Non-monsoon season recharge from rainfall", "Non-monsoon season recharge from other sources"];
    const districts = data.map(d => d["Name of District"]);
    const lowValueThreshold = 1000; // Adjust threshold values as needed
    const highValueThreshold = 500000;

    // Filter data based on thresholds
    const filteredData = data.filter(d => {
        const totalRecharge = d["Monsoon season recharge from rainfall"] +
            d["Monsoon season recharge from other sources"] +
            d["Non-monsoon season recharge from rainfall"] +
            d["Non-monsoon season recharge from other sources"];
        return totalRecharge >= lowValueThreshold && totalRecharge <= highValueThreshold;
    });

    // Create a color scale for the different recharge types
    const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(["#4CAF50", "#8BC34A", "#FF9800", "#FF5722"]);

    // Set up the x-axis
    const x = d3.scaleBand()
        .domain(districts)
        .range([0, width])
        .padding([0.2]);

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickSize(0))
        .selectAll("text")
        .attr("font-size", 8)
        .style("text-anchor", "end")
        .attr("dx",
            "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");


    // Set up the y-axis based on filtered data
    const y = d3.scaleLinear()
        .domain([0, d3.max(filteredData, d =>
            d["Monsoon season recharge from rainfall"] +
            d["Monsoon season recharge from other sources"] +
            d["Non-monsoon season recharge from rainfall"] +
            d["Non-monsoon season recharge from other sources"]
        ) * 1.1])
        .nice()
        .range([height, 0]);

    svg.append("g").call(d3.axisLeft(y));

    // Stack the filtered data
    const stackedData = d3.stack()
        .keys(subgroups)
        (filteredData);

    // Add bars for each stacked segment
    svg.append("g")
        .selectAll("g")
        .data(stackedData)
        .join("g")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("x", d => x(d.data["Name of District"]))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth());

    // Add a legend
    const legend = svg.selectAll(".legend")
        .data(subgroups)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(0,${i * 20})`);

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .attr("font-size", 10)
        .style("text-anchor", "end")
        .text(d => d);

    // Add axis labels
    svg.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 10})`)
        .style("text-anchor", "middle")
        .attr("font-size", 10)
        .attr("font-weight", "bold")
        .text("Districts");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("font-size", 10)
        .attr("font-weight", "bold")
        .style("text-anchor", "middle")
        .text("Groundwater Recharge (Million Cubic Meters)");

});