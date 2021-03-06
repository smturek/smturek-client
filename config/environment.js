/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'smturek',
    environment: environment,
    baseURL: '/',
    adapterURL: process.env.ADAPTER_URL,
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },
    contentSecurityPolicy: {
    'report-uri': "http://localhost:4200",
    'default-src': "'none'",
    'script-src': "'self'",
    'font-src': "'self' https://fonts.gstatic.com",
    'connect-src': "'self' https://smturek-api.herokuapp.com",
    'img-src': "'self' ",
    'style-src': "'self' 'unsafe-inline' https://fonts.googleapis.com https://maxcdn.bootstrapcdn.com/",
    'media-src': "'self'"
    },
    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
