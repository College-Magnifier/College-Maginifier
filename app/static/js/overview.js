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


// var data = [
//   [ 'ir', 0 ],
//   [ 'ph', 1 ],
//   [ 'sa', 2 ],
//   [ 'jp', 3 ],
//   [ 'th', 4 ],
//   [ 'om', 5 ],
//   [ 'ye', 6 ],
//   [ 'in', 7 ],
//   [ 'kr', 8 ],
//   [ 'bd', 9 ],
//   [ 'sp', 10 ],
//   [ 'cn', 11 ],
//   [ 'bh', 12 ],
//   [ 'mm', 13 ],
//   [ 'id', 14 ],
//   [ 'sg', 15 ],
//   [ 'ru', 16 ],
//   [ 'sh', 17 ],
//   [ 'my', 18 ],
//   [ 'az', 19 ],
//   [ 'am', 20 ],
//   [ 'vn', 21 ],
//   [ 'tj', 22 ],
//   [ 'uz', 23 ],
//   [ 'tl', 24 ],
//   [ 'kh', 25 ],
//   [ 'bt', 26 ],
//   [ 'ge', 27 ],
//   [ 'kz', 28 ],
//   [ 'il', 29 ],
//   [ 'sy', 30 ],
//   [ 'jo', 31 ],
//   [ 'tm', 32 ],
//   [ 'cnm', 33 ],
//   [ 'mn', 34 ],
//   [ 'kw', 35 ],
//   [ 'iq', 36 ],
//   [ 'ae', 37 ],
//   [ 'la', 38 ],
//   [ 'pk', 39 ],
//   [ 'jk', 40 ],
//   [ 'qa', 41 ],
//   [ 'tr', 42 ],
//   [ 'bn', 43 ],
//   [ 'af', 44 ],
//   [ 'kp', 45 ],
//   [ 'lb', 46 ],
//   [ 'nc', 47 ],
//   [ 'cy', 48 ],
//   [ 'tw', 49 ],
//   [ 'np', 50 ],
//   [ 'lk', 51 ],
//   [ 'kg', 52 ]
// ];
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
