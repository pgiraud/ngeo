goog.provide('gmf.MousepositionController');
goog.provide('gmf.mousepositionDirective');

goog.require('gmf');
/** @suppress {extraRequire} */
goog.require('ngeo.filters');
goog.require('ol.control.MousePosition');

/**
 * Provide a directive to display the mouse position coordinates depending
 * on the chosen projection. The directive also provides a projection picker
 * to choose how the coordinates are displayed.
 * service.
 *
 * Example:
 *  <gmf-mouseposition gmf-mouseposition-map="ctrl.map"
 *     gmf-mouseposition-projections="ctrl.projections">
 *  </gmf-mouseposition>
 *
 * @htmlAttribute {ol.Map} gmf-mouseposition-map The map.
 * @htmlAttribute {Array.<gmfx.MousePositionProjection>}
 *    gmf-mouseposition-projection The list of the projections.
 * @return {angular.Directive} The directive specs.
 * @ngInject
 * @ngdoc directive
 * @ngname gmfMouseposition
 */
gmf.mousepositionDirective = function() {
  return {
    restrict: 'E',
    controller: 'gmfMousepositionController',
    scope: {
      'map': '<gmfMousepositionMap',
      'projections': '<gmfMousepositionProjections'
    },
    bindToController: true,
    controllerAs: 'ctrl',
    templateUrl: gmf.baseTemplateUrl + '/mouseposition.html'
  };
};

gmf.module.directive('gmfMouseposition', gmf.mousepositionDirective);


/**
 * @param {angular.$filter} $filter Angular filter
 * @constructor
 * @export
 * @ngInject
 * @ngdoc controller
 * @ngname gmfMousepositionController
 */
gmf.MousepositionController = function($filter) {
  /**
   * @type {ol.Map}
   * @export
   */
  this.map;

  /**
   * @type {Array.<gmfx.MousePositionProjection>}
   * @export
   */
  this.projections;

  /**
   * @type {gmfx.MousePositionProjection}
   * @export
   */
  this.projection;

  // function that apply the filter.
  var formatFn = function(coordinates) {
    var filterAndArgs = this.projection.filter.split(':');
    var filter = $filter(filterAndArgs.shift());
    goog.asserts.assertFunction(filter);
    var args = filterAndArgs;
    args.unshift(coordinates);
    return filter.apply(this, args);
  };

  this.control = new ol.control.MousePosition({
    className: 'custom-mouse-position',
    coordinateFormat: formatFn.bind(this),
    target: document.getElementById('mouse-position'),
    undefinedHTML: '&nbsp;'
  });

  this.setProjection(this.projections[0]);

  this.map.addControl(this.control);
};


/**
 * @param {gmfx.MousePositionProjection} projection The new projection to use.
 * @export
 */
gmf.MousepositionController.prototype.setProjection = function(projection) {
  this.control.setProjection(ol.proj.get(projection.code));
  this.projection = projection;
};

gmf.module.controller('gmfMousepositionController',
    gmf.MousepositionController);
