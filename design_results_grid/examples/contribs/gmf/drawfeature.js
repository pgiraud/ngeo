


/** @const **/
var app = {};


/** @type {!angular.Module} **/
app.module = angular.module('app', ['gmf']);


/**
 * @param {!angular.Scope} $scope Angular scope.
 * @param {ngeo.FeatureHelper} ngeoFeatureHelper Gmf feature helper service.
 * @param {ol.Collection.<ol.Feature>} ngeoFeatures Collection of features.
 * @param {ngeo.ToolActivateMgr} ngeoToolActivateMgr Ngeo ToolActivate manager
 *     service.
 * @constructor
 */
app.MainController = function($scope, ngeoFeatureHelper, ngeoFeatures,
    ngeoToolActivateMgr) {

  /**
   * @type {!angular.Scope}
   * @private
   */
  this.scope_ = $scope;

  var view = new ol.View({
    center: [0, 0],
    zoom: 3
  });

  ngeoFeatureHelper.setProjection(view.getProjection());

  /**
   * @type {ol.Map}
   * @export
   */
  this.map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      }),
      new ol.layer.Vector({
        source: new ol.source.Vector({
          wrapX: false,
          features: ngeoFeatures
        })
      })
    ],
    view: view
  });

 /**
   * @type {boolean}
   * @export
   */
  this.drawFeatureActive = true;

  var drawFeatureToolActivate = new ngeo.ToolActivate(
      this, 'drawFeatureActive');
  ngeoToolActivateMgr.registerTool(
      'mapTools', drawFeatureToolActivate, true);

 /**
   * @type {boolean}
   * @export
   */
  this.pointerMoveActive = false;

  var pointerMoveToolActivate = new ngeo.ToolActivate(
      this, 'pointerMoveActive');
  ngeoToolActivateMgr.registerTool(
      'mapTools', pointerMoveToolActivate, false);

  $scope.$watch(
    function() {
      return this.pointerMoveActive;
    }.bind(this),
    function(newVal) {
      if (newVal) {
        this.map.on('pointermove', this.handleMapPointerMove_, this);
      } else {
        this.map.un('pointermove', this.handleMapPointerMove_, this);
        $('#pointermove-feature').html('');
      }
    }.bind(this)
  );

};


/**
 * @param {ol.MapBrowserEvent} evt MapBrowser event
 * @private
 */
app.MainController.prototype.handleMapPointerMove_ = function(evt) {
  var pixel = evt.pixel;

  var feature = this.map.forEachFeatureAtPixel(pixel, function(feature) {
    return feature;
  });

  $('#pointermove-feature').html(
    (feature) ? feature.get(ngeo.FeatureProperties.NAME) : 'None'
  );

  this.scope_.$apply();
};


app.module.controller('MainController', app.MainController);
