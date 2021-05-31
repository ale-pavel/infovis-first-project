// main code executed here

var current_line = 'a';
d3.json('../data/multivariate.json')
	.then(function(data) {
			draw_plot(data);
})
	.catch(function(error) {
		console.log(error)
});

function alignStacks(key) {
  let key_list = ['a', 'b', 'c', 'd', 'e'];
  let moveDown = false;
  let key_align_interval = [];
  let i_curr = key_list.indexOf(current_line);
  let i_key = key_list.indexOf(key);

  if (key < current_line) {
    moveDown = false;
    key_align_interval = key_list.slice(i_key, i_curr);
  }
  else if (key > current_line) {
    moveDown = true;
    key_align_interval = key_list.slice(i_curr, i_key);
  }

  moveStacks(key_align_interval, moveDown);
  current_line = key;
};

function moveStacks(keys, moveDown) {
  let datacase_sum_height = [];
  let key_list = ['a', 'b', 'c', 'd', 'e'];

  if (keys.length == 0)
    return;

      //all_rects = d3.selectAll('rect');
      //single_rect = all_rects.filter(function(d) { return (d.attr('data-case') == i && d.attr('key') == key); });

  //sum slice of keys to move by y, then decide if *(-1) based on moveDown
  for (let i = 0; i < 10; i++) {
    datacase_sum_height[i] = 0;
    for (let key of keys) {
      // select the i-th data-case and all of the keys to sum (one by one)
      data_case_attr = "[data-case='"+i+"']";
      key_attr = "[key='"+key+"']";
      single_rect = d3.select(data_case_attr+key_attr);
      datacase_sum_height[i] += parseFloat(single_rect.attr('height'));
    }
    if (!moveDown)
      datacase_sum_height[i] *= -1; 
  }

  for (let i = 0; i < 10; i++) {
    for (let key of key_list) {
      // select the i-th data-case and all of the keys to sum (one by one)
      data_case_attr = "[data-case='"+i+"']";
      key_attr = "[key='"+key+"']";
      single_rect = d3.select(data_case_attr+key_attr);
      current_rect_y = single_rect.attr('y');
      new_rect_y = parseFloat(current_rect_y) + datacase_sum_height[i];
      single_rect.transition().duration(500).attr('y', new_rect_y);
    } 
  }

}


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
    .domain([-100, 150])
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

  //console.log(stackedData);

  // Show the bars
  svg.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .join("g")
      .attr("fill", d => color(d.key))
      .attr('class', d => 'rect-group rect-' + d.key)
      .on("mouseover", function(event, d) {         
        // Reduce opacity of all rect groups
        d3.selectAll('.rect-group').transition().style("opacity", 0.7)  
        // Highlight all rects of this subgroup with opacity 1. It is possible to select them since they have a specific class = their name.
        d3.select('.rect-' + d.key).transition().style("opacity", 1) 
      })
      .on("mouseleave", function(event, d) {        
        // Back to normal opacity: 1
        d3.selectAll('.rect-group').transition().style("opacity", 1) 
      })
      .selectAll("rect")
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data(d => d)
      .join("rect")
        .attr("x", d => x(d.data.id))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth())
        .attr('data-case', d => d.data.id);
        //.on('click', function(e, d) {
        //  curr_y = d3.select(this).attr('y');
        //  curr_h = d3.select(this).attr('height');
        //  d3.select(this).transition().attr('y', +curr_y + +curr_h);
        //});

  // add the key corresponding to multivariate field (like 'a', 'b' etc.)
  d3.selectAll('rect')
    .each(function(d, i) {
      d3.select(this).attr('key', d3.select(this).node().parentNode.classList[1].substring(5,6))
    });

  d3.selectAll('rect')
    .on('click', function(e, d) {
      clicked_group = d3.select(this)
      key = clicked_group.node().parentNode.classList[1].substring(5,6);
      alignStacks(key);
    });

};
