goog.provide('ngeo.MobileQueryController');
goog.provide('ngeo.mobileQueryDirective');

goog.require('ngeo');


/**
 * Provide a "mobile query" directive.
 *
 * @example
 * <button ngeo-mobile-query=""
 *   ngeo-mobile-query-map="::ctrl.map">
 * </button>
 *
 * @return {angular.Directive} The Directive Definition Object.
 * @ngInject
 * @ngdoc directive
 * @ngname ngeoMobileQuery
 */
ngeo.mobileQueryDirective = function() {
  return {
    restrict: 'A',
    scope: {
      'map': '=ngeoMobileQueryMap'
    },
    bindToController: true,
    controller: 'NgeoMobileQueryController',
    controllerAs: 'ctrl'
  };
};


ngeoModule.directive('ngeoMobileQuery', ngeo.mobileQueryDirective);



/**
 * @constructor
 * @param {angular.JQLite} $element Element.
 * @param {ngeo.Query} ngeoQuery The ngeo Query service.
 * @export
 * @ngInject
 * @ngdoc controller
 * @ngname NgeoMobileQueryController
 */
ngeo.MobileQueryController = function($element, ngeoQuery) {

  /**
   * @type {ol.Map}
   * @export
   */
  this.map;

  /**
   * @type {boolean}
   * @export
   */
  this.active = false;

  /**
   * @type {ngeo.Query}
   * @private
   */
  this.query_ = ngeoQuery;

  // bind the map to the query service
  ngeoQuery.setMap(this.map);

  $element.on('click', goog.bind(this.toggle, this));

};


/**
 * @export
 */
ngeo.MobileQueryController.prototype.toggle = function() {
  this.active = !this.active;
  console.log(this.active);
  console.log(this.query_);
};





ngeoModule.controller('NgeoMobileQueryController', ngeo.MobileQueryController);
