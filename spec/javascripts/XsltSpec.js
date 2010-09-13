describe("jquery.xslt", function() {
  
	describe("transformations operating on URLs", function() {
		
		var input, xslt;		
		var inputUrl = 'fixtures/input.xml';
		var xsltUrl = 'fixtures/books.xslt';
		var mock_ajax_requests = {};
		
		beforeEach(function() {
			loadFixtures('fixtures/fixture-target.html');
			var xml = 'fixtures/input.xml';
			var xsl = 'fixtures/books.xslt';

			input = jasmine.getFixtures().read(inputUrl);
			xslt = jasmine.getFixtures().read(xsltUrl);
			mock_ajax_requests[xml] = input;
			mock_ajax_requests[xsl] = xslt;
			spyOn($, 'ajax').andCallFake(function(options) { 
				var data = mock_ajax_requests[options.url];
				options.success(data, 'ok', undefined);
				return true; 
			});
		});
		
		it("should fetch the input and xslt documents via $.ajax", function() {
			var result = $.xslt.transform({ 
				sourceUrl: inputUrl, 
				stylesheetUrl: xsltUrl
			});
			expect(result.find('p > a').length).toEqual(3);
		});
		
	});

  	describe("transformations operating on raw (string) data", function() {

		var input, xslt;

		beforeEach(function() {
			loadFixtures('fixtures/fixture-target.html');
			var xml = 'fixtures/input.xml';
			var xsl = 'fixtures/books.xslt';

			input = jasmine.getFixtures().read(xml);
			xslt = jasmine.getFixtures().read(xsl);
		});
    
	    it("should apply the input and xslt to produce a viable result", function() {
			var result = $.xslt.transform({ source: input, stylesheet: xslt });
			expect(result).toContain('p > a[href*=Skiena]:contains(The Algorithm Design Manual)');
			expect(result).toContain("p > a[href*='Bovet'][href$='Cesati']:contains(Understanding the Linux Kernel)");		
			expect(result).toContain('p > a[href$=Date]:contains(Database Systems)');
	    });

		it("should return a raw DOM document when requested", function() {
			var result = $.xslt.transform({ source: input, stylesheet: xslt, resultFormat: 'DOM' });
			expect(result).toHaveNodeType(Node.DOCUMENT_NODE);
		});

  	});

	describe("transformations taking input parameters", function() {
		
		xit('should take the supplied input parameters and pass them on to the stylesheet', function() {});
		
		xit('should clear input parameters between executions', function() {});
		
	});

});