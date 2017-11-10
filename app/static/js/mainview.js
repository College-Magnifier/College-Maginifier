/*
  Generate class dependencies graph
  Author : Hanfei Lin
  Date: 10/14/2017
*/

vis.mainview = function() {

  var mainview = {};
  var container = null;
  var data = null;
  var header = null;
  var size = [0, 0];
  var margin = {
    left: 10,
    top: 10,
    right: 10,
    bottom: 10
  };
  var dispatch = d3.dispatch('select', 'mouseover', 'mouseout');

  mainview.container = function(_) {
    if (!arguments.length) {
      return container;
    }
    container = _;
    return mainview;
  };

  mainview.data = function(_) {
    if (!arguments.length) {
      return data;
    }
    data = _.data;
    header = _.types;
    otherInfo = _.other_info;
    universities = _.universities;
    return mainview;
  };

  mainview.dispatch = dispatch;

  ///////////////////////////////////////////////////
  // Private Parameters
  var axisMargin = 20;
  var year = "2015";
  var x = null;
  var y = null;
  var xAxis = null;
  var yAxis = null;
  var line = null;
  var voronoi = null;
  var svg = null;
  var tooltip = null;

  color = d3.scaleOrdinal(d3.schemeCategory20);

  ///////////////////////////////////////////////////
  // Public Function

  //calculate
  mainview.layout = function() {

    console.log(data)

    //some calculations
    rankRange = calRankRange();

    //width & height
    // size[0] = parseInt(container.style("width"));
    size[0] = 220 * (Object.keys(header).length) + 4 * axisMargin;
    //size[1] = 60 * (rankRange[1] - rankRange[0]);
    size[1] = parseInt(container.style('height')) * 1.5;

    var types = []
    for (i in Object.keys(header)) {
      types.push(parseInt(Object.keys(header)[i]));
    }

    //x scale & y scale
    x = d3.scaleLinear().domain([d3.min(types), d3.max(types)]).range([
      margin.left + 14 * axisMargin,
      size[0] - margin.right - 2 * axisMargin
    ]);
    y = d3.scaleLinear().domain([rankRange[1], rankRange[0]]).range([
      margin.top + 10 * axisMargin,
      size[1] - margin.bottom
    ]);

    //rank lines
    line = d3.line().x(d => x(d.type)).y(d => y(d.rank));

    //xAxis & yAxis
    xAxis = d3.axisBottom(x).tickFormat(d => header[d]).ticks(data[0].scores[year].length).tickSize(0);

    yAxis = d3.axisLeft(y).ticks().tickSize(0).tickValues(calRankRange());

    //voronoi interaction
    voronoi = d3.voronoi().x(d => x(d.type)).y(d => y(d.rank)).extent([
      [
        margin.left + 9 * axisMargin,
        margin.top + axisMargin
      ],
      [
        size[0] - margin.right,
        size[1] - margin.bottom
      ]
    ]);

    return mainview;
  };

  //render the graph
  mainview.render = function() {

    svg = container.append('svg').attr('width', size[0]).attr('height', size[1]).append('g').attr('transform', 'translate(' + 0 + ',' + 0 + ')');

    //x-Axis
    var xGroup = svg.append('g');
    var xAxisElem = xGroup.append('g').attr('transform', 'translate(' + [10, 0] + ')').attr('class', 'x-axis').call(xAxis);

    //vertical grid line
    xGroup.append('g').selectAll('line').data(x.ticks(data[0].scores[year].length)).enter().append('line').attr('class', 'grid-line').attr('y1', margin.top + axisMargin).attr('y2', size[1] - margin.bottom).attr('x1', d => x(d)).attr('x2', d => x(d));

    //y-Axis
    var yGroup = svg.append('g');
    (function() {
      for (var i = 0; i < data.length; i++) {
        yGroup.append('text').attr('id', 'u' + data[i].name).attr('x', 0).attr('y', y(data[i].scores[year][0].rank)).style('fill', '#555').style('font-size', '10px').style('font-weight', 'bold').text(universities[data[i].name]);
      }
    })();

    //render rank lines
    var lines = svg.append('g').selectAll('path').data(data).enter().append('path').attr('id', function(d) {
      return 'l' + d.name;
    }).attr('class', 'rank-line').attr('d', function(d) {
      d.line = this;
      return line(d.scores[year]);
    }).style('stroke', "grey").style('stroke-width', 0.5).style('opacity', 0.5);

    //render rank points
    for (var i = 0; i < Object.keys(header).length; i++) {
      var Dots = svg.append('g').selectAll('circle').data(data).enter().append('circle').attr('id', function(d) {
        return 's' + d.name;
      }).attr('class', 'end-circle').attr('cx', function(d) {
        if (d.scores[year][i]) {
          return x(d.scores[year][i].type);
        }
      }).attr('cy', function(d) {
        if (d.scores[year][i]) {
          return y(d.scores[year][i].rank);
        }
      }).attr('r', 8).style('fill', d => color(d.name)).style('opacity', 1);
    }

    //tooltip
    tooltip = svg.append('g').attr('transform', 'translate(-100, -100)').attr('class', 'tooltip');

    tooltip.append('circle').attr('r', 8);

    tooltip.append('text').attr('class', 'name').attr('y', -20);

    //interaction: use voronoi graph to seperate mouse domain
    var voronoiGroup = svg.append('g').attr('class', 'voronoi');

    voronoiGroup.selectAll('path').data(voronoi.polygons(d3.merge(data.map(d => d.scores[year])))).enter().append('path').attr('d', function(d) {
      return d
        ? 'M' + d.join('L') + 'Z'
        : null;
    }).on('mouseover', mouseover).on('mouseout', mouseout);

    svg.selectAll('.rank-line').each(d => d.line.parentNode.appendChild(d.line));

    return mainview.update();

  };

  //update the graph
  mainview.update = function() {
    return mainview;
  };

  ///////////////////////////////////////////////////
  // Private Functions

  //calculate maximun range and minimun range
  function calRankRange() {
    var maxRank = 0;
    var minRank = 1000;
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data[i].scores[year].length; j++) {
        if (data[i].scores[year][j].score > maxRank) {
          maxRank = data[i].scores[year][j].rank;
        }
        if (data[i].scores[year][j].score < minRank) {
          minRank = data[i].scores[year][j].rank;
        }
      }
    }
    return [minRank, maxRank];
  }

  //change opacity
  function changeOpacity(id, opa) {
    container.select('#s' + id).style('opacity', opa);
    container.select('#l' + id).style('opacity', opa);
    container.select('#e' + id).style('opacity', opa);
  }

  //mouseover interaction
  function mouseover(d) {

    //update line
    svg.selectAll('.rank-line').style('opacity', 0.5);
    changeOpacity(d.data.name, 1);
    container.select('#l' + d.data.name).style('stroke', color(d.data.name)).style("stroke-width", 5);

    //update tooltip
    tooltip.attr('transform', 'translate(' + x(d.data.type) + ',' + y(d.data.rank) + ')').style('fill', color(d.data.name));

    tooltip.select('text').text(universities[d.data.name] + ' - ' + d.data.score).attr('text-anchor', d.data.type == x.domain()[0]
      ? 'start'
      : 'middle').attr('dx', d.data.type == x.domain()[0]
      ? -10
      : d.data.type == x.domain()[1]
        ? -8 * header[d.data.type].length
        : 0).attr('dy', d.data.rank == 1
      ? 40
      : 0);

    //update x-axis
    svg.select('.x-axis').append('rect').attr('x', x(d.data.type) - 9 * header[d.data.type].length / 2).attr('y', 0).attr('width', 9 * header[d.data.type].length).attr('height', 20).style('fill', 'white');

    svg.select('.x-axis').append('text').text(header[d.data.type]).attr('class', 'tmpText').attr('x', x(d.data.type)).attr('y', 14).attr('font-size', 20).attr('fill', 'steelblue');

    //update y-axis
    svg.select('#u' + d.data.name).style('fill', color(d.data.name));
  }

  //mouseout interaction
  function mouseout(d) {

    //unhighlight line
    changeOpacity(d.data.name, 0.5);
    container.select('#l' + d.data.name).style('stroke', "grey").style("stroke-width", 0.5);

    //remove tooltip
    tooltip.attr('transform', 'translate(-100,-100)');

    //reduct x-axis
    svg.select('.x-axis').selectAll('rect').remove();
    svg.select('.x-axis').select('.tmpText').remove();

    //update y-axis
    svg.select('#u' + d.data.name).style('fill', '#555');
  }

  return mainview;
};
