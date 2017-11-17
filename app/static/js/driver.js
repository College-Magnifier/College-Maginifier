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

  d3.json('get_subject_sores', function(error, json) {
    if (error) {
      console.log(error);
      return;
    }
    console.log(json)
    hview.container(d3.select("#hview")).data(json).layout().render();
  });

  mainview.container(d3.select("#mainview")).layout().render();

}

function wire_views() {

  hview.dispatch.on('select', function(selected) {

    load("filter", JSON.stringify(selected));

  });

}

function load(url, param) {

  var callback = function(error, json) {
    if (!json) {
      return;
    }
    if (json.responseText) {
      json = JSON.parse(json.responseText);
    }
    if (error) {
      console.log(error);
    } else {
      if (url.indexOf('filter') == 0) {
          d3.select("#mainview").selectAll("*").remove();
          mainview.data(json);
          mainview.layout().render();
      }
    }
  };

  if (!param) {
    d3.json(url, callback);
  } else {
    d3.xhr(url)
      .header("Content-Type", "application/json")
      .post(param, callback);
  };
}
