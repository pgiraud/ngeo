goog.provide('control');

goog.require('ngeo.controlDirective');
goog.require('ngeo.mapDirective');
goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.control.MousePosition');
goog.require('ol.layer.Tile');
goog.require('ol.source.OSM');


/** @const **/
var app = {};


/** @type {!angular.Module} **/
app.module = angular.module('app', ['ngeo']);


/**
 * @constructor
 */
app.MainController = function() {

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
      zoom: 4
    })
  });

  /**
   * @type {ol.control.Control}
   * @export
   */
  this.control = new ol.control.MousePosition({
    className: 'mouse-position'
  });
};


app.module.controller('MainController', app.MainController);
