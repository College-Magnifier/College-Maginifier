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
  // init data list
  $.get('/list', function(d) {
    $('#dataset').empty();
    d = $.parseJSON(d);
    d.forEach(function(name) {
      $('#dataset').append(
        '<option>' + name.substring(0, name.length - 4) + '</option>'
      );
    });

    display();
  });

  wire_views();
});

//////////////////////////////////////////////////////////////////////
// local functions

function display() {

  // load datasets
  var data = $('#dataset').val();
  if(!data || data == '') {
    return;
  }

  var url = 'data/' + $('#dataset').val() + '.csv';

  d3.json(url, function(error, json) {
    if (error) {
      console.log(error);
      return;
    }

    mainview.container(d3.select('#mainview')).data(json).layout().render();

  });
}

function wire_views() {

}
