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

    return hview;
  };

  hview.render = function() {

    return hview.update();
  };

  hview.update = function() {
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
