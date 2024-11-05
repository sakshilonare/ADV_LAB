
d3.csv("gw-maharashtra-2020.csv", d3.autoType).then(data => {
    const districtData = data[0]; // Example: use the first district’s data

    const sources = [
        { label: "Irrigation", value: districtData["Irrigation - Annual extraction"] },
        { label: "Domestic", value: districtData["Domestic - Annual Extraction"] }
    ];

    const width = 300, height = 300, radius = Math.min(width, height) / 2;
    const svg = d3.select("#pie-chart").append("svg")
                  .attr("width", width)
                  .attr("height", height)
                  .append("g")
                  .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const pie = d3.pie().value(d => d.value);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    svg.selectAll("path")
       .data(pie(sources))
       .enter()
       .append("path")
       .attr("d", arc)
       .attr("fill", d => color(d.data.label));

    svg.selectAll("text")
       .data(pie(sources))
       .enter()
       .append("text")
       .attr("transform", d => `translate(${arc.centroid(d).map(x => x + radius * 0.4)})`)
       .attr("text-anchor", "middle")
       .attr("font-size", 20)
       .text(d => `${d.data.label}: ${d.data.value}`);
});