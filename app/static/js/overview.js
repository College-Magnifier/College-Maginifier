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
vis.overview = function(){
  var overview = {};
var dispatch = d3.dispatch('select', 'mouseover', 'mouseout');
overview.dispatch = dispatch;

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
              color: '#FCD78D'
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
                switch (this.name) {
                // Continents
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
                // Countries
                case 'United States of America':
                  renderMap('united-states');
                  break;
                case 'Canada':
                  renderMap('canada');
                  break;
                case 'United Kingdom':
                  renderMap('united-kingdom');
                  break;
                case 'Netherlands':
                  renderMap('netherlands');
                  break;
                case 'Germany':
                  renderMap('germany');
                  break;
                case 'China':
                  renderMap('china');
                  break;
                case 'Japan':
                  renderMap('japan');
                  break;
                case 'South Korea':
                  renderMap('south-korea');
                  break;
                case 'Australia':
                  renderMap('australia');
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

function showSchoolCoordinates(scale, mapData) {
  $.ajax({
    method: 'GET',
    url: '/map_data/school_coordinates',
    data: { scale: scale },
    success: function(resp) {
      data = JSON.parse(resp);

      data.forEach(function(point) {
        point['dataLabels'] = { enabled: false };
      });

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
          pointFormat: '<b>{point.name}</b>'
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
        }, {
          type: 'mappoint',
          name: 'Colleges',
          color: Highcharts.getOptions().colors[1],
          data: data
        } ],

        credits: {
          enabled: false
        }
      });
    }
  });
}

function renderMap(scale) {
  // TODO: This is the place map changes, dispatch for other views here
  dispatch.select(scale);

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
  } else if (scale == 'united-states' || scale == 'canada') {
    $('#back-btn').show();
    $('#back-btn').unbind('click');
    $('#back-btn').click(function() {
      renderMap('north-america');
    });
    switch (scale) {
    case 'united-states':
      showSchoolCoordinates(scale, Highcharts.maps['countries/us/us-all']);
      break;
    case 'canada':
      showSchoolCoordinates(scale, Highcharts.maps['countries/ca/ca-all']);
      break;
    }
  } else if (scale == 'united-kingdom' || scale == 'netherlands' || scale == 'germany') {
    $('#back-btn').show();
    $('#back-btn').unbind('click');
    $('#back-btn').click(function() {
      renderMap('europe');
    });
    switch (scale) {
    case 'united-kingdom':
      showSchoolCoordinates(scale, Highcharts.maps['countries/gb/gb-all']);
      break;
    case 'netherlands':
      showSchoolCoordinates(scale, Highcharts.maps['countries/nl/nl-all']);
      break;
    case 'germany':
      showSchoolCoordinates(scale, Highcharts.maps['countries/de/de-all']);
      break;
    }
  } else if (scale == 'china' || scale == 'japan' || scale == 'south-korea') {
    $('#back-btn').show();
    $('#back-btn').unbind('click');
    $('#back-btn').click(function() {
      renderMap('asia');
    });
    switch (scale) {
    case 'china':
      showSchoolCoordinates(scale, Highcharts.maps['countries/cn/custom/cn-all-sar-taiwan']);
      break;
    case 'japan':
      showSchoolCoordinates(scale, Highcharts.maps['countries/jp/jp-all']);
      break;
    case 'south-korea':
      showSchoolCoordinates(scale, Highcharts.maps['countries/kr/kr-all']);
      break;
    }
  } else if (scale == 'australia') {
    $('#back-btn').show();
    $('#back-btn').unbind('click');
    $('#back-btn').click(function() {
      renderMap('oceania');
    });
    showSchoolCoordinates(scale, Highcharts.maps['countries/au/au-all']);
  }
}

renderMap('world-continents');
return overview;
}
