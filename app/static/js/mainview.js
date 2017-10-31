/*
	Generate class dependencies graph
	Author : Hanfei Lin
	Date: 10/14/2017
*/

vis.mainview = function(){

	var mainview = {},
		container = null,
		data = null,
		header = null,
		size = [0, 0],
	 	margin = {left:10, top:10, right:10, bottom:10},
		dispatch = d3.dispatch("select", "mouseover", "mouseout");

	mainview.container = function(_) {
		if (!arguments.length) return container;
		container = _;
		return mainview;
	};

	mainview.data = function(_) {
		if (!arguments.length) return data;
		data = _.data;
		header = _.header;
		return mainview;
	};

	mainview.dispatch = dispatch;

	///////////////////////////////////////////////////
	// Private Parameters
  var axisMargin = 20,
			x = null,
			y = null,
			xAxis = null,
			yAxis = null,
			line = null,
			voronoi = null,
			svg = null,
			tooltip = null,
			nameMapId = {};
			color = d3.scaleOrdinal(d3.schemeCategory20);

	///////////////////////////////////////////////////
	// Public Function

	//calculate
	mainview.layout = function() {

		//some calculations
		rankRange = calRankRange();
		for (var i = 0; i < data.length; i++){
				nameMapId[data[i].Name] = i;
		}

		//width & height
		// size[0] = parseInt(container.style("width"));
		size[0] = 80 * (header.length - 3) + 4 * axisMargin;
		// size[1] = 3 * (rankRange[1] - rankRange[0]);
		size[1] = parseInt(container.style("height"));

		//x scale & y scale
		x = d3.scaleLinear().domain([3, header.length - 1])
				.range([margin.left + 9 * axisMargin, size[0] - margin.right - 2 * axisMargin]);
		y = d3.scaleLog().domain([rankRange[0], rankRange[1]])
				.range([margin.top + axisMargin, size[1] - margin.bottom]);

		//rank lines
		line = d3.line()
					.x(d => x(d.type))
					.y(d => y(d.rank))

		//xAxis & yAxis
		xAxis = d3.axisBottom(x)
				.tickFormat(d3.format("d"))
				.ticks(data[0].ranks.length)
				.tickSize(0);
		yAxis = d3.axisLeft(y)
				.ticks()
				.tickSize(0)
				.tickValues(calRankRange())

		//voronoi interaction
		voronoi = d3.voronoi()
				.x(d => x(d.type))
				.y(d => y(d.rank))
				.extent([[- margin.left / 2, - margin.top / 2], [size[0] + margin.right / 2, size[1] + margin.bottom / 2]]);

		return mainview;
	};

	//render the graph
	mainview.render = function() {

		svg = container.append("svg")
			.attr("width", size[0] - margin.left - margin.right)
			.attr("height", size[1] - margin.top - margin.bottom)
			.append("g").attr("transform", "translate(" + 0 + "," + margin.top + ")");

		//x-Axis
		var xGroup = svg.append("g");
    var xAxisElem = xGroup.append("g")
      .attr("transform", "translate(" + [0, 0] + ")")
      .attr("class", "x-axis")
      .call(xAxis);

		//vertical grid line
    xGroup.append("g").selectAll("line")
      	.data(x.ticks(data[0].ranks.length))
      	.enter().append("line")
      	.attr("class", "grid-line")
      	.attr("y1", margin.top + axisMargin)
      	.attr("y2", size[1] - margin.bottom)
      	.attr("x1", d => x(d))
      	.attr("x2", d => x(d));

		//y-Axis
    var yGroup = svg.append("g")
		for (var i = 0; i < data.length; i++){
			yGroup.append("text")
				.attr("x", 0)
				.attr("y", y(data[i].ranks[0].rank))
				.style('fill', "#555")
				.style('font-size', '10px')
				.style('font-weight', 'bold')
				.text(data[i].Name);
		}

		//render rank lines
	  var lines = svg.append("g")
	      .selectAll("path")
	      .data(data)
	      .enter().append("path")
				.attr("id", function(d){
					return "l" + nameMapId[d.Name];
				})
	      .attr("class", "rank-line")
	      .attr("d", function(d) {d.line = this; return line(d.ranks)})
	      .style("stroke", d => color(d.Name))
	      .style("stroke-width", 6)
	      .style("opacity", 0.1)

		var startDots = svg.append("g")
				.selectAll("circle")
				.data(data)
				.enter().append("circle")
				.attr("id", function(d){
					return "s" + nameMapId[d.Name];
				})
				.attr("class", "end-circle")
				.attr("cx", d => x(d.ranks[0].type))
				.attr("cy", d => y(d.ranks[0].rank))
				.attr("r", 8)
				.style("fill", d => color(d.Name))
				.style("opacity", 0.1)

		var endDots = svg.append("g")
	      .selectAll("circle")
	      .data(data)
	      .enter().append("circle")
				.attr("id", function(d){
					return "e" + nameMapId[d.Name];
				})
	      .attr("class", "end-circle")
	      .attr("cx", d => x(d.ranks[d.ranks.length - 1].type))
	      .attr("cy", d => y(d.ranks[d.ranks.length - 1].rank))
	      .attr("r", 8)
	      .style("fill", d => color(d.Name))
	      .style("opacity", 0.1)

		//tooltip
		tooltip = svg.append("g")
			  .attr("transform", "translate(-100, -100)")
				.attr("class", "tooltip");

		tooltip.append("circle")
				.attr("r", 8);

		tooltip.append("text")
				.attr("class", "name")
				.attr("y", -20);

		//interaction: use voronoi graph to seperate mouse domain
		var voronoiGroup = svg.append("g")
			.attr("class", "voronoi");

		voronoiGroup.selectAll("path")
			.data(voronoi.polygons(d3.merge(data.map(d => d.ranks))))
			.enter().append("path")
				.attr("d", function(d) { return d ? "M" + d.join("L") + "Z" : null; })
				.on("mouseover", mouseover)
				.on("mouseout", mouseout);

		svg.selectAll(".rank-line")
      	.each(d => d.line.parentNode.appendChild(d.line));

		return mainview.update();
		
	};

	//update the graph
	mainview.update = function() {
		return mainview;
	};

	///////////////////////////////////////////////////
	// Private Functions

	//calculate maximun range and minimun range
	function calRankRange(){
			var maxRank = 0, minRank = 1000;
			for (var i = 0; i < data.length; i++){
				 for (var j = 0; j < data[i].ranks.length; j++){
						 if (data[i].ranks[j].rank > maxRank){
								maxRank = data[i].ranks[j].rank;
						 }
						 if (data[i].ranks[j].rank < minRank){
								minRank = data[i].ranks[j].rank;
						 }
					}
			 }
			 return [minRank, maxRank];
	 }

	 //change opacity
	 function changeOpacity(id, opa){
		 container.select("#s" + id).style("opacity", opa);
		 container.select("#l" + id).style("opacity", opa);
		 container.select("#e" + id).style("opacity", opa);
	 }

	 //mouseover interaction
	 function mouseover(d) {
		 svg.selectAll(".rank-line").style("opacity", 0.1);
		 changeOpacity(nameMapId[d.data.Name], 1);
		 tooltip.attr("transform", "translate(" + x(d.data.type) + "," + y(d.data.rank) + ")")
			 .style("fill", color(d.data.Name))
		 tooltip.select("text").text(d.data.Name + " - " + d.data.rank)
			 .attr("text-anchor", d.data.type == x.domain()[0] ? "start" : "middle")
			 .attr("dx", d.data.type == x.domain()[0] ? -10 : 0)
	 }

	 //mouseout interaction
	 function mouseout(d) {
		 changeOpacity(nameMapId[d.data.Name], 0.1);
		 tooltip.attr("transform", "translate(-100,-100)");
	 }

	return mainview;
};
