goog.require('gmf.Themes');
goog.require('gmf.QueryManager');
goog.require('gmf.test.data.themes');

describe('gmf.QueryManager', function() {
  var queryManager;
  var gmfThemes;
  var $httpBackend;

  beforeEach(function() {
    module('ngeo', function($provide) {
      $provide.value('ngeoQueryOptions', {});
    });
    inject(function($injector) {
      queryManager = $injector.get('gmfQueryManager');
      queryManager.sources_.length = 0;
      gmfThemes = $injector.get('gmfThemes');
      var treeUrl = $injector.get('gmfTreeUrl');
      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', treeUrl).respond(themes);
    });
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  var getSourceById = function(sources, id) {
    var results = $.grep(sources, function(source) {
      return source.id === id;
    });
    return (results.length > 0) ? results[0] : null;
  };

  describe('#handleThemesLoad_', function() {
    it('creates sources when the themes are loaded', function() {
      gmfThemes.loadThemes();
      $httpBackend.flush();
      expect(queryManager.sources_.length).toBeGreaterThan(0);

      // overlay layer
      var osmSource = getSourceById(queryManager.sources_, 109);
      expect(osmSource).not.toBeNull();

      // background layer
      var bgLayerSource = getSourceById(queryManager.sources_, 134);
      expect(bgLayerSource).not.toBeNull();
      expect(bgLayerSource.params.LAYERS).toBe('ch.are.alpenkonvention');
      expect(bgLayerSource.url).toBe('https://wms.geo.admin.ch/');
    });
  });

  describe('#createSources_', function() {
    it('creates a source only with queryable child layers', function() {
      var osmTheme = gmf.Themes.findThemeByName(themes.themes, 'OSM');
      queryManager.createSources_(osmTheme);
      var osmSource = getSourceById(queryManager.sources_, 109);
      // hotel is ignored because `queryable` is `0`
      var expectedLayers =
          'fuel,information,cinema,alpine_hut,bank,bus_stop,cafe,parking,' +
          'place_of_worship,police,post_office,restaurant,zoo';
      expect(osmSource.params.LAYERS).toBe(expectedLayers);
    });

    it('creates a source for queryable WMTS overlay layers', function() {
      var cadasterTheme = gmf.Themes.findThemeByName(themes.themes, 'Cadastre');
      queryManager.createSources_(cadasterTheme);

      // layer 'non-queryable-wmts-layer' without `wmsUrl`
      var sourceNonQueryable = getSourceById(queryManager.sources_, 91346);
      expect(sourceNonQueryable).toBeNull();

      // layer 'ch.are.alpenkonvention' with `wmsUrl` and `wmsLayers` and `queryLayers`
      // (`wmsLayers` takes precedence over `queryLayers`)
      var sourceAlpConvention = getSourceById(queryManager.sources_, 119);
      expect(sourceAlpConvention).toBeDefined();
      expect(sourceAlpConvention.params.LAYERS).toBe('ch.are.alpenkonvention');

      // layer 'ch.astra.ausnahmetransportrouten' with `wmsUrl` and `queryLayers`
      var sourceRoutes = getSourceById(queryManager.sources_, 120);
      expect(sourceRoutes).toBeDefined();
      expect(sourceRoutes.params.LAYERS).toBe('ch.astra.ausnahmetransportrouten');
    });
  });
});
