/**
 * jquery.xslt.js: jQuery wrapper for Sarissa <http://sarissa.sourceforge.net/>
 *
 * @version   0.0.1
 * @requires  >= jQuery 1.4.2           http://jquery.com/
 * @requires  >= sarissa.js 0.9.9.4     http://sarissa.sourceforge.net/
 */
(function($) {

    $.extend({
        xslt : {
			JQUERY_XSLT_NS_URI: 'http://www.w3.org/1999/XSL/Transform',
            __serializer: new XMLSerializer(),
            useCache: false,
            cache: {
				raw: {},
				compiled: {},
				get: function(key) {
					return (jQuery.xslt.cache.raw[key] || jQuery.xslt.cache.compiled[key]);
				},
				put: function(key, raw, compiled) {
					jQuery.xslt.cache.raw[key] = raw;
					if (compiled) {
						jQuery.xslt.cache.compiled[key] = compiled;
					}
				},
				contains: function(key) {
					return !(jQuery.cache.get(key) === undefined);
				}
			},
            errorHandler: function(xhr, textStatus, errorThrown) {
                throw {
					error: "RemoteError",
					exception: errorThrown,
					message: textStatus,
					context: xhr
				};
            },
            fetchUrl: function(url, callback, ignoreCache) {
				if (!ignoreCache) {
					var cached = jQuery.xslt.cache.get(url);
					if (cached) {
						callback(cached, 'cached', undefined);
					}
				}
                jQuery.ajax({
                    url: url,
                    async: false,
                    type: 'GET',
                    contentType: 'application/xml',
                    xhr: jQuery.xslt.xhr,
                    error: jQuery.xslt.errorHandler,
                    success: function(data, status, xhr) {
						var compiled = callback(data, status, xhr);
						if (!ignoreCache) {
							jQuery.xslt.cache.put(url, data, compiled);
						}
					}
                });
            },
            xhr: function() {
                // TODO: use object detection instead of browser detection!?
                if (jQuery.browser.msie && jQuery.browser.version.substr(0, 1) <= 7)
                    return new ActiveXObject("Microsoft.XMLHTTP");
                else
                    return new XMLHttpRequest();
            },
            transform: function(options) {
                var proc = jQuery.xslt.loadTransform(options);
                var xml = jQuery.xslt.loadXML(options);
				var params = options.parameters;
                if (params) {
                    for (param in params) {
                        if (params.hasOwnProperty(param)) {
							proc.setParameter(null, param, params[param]);
						}
                    }
                }
                var result = proc.transformToDocument(xml);
                proc.clearParameters();
                return jQuery.xslt.parseResult(result, options);
            },
            parseResult: function(result, options) {
                if (options.resultFormat == 'DOM')
                    return result;
                return jQuery(jQuery.xslt.__serializer.serializeToString(result));
            },
            loadXML: function(options) {
                var src = options.source;
				var xml;
                if (typeof src === 'string') {
					xml = (options.nocompile) ? undefined : new DOMParser().parseFromString(src, "text/xml");
                    if (options.useCache || options.hasOwnProperty('sourceUrl')) {
						jQuery.xslt.cache.put(options.sourceUrl, src, xml);
					}
					return xml || src;
                } else if (typeof src === 'undefined') {
					jQuery.xslt.fetchUrl(options.sourceUrl, function(data, _textStatus, _xhr) {
						// TODO: get content type from the reponse object
						if (options.nocompile) {
							xml = data;
							return undefined;
						} else {
							xml = new DOMParser().parseFromString(xml, "text/xml");
							return xml;
						}
					}, options.useCache);
					return xml;
				} else {
					return src;
                }

                // return new DOMParser().parseFromString(xml, "text/xml");
            },
            loadTransform: function(options) {
                var xsl = options.stylesheet;
				var compiledXsl = undefined;
				var compileXsl = function(data, _textStatus, _xhr) {
					var doc = jQuery.xslt.preCompile(data);
                    var proc = new XSLTProcessor();
	                proc.importStylesheet(doc);
	                compiledXsl = proc;
					return compiledXsl;
                };
                if (typeof xsl === 'undefined') {
                    // return $.xslt.cache[options.cacheKey];
					xsl = options.stylesheetUrl;

					// NB: moved all cache control into jQuery.xslt.fetchUrl
					/*
					if (options.useCache || jQuery.xslt.useCache) {
                        var xfm = jQuery.xslt.cache[xsl];
                        if (xfm) {
                            return xfm;
                        }
                    }
					*/

					jQuery.xslt.fetchUrl(xsl, compileXsl, (options.useCache || jQuery.xslt.useCache));
					/*
					if (options.useCache || jQuery.xslt.useCache) {
						jQuery.xslt.cache[xsl] = compiledXsl;
					}
					*/

                } else {
					compileXsl(xsl);
				}

				return compiledXsl;
            },
			preCompile: function(data) {
				var doc = jQuery.xslt.convertToDom(data);
				if (jQuery.browser.mozilla || jQuery.browser.webkit || jQuery.browser.opera) {
					var nsmap = jQuery.xslt.extractNamespaces(doc);
					var root = doc.documentElement;

					// TODO: for mozilla use XPathEvalutator instead!

					var includeNodes = root.getElementsByTagName('include');
					if (includeNodes.length == 0 && jQuery.browser.mozilla) {
						includeNodes = root.getElementsByTagName(nsmap.uri[jQuery.xslt.JQUERY_XSLT_NS_URI] + ':include');
					}
					var includes = jQuery.grep(includeNodes, function(e, _) {
						return e.namespaceURI == jQuery.xslt.JQUERY_XSLT_NS_URI;
					});
					jQuery.each(includes, function(_, elem) {
						var href = elem.getAttribute('href');
						var parent = elem.parentNode;

						if (jQuery.browser.webkit) {
							// TODO: make this work in Opera and/or FF
							var xslns = nsmap.uri[jQuery.xslt.JQUERY_XSLT_NS_URI];
							var incl = "  INLINED <" + xslns + ':include href="' + href + '" />  ';
							var comment = doc.createComment(incl);
							parent.insertBefore(comment, elem);
						}

						parent.removeChild(elem);

						// NB: we don't want to compile or cache these!
                        try {
                            var data = jQuery.xslt.loadXML({sourceUrl: href, nocompile: true, useCache: true});
                            var xsl = jQuery.xslt.preCompile(data);
                            var xslNsmap = jQuery.xslt.extractNamespaces(xsl);
                            jQuery.xslt.mergeDocuments(doc, xsl, function(e) {
                                if (e.nodeName.indexOf(':') != -1) {
                                    var pair = e.nodeName.split(':');
                                    if (pair[1] == 'output' && e.namespaceURI == jQuery.xslt.JQUERY_XSLT_NS_URI) {
                                        return false;
                                    }
                                    /*
                                    if (xslNsmap.prefix[pair[0]] == jQuery.xslt.JQUERY_XSLT_NS_URI) {
                                        return (pair[1] != 'output');
                                    }
                                    */
                                }
                                return true;
                            });
                        } catch (e) {
                            // ignored (log it?)
                            if (e) {
                                console.log(e);
                            }
                        }
					});
				}
				return doc;
			},
			mergeDocuments: function(doc, include, checkfunc) {
				var root = doc.documentElement;
				var target = (root.hasChildNodes()) ? root.firstChild : root;
				jQuery.each(include.documentElement.childNodes, function(_,e) {
					if (checkfunc && checkfunc(e)) {
						root.appendChild(e.cloneNode(true));
					}
				});
			},
			extractNamespaces: function(doc) {
				nsmap = {
					prefix: {},
					uri: {}
				};

				var root = doc.documentElement;
				for (i = 0; i < root.attributes.length; i++) {
					var attr = root.attributes[i];
					if (attr.namespaceURI == 'http://www.w3.org/2000/xmlns/') {
						var prefix = attr.name.replace('xmlns:', '');
						var uri = attr.value;
						nsmap.prefix[prefix] = uri;
						nsmap.uri[uri] = prefix;
					}
				}

				return nsmap;
			},
			convertToDom: function(data) {
				// TODO: get content type from the reponse object
				return (typeof data === 'string') ?
					new DOMParser().parseFromString(data, "text/xml") : data;
			}
        }
    });

    $.fn.xslt = function() {
        if (arguments.length == 1) {
            return jQuery.xslt.transform.apply(this, arguments);
        } else {
            if (arguments.length == 2) {
                return jQuery.xslt.transform({ stylesheetUrl: arguments[0], sourceUrl: [1] });
            } else if (arguments.length == 3) {
                return jQuery.xslt.transform({
                    stylesheetUrl: arguments[0],
                    sourceUrl: arguments[1],
                    parameters: arguments[2]
                });
            } else {
                throw "Bad Arguments: jQuery.fn.xlst only takes between 1 and 3 parameters";
            }
        }
    };

    $.fn.transform = function() {
        if (arguments.length == 1) {
            return this.html(jQuery.xslt.transform.apply(this, arguments));
        } else if (arguments.length == 2) {
            return this.html(jQuery.xslt.transform({
                stylesheetUrl: arguments[0],
                sourceUrl: arguments[1]
            }));
        } else if (arguments.length == 3) {
            return this.html(jQuery.xslt.transform({
                stylesheetUrl: arguments[0],
                sourceUrl: arguments[1],
                parameters: arguments[2]
            }));
        } else {
            throw "Bad Arguments: jQuery.fn.xlst only takes between 1 and 3 parameters";
        }
    };

})(jQuery);
