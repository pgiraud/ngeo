goog.provide('styleediting');

goog.require('goog.color.alpha');
goog.require('ngeo.mapDirective');
goog.require('ol.Feature');
goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.layer.Tile');
goog.require('ol.layer.Vector');
goog.require('ol.source.OSM');
goog.require('ol.source.Vector');
goog.require('ol.style.RegularShape');
goog.require('ol.style.Stroke');
goog.require('ol.style.Text');


/** @const **/
var app = {};


/** @type {!angular.Module} **/
app.module = angular.module('app', ['ngeo']);


/**
 * @return {angular.Directive} Directive Definition Object.
 */
app.styleEditingDirective = function() {
  return {
    restrict: 'E',
    scope: {
      'feature': '=appStyleEditingFeature'
    },
    controller: 'AppStyleEditingController',
    bindToController: true,
    controllerAs: 'ctrl',
    templateUrl: 'partials/styleediting.html'
  };
};


app.module.directive('appStyleEditing', app.styleEditingDirective);



/**
 * @param {angular.Scope} $scope The scope.
 * @constructor
 */
app.StyleEditingController = function($scope) {

  /**
   * @type {ol.Feature}
   * @export
   */
  this.feature;


  /**
   * @type {string}
   * @export
   */
  this.type;


  /**
   * @type {string}
   * @export
   */
  this.color;


  /**
   * @type {number}
   * @export
   */
  this.opacity;


  /**
   * @type {string}
   * @export
   */
  this.shape;


  /**
   * @type {Array<string>}
   * @export
   */
  this.colors = [
    ['#880015', '#ed1c24', '#ff7f27', '#fff200', '#22b14c', '#00a2e8',
      '#3f48cc', '#a349a4'],
    ['#b97a57', '#ffaec9', '#ffc90e', '#efe4b0', '#b5e61d', '#99d9ea',
      '#7092be', '#c8bfe7'],
    ['#ffffff', '#f7f7f7', '#c3c3c3', '#000000']
  ];

  $scope.$watch(angular.bind(this, function() {
    return this.feature;
  }), angular.bind(this, function() {
    var style = this.feature.get('__style__');
    this.type = this.feature.getGeometry().getType().toLowerCase();
    if (this.type == 'point' && style['text']) {
      this.type = 'text';
    }
    this.color = style['color'];
    this.opacity = style['opacity'];
    this.shape = style['shape'];
    this.lineDash = style['lineDash'];
  }));
};


/**
 * @param {string} lineDash
 * @export
 */
app.StyleEditingController.prototype.setLineDash = function(lineDash) {
  var style = this.feature.get('__style__');
  style['lineDash'] = lineDash;
  this.lineDash = lineDash;
  this.feature.changed();
};


/**
 * @param {string} shape
 * @export
 */
app.StyleEditingController.prototype.setShape = function(shape) {
  var style = this.feature.get('__style__');
  style['shape'] = shape;
  this.shape = shape;
  this.feature.changed();
};


/**
 * @param {number} val
 * @return {*}
 * @export
 */
app.StyleEditingController.prototype.getSetSize = function(val) {
  var style = this.feature.get('__style__');
  if (arguments.length) {
    style['size'] = parseFloat(val);
    this.feature.changed();
    return;
  } else {
    return style['size'];
  }
};


/**
 * @param {number} val
 * @return {*}
 * @export
 */
app.StyleEditingController.prototype.getSetRotation = function(val) {
  var style = this.feature.get('__style__');
  if (arguments.length) {
    style['rotation'] = parseFloat(val) / 360 * Math.PI * 2;
    this.feature.changed();
    return;
  } else {
    return style['rotation'] * 360 / Math.PI / 2;
  }
};


/**
 * @param {number} val
 * @return {*}
 * @export
 */
app.StyleEditingController.prototype.getSetOpacity = function(val) {
  var style = this.feature.get('__style__');
  if (arguments.length) {
    this.opacity = 1 - (parseFloat(val) / 100);
    style['opacity'] = this.opacity;
    this.feature.changed();
    return;
  } else {
    return (1 - this.opacity) * 100;
  }
};


/**
 * @param {string} val
 * @return {*}
 * @export
 */
app.StyleEditingController.prototype.setColor = function(val) {
  var style = this.feature.get('__style__');
  if (arguments.length) {
    style['color'] = val;
    this.feature.changed();
    this.color = val;
    return;
  } else {
    return goog.color.parseRgb(style['color']);
  }
};


app.module.controller('AppStyleEditingController', app.StyleEditingController);



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
   * @type {Array<ol.Feature>}
   * @export
   */
  this.features = {
    'point': new ol.Feature({
      geometry: new ol.geom.Point([0, 0])
    }),
    'line': new ol.Feature({
      geometry: new ol.geom.LineString([
        [0, 0], [1000000, 0], [1000000, 1000000], [0, 1000000]])
    }),
    'polygon': new ol.Feature({
      geometry: new ol.geom.Polygon([
        [[0, 0], [1000000, 0], [1000000, 1000000], [0, 1000000], [0, 0]]])
    }),
    'text': new ol.Feature({
      geometry: new ol.geom.Point([0, 0]),
      name: 'foo bar'
    })
  };

  var styleFunction = function(feature, resolution) {
    // goog.asserts.assert(goog.isDef(this.get('__style__'));
    var style = this.get('__style__');
    var color = style['color'];
    var rgb = goog.color.hexToRgb(color);
    var fillColor = goog.color.alpha.rgbaToRgbaStyle(rgb[0], rgb[1], rgb[2],
        style['opacity']);
    var fill = new ol.style.Fill({
      color: fillColor
    });

    var lineDash;
    if (style['lineDash']) {
      var size = style['size'];
      switch (style['lineDash']) {
        case 'dashed':
          lineDash = [10 * size, 10 * size];
          break;
        case 'dotted':
          lineDash = [0.5 * size, 3 * size];
          break;
      }
    }

    var stroke;

    if (style['size'] > 0) {
      stroke = new ol.style.Stroke({
        color: color,
        width: style['size'],
        lineDash: lineDash
      });
    }
    var imageOptions = {
      fill: fill,
      stroke: new ol.style.Stroke({
        color: color,
        width: style['size'] / 7
      }),
      radius: style['size']
    };
    var image = new ol.style.Circle(imageOptions);
    if (style['shape'] && style['shape'] != 'circle') {
      goog.object.extend(imageOptions, {
        points: 4,
        angle: Math.PI / 4,
        rotation: style['rotation']
      });
      image = new ol.style.RegularShape(imageOptions);
    }

    if (style['text']) {
      return [
        new ol.style.Style({
          text: new ol.style.Text({
            text: this.get('name'),
            font: style['size'] + 'px Sans-serif',
            rotation: style['rotation'],
            fill: new ol.style.Fill({
              color: color
            }),
            stroke: new ol.style.Stroke({
              color: 'white',
              width: 2
            })
          })
        })
      ];
    }

    return [
      new ol.style.Style({
        image: image,
        fill: fill,
        stroke: stroke
      })
    ];
  };

  for (var type in this.features) {
    var feature = this.features[type];

    feature.setStyle(styleFunction);
    feature.set('__style__', {
      color: '#ed1c24',
      opacity: 0.2,
      size: feature.getGeometry().getType() == 'Point' ? 10 : 1.25,
      shape: 'circle',
      rotation: 0,
      lineDash: 'plain'
    });
  }

  this.features['text'].get('__style__')['text'] = true;

  /**
   * @type {Array<ol.Feature>}
   * @export
   */
  this.feature = this.features['point'];


  /**
   * @type {ol.layer.Vector}
   * @private
   */
  this.layer_ = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: [this.feature]
    })
  });
  this.layer_.setMap(this.map);
};


/**
 *
 * @param {string} type
 */
app.MainController.prototype.switch = function(type) {
  if (this.currentTypeIndex_ >= this.features.length) {
    this.currentTypeIndex_ = 0;
  }
  var source = this.layer_.getSource();
  source.clear();
  this.feature = this.features[type];
  source.addFeature(this.feature);
};


app.module.controller('MainController', app.MainController);
