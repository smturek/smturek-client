import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource("games", function() {
    this.route("binding");
  });
  this.resource("resume", function() {});
  this.resource("blog", function() {});
  this.resource("portfolio", function() {});
});

export default Router;
