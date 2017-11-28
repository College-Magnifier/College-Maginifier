/*
  Show class information
  Author : Hanfei Lin
  Date: 10/14/2017
*/

vis.vview = function() {
//
  var vview = {};

vview.render = function(id){
$.ajax({
  url: '/get_school_descriptions',
  data: {
    id: id
  },
  type: 'GET',
  dataType: 'html',
  success: function (data) {
    $('#vview .descriptions').html(data);
  },
});
}

  return vview;
};
