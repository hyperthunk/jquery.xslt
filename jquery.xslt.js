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
                $.ajax({
                    url: url,
                    async: false,
                    type: 'GET',
                    contentType: 'application/xml',
                    xhr: $.xslt.xhr,
                    error: $.xslt.errorHandler,
                    success: callback
                });  
            },
            xhr: function() {
                // TODO: use object detection instead of browser detection!?
                if ($.browser.msie && $.browser.version.substr(0, 1) <= 7)
                    return new ActiveXObject("Microsoft.XMLHTTP");
                else
                    return new XMLHttpRequest();
            },
            transform: function(options) {
                var proc = $.xslt.loadTransform(options);
                var xml = $.xslt.loadXML(options);
                //if (options.parameters) {
                //    $(options.parameters).each(function(p) {
                //        proc.setParameter(null, "title", paramValue);      
                //    });
                //}
                var result = proc.transformToDocument(xml);
                //proc.clearParameters();
                return parseResult(result, options); 
            },
            parseResult: function(result, options) {
                if (options.resultFormat == 'DOM')
                    return result;
                return $($.xslt.__serializer.serializeToString(result));  
            },
            loadXML: function(options) {
                var src = options.source;
                if (src) {
                    return src;
                } else {
                    var xml = undefined;
                    $.xslt.fetchUrl(options.sourceUrl,
                        function(data, _textStatus, _xhr) {
                            xml = data;
                        });
                    return xml;
                }
            },
            loadTransform: function(options) {
                var xsl = options.stylesheet;
                if (typeof xsl === 'undefined') {
                    return $.xslt.cache[options.cacheKey];
                } else {
                    if (options.useCash || $.xslt.useCache) {
                        var xfm = $.xslt.cache[xsl];
                        if (xfm) {
                            return xfm;
                        }
                    }
                    success = function(data, _textStatus, _xhr) {
                        var proc = new XSLTProcessor();
                        proc.importStylesheet(data);
                        $.xslt.cache[xsl] = proc;
                    };
                    $.xslt.fetchUrl(xsl, success);
                    return $.xslt.cache[xsl];
                }
            }
        }
    });
    
    $.fn.xslt = function() {
        if (arguments.length == 1) {
            return $.xslt.transform.apply(this, arguments)
        } else {
            if (arguments.length == 2) {
                return $.xslt.transform({ stylesheet: arguments[0], source: [1] });
            } else if (arguments.length == 3) {
                return $.xslt.transform({
                    transform: arguments[0],
                    source: arguments[1],
                    parameters: arguments[2]
                });
            } else {
                throw "Bad Arguments: $.fn.xlst only takes between 1 and 3 parameters";
            }
        }
    };
    
    $.fn.transform = function() {
        if (arguments.length == 1) {
            return this.replaceWith($.xslt.transform({
                stylesheet: arguments[0],
                source: this
            }));
        } else if (arguments.length == 2) {
            return this.replaceWith($.xslt.transform({
                stylesheet: arguments[0],
                source: arguments[1]
            }));
        } else if (arguments.length == 3) {
            return this.replaceWith($.xslt.transform({
                stylesheet: arguments[0],
                source: arguments[1],
                parameters: arguments[3]
            }));
        } else {
            throw "Bad Arguments: $.fn.xlst only takes between 1 and 3 parameters";
        }
    };

})(jQuery);