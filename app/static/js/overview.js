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

function renderMap(scale) {
  $.ajax({
    method: 'GET',
    url: '/map_data/school_distribution',
    data: { scale: scale },
    success: function(resp) {
      data = JSON.parse(resp);

      console.log(data);

      $('#overview').highcharts('Map', {
        title: { text: '' },
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
          mapData: Highcharts.maps['custom/' + scale],
          name: 'Total Colleges',
          states: {
            hover: {
              color: '#BADA55'
            }
          },
          dataLabels: {
            enabled: true,
            format: '{point.name}'
          },
          pointer: 'cursor',
          point: {
            events: {
              click: function() {
                console.log(this.name);
                switch (this.name) {
                case 'Asia':
                  renderMap('asia');
                  break;
                }
              }
            }
          }
        } ],

        credits: {
          enabled: false
        }
      });
    }
  });
}

renderMap('world-continents');
