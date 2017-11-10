/*
  Generate class dependencies graph
  Author : Hanfei Lin
  Date: 10/14/2017
*/
//
// vis.overview = function() {
//
//   var overview = {};
//   var container = null;
//   var data = null;
//   var size = [ 0, 0 ];
//   var margin = { left: 10, top: 10, right: 10, bottom: 10 };
//   var dispatch = d3.dispatch('select', 'mouseover', 'mouseout');
//
//   overview.container = function(_) {
//     if (!arguments.length) {
//       return container;
//     }
//     container = _;
//     return overview;
//   };
//
//   overview.data = function(_) {
//     if (!arguments.length) {
//       return data;
//     }
//     data = _;
//     return overview;
//   };
//
//   overview.dispatch = dispatch;
//
//   ///////////////////////////////////////////////////
//   // Private Parameters
//
//   var selected = [];
//
//   ///////////////////////////////////////////////////
//   // Public Function
//   overview.layout = function() {
//
//     return overview;
//   };
//
//   overview.render = function() {
//
//     return overview.update();
//   };
//
//   overview.update = function() {
//     return overview;
//   };
//
//   overview.dispatch = dispatch;
//
//   ///////////////////////////////////////////////////
//   // Private Functions
//
//   function private_function2() {
//
//   }
//
//   function private_function3() {
//
//   }
//
//   return overview;
// };



var data = [
  [ 'eu', 0 ],
  [ 'oc', 1 ],
  [ 'af', 2 ],
  [ 'as', 3 ],
  [ 'na', 4 ],
  [ 'sa', 5 ]
];

Highcharts.mapChart('overview', {
  chart: {
    map: 'custom/world-continents'
  },

  title: {
    text: ''
  },

  mapNavigation: {
    enabled: true,
    buttonOptions: {
      verticalAlign: 'bottom'
    }
  },

  colorAxis: {
    min: 0
  },

  series: [ {
    data: data,
    name: 'Random data',
    states: {
      hover: {
        color: '#BADA55'
      }
    },
    dataLabels: {
      enabled: true,
      format: '{point.name}'
    }
  } ],

  credits: {
    enabled: false
  }
});
