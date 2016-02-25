goog.provide('gmf.AbstractDesktopController');

goog.require('gmf');
goog.require('gmf.AbstractController');
/** @suppress {extraRequire} */
goog.require('gmf.mobileBackgroundlayerselectorDirective');
/** @suppress {extraRequire} */
goog.require('ngeo.btngroupDirective');
/** @suppress {extraRequire} */
goog.require('ngeo.PrintUtils');
/** @suppress {extraRequire} */
goog.require('ngeo.CreatePrint');
/** @suppress {extraRequire} */
goog.require('ngeo.resizemapDirective');
goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.control.ScaleLine');
goog.require('ol.control.Zoom');
goog.require('ol.interaction');

gmf.module.constant('isDesktop', true);


/**
 * Desktop application abstract controller.
 *
 * This file includes `goog.require`'s for desktop components/directives used
 * by the HTML page and the controller to provide the configuration.
 *
 * @param {gmfx.Config} config A part of the application config.
 * @param {angular.Scope} $scope Scope.
 * @param {angular.$injector} $injector Main injector.
 * @constructor
 * @extends {gmf.AbstractController}
 * @ngInject
 * @export
 */
gmf.AbstractDesktopController = function(config, $scope, $injector) {

  var viewConfig = {
    projection: ol.proj.get('epsg:' + (config.srid || 21781))
  };
  goog.object.extend(viewConfig, config.mapViewConfig || {});

  /**
   * @type {ol.Map}
   * @export
   */
  this.map = new ol.Map({
    layers: [],
    view: new ol.View(viewConfig),
    controls: config.mapControls || [
      new ol.control.ScaleLine(),
      new ol.control.Zoom()
    ],
    interactions: config.mapInteractions || ol.interaction.defaults({
      pinchRotate: false,
      altShiftDragRotate: false
    })
  });

  /**
   * @type {boolean}
   * @export
   */
  this.loginActive = false;

  /**
   * @type {boolean}
   * @export
   */
  this.toolsActive = false;

  // initialize tooltips
  $('[data-toggle="tooltip"]').tooltip({
    container: 'body',
    trigger: 'hover'
  });

  goog.base(
      this, config, $scope, $injector);

  // close the login panel on successful login
  $scope.$watch(function() {
    return this.gmfUser.username;
  }.bind(this), function(newVal) {
    if (newVal !== null && this.loginActive) {
      this.loginActive = false;
    }
  }.bind(this));


  var PRINT_SCALES_ = [100, 250, 500, 2500, 5000, 10000, 25000, 50000,
    100000, 500000];
  var PRINT_PAPER_SIZE_ = [555, 675];

  var ngeoPrintUtils = $injector.get('ngeoPrintUtils');

  /**
   * @type {function(ol.render.Event)}
   */
  var postcomposeListener = ngeoPrintUtils.createPrintMaskPostcompose(
      /**
       * @return {ol.Size} Size in dots of the map to print.
       */
      function() {
        return PRINT_PAPER_SIZE_;
      },
      /**
       * @param {olx.FrameState} frameState Frame state.
       * @return {number} Scale of the map to print.
       */
      function(frameState) {
        var mapSize = frameState.size;
        var mapResolution = frameState.viewState.resolution;
        // we test mapSize and mapResolution just to please the compiler
        return mapSize !== undefined && mapResolution !== undefined ?
            ngeoPrintUtils.getOptimalScale(mapSize, mapResolution,
                PRINT_PAPER_SIZE_, PRINT_SCALES_) :
            PRINT_SCALES_[0];
      });

  /**
   * Draw the print window in a map postcompose listener.
   */
  this.map.on('postcompose', postcomposeListener);

};
goog.inherits(gmf.AbstractDesktopController, gmf.AbstractController);


gmf.module.controller(
    'AbstractDesktopController',
    gmf.AbstractDesktopController);
