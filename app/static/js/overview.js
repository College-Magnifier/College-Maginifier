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
//
//
function showDistribution(scale, mapData) {
  $.ajax({
    method: 'GET',
    url: '/map_data/school_distribution',
    data: { scale: scale },
    success: function(resp) {
      data = JSON.parse(resp);

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
          mapData: mapData,
          borderColor: 'white',
          name: 'Total Colleges',
          states: {
            hover: {
              color: '#BADA55'
            }
          },
          dataLabels: {
            enabled: false,
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
                case 'North America':
                  renderMap('north-america');
                  break;
                case 'South America':
                  renderMap('south-america');
                  break;
                case 'Europe':
                  renderMap('europe');
                  break;
                case 'Africa':
                  renderMap('africa');
                  break;
                case 'Oceania':
                  renderMap('oceania');
                  break;
                case 'United States of America':
                  renderMap('united-states');
                  break;
                case 'China':
                  renderMap('china');
                  break;
                case 'United Kingdom':
                  renderMap('united-kingdom');
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

function showSchoolCoordinates(country, mapData) {
  // $.ajax({
  //   method: 'GET',
  //   url: '/map_data/school_coordinates',
  //   data: { country: country },
  //   success: function(resp) {
  //     data = JSON.parse(resp);

  $('#overview').highcharts('Map', {
    title: { text: '' },
    mapNavigation: {
      enabled: true,
      buttonOptions: {
        verticalAlign: 'bottom'
      }
    },
    tooltip: {
      headerFormat: '',
      pointFormat: '<b>{point.name}</b><br>Lat: {point.lat}, Lon: {point.lon}'
    },
    series: [ {
      mapData: mapData,
      name: 'Basemap',
      borderColor: '#A0A0A0',
      nullColor: 'rgba(200, 200, 200, 0.3)',
      showInLegend: false
    }, {
      name: 'Separators',
      type: 'mapline',
      data: Highcharts.geojson(mapData, 'mapline'),
      color: '#707070',
      showInLegend: false,
      enableMouseTracking: false
    } ],

    credits: {
      enabled: false
    }
  });
  //   }
  // });
}

function renderMap(scale) {
  if (scale == 'world-continents') {
    $('#back-btn').hide();
    $('#back-btn').unbind('click');
    showDistribution(scale, Highcharts.maps['custom/world-continents']);
  } else if (scale == 'asia' || scale == 'europe' || scale == 'north-america' ||
    scale == 'south-america' || scale == 'oceania' || scale == 'africa') {
    $('#back-btn').show();
    $('#back-btn').unbind('click');
    $('#back-btn').click(function() {
      renderMap('world-continents');
    });
    showDistribution(scale, Highcharts.maps['custom/' + scale]);
  } else if (scale == 'united-states') {
    $('#back-btn').show();
    $('#back-btn').unbind('click');
    $('#back-btn').click(function() {
      renderMap('north-america');
    });
    showSchoolCoordinates(scale, Highcharts.maps['countries/us/us-all']);
  } else if (scale == 'united-kingdom') {
    $('#back-btn').show();
    $('#back-btn').unbind('click');
    $('#back-btn').click(function() {
      renderMap('europe');
    });
    showSchoolCoordinates(scale, Highcharts.maps['countries/gb/gb-all']);
  } else if (scale == 'china') {
    $('#back-btn').show();
    $('#back-btn').unbind('click');
    $('#back-btn').click(function() {
      renderMap('asia');
    });
    showSchoolCoordinates(scale, Highcharts.maps['countries/cn/custom/cn-all-sar-taiwan']);
  }
}

renderMap('world-continents');
