d3.csv("gw-maharashtra-2020.csv", d3.autoType).then(data => {
   const width = 500, height = 300, margin = { top: 20, right: 30, bottom: 50, left: 50 };
   const svg = d3.select("#scatter-plot").append("svg")
     .attr("width", width)
     .attr("height", height);
 
   const lowValueThreshold = 1000;
   const highValueThreshold = 200000;
 
   // Filter data within the threshold range
   const filteredData = data.filter(d => 
     d["Annual Extractable Groundwater Resource"] >= lowValueThreshold &&
     d["Total Annual Extraction"] >= lowValueThreshold &&
     d["Annual Extractable Groundwater Resource"] <= highValueThreshold &&
     d["Total Annual Extraction"] <= highValueThreshold
   );
 
   const x = d3.scaleLinear()
     .domain(d3.extent(filteredData, d => d["Annual Extractable Groundwater Resource"]))
     .range([margin.left, width - margin.right]);
 
   const y = d3.scaleLinear()
     .domain(d3.extent(filteredData, d => d["Total Annual Extraction"]))
     .range([height - margin.bottom, margin.top]);
 
   svg.append("g")
     .attr("transform", `translate(0,${height - margin.bottom})`)
     .call(d3.axisBottom(x));
 
   svg.append("g")
     .attr("transform", `translate(${margin.left},0)`)
     .call(d3.axisLeft(y));
 
   // Add text labels
   svg.append("text")
     .attr("x", width / 2)
     .attr("y", height - 10)
     .attr("font-size", 10)
     .attr("font-weight", "bold")
     .style("text-anchor", "middle")
     .text("Annual Extractable Groundwater Resource");
 
   svg.append("text")
     .attr("transform", "rotate(-90)")
     .attr("x", -height / 2)
     .attr("y", 14)
     .attr("font-size", 10)
     .attr("font-weight", "bold")
     .style("text-anchor", "middle")
     .text("Total Annual Extraction");
 
   // Plot circles for filtered data
   svg.selectAll("circle")
     .data(filteredData)
     .enter()
     .append("circle")
     .attr("cx", d => x(d["Annual Extractable Groundwater Resource"]))
     .attr("cy", d => y(d["Total Annual Extraction"]))
     .attr("r", 5)
     .attr("fill", "blue");
 });