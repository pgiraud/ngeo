goog.provide('ngeo.Query');

goog.require('ngeo');


/**
 * @typedef {{
 *     resultSource: (ngeo.QueryResultSource),
 *     source: (ngeox.QuerySource)
 * }}
 */
ngeo.QueryCacheItem;


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
 *     id: (string),
 *     label: (string),
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
 * @param {ngeox.QueryOptions|undefined} ngeoQueryOptions
 */
ngeo.Query = function($http, ngeoQueryResult, ngeoQueryOptions) {

  var options = ngeoQueryOptions !== undefined ? ngeoQueryOptions : {};

  /**
   * @type {number}
   * @private
   */
  this.limit_ = options.limit !== undefined ? options.limit : 50;

  /**
   * @type {string}
   * @private
   */
  this.sourceIdProperty_ = options.sourceIdProperty !== undefined ?
      options.sourceIdProperty : ngeo.Query.DEFAULT_SOURCE_ID_PROPERTY_;

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

  /**
   * @type {Object.<string, ngeo.QueryCacheItem>}
   * @private
   */
  this.cache_ = {};
};


/**
 * @const
 * @private
 */
ngeo.Query.DEFAULT_SOURCE_ID_PROPERTY_ = 'querySourceId';


/**
 * @param {ngeox.QuerySource} source
 * @export
 */
ngeo.Query.prototype.addSource = function(source) {
  var sourceId = source.id;

  goog.asserts.assert(sourceId, 'source.id should be thruthy');
  goog.asserts.assert(!this.cache_[sourceId],
      'no other source with the same id should be present');

  // attempt to obtain an ol3 wms source object from the layer and set it
  // in the query source object, if not defined
  if (!source.wmsSource &&
      source.layer &&
      (source.layer instanceof ol.layer.Image ||
      source.layer instanceof ol.layer.Tile)) {
    var wmsSource = source.layer.getSource();
    if (wmsSource &&
        (wmsSource instanceof ol.source.ImageWMS ||
        wmsSource instanceof ol.source.TileWMS)) {
      source.wmsSource = wmsSource;
    }
  }

  this.sources_.push(source);

  var sourceLabel = source.label !== undefined ? source.label : sourceId;

  var resultSource = /** @type {ngeo.QueryResultSource} */ ({
    'features': [],
    'id': sourceId,
    'label': sourceLabel,
    'pending': false
  });

  this.result_.sources.push(resultSource);

  var cacheItem = {
    'source': source,
    'resultSource': resultSource
  };
  this.cache_[sourceId] = cacheItem;
};


/**
 * @param {ol.Coordinate|ol.Extent} object
 * @export
 */
ngeo.Query.prototype.issue = function(object) {
  this.clearResult_();

  if (object.length === 2) {
    this.issueWMSGetFeatureInfoRequests_(object);
  }
};


/**
 * @param {ol.Coordinate} coordinate
 * @private
 */
ngeo.Query.prototype.issueWMSGetFeatureInfoRequests_ = function(coordinate) {
  console.log(this.limit_);
  console.log(this.sourceIdProperty_);
};


/**
 * @private
 */
ngeo.Query.prototype.clearResult_ = function() {
};


ngeoModule.service('ngeoQuery', ngeo.Query);
