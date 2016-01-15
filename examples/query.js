goog.provide('query');

goog.require('ngeo');
goog.require('ngeo.Query');
goog.require('ngeo.mapDirective');
goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.layer.Image');
goog.require('ol.layer.Tile');
goog.require('ol.proj');
goog.require('ol.source.ImageWMS');
goog.require('ol.source.OSM');


proj4.defs('EPSG:21781',
    '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 ' +
    '+x_0=600000 +y_0=200000 +ellps=bessel ' +
    '+towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs');


/** @const **/
var app = {};


/** @type {!angular.Module} **/
app.module = angular.module('app', ['ngeo']);


app.module.constant('ngeoQueryOptions', {
  'limit': 20
});



/**
 * @param {ngeo.Query} ngeoQuery Query service
 * @constructor
 * @ngInject
 */
app.MainController = function(ngeoQuery) {

  var projection = ol.proj.get('EPSG:21781');
  projection.setExtent([485869.5728, 76443.1884, 837076.5648, 299941.7864]);

  var informationLayer = new ol.layer.Image({
    'source': new ol.source.ImageWMS({
      'url': 'https://geomapfish-demo.camptocamp.net/1.6/wsgi/mapserv_proxy',
      params: {'LAYERS': 'information'}
    })
  });
  ngeoQuery.addSource({
    'id': 'information',
    'layer': informationLayer
  });

  var busStopLayer = new ol.layer.Image({
    'source': new ol.source.ImageWMS({
      'url': 'https://geomapfish-demo.camptocamp.net/1.6/wsgi/mapserv_proxy',
      params: {'LAYERS': 'bus_stop'}
    })
  });
  ngeoQuery.addSource({
    'id': 'bus_stop',
    'layer': busStopLayer
  });

  /**
   * @type {ol.Map}
   * @export
   */
  this.map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      }),
      busStopLayer,
      informationLayer
    ],
    view: new ol.View({
      projection: projection,
      resolutions: [200, 100, 50, 20, 10, 5, 2.5, 2, 1, 0.5],
      center: [537635, 152640],
      zoom: 3
    })
  });
};


app.module.controller('MainController', app.MainController);
