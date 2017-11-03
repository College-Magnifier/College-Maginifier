/*
  A code template for a visualization component
  Author : Hanfei Lin
  Date: 10/14/2017
*/

vis.component = function() {

  var component = {};
  var container = null;
  var data = null;
  var size = [ 960, 800 ];
  var margin = { left: 10, top: 10, right: 10, bottom: 10 };
  var dispatch = d3.dispatch('select', 'mouseover', 'mouseout');

  component.container = function(_) {
    if (!arguments.length) {
      return container;
    }
    container = _;
    return component;
  };

  component.data = function(_) {
    if (!arguments.length) {
      return data;
    }
    data = _;
    return component;
  };

  component.size = function(_) {
    if (!arguments.length) {
      return size;
    }
    size = _;
    return component;
  };

  component.margin = function(_) {
    if (!arguments.length) {
      return margin;
    }
    margin = _;
    return component;
  };

  component.dispatch = dispatch;

  ///////////////////////////////////////////////////
  // Private Parameters

  ///////////////////////////////////////////////////
  // Public Function
  component.layout = function() {
    return component;
  };

  component.render = function() {
    return component.update();
  };

  component.update = function() {
    return component;
  };

  ///////////////////////////////////////////////////
  // Private Functions

  function private_function1() {

  }

  function private_function2() {

  }

  function private_function3() {

  }

  return component;
};
