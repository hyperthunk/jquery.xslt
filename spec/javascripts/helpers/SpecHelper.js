beforeEach(function() {
	
	this.addMatchers({
    	toHaveNodeType: function(expectedType) {
			return (this.actual.nodeType == expectedType);
		}
		/*
		,
		toContain: function(expected) {
			return (this.actual.indexOf(expected) != -1);
		}
		*/
  	});

});
