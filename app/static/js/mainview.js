/*
  Subject Magnifier
  Author : Hanfei Lin
  Date: 10/14/2017
*/

vis.mainview = function() {

  ///////////////////////////////////////////////////
  // Public Parameters

  var mainview = {},
    container = null,
    data = null,
    size = [0, 0],
    margin = {
      left: 10,
      top: 10,
      right: 10,
      bottom: 10
    };

  var dispatch = d3.dispatch('select', 'mouseover', 'mouseout');
  mainview.dispatch = dispatch;

  ///////////////////////////////////////////////////
  // Private Parameters

  var outer = d3.map(),
    inner = [],
    links = [],
    subject = [];

  var link_width = '1px';

  var color20 = d3.scale.category20();

  var diameter = 700;
  var rect_width = 120;
  var rect_height = 0;

  var inner_y,
    outer_x,
    outer_y,
    bar_x;

  ///////////////////////////////////////////////////
  // Public Function

  // set up container
  mainview.container = function(_) {
    if (!arguments.length) {
      return container;
    }
    container = _;
    return mainview;
  };

  // set up data
  mainview.data = function(_) {
    if (!arguments.length) {
      return data;
    }
    data = _;
    return mainview;
  };

  //calculation
  mainview.layout = function() {

    outer = d3.map(),
      inner = [],
      links = [],
      subject = [];

    size[0] = parseInt(container.style('width'));
    size[1] = parseInt(container.style('height'));

    diameter = size[1] - margin.top - margin.bottom;

    rect_height = (diameter - 150) / data.length;

    var outerId = 0;

    //preprocessing
    data.forEach(function(d) {

      if (d == null)
        return;

      //inner items
      innerItem = {
        id: 'i' + inner.length,
        uid: d["id"],
        abbr: d['abbr'],
        university: d['university'],
        subjects: d['subjects'],
        related_links: [],
        selected: false
      };

      innerItem.related_nodes = [innerItem.id];
      inner.push(innerItem);

      //cast to array
      if (!Array.isArray(d['subjects']))
        d['subjects'] = [d['subjects']];

      d['subjects'].forEach(function(d1) {

        outerItem = outer.get(d1['subject']);

        if (outerItem == null) {

          outerItem = {
            name: d1['subject'],
            type: d1['type'],
            id: 'o' + outerId,
            related_links: []
          };

          outerItem.related_nodes = [outerItem.id];
          outerId = outerId + 1;
          outer.set(d1['subject'], outerItem);
        }

        // create the links
        ioLink = {
          id: 'l-' + innerItem.id + '-' + outerItem.id,
          inner: innerItem,
          outer: outerItem
        };
        links.push(ioLink);

        // and the relationships
        innerItem.related_nodes.push(outerItem.id);
        innerItem.related_links.push(ioLink.id);
        outerItem.related_nodes.push(innerItem.id);
        outerItem.related_links.push(ioLink.id);
      });
    });

    data = {
      inner: inner,
      outer: outer.values(),
      links: links
    };

    //reorder outerItems
    outer = data.outer;
    data.outer = Array(outer.length);

    var i1 = 0;
    var i2 = outer.length - 1;

    outer.sort(createCompareFunction('type'));

    outer.forEach(function(d) {
      if (subject.hasOwnProperty(d['type'])) {
        if (subject[d['type']].indexOf(d['name']) < 0) {
          subject[d['type']].push(d['name']);
        }
      } else {
        subject[d['type']] = [];
        subject[d['type']].push(d['name']);
      }
    });

    data.outer = outer;

    //
    var il = data.inner.length;
    var ol = data.outer.length;

    //scale
    inner_y = d3.scale.linear().domain([0, il]).range([-(il * rect_height) / 2,
      il * rect_height / 2
    ]);

    outer_x = d3.scale.linear().domain([0, data.outer.length]).range([200, 340]);

    outer_y = d3.scale.linear().domain([0, data.outer.length]).range([
      0, diameter / 2 - 120
    ]);

    //scale for bar chart
    bar_x = d3.scale.linear().domain([0, 100]).range([0, 200]);

    // setup positioning
    data.outer = data.outer.map(function(d, i) {
      d.x = outer_x(i);
      d.y = diameter / 3;
      return d;
    });

    data.inner = data.inner.map(function(d, i) {
      d.x = -(rect_width / 2) + 80;
      d.y = inner_y(i);
      return d;
    });

    return mainview;
  };

  // render
  mainview.render = function() {

    function get_color(name) {
      var c = Math.round(color20(name));
      if (isNaN(c)) {
        return '#dddddd'; // fallback color
      }

      return colors[c];
    }

    function projectX(x) {
      return (x - 90) / 180 * Math.PI - Math.PI / 2;
    }

    var diagonal = d3.svg.diagonal().source(function(d) {
      return {
        'x': d.outer.y * Math.cos(projectX(d.outer.x)),
        'y': -d.outer.y * Math.sin(projectX(d.outer.x))
      };
    }).target(function(d) {
      return {
        'x': d.inner.y + rect_height / 2,
        'y': d.outer.x > 180 ?
          d.inner.x :
          d.inner.x + rect_width
      };
    }).projection(function(d) {
      return [d.y, d.x];
    });

    var svg = container.append('svg').attr('width', size[0] - margin.left - margin.right).attr('height', diameter).append('g').attr('transform', 'translate(' + (diameter / 2 + 80) + ',' + diameter / 2 + ')');

    //arc
    var arcPath = d3.svg.arc().innerRadius(200).outerRadius(220);

    var arcData = [];
    var lastStart = 10 / 9 * Math.PI;

    for (i in subject) {
      item = {
        startAngle: lastStart,
        endAngle: subject[i].length / data.outer.length * 7 / 9 * Math.PI + lastStart,
        name: i
      };
      arcData.push(item);
      lastStart = subject[i].length / data.outer.length * 7 / 9 * Math.PI + lastStart;
    }

    // var c = d3.scale.category20();

    var arcs = svg.append('g').selectAll('path').data(arcData).enter().append('path').attr('d', function(d) {
      return arcPath(d);
    }).attr('fill', function(d) {
      return typeColor(d['name'], 'outer');
    });

    // links
    var link = svg.append('g').attr('class', 'links').selectAll('.link').data(data.links).enter().append('path').attr('class', 'link').attr('id', function(d) {
      return d.id;
    }).attr('d', diagonal).attr('stroke', function(d) {
      return '#aaa';
    }).attr('stroke-width', link_width).attr('opacity', 0.2);

    // outer nodes

    var onode = svg.append('g').selectAll('.outer_node').data(data.outer).enter().append('g').attr('class', 'outer_node').attr('transform', function(d) {
      return 'rotate(' + (d.x - 90) + ')translate(' + d.y + ')';
    }).on('mouseover', mouseoverOnode).on('mouseout', mouseoutOnode);

    onode.append('circle').attr('id', function(d) {
      return d.id;
    }).attr('r', 4.5).attr('fill', '#A7B2B8').attr('opacity', 1);

    onode.append('circle').attr('r', 20).attr('visibility', 'hidden');

    onode.append('text').attr('id', function(d) {
      return d.id + '-txt';
    }).attr('dy', '.31em').attr('text-anchor', function(d) {
      return d.x < 180 ?
        'start' :
        'end';
    }).attr('transform', function(d) {
      return d.x < 180 ?
        'translate(8)' :
        'rotate(180)translate(-8)';
    }).text(function(d) {
      return d.name;
    });

    // inner nodes

    var inode = svg.append('g').selectAll('.inner_node').data(data.inner).enter().append('g').attr('class', 'inner_node').attr('transform', function(d, i) {
      return 'translate(' + d.x + ',' + d.y + ')';
    }).on('mouseover', mouseoverInode).on('mouseout', mouseoutInode).on("click", function(d) {
      container.selectAll("*").classed("selected", false);
      for (var node in data.inner){
        if (data.inner[node].uid != d.uid){
          data.inner[node].selected = false;
        }
      }

      d.selected = d.selected ? false : true;
      container.select("#" + d.id).classed("selected", d.selected);
      mainview.dispatch.select(d.uid);
    })

    inode.append('rect').attr('width', rect_width).attr('height', rect_height).attr('id', function(d) {
      return d.id;
    }).attr('fill', function(d) {
      return universityColor(d.id);
    }).attr('opacity', 1).attr('stroke', 'white').attr('stroke-width', 2);

    inode.append('text').attr('id', function(d) {
      return d.id + '-txt';
    }).attr('text-anchor', 'middle').attr('transform', 'translate(' + rect_width / 2 + ', ' + rect_height * .75 + ')').text(function(d) {
      return d.abbr;
    });

    //bar chart
    var rects = svg.append('g').selectAll('.rect').data(data.inner).enter().append('rect').attr('id', d => 'b' + d.id).attr('class', 'bar').attr('x', function(d, i) {
      return bar_x(0);
    }).attr('y', function(d, i) {
      return inner_y(i);
    }).attr('width', function(d, i) {
      return bar_x(100);
    }).attr('height', function(d) {
      return rect_height;
    }).attr('transform', 'translate(' + (-(rect_width / 2) + rect_width + 100) + ',' + 0 + ')').attr('fill', d => get_color(d.name)).attr('stroke', '#fff').attr('stroke-width', 1).attr('opacity', 0);

    var texts = svg.append('g').selectAll('.barText').data(data.inner).enter().append('text').attr('id', d => 't' + d.id).attr('class', 'barText').attr('x', function(d, i) {
      return bar_x(100) + 150;
    }).attr('y', function(d, i) {
      return inner_y(i);
    }).attr('dx', function() {
      return 20;
    }).attr('dy', function(d) {
      return 20;
    }).text(function(d, i) {
      return 'null';
    }).style('opacity', 0);

    var title = svg.append('g').append('text').attr('class', 'title').text('none').attr('transform', 'translate(' + (-(rect_width / 2) + rect_width + 100) + ',' + -(inner_y(data.inner.length) + 10) + ')').style('opacity', 0);

    var xAxis = d3.svg.axis().scale(bar_x).orient('bottom').tickValues([
      0,
      20,
      40,
      60,
      80,
      100
    ]);

    svg.append('g').attr('class', 'axis').attr('transform', 'translate(' + (-(rect_width / 2) + rect_width + 100) + ',' + (inner_y(data.inner.length) + 10) + ')').call(xAxis).attr('opacity', 0);

    return mainview;
  };

  mainview.update = function() {

    return mainview;
  };

  ///////////////////////////////////////////////////
  // Private Function

  // When mouseover outside nodes
  function mouseoverOnode(d) {
    // bring to front
    container.selectAll('.links .link').sort(function(a, b) {
      return d.related_links.indexOf(a.id);
    });

    container.select('#' + d['id']).attr('fill', function(d) {
      return typeColor(d['type'], 'link');
    });

    for (var i = 0; i < data.inner.length; i++) {
      container.select('#' + data.inner[i].id).attr('fill', '#7E7E7E');
    }

    for (var i = 0; i < d.related_nodes.length; i++) {

      container.select('#' + d.related_nodes[i]).classed('highlight', true);
      container.select('#' + d.related_nodes[i]).attr('fill', typeColor(d.type, 'link'));
      container.select('#' + d.related_nodes[i] + '-txt').attr('font-weight', 'bold');

      //update barchart
      if (!d.abbr) {

        var inner = data.inner[d.related_nodes[i].slice(1, d.related_nodes[i].length)];
        var score = 0;
        if (inner) {
          for (var item in inner['subjects']) {
            if (inner['subjects'][item]['subject'] == d.name) {
              score = inner['subjects'][item]['score'];
            }
          }
        }

        container.select('#b' + d.related_nodes[i]).attr('opacity', 0.6).transition().duration(500).ease('linear').attr('width', bar_x(score)).attr('fill', barColor(score, d.type));
      }

      container.select('#t' + d.related_nodes[i]).transition().duration(500).text(score).style('opacity', 1);
    }

    container.select('#' + d.id + '-txt').attr('fill', typeColor(d.type));
    container.select('.axis').classed('highlight', true);
    container.select('.title').text(d.name).style('opacity', 1);

    for (var i = 0; i < d.related_links.length; i++) {
      container.select('#' + d.related_links[i]).attr('stroke-width', '2.5px').attr('stroke', function(d) {
        // return "#596D78"
        return typeColor(d['outer']['type'], 'link');
      }).attr('opacity', 1);
    }
  }

  // When mouseover inside nodes
  function mouseoverInode(d) {
    // bring to front
    container.selectAll('.links .link').sort(function(a, b) {
      return d.related_links.indexOf(a.id);
    });

    for (var i = 0; i < d.related_nodes.length; i++) {
      container.select('#' + d.related_nodes[i]).attr('opacity', 1).attr('fill', function(d) {
        if (!d.abbr) {
          return typeColor(d['type'], 'link');
        } else {
          return '#9cd2ff';
        }
      });
      container.select('#' + d.related_nodes[i] + '-txt').attr('font-weight', 'bold').attr('fill', function(d) {
        if (!d.abbr) {
          return typeColor(d.type, 'link');
        }
      });
    }

    container.select('#' + d.id + '-txt').attr('font-weight', 'bold').text(d.university);

    for (var i = 0; i < d.related_links.length; i++) {
      container.select('#' + d.related_links[i]).attr('stroke-width', '3px').attr('stroke', function(d) {
        return typeColor(d['outer']['type'], 'link');
      }).attr('opacity', 1);
    }
  }

  // When mouseout outside nodes
  function mouseoutOnode(d) {
    for (var i = 0; i < d.related_nodes.length; i++) {
      container.select('#' + d.related_nodes[i]).classed('highlight', false);
      container.select('#b' + d.related_nodes[i]).classed('highlight', false);
      container.select('#' + d.related_nodes[i] + '-txt').attr('font-weight', 'normal');
      container.select('#b' + d.related_nodes[i]).transition().duration(200).ease('linear').attr('opacity', 0);
      container.select('#t' + d.related_nodes[i]).transition().duration(200).style('opacity', 0);
    }

    for (var i = 0; i < data.inner.length; i++) {
      container.select('#' + data.inner[i].id).attr('fill', d => universityColor(data.inner[i].id));
    }

    container.select('#' + d.id).attr('fill', '#A9B2B7');
    container.select('#' + d.id + '-txt').attr('fill', null);
    container.select('.title').style('opacity', 0);
    container.select('.axis').classed('highlight', false);

    for (var i = 0; i < d.related_links.length; i++) {
      d3.select('#' + d.related_links[i]).attr('stroke-width', link_width).attr('stroke', '#aaa').attr('opacity', 0.2);
    }
  }

  // When mouseout inside nodes
  function mouseoutInode(d) {
    for (var i = 0; i < d.related_nodes.length; i++) {
      container.select('#' + d.related_nodes[i]).classed('highlight', false);
      container.select('#b' + d.related_nodes[i]).classed('highlight', false);
      container.select('#' + d.related_nodes[i] + '-txt').attr('font-weight', 'normal');
      container.select('#' + d.related_nodes[i]).attr('fill', '#A7B2B8');
      container.select('#b' + d.related_nodes[i]).transition().duration(200).ease('linear').attr('opacity', 0);
      container.select('#t' + d.related_nodes[i]).transition().duration(200).style('opacity', 0);
      container.select('#' + d.related_nodes[i] + '-txt').attr('fill', null);
    }

    container.select('#' + d.id + '-txt').attr('font-weight', 'normal').text(d.abbr);
    if (d.abbr) {
      container.select('#' + d.id).attr('fill', universityColor(d.id));
    }

    for (var i = 0; i < d.related_links.length; i++) {
      d3.select('#' + d.related_links[i]).attr('stroke-width', link_width).attr('stroke', '#aaa').attr('opacity', 0.2);
    }
  }

  // a compare function
  function createCompareFunction(propertyName) {

    return function(object1, object2) {
      var value1 = object1[propertyName];
      var value2 = object2[propertyName];

      if (value1 < value2) {
        return -1;
      } else if (value1 > value2) {
        return 1;
      } else {
        return 0;
      }
    };
  }

  // color for subject types
  function typeColor(d, flag) {
    if (d == 'ARTS') {
      return flag == 'outer' ? '#DCEBD8' : '#A6DB98';
    } else if (d == 'ENG') {
      return flag == 'outer' ? '#FEEFDE' : '#FCDF9A';
    } else if (d == 'LIFE SCI') {
      return flag == 'outer' ? '#D7E4EF' : '#8EC0EE';
    } else if (d == 'NATURAL') {
      return flag == 'outer' ? '#FCE7E5' : '#F9B8A9';
    } else {
      return flag == 'outer' ? '#EEECFC' : '#BEB6E0';
    }
  }

  // color for bar charts
  function barColor(score, type) {

    var colorRange;

    if (type == 'ARTS') {
      colorRange = colorbrewer.YlGn[9];
    } else if (type == 'ENG') {
      colorRange = colorbrewer.Oranges[9];
    } else if (type == 'LIFE SCI') {
      colorRange = colorbrewer.Blues[9];
    } else if (type == 'NATURAL') {
      colorRange = colorbrewer.RdPu[9];
    } else {
      colorRange = colorbrewer.Purples[9];
    }

    var bc = d3.scale.linear().domain([
      50,
      56.25,
      62.5,
      68.75,
      75,
      81.25,
      87,
      93.25,
      100
    ]).range(colorRange);

    return bc(score);

  }

  // color for inner nodes
  function universityColor(u) {
    var uc = d3.scale.linear().domain([1, data.inner.length]).range(colorbrewer.Set3[12]);
    return uc(parseInt(u.slice(1, u.length)));
  }

  return mainview;
};
