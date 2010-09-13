describe("jquery.xslt", function() {
  
  describe("transformations operating on raw (string) data", function() {

	var input, xslt;

    beforeEach(function() {
        loadFixtures('fixtures/fixture-target.html');
    	input = jasmine.getFixtures().read('fixtures/input.xml');
		xslt = jasmine.getFixtures().read('fixtures/books.xslt');
    });
    
    it("should apply the input and xslt to produce a viable result", function() {
		var result = $.xslt.transform({ source: input, stylesheet: xslt });
		expect(result).toContain('p > a[href*=Skiena]:contains(The Algorithm Design Manual)');
		expect(result).toContain("p > a[href*='Bovet'][href$='Cesati']:contains(Understanding the Linux Kernel)");		
		expect(result).toContain('p > a[href$=Date]:contains(Database Systems)');
    });

	it("should return a raw DOM document when requested", function() {
		var result = $.xslt.transform({ source: input, stylesheet: xslt, resultFormat: 'DOM' });
		this.log(result.nodeType == Node.DOCUMENT_NODE);
		expect(result).toHaveNodeType(Node.DOCUMENT_NODE);
	});

  });

});