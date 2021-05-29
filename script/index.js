// main code executed here
d3.json('../data/multivariate.json')
	.then(function(data) {
			draw_plot(data);
})
	.catch(function(error) {
		console.log(error)
});


function draw_plot(data) {
	// set the dimensions and margins of the graph
	const margin = {top: 10, right: 30, bottom: 20, left: 50},
	    width = 660 - margin.left - margin.right,
	    height = 600 - margin.top - margin.bottom;

	// append the svg object to the body of the page
	const svg = d3.select("#my_dataviz")
	  .append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", `translate(${margin.left},${margin.top})`);

  // List of subgroups = header of the csv files = soil condition here
  const subgroups = ['a', 'b', 'c', 'd', 'e'];

  // Add X axis
  const x = d3.scaleBand()
      .domain(d3.range(0, 10, 1))
      .range([0, width])
      .padding([0.2])
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickSizeOuter(0));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, 150])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // color palette = one color per subgroup
  const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd"])

  //stack the data? --> stack per subgroup
  const stackedData = d3.stack()
    .keys(subgroups)
    (data)

  console.log(stackedData);

  // Show the bars
  svg.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .join("g")
      .attr("fill", d => color(d.key))
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(d => d)
      .join("rect")
        .attr("x", d => x(d.data.id))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth())
};
