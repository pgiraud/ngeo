goog.provide('ngeo.Query');


/**
 * @typedef {{
 *     sources: (Array.<ngeo.QueryResultSource>),
 *     total: (number)
 * }}
 */
ngeo.QueryResult;


/**
 * @typedef {{
 *     features: (Array.<ol.Feature>),
 *     label: (string),
 *     name: (string),
 *     pending: (boolean)
 * }}
 */
ngeo.QueryResultSource;


ngeoModule.value('ngeoQueryResult', {
  'sources': [],
  'total': 0
});



/**
 * The Query service provides a way to send WMS GetFeatureInfo requests from
 * visible layer objects within a map. Those do not necessarily need to have
 * a WMS source. The Query service requires source configuration in order
 * for layers to actually be considered queryable.
 *
 * To know more about the specification of a source configuration, see
 * `ngeox.QuerySource`
 *
 * @constructor
 * @param {angular.$http} $http Angular $http service.
 * @param {ngeo.QueryResult} ngeoQueryResult
 */
ngeo.Query = function($http, ngeoQueryResult) {

  /**
   * @type {angular.$http}
   * @private
   */
  this.$http_ = $http;

  /**
   * @type {ngeo.QueryResult}
   * @private
   */
  this.result_ = ngeoQueryResult;

  /**
   * @type {Array.<ngeox.QuerySource>}
   * @private
   */
  this.sources_ = [];
};


/**
 * @param {ngeox.QuerySource} source
 * @export
 */
ngeo.Query.prototype.addSource = function(source) {
  this.sources_.push(source);

  var resultSource = /** @type {ngeo.QueryResultSource} */ ({
    'features': [],
    'label': source.label,
    'name': source.name,
    'pending': false
  });

  this.result_.sources.push(resultSource);
};


/**
 * @param {ol.Coordinate|ol.Extent} object
 * @export
 */
ngeo.Query.prototype.issue = function(object) {
  if (object.length === 2) {
    this.issueWMSGetFeatureInfoRequests_(object);
  }
};


/**
 * @param {ol.Coordinate} coordinate
 * @private
 */
ngeo.Query.prototype.issueWMSGetFeatureInfoRequests_ = function(coordinate) {
};


/**
 * @private
 */
ngeo.Query.prototype.clear_ = function() {
};
