import Ember from 'ember';

export default Ember.Controller.extend({

  showScoreSubmit: false,
  playerScore: 0,
  showHighScore: false,

  actions: {
    submitScore: function() {
      var playerName = this.get('playerName');
      var playerScore = this.get('playerScore');
      var score = this.store.createRecord('score', {name: playerName, score: playerScore});
      this.set('playerName', '');
      this.set('playerScore', '');
      score.save();
      this.set('showHighScore', true);
      this.set('showScoreSubmit', false);
    },

    endGame: function(score) {
      this.set('showScoreSubmit', true);
      this.set('playerScore', score);
    }
  }
});
