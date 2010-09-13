describe("jquery.xslt", function() {
  
	describe("transformations operating on URLs", function() {
		
		var input, xslt;		
		var inputUrl = 'fixtures/input.xml';
		var xsltUrl = 'fixtures/books.xslt';
		var mock_ajax_requests = {};
		var ajaxSpy;
		
		beforeEach(function() {
			loadFixtures('fixtures/fixture-target.html');
			var xml = 'fixtures/input.xml';
			var xsl = 'fixtures/books.xslt';

			input = jasmine.getFixtures().read(inputUrl);
			xslt = jasmine.getFixtures().read(xsltUrl);
			mock_ajax_requests[xml] = input;
			mock_ajax_requests[xsl] = xslt;
			ajaxSpy = spyOn($, 'ajax').andCallFake(function(options) { 
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
		
		it("should provide transparent caching of xslt results", function() {
			call = function() {
				var result = $.xslt.transform({ 
					source: input, 
					stylesheetUrl: xsltUrl,
					useCache: true,
					tag: 'cache-test'
				});
				expect(result).toBeDefined();
			};
			call(); // calls the ajax function
			call(); // uses cached results instead
			expect(ajaxSpy.callCount).toEqual(1);
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

	describe("transformations operating on pre-compiled DOM objects", function() {
	
		var input, xslt;

		beforeEach(function() {
			loadFixtures('fixtures/fixture-target.html');
			var xml = 'fixtures/input.xml';
			var xsl = 'fixtures/books.xslt';

			input = jasmine.getFixtures().read(xml);
			xslt = jasmine.getFixtures().read(xsl);
		});	
		
		it("should apply the input and xslt DOM objects to produce a viable result", function() {
			var parser = new DOMParser();
			var result = $.xslt.transform({ 
				source: parser.parseFromString(input, "text/xml"), 
			   	stylesheet: parser.parseFromString(xslt, "text/xml")
			});
			expect(result).toContain('p > a[href*=Skiena]:contains(The Algorithm Design Manual)');
			expect(result).toContain("p > a[href*='Bovet'][href$='Cesati']:contains(Understanding the Linux Kernel)");		
			expect(result).toContain('p > a[href$=Date]:contains(Database Systems)');
	    });
		
	});

	describe("transformations taking input parameters", function() {
		
		xit('should take the supplied input parameters and pass them on to the stylesheet', function() {});
		
		xit('should clear input parameters between executions', function() {});
		
		xit('should accept an exsl:node-set as a parameter', function() {});
		
	});

});