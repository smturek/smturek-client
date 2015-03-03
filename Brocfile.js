/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp();

dotEnv: {
    clientAllowedKeys: ['ADAPTER_URL']
  }

app.import("bower_components/phaser/build/phaser.js");

module.exports = app.toTree();
