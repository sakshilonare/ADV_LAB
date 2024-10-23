const margin = { top: 20, right: 30, bottom: 40, left: 50 },
      width = 800 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

const svg = d3.select("#box-plot")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

d3.csv('udemy_courses.csv').then(data => {
    data.forEach(d => {
        d.price = +d.price;
    });

    const nestedData = d3.group(data, d => d.level);
    const boxPlotData = Array.from(nestedData, ([key, values]) => {
        const prices = values.map(d => d.price);
        return {
            level: key,
            Q1: d3.quantile(prices.sort(d3.ascending), 0.25),
            median: d3.quantile(prices.sort(d3.ascending), 0.5),
            Q3: d3.quantile(prices.sort(d3.ascending), 0.75),
            IQR: d3.quantile(prices.sort(d3.ascending), 0.75) - d3.quantile(prices.sort(d3.ascending), 0.25),
            min: d3.min(prices),
            max: d3.max(prices),
        };
    });

    // Set up scales
    const x = d3.scaleBand()
        .domain(boxPlotData.map(d => d.level))
        .range([0, width])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(boxPlotData, d => d.max)]) // Adjust max if necessary
        .nice()
        .range([height, 0]);

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x));

    svg.append("g")
      .call(d3.axisLeft(y));

    // Create box plots
    svg.selectAll(".box")
      .data(boxPlotData)
      .enter().append("rect")
        .attr("class", "box")
        .attr("x", d => x(d.level))
        .attr("y", d => y(d.Q3))
        .attr("height", d => y(d.Q1) - y(d.Q3))
        .attr("width", x.bandwidth())
        .style("fill", "steelblue");

    // Add median lines
    svg.selectAll(".median")
      .data(boxPlotData)
      .enter().append("line")
        .attr("class", "median")
        .attr("x1", d => x(d.level) + x.bandwidth() / 2)
        .attr("x2", d => x(d.level) + x.bandwidth() / 2)
        .attr("y1", d => y(d.median))
        .attr("y2", d => y(d.median) - 10) // Length of the median line
        .style("stroke", "red");

    // Add whiskers
    svg.selectAll(".whisker")
      .data(boxPlotData)
      .enter().append("line")
        .attr("class", "whisker")
        .attr("x1", d => x(d.level) + x.bandwidth() / 2)
        .attr("x2", d => x(d.level) + x.bandwidth() / 2)
        .attr("y1", d => y(d.min))
        .attr("y2", d => y(d.Q1))
        .style("stroke", "black");

    svg.selectAll(".whiskerMax")
      .data(boxPlotData)
      .enter().append("line")
        .attr("class", "whiskerMax")
        .attr("x1", d => x(d.level) + x.bandwidth() / 2)
        .attr("x2", d => x(d.level) + x.bandwidth() / 2)
        .attr("y1", d => y(d.Q3))
        .attr("y2", d => y(d.max))
        .style("stroke", "black");
});
