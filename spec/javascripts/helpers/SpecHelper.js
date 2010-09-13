beforeEach(function() {
	
	this.addMatchers({
    	toHaveNodeType: function(expectedType) {
			return (this.actual.nodeType == expectedType);
		}
  	});

});
