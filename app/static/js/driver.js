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

  var url = 'data/' + "overall.csv";

  d3.json(url, function(error, json) {
    if (error) {
      console.log(error);
      return;
    }
    hview.container(d3.select("#hview")).data(json).layout().render();
    mainview.container(d3.select("#mainview")).data(json).layout().render();
  });


}

function wire_views() {

}
