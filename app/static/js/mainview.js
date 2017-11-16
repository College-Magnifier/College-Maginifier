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

  ///////////////////////////////////////////////////
  // Public Function

  //calculate
  mainview.layout = function() {

    return mainview;
  }

  mainview.render = function() {


    return mainview;
  }

  mainview.update = function() {

    return mainview;
  }

  return mainview;
};
