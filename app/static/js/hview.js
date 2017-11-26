/*
  Generate class dependencies graph
  Author : Hanfei Lin
  Date: 10/14/2017
*/

vis.hview = function() {

  var hview = {};
  var container = null;
  var data = null;
  var size = [ 0, 0 ];
  var margin = { left: 10, top: 10, right: 10, bottom: 10 };
  var dispatch = d3.dispatch('select', 'mouseover', 'mouseout');

  hview.container = function(_) {
    if (!arguments.length) {
      return container;
    }
    container = _;
    return hview;
  };

  hview.data = function(_) {
    if (!arguments.length) {
      return data;
    }
    data = _;
    return hview;
  };

  hview.dispatch = dispatch;

  ///////////////////////////////////////////////////
  // Private Parameters

  ///////////////////////////////////////////////////

  // Public Function
  hview.layout = function() {

    size[0] = parseInt(container.style("width"));
    size[1] = parseInt(container.style("height"));

    return hview;
  };

  hview.render = function() {

    var color = d3.scale.linear()
      .domain([200, 1])
      .range(["#E6EAF3", "#133494"])
      .interpolate(d3.interpolateLab);

    parcoords = d3.parcoords()(container[0][0])
        .color(function(d, i) {
            return color(d['id']);
            // return "#87B2ED"
        })
        .alpha(0.2)

    parcoords
        .data(data)
        .hideAxis(["university", "id"])
        .rate(150)
        .composite("darker")
        .mode("queue")
        .render()
        .shadows()
        .reorderable()
        .brushMode("1D-axes")
        .on("brushend", function(items) {

            selected = [];

            for (i in items){
              selected.push(items[i].id)
            }

            hview.dispatch.select(selected);
        })
        .reorderable()
        .interactive();

    return hview.update();
  };

  hview.update = function() {

    parcoords
        .data(data)
        .render()
        .brushReset()

    return hview;
  };

  ///////////////////////////////////////////////////
  // Private Functions

  function private_function1() {

  }

  function private_function2() {

  }

  function private_function3() {

  }

  return hview;
};
