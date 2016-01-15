/**
 * @fileoverview Application entry point.
 *
 * This file defines the "app_desktop" Closure namespace, which is be used as the
 * Closure entry point (see "closure_entry_point" in the "build.json" file).
 *
 * This file includes `goog.require`'s for all the components/directives used
 * by the HTML page and the controller to provide the configuration.
 */
goog.provide('gmf.AbstractDesktopController');

goog.require('gmf');
goog.require('gmf.mapDirective');
goog.require('gmf.proj.EPSG21781');
goog.require('gmf.searchDirective');
goog.require('ngeo.FeatureOverlayMgr');
goog.require('ngeo.btngroupDirective');
goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.control.ScaleLine');
goog.require('ol.control.Zoom');
goog.require('ol.layer.Tile');
goog.require('ol.source.OSM');
goog.require('ol.style.Circle');
goog.require('ol.style.Fill');
goog.require('ol.style.Stroke');
goog.require('ol.style.Style');


gmfModule.constant('isDesktop', true);



/**
 * @param {ngeo.FeatureOverlayMgr} ngeoFeatureOverlayMgr The ngeo feature
 *     overlay manager service.
 * @param {Object} serverVars vars from GMF
 * @constructor
 * @ngInject
 * @export
 */
gmf.AbstractDesktopController = function(ngeoFeatureOverlayMgr, serverVars) {

  /**
   * @type {Array.<gmfx.SearchDirectiveDatasource>}
   * @export
   */
  this.searchDatasources = [{
    datasetTitle: 'Internal',
    labelKey: 'label',
    groupsKey: 'layer_name',
    groupValues: ['osm'],
    projection: 'EPSG:21781',
    url: serverVars['serviceUrls']['fulltextsearch']
  }];

  /**
   * @type {ol.Map}
   * @export
   */
  this.map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    view: new ol.View({
      center: [0, 0],
      zoom: 2
    }),
    controls: [
      new ol.control.ScaleLine(),
      new ol.control.Zoom()
    ]
  });

  /**
   * @type {boolean}
   * @export
   */
  this.toolsActive = false;

  ngeoFeatureOverlayMgr.init(this.map);

};


gmfModule.controller('AbstractDesktopController', gmf.AbstractDesktopController);
