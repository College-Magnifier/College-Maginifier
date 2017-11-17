/*
  Generate class dependencies graph
  Author : Hanfei Lin
  Date: 10/14/2017
*/

vis.mainview = function() {

  var mainview = {};
  var container = null;
  var data = null;
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
    return mainview;
  };

  mainview.dispatch = dispatch;

  ///////////////////////////////////////////////////
  // Private Parameters

  var dataTest = [
    [120, ["like", "call response", "dramatic intro", "has breaks", "male vocalist", "silly", "swing"]],
    [150, ["brassy", "like", "calm energy", "female vocalist", "swing", "fun"]],
    [170, ["calm energy", "instrumental", "swing", "like", "happy"]],
    [140, ["has breaks", "male vocalist", "swing", "piano", "banjo", "chill"]],
    [160, ["calm energy", "instrumental", "swing", "like", "interesting"]],
    [140, ["brassy", "like", "energy", "dramatic intro", "male vocalist", "baseball", "swing"]],
    [170, ["instrumental", "interesting", "high energy", "like", "swing"]],
    [140, ["instrumental", "energy", "like", "swing"]],
    [200, ["instrumental", "brassy", "dramatic intro", "like", "swing"]],
    [160, ["male vocalist", "brassy", "swing", "like", "my favorites"]],
    [130, ["like", "interesting", "dramatic intro", "male vocalist", "silly", "swing", "gospel"]],
    [160, ["like", "long intro", "announcer", "energy", "swing", "female vocalist"]],
    [170, ["instrumental", "swing", "bass", "like"]],
    [150, ["like", "interesting", "has breaks", "instrumental", "chunky", "swing", "banjo", "trumpet"]],
    [170, ["like", "has breaks", "male vocalist", "silly", "swing", "banjo"]],
    [190, ["instrumental", "banjo", "swing"]],
    [130, ["instrumental", "brassy", "banjo", "like", "swing"]],
    [160, ["brassy", "like", "energy", "instrumental", "big band", "jam", "swing"]],
    [150, ["like", "male vocalist", "live", "swing", "piano", "banjo", "chill"]],
    [150, ["like", "trick ending", "instrumental", "chunky", "swing", "chill"]],
    [120, ["brassy", "like", "female vocalist", "swing", "chill", "energy buildup"]],
    [150, ["brassy", "like", "interesting", "instrumental", "swing", "piano"]],
    [190, ["brassy", "like", "long intro", "energy", "baseball", "swing", "female vocalist"]],
    [180, ["calm energy", "female vocalist", "live", "like", "swing"]],
    [200, ["banjo", "like", "long intro", "interesting", "energy", "my favorites", "male vocalist", "silly", "swing", "fun", "balboa"]],
    [150, ["brassy", "calm energy", "chunky", "instrumental", "old-timey", "live", "swing"]],
    [160, ["like", "call response", "interesting", "instrumental", "calm energy", "swing"]],
    [180, ["interesting", "swing", "fast", "male vocalist"]],
    [150, ["calm energy", "chunky", "swing", "female vocalist", "like"]],
    [180, ["like", "has breaks", "male vocalist", "chunky", "silly", "swing"]],
    [140, ["instrumental", "brassy", "dramatic intro", "swing", "chill"]],
    [150, ["male vocalist", "trumpet", "like", "swing"]],
    [150, ["instrumental", "energy", "like", "has breaks", "swing"]],
    [180, ["brassy", "like", "energy", "has breaks", "instrumental", "has calm", "swing"]],
    [150, ["female vocalist", "swing"]],
    [170, ["instrumental", "brassy", "energy", "swing"]],
    [170, ["calm energy", "instrumental", "energy", "like", "swing"]],
    [190, ["brassy", "like", "instrumental", "high energy", "swing", "trumpet"]],
    [160, ["male vocalist", "energy", "swing", "old-timey"]],
    [170, ["like", "oldies", "my favorites", "fast", "male vocalist", "high energy", "swing"]]
  ];

  var outer = d3.map(),
    inner = [],
    links = [];

  var link_width = "1px";

  var colors = ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695"]
  var color = d3.scale.linear()
    .domain([60, 220])
    .range([colors.length - 1, 0])
    .clamp(true);

  var diameter = 700;
  var rect_width = 120;
  var rect_height = (diameter - 150) / dataTest.length;

  var inner_y,
    outer_x,
    outer_y,
    bar_x;


  ///////////////////////////////////////////////////
  // Public Function

  //calculate
  mainview.layout = function() {

    size[0] = parseInt(container.style("width"));
    size[1] = parseInt(container.style("height"));

    diameter = size[1] - margin.top - margin.bottom;

    var outerId = 0;

    //preprocessing
    dataTest.forEach(function(d) {

      if (d == null)
        return;

      //inner items
      innerItem = {
        id: 'i' + inner.length,
        name: d[0],
        related_links: []
      };

      innerItem.related_nodes = [innerItem.id];
      inner.push(innerItem);

      //cast to array
      if (!Array.isArray(d[1]))
        d[1] = [d[1]];

      d[1].forEach(function(d1) {

        //outer items
        outerItem = outer.get(d1);

        if (outerItem == null) {
          outerItem = {
            name: d1,
            id: 'o' + outerId,
            related_links: []
          };

          outerItem.related_nodes = [outerItem.id];
          outerId = outerId + 1;
          outer.set(d1, outerItem);
        }

        // create the links
        ioLink = {
          id: 'l-' + innerItem.id + '-' + outerItem.id,
          inner: innerItem,
          outer: outerItem
        }
        links.push(ioLink);

        // and the relationships
        innerItem.related_nodes.push(outerItem.id);
        innerItem.related_links.push(ioLink.id);
        outerItem.related_nodes.push(innerItem.id);
        outerItem.related_links.push(ioLink.id);
      });
    });

    dataTest = {
      inner: inner,
      outer: outer.values(),
      links: links
    }

    //reorder outerItems
    outer = dataTest.outer;
    dataTest.outer = Array(outer.length);

    var i1 = 0;
    var i2 = outer.length - 1;

    for (var i = 0; i < dataTest.outer.length; ++i) {
      if (i % 2 == 1)
        dataTest.outer[i2--] = outer[i];
      else
        dataTest.outer[i1++] = outer[i];
    }

    //
    var il = dataTest.inner.length;
    var ol = dataTest.outer.length;

    //scale
    inner_y = d3.scale.linear()
      .domain([0, il])
      .range([-(il * rect_height) / 2, (il * rect_height) / 2]);

    outer_x = d3.scale.linear()
      .domain([0, dataTest.outer.length])
      .range([200, 340]);

    outer_y = d3.scale.linear()
      .domain([0, dataTest.outer.length])
      .range([0, diameter / 2 - 120]);

    //scale for bar chart
    bar_x = d3.scale.linear()
      .domain([0, 100])
      .range([0, 200]);

    // setup positioning
    dataTest.outer = dataTest.outer.map(function(d, i) {
      d.x = outer_x(i);
      d.y = diameter / 3;
      return d;
    });

    dataTest.inner = dataTest.inner.map(function(d, i) {
      d.x = -(rect_width / 2) + 80;
      d.y = inner_y(i);
      return d;
    });

    console.log(dataTest)

    return mainview;
  }

  mainview.render = function() {

    function get_color(name) {
      var c = Math.round(color(name));
      if (isNaN(c))
        return '#dddddd'; // fallback color

      return colors[c];
    }

    function projectX(x) {
      return ((x - 90) / 180 * Math.PI) - (Math.PI / 2);
    }

    var diagonal = d3.svg.diagonal()
      .source(function(d) {
        return {
          "x": d.outer.y * Math.cos(projectX(d.outer.x)),
          "y": -d.outer.y * Math.sin(projectX(d.outer.x))
        };
      })
      .target(function(d) {
        return {
          "x": d.inner.y + rect_height / 2,
          "y": d.outer.x > 180 ? d.inner.x : d.inner.x + rect_width
        };
      })
      .projection(function(d) {
        return [d.y, d.x];
      });

    var svg = container.append("svg")
      .attr("width", size[0] - margin.left - margin.right)
      .attr("height", diameter)
      .append("g")
      .attr("transform", "translate(" + (diameter / 2 + 50) + "," + diameter / 2 + ")");


    //pie
    var arcPath = d3.svg.arc()
      .innerRadius(200)
      .outerRadius(220)

    var dataset = [

      {
        startAngle: Math.PI * 10 / 9,
        endAngle: Math.PI * 1.2
      },
      {
        startAngle: Math.PI * 1.2,
        endAngle: Math.PI * 1.5
      },
      {
        startAngle: Math.PI * 1.5,
        endAngle: Math.PI * 1.8
      },
      {
        startAngle: Math.PI * 1.8,
        endAngle: Math.PI * 34 / 18
      }
    ]
    var color2 = d3.scale.category20();

    var arcs = svg.append("g").selectAll("path")
      .data(dataset)
      .enter()
      .append("path")
      .attr("d", function(d) {
        return arcPath(d)
      }) // 生成弧
      .attr("fill", function(d, i) {
        return color2(i * 3)
      })
      .attr("opacity", 0.2)


    // links
    var link = svg.append('g').attr('class', 'links').selectAll(".link")
      .data(dataTest.links)
      .enter().append('path')
      .attr('class', 'link')
      .attr('id', function(d) {
        return d.id
      })
      .attr("d", diagonal)
      .attr('stroke', function(d) {
        return "#aaa";
      })
      .attr('stroke-width', link_width)
      .attr("opacity", 0.4)


    // outer nodes

    var onode = svg.append('g').selectAll(".outer_node")
      .data(dataTest.outer)
      .enter().append("g")
      .attr("class", "outer_node")
      .attr("transform", function(d) {
        return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
      })
      .on("mouseover", mouseoverOnode)
      .on("mouseout", mouseout);

    onode.append("circle")
      .attr('id', function(d) {
        return d.id
      })
      .attr("r", 4.5)
      .attr("opacity", 0.5)

    onode.append("circle")
      .attr('r', 20)
      .attr('visibility', 'hidden');

    onode.append("text")
      .attr('id', function(d) {
        return d.id + '-txt';
      })
      .attr("dy", ".31em")
      .attr("text-anchor", function(d) {
        return d.x < 180 ? "start" : "end";
      })
      .attr("transform", function(d) {
        return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)";
      })
      .text(function(d) {
        return d.name;
      });

    // inner nodes

    var inode = svg.append('g').selectAll(".inner_node")
      .data(dataTest.inner)
      .enter().append("g")
      .attr("class", "inner_node")
      .attr("transform", function(d, i) {
        return "translate(" + d.x + "," + d.y + ")"
      })
      .on("mouseover", mouseoverInode)
      .on("mouseout", mouseout);

    inode.append('rect')
      .attr('width', rect_width)
      .attr('height', rect_height)
      .attr('id', function(d) {
        return d.id;
      })
      .attr('fill', function(d) {
        return get_color(d.name);
      }).attr("stroke", "white")
      .attr("stroke-width", 2)

    inode.append("text")
      .attr('id', function(d) {
        return d.id + '-txt';
      })
      .attr('text-anchor', 'middle')
      .attr("transform", "translate(" + rect_width / 2 + ", " + rect_height * .75 + ")")
      .text(function(d) {
        return d.name;
      });

    //bar chart
    var rects = svg.append('g').selectAll(".rect")
      .data(dataTest.inner)
      .enter()
      .append("rect")
      .attr("id", d => "b" + d.id)
      .attr("class", "bar")
      .attr("x", function(d, i) {
        return bar_x(0);
      })
      .attr("y", function(d, i) {
        return inner_y(i);
      })
      .attr("width", function(d, i) {
        return bar_x(i / dataTest.inner.length * 100)
      })
      .attr("height", function(d) {
        return rect_height;
      })
      .attr("transform", "translate(" + (-(rect_width / 2) + rect_width + 100) + "," + 0 + ")")
      .attr("fill", d => get_color(d.name))
      .attr("stroke", "#fff")
      .attr("stroke-width", 1)
      .attr("opacity", 0)

    var texts = svg.append('g').selectAll(".barText")
      .data(dataTest.inner)
      .enter()
      .append("text")
      .attr("id", d => "t" + d.id)
      .attr("class", "barText")

      .attr("x", function(d, i) {
        return bar_x(i / dataTest.inner.length * 100) + 150;
      })
      .attr("y", function(d, i) {
        return inner_y(i);
      })
      .attr("dx", function() {
        return 20;
      })
      .attr("dy", function(d) {
        return 20;
      })
      .text(function(d, i) {
        return i / dataTest.inner.length * 100;
      }).style("opacity", 0)

    var title = svg.append('g')
      .append("text")
      .attr("class", "title")
      .text("none")
      .attr("transform", "translate(" + (-(rect_width / 2) + rect_width + 100) + "," + -(inner_y(dataTest.inner.length) + 10) + ")")
      .style("opacity", 0)

    var xAxis = d3.svg.axis()
      .scale(bar_x)
      .orient("bottom")
      .tickValues([0, 20, 40, 60, 80, 100]);

    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + (-(rect_width / 2) + rect_width + 100) + "," + (inner_y(dataTest.inner.length) + 10) + ")")
      .call(xAxis)
      .attr("opacity", 0)

    //rank chart
    

    // need to specify x/y/etc

    // d3.select(self.frameElement).style("height", diameter - 150 + "px");

    return mainview;
  }

  mainview.update = function() {

    return mainview;
  }

  //private function
  function mouseoverOnode(d) {
    // bring to front
    container.selectAll('.links .link').sort(function(a, b) {
      return d.related_links.indexOf(a.id);
    });

    for (var i = 0; i < d.related_nodes.length; i++) {
      container.select('#' + d.related_nodes[i]).classed('highlight', true);
      container.select('#' + d.related_nodes[i] + '-txt').attr("font-weight", 'bold');

      container.select('#b' + d.related_nodes[i]).transition()
        .duration(700)
        .ease("linear")
        .attr("opacity", 1)

      container.select('#t' + d.related_nodes[i]).transition()
        .duration(700)
        .style("opacity", 1)

    }

    container.select(".axis").classed('highlight', true);

    container.select(".title").style('opacity', 1);

    for (var i = 0; i < d.related_links.length; i++)
      container.select('#' + d.related_links[i]).attr('stroke-width', '3px').attr("stroke", "#596D78").attr("opacity", 1);
  }

  function mouseoverInode(d) {
    // bring to front
    container.selectAll('.links .link').sort(function(a, b) {
      return d.related_links.indexOf(a.id);
    });

    for (var i = 0; i < d.related_nodes.length; i++) {
      container.select('#' + d.related_nodes[i]).classed('highlight', true);
      container.select('#' + d.related_nodes[i] + '-txt').attr("font-weight", 'bold');

    }

    for (var i = 0; i < d.related_links.length; i++)
      container.select('#' + d.related_links[i]).attr('stroke-width', '3px').attr("stroke", "#596D78").attr("opacity", 1);
  }

  function mouseout(d) {
    for (var i = 0; i < d.related_nodes.length; i++) {
      container.select('#' + d.related_nodes[i]).classed('highlight', false);
      container.select('#b' + d.related_nodes[i]).classed('highlight', false);
      container.select('#' + d.related_nodes[i] + '-txt').attr("font-weight", 'normal');

      container.select('#b' + d.related_nodes[i]).transition()
        .duration(200)
        .ease("linear")
        .attr("opacity", 0)

      container.select('#t' + d.related_nodes[i]).transition()
        .duration(200)
        .style("opacity", 0)
    }

    container.select(".title").text(d.name).style('opacity', 0);
    container.select(".axis").classed('highlight', false);

    for (var i = 0; i < d.related_links.length; i++)
      d3.select('#' + d.related_links[i]).attr('stroke-width', link_width).attr("stroke", "#aaa").attr("opacity", 0.4);;
  }

  return mainview;
};
