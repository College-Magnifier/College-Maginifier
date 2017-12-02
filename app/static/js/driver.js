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

var selectedIdByMap = [];

//////////////////////////////////////////////////////////////////////
// local functions

function display() {

  d3.json('/vis/get_subject_scores', function(error, json) {
    if (error) {
      console.log(error);
      return;
    }
    hview.container(d3.select('#hview')).data(json).layout().render();
  });

  var init = [];
  for (var i = 1; i <= 20; i++) {
    init.push(i);
  }

  load('/vis/get_subject_details', {
    ids: JSON.stringify(init)
  });

  vview.render(66);

}

function wire_views() {

  hview.dispatch.on('select', function(selected) {
    d3.select('#mainview').selectAll('*').remove();

    console.log(selected)

    updatePoints(selected);

    if (selected.length == 0) {
      selected = selectedIdByMap;
    }

    load('/vis/get_subject_details', {
      ids: JSON.stringify(selected)
    });

  });

  overview.dispatch.on('select', function(scale) {

    load('/vis/get_subject_scores', {
      scale: scale
    });
  });

  mainview.dispatch.on('select', function(id) {
    vview.render(id);
  });

}

function load(url, param) {

  var callback = function(json) {

    if (url.indexOf('get_subject_details') >= 0) {
      updateMainview(json);
    } else if (url.indexOf('get_subject_scores') >= 0) {
      hview.data(json).update();

      selectedIdByMap = [];
      selected = [];

      for (var i = 0; i < json.length; i++) {
        selectedIdByMap.push(json[i].id);
      }

      if (param.scale == 'world-continents') {
        for (var i = 1; i <= 20; i++) {
          selected.push(i);
        }
      } else {
        selected = selectedIdByMap;
      }

      load('/vis/get_subject_details', {
        ids: JSON.stringify(selected)
      });
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

updateMainview = function(data) {
  d3.select('#mainview').selectAll('*').remove();
  mainview.container(d3.select('#mainview')).data(data);
  mainview.layout().render();
};
