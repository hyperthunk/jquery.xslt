beforeEach(function() {
	this.addMatchers({
    	toBePlaying: function(expectedSong) {
      		var player = this.actual;
      		return player.currentlyPlayingSong === expectedSong
          	&& player.isPlaying;
    	},
		toHaveNodeType: function(expectedType) {
			return (this.actual.nodeType == expectedType);
		}
  	})
});
