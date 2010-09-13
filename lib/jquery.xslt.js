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
            __serializer: new XMLSerializer(),
            useCache: false,
            cache: {},
            errorHandler: function(xhr, textStatus, errorThrown) {
                throw errorThrown;
            },
            fetchUrl: function(url, callback) {
                jQuery.ajax({
                    url: url,
                    async: false,
                    type: 'GET',
                    contentType: 'application/xml',
                    xhr: jQuery.xslt.xhr,
                    error: jQuery.xslt.errorHandler,
                    success: callback
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
                //if (options.parameters) {
                //    $(options.parameters).each(function(p) {
                //        proc.setParameter(null, "title", paramValue);      
                //    });
                //}
                var result = proc.transformToDocument(xml);
                //proc.clearParameters();
                return jQuery.xslt.parseResult(result, options); 
            },
            parseResult: function(result, options) {
                if (options.resultFormat == 'DOM')
                    return result;
                return jQuery(jQuery.xslt.__serializer.serializeToString(result));  
            },
            loadXML: function(options) {
                var src = options.source;
				var xml = undefined;
                if (typeof src === 'string') {
                    xml = src;
                } else if (typeof src === 'undefined') {
                    jQuery.xslt.fetchUrl(options.sourceUrl,
                        function(data, _textStatus, _xhr) {
                            xml = data;
                        });
				} else {
					return src;
                }

				// TODO: get content type from the reponse object 
                return new DOMParser().parseFromString(xml, "text/xml");
            },
            loadTransform: function(options) {
                var xsl = options.stylesheet;
				var compiledXsl = undefined;
				var compileXsl = function(data, _textStatus, _xhr) {
					// TODO: get content type from the reponse object 
					var doc = (typeof data === 'string') ?
						new DOMParser().parseFromString(data, "text/xml") :
						data;
                    var proc = new XSLTProcessor();
                    proc.importStylesheet(doc);
                    compiledXsl = proc;
                };
                if (typeof xsl === 'undefined') {
                    // return $.xslt.cache[options.cacheKey];
					xsl = options.stylesheetUrl;
					if (options.useCache || jQuery.xslt.useCache) {
                        var xfm = jQuery.xslt.cache[xsl];
                        if (xfm) {
                            return xfm;
                        }
                    }
                    
					jQuery.xslt.fetchUrl(xsl, compileXsl);
					if (options.useCache || jQuery.xslt.useCache) {
						jQuery.xslt.cache[xsl] = compiledXsl;
					}
					
                } else {
					compileXsl(xsl);
				}
				
				return compiledXsl;
            }
        }
    });
    
    $.fn.xslt = function() {
        if (arguments.length == 1) {
            return jQuery.xslt.transform.apply(this, arguments)
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
