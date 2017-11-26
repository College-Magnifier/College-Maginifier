/*
  System Driver
  Author : Hanfei Lin
  Date: 10/14/2017
*/

var mainview = vis.mainview();
var overview = vis.overview();
var vview = vis.vview();
var hview = vis.hview();

// layout UI and setup events
$(document).ready(function() {
  display();
  wire_views();
});

//////////////////////////////////////////////////////////////////////
// local functions

function display() {

  d3.json('/vis/get_subject_scores', function(error, json) {
    if (error) {
      console.log(error);
      return;
    }
    console.log(json)
    hview.container(d3.select('#hview')).data(json).layout().render();
  });

  var init = [];
  for (var i = 1; i <= 20; i++) {
    init.push(i);
  }

  param = {
    ids: JSON.stringify(init)
  }

  load('/vis/get_subject_details', param);

}

function wire_views() {

  hview.dispatch.on('select', function(selected) {
    d3.select('#mainview').selectAll('*').remove();

    param = {
      ids: JSON.stringify(selected)
    }
    load('/vis/get_subject_details', param);

  });

  overview.dispatch.on('select', function(scale){

    param = {
      scale: scale
    }

    load('/vis/get_subject_scores', param);
  })

}

function load(url, param) {

  var callback = function(json) {

    if (url.indexOf('get_subject_details') >= 0) {
      mainview.container(d3.select('#mainview')).data(json);
      mainview.layout().render();
    } else if (url.indexOf('get_subject_scores') >= 0) {
      hview.data(json).update();
    }
  };

  if (!param) {
    d3.json(url, callback);
  } else {
    $.ajax({
      url: url,
      method: 'GET',
      data: param,
      success: function(resp) {
        callback(JSON.parse(resp));
      }
    });

  }
}
