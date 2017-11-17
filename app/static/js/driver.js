/*
  System Driver
  Author : Hanfei Lin
  Date: 10/14/2017
*/

var mainview = vis.mainview();
// var overview = vis.overview();
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
    hview.container(d3.select("#hview")).data(json).layout().render();
  });

  var init = [];
  for (var i = 1; i <= 20; i++){
    init.push(i);
  }

  load("/vis/get_subject_details", JSON.stringify(init));

}

function wire_views() {

  hview.dispatch.on('select', function(selected) {
    d3.select("#mainview").selectAll("*").remove();

    load("/vis/get_subject_details", JSON.stringify(selected));

  });

}

function load(url, param) {

  var callback = function(json) {

      if (url.indexOf('get_subject_details')) {
          console.log(json)

          mainview.container(d3.select("#mainview")).data(json);
          mainview.layout().render();
    }
  };

  if (!param) {
    d3.json(url, callback);
  } else {
    $.ajax({
      url: url,
      method: 'GET',
      data: { ids: param },
      success: function(resp) {
        callback(JSON.parse(resp));
      }
    });

  };
}
