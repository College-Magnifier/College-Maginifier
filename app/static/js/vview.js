/*
  Show class information
  Author : Hanfei Lin
  Date: 10/14/2017
*/

vis.vview = function() {

  var vview = {};
  var container = null;
  var data = null;
  var nodeInfo = null;
  var size = [ 0, 0 ];
  var margin = { left: 10, top: 10, right: 10, bottom: 10 };
  var dispatch = d3.dispatch('select', 'mouseover', 'mouseout');

  vview.container = function(_) {
    if (!arguments.length) {
      return container;
    }
    container = _;
    return vview;
  };

  vview.data = function(_) {
    if (!arguments.length) {
      return data;
    }
    data = _;
    return vview;
  };

  vview.nodeInfo = function(_) {
    if (!arguments.length) {
      return nodeInfo;
    }
    nodeInfo = _;
    return vview;
  };

  vview.dispatch = dispatch;

  ///////////////////////////////////////////////////
  // Private Parameters

  ///////////////////////////////////////////////////
  // Public Function
  vview.layout = function() {
    console.log(data);
    console.log(nodeInfo);
    return vview;
  };

  vview.render = function() {


    return vview.update();
  };

  vview.update = function() {
    return vview;
  };

  ///////////////////////////////////////////////////
  // Private Functions

  function private_function1() {

  }

  function private_function2() {

  }

  function private_function3() {

  }

  return vview;
};
