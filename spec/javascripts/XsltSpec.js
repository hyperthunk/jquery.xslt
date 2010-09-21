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
                // console.log('running fake ajax on ' + options.url);
				var data = mock_ajax_requests[options.url];
                // console.log('returning data ' + data);
				options.success(data, 'ok', undefined);
				return true;
			});
		});

        it("should delegate to the custom resolver if one is specified", function() {
            var result = $.xslt.transform({
                source: input,
                stylesheetUrl: xsltUrl,
                urlResolver: function(url) {
                    if (url == xsltUrl)
                        return xslt;
                    return undefined;
                }
            });
            expect(result).toBeDefined();
			expect(ajaxSpy.callCount).toEqual(0);
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

	// TODO: fixutre out how to make this work on platform that don't support it natively
	describe("pre-processing stylesheets to deal with import/includes", function() {

		it('should manually perform includes to work around issues with gekko and webkit', function() {

			var xslt = jasmine.getFixtures().read('fixtures/callout.xslt');
			var emptyDomNode = '<node />';
			var result = $.xslt.transform({
				source: emptyDomNode,
				stylesheet: xslt,
				resultFormat: 'DOM'
			});

			expect(result.selectNodes('output').length).toEqual(1);
			expect(result.selectNodes('output/foo/bar').length).toEqual(1);
			expect(result.selectNodes("output/book[@worm='invisible']").length).toEqual(1);
		});

        xit('should handle xsl:imports and work around issues with gekko and webkit where required', function() {

            var xslt = jasmine.getFixtures().read('fixtures/import.xslt');
            var emptyDomNode = '<node />';
            console.log('output...');

            var result = $.xslt.transform({
                source: emptyDomNode,
                stylesheet: xslt,
                resultFormat: 'DOM'
            });

            console.log(result);
            expect(result.selectNodes('output').length).toEqual(1);
            expect(result.selectNodes('output/foo/bar').length).toEqual(1);
            expect(result.selectNodes("output/book[@worm='invisible']").length).toEqual(1);
        });

        it('should puke for includes where the url is invalid', function() {

            var xslt = jasmine.getFixtures().read('fixtures/invalid_includes.xslt');
            var emptyDomNode = '<node />';
            var bang = function() {
                var result = $.xslt.transform({
                    source: emptyDomNode,
                    stylesheet: xslt,
                    resultFormat: 'DOM'
                });
            };

            expect(bang).toThrow();
        });

        it('should puke for imports where the url is invalid', function() {

            var xslt = jasmine.getFixtures().read('fixtures/invalid_imports.xslt');
            var emptyDomNode = '<node />';
            var bang = function() {
                var result = $.xslt.transform({
                    source: emptyDomNode,
                    stylesheet: xslt,
                    resultFormat: 'DOM'
                });
            };

            expect(bang).toThrow();
        });

	});

    describe("preprocessing stylesheets to replace calls to the document function", function() {

        var xslt;

		beforeEach(function() {
			var xsl = 'fixtures/doc.xslt';
			xslt = jasmine.getFixtures().read(xsl);
		});

        it('should resolve external documents correctly!', function() {
			var result = $.xslt.transform({ source: '<ignored />', stylesheet: xslt });
            // console.log(result);
			expect(result).toContain('p > a:contains(Hello!)');
	    });

        it('should resolve external documents into variables correctly!', function() {
            var xsl = jasmine.getFixtures().read('fixtures/exsldoc.xslt');
			var result = $.xslt.transform({ source: '<ignored />', stylesheet: xsl });
            // console.log(result);
			expect(result).toContain('p:contains(The Algorithm Design Manual)');
            expect(result).toContain("p:contains(Understanding the Linux Kernel)");
			expect(result).toContain('p:contains(Database Systems)');
	    });

    });

	describe("transformations taking input parameters", function() {

		it('should take the supplied input parameters and pass them on to the stylesheet', function() {
			var xslt = jasmine.getFixtures().read('fixtures/params.xslt');
			var emptyDomNode = '<node />';
			var params = {};
			params['param1'] = 'main';
			params['param2'] = 'html-content'
			var result = $.xslt.transform({
				source: emptyDomNode,
				stylesheet: xslt,
				parameters: params,
				tag: 'test-params'
			});

			expect(result).toContain('div#main > p:contains(html-content)');
		});

		it('should clear input parameters between executions', function() {
			var xslt = jasmine.getFixtures().read('fixtures/params.xslt');
			var emptyDomNode = '<node />';
			var result = $.xslt.transform({
				source: emptyDomNode,
				stylesheet: xslt,
				parameters: {
					param1: 'param1',
					param2: 'param2'
				},
				useCache: true
			});

			expect(result).toContain('div#param1 > p:contains(param2)');

			var result2 = $.xslt.transform({
				source: emptyDomNode,
				stylesheet: xslt,
				parameters: {
					param1: 'foo1',
					param2: 'foo2'
				},
				useCache: true
			});

			expect(result2).toContain('div#foo1 > p:contains(foo2)');
		});

		// TODO: fixutre out if this is even possible client side
		xit('should accept an exsl:node-set as a parameter', function() {
			var parser = new DOMParser();
			var xmlString = "<node ref='foo/bar'>Node Value</node>";
			var xmlParam = parser.parseFromString(xmlString, "text/xml");

			var xslt = jasmine.getFixtures().read('fixtures/node-set.xslt');
			var emptyDomNode = '<node />';
			var result = $.xslt.transform({
				source: emptyDomNode,
				stylesheet: xslt,
				parameters: { nodes: xmlParam }
			});

			expect(result).toContain("div > a[href*='foo/bar']");
		});

	});

});
