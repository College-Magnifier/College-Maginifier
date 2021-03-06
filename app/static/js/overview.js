/*
  Generate map
  Author : Hanfei Lin
  Date: 10/14/2017
*/
var coordData = null;

vis.overview = function() {
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
          chart: { backgroundColor: '#f9f9f9' },
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
          credits: { enabled: false }
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
        coordData = JSON.parse(resp);

        coordData.forEach(function(point) {
          point['dataLabels'] = { enabled: false };
          point['color'] = '#757575';
        });

        coordMapOption = {
          title: { text: '' },
          mapNavigation: {
            enabled: true,
            buttonOptions: {
              verticalAlign: 'bottom'
            }
          },
          chart: { backgroundColor: '#f9f9f9' },
          tooltip: {
            headerFormat: '',
            pointFormat: '<b>{point.name}</b>'
          },
          series: [ {
            mapData: mapData,
            name: 'Basemap',
            borderColor: '#fff',
            nullColor: '#8DCAC9',
            showInLegend: false
          }, {
            name: 'Separators',
            type: 'mapline',
            data: Highcharts.geojson(mapData, 'mapline'),
            color: '#fff',
            showInLegend: false,
            enableMouseTracking: false
          }, {
            type: 'mappoint',
            name: 'Colleges',
            color: Highcharts.getOptions().colors[1],
            data: coordData
          } ],
          credits: { enabled: false }
        };
        coordMap = Highcharts.mapChart('overview', coordMapOption);
      }
    });
  }

  function renderMap(scale) {
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
};

updatePoints = function(ids) {
  if (!coordData) {
    return;
  }
  coordData.forEach(function(point) {
    point['color'] = ids.indexOf(point['id']) != -1 ? '#9c27b0' : '#757575';
  });
  coordMap = Highcharts.mapChart('overview', coordMap.options);
};
