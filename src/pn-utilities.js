/*!
 * Phantom Net Utilities
 * Original author: Green Grass (http://nguyenngocminh.info)
 * Licensed under the MIT license
 * 
 * Dependencies:
 * - Modernizr (optional)
 * - jQuery
 * - jQuery.UI (optional)
 */

(function ($, window, document, undefined) {

    "use strict";

    if (window.PN === undefined) {
        window.PN = function () { };
    }
    var PN = window.PN;

    if (PN.showErrorMessages !== undefined) {
        return;
    }

    // ////////////////////////////////////////////////////////////////
    // // Globalization
    // var currentCulture = '';
    // var Globalization = PN.Class.extend({

    //     getCurrentCulture: function () {
    //         return currentCulture;
    //     },

    //     setCurrentCulture: function (culture) {
    //         currentCulture = culture;
    //         switch (culture) {
    //             case 'vi':
    //                 $.validator.addMethod('date', function (value, element) {
    //                     return true;
    //                 });
    //                 $.validator.addMethod('number', function (value, element) {
    //                     return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:.\d{3})+)?(?:\,\d+)?$/.test(value);
    //                 });
    //                 break;
    //             default:
    //                 if (currentCulture == '') {
    //                     return;
    //                 }

    //                 // Reset to default
    //                 $.validator.addMethod('date', function (value, element) {
    //                     return this.optional(element) || !/Invalid|NaN/.test(new Date(value).toString());
    //                 });
    //                 $.validator.addMethod('number', function (value, element) {
    //                     return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
    //                 });
    //                 break;
    //         }
    //     }

    // });

    // PN.Globalization = new Globalization();

    ////////////////////////////////////////////////////////////////
    // showErrorMessages
    PN.showErrorMessages = function (messages) {
        alert(messages);
    };

    ////////////////////////////////////////////////////////////////
    // toAscii
    var _unicode = "áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴđĐ",
        _ascii = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyAAAAAAAAAAAAAAAAAEEEEEEEEEEEIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYYdD";
    PN.toAscii = function (source) {
        for (var i = 0; i < _unicode.length; i++) {
            var regexp = new RegExp(_unicode.substr(i, 1), "g");
            source = source.replace(regexp, _ascii.substr(i, 1));
        }
        return source;
    };

    ////////////////////////////////////////////////////////////////
    // camelToKebabCase
    PN.camelToKebabCase = function (source) {
        return source.replace(/\W+/g, '-').replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();;
    };

    ////////////////////////////////////////////////////////////////
    // kebabToCamelCase
    PN.kebabToCamelCase = function (source) {
        return source.replace(/(\-\w)/g, function (m) { return m[1].toUpperCase(); });
    };

    ////////////////////////////////////////////////////////////////
    // outerHtml
    PN.outerHtml = function (elements) {
        return $("<div></div>").append($(elements).clone()).html();
    };

    ////////////////////////////////////////////////////////////////
    // textWithLineBreaks
    PN.textWithLineBreaks = function (html) {
        var breakToken = '_______break_______',
            lineBreakedHtml = html.replace(/<br\s?\/?>/gi, breakToken)
                                  .replace(/<p\.*?>(.*?)<\/p>/gi, breakToken + "$1" + breakToken)
                                  .replace(/<div\.*?>(.*?)<\/div>/gi, breakToken + "$1" + breakToken)
                                  .replace(/<li\.*?>(.*?)<\/li>/gi, breakToken + "$1" + breakToken);
        var ret = $("<div></div>").html(lineBreakedHtml).text().replace(/\n/g, "").replace(new RegExp(breakToken, "g"), "\n");
        while (ret.indexOf("\n\n") > -1) {
            ret = ret.replace("\n\n", "\n");
        }
        return ret;
    };

    ////////////////////////////////////////////////////////////////
    // escapeHtmlWithLineBreaks
    PN.escapeHtmlWithLineBreaks = function (html) {
        return html.replace(/&/g, "&amp;")
                   .replace(/</g, "&lt;")
                   .replace(/>/g, "&gt;")
                   .replace(/\n/g, "<br />");
    };

    ////////////////////////////////////////////////////////////////
    // toUrlFriendly
    PN.toUrlFriendly = function (source) {
        source = PN.toAscii(source).trim().toLowerCase();
        source = source.replace(/ /g, "-");
        source = source.replace(/&nbsp;/g, "-");
        source = source.replace(/[^0-9a-z-]/g, "");
        while (source.indexOf("--") > -1) {
            source = source.replace(/--/g, "-");
        }
        return source;
    };

    ////////////////////////////////////////////////////////////////
    // pasteHtmlAtCaret
    // http://stackoverflow.com/questions/6690752/insert-html-at-caret-in-a-contenteditable-div/6691294#6691294
    PN.pasteHtmlAtCaret = function (html, selectPastedContent) {
        var sel, range;
        if (window.getSelection) {
            // IE9 and non-IE
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();

                // Range.createContextualFragment() would be useful here but is
                // only relatively recently standardized and is not supported in
                // some browsers (IE9, for one)
                var el = document.createElement("div");
                el.innerHTML = html;
                var frag = document.createDocumentFragment(), node, lastNode;
                while ((node = el.firstChild)) {
                    lastNode = frag.appendChild(node);
                }
                var firstNode = frag.firstChild;
                range.insertNode(frag);

                // Preserve the selection
                if (lastNode) {
                    range = range.cloneRange();
                    range.setStartAfter(lastNode);
                    if (selectPastedContent) {
                        range.setStartBefore(firstNode);
                    } else {
                        range.collapse(true);
                    }
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        } else if ((sel = document.selection) && sel.type != "Control") {
            // IE < 9
            var originalRange = sel.createRange();
            originalRange.collapse(true);
            sel.createRange().pasteHTML(html);
            if (selectPastedContent) {
                range = sel.createRange();
                range.setEndPoint("StartToStart", originalRange);
                range.select();
            }
        }
    };

    ////////////////////////////////////////////////////////////////
    // turnOnContentHtml
    PN.turnOnContentHtml = function (html) {
        html = html || '';

        var regexp, match, replacement;

        // Name base images
        regexp = /\[image\s+src\s*=\s*('\s*([^']+)\s*'|"\s*([^"]+)\s*")(\s+alt=\s*('\s*([\s\S]*?)\s*'|"\s*([\s\S]*?)\s*"))*(\s+caption=\s*('\s*([\s\S]*?)\s*'|"\s*([\s\S]*?)\s*"))*(\s+description=\s*('\s*([\s\S]*?)\s*'|"\s*([\s\S]*?)\s*"))*\s*\]/g;
        while ((match = regexp.exec(html)) !== null) {
            var src = match[2] ? match[2] : match[3],
                alt = match[6] ? match[6] : match[7],
                caption = match[10] ? match[10] : match[11],
                description = match[14] ? match[14] : match[15];
            replacement = '<figure><img class="img-responsive" alt="' + alt + '" caption="' + caption + '" description="' + description + '" src="' + src + '" /></figure>';
            html = html.replace(match[0], replacement);
        }

        // Captions
        regexp = /\[label\][\s\S]*?\[\/label\]/g;
        while ((match = regexp.exec(html)) !== null) {
            replacement = match[0].replace(/<\/div>\s*<div>/g, '<br />');
            html = html.replace(match[0], replacement);
        }
        html = html.replace(/\[label\]/g, '<figure><figcaption>');
        html = html.replace(/\[\/label\]/g, '</figcaption></figure>');
        html = html.replace(/<\/figure><figure><figcaption>/g, '<figcaption>');

        // Youtube
        regexp = /\[youtube\]([a-zA-Z0-9]{11})\[\/youtube\]/g;
        while ((match = regexp.exec(html)) !== null) {
            replacement = '<div class="embed-responsive embed-responsive-16by9"><iframe src="https://www.youtube.com/embed/' + match[1] + '?rel=0" allowfullscreen></iframe></div>';
            html = html.replace(match[0], replacement);
        }

        // Asides
        html = html.replace(/\[aside\]/g, '<div class="aside">');
        html = html.replace(/\[\/aside\]/g, '</div>');

        return html;
    };

    ////////////////////////////////////////////////////////////////
    // turnOffContentHtml
    PN.turnOffContentHtml = function (html) {
        html = html || '';

        // Images, captions
        var container = $('<div></div>').html(html),
            figures = container.find('figure');

        $.each(figures, function (index, value) {
            var $value = $(value),
                image = $('img', $value),
                figcaption = $('figcaption', $value).html(),
                replacement = '';
            if (image.is('*')) {
                var src = image.attr('src'),
                    alt = image.attr('alt'),
                    caption = image.attr('caption'),
                    description = image.attr('description');
                alt = alt === undefined ? '' : alt;
                caption = caption === undefined ? '' : caption;
                description = description === undefined ? '' : description;
                replacement += '[image src="' + src + '" alt="' + alt + '" caption="' + caption + '" description="' + description + '"]';
            }
            if (figcaption) {
                replacement += '[label]' + figcaption + '[/label]';
            }
            $value.replaceWith(replacement);
        });

        // Youtube
        var videos = container.find('.embed-responsive');
        $.each(videos, function (index, value) {
            var $value = $(value),
                iframe = $('iframe', $value),
                clipId,
                replacement;
            if (iframe.attr('src') && iframe.attr('src').indexOf('https://www.youtube.com') === 0) {
                clipId = iframe.attr('src').substr('https://www.youtube.com/embed/'.length, 11);
                replacement = '[youtube]' + clipId + '[/youtube]';
                $value.replaceWith(replacement);
            }
        });

        // Asides
        var asides = container.find('div.aside');
        $.each(asides, function (index, value) {
            var $value = $(value),
                replacement = '[aside]' + $value.html() + '[/aside]';
            $value.replaceWith(replacement);
        });

        return container.html();
    };

    ////////////////////////////////////////////////////////////////
    // tableToExcel
    PN.tableToExcel = function (table, name) {
        /// <signature>
        /// <param name='table' type='jQuery' />
        /// <param name='name' type='String' />
        /// <returns type='String'/>
        /// </signature>
        /*
         * Source :http://www.codeproject.com/Tips/755203/Export-HTML-table-to-Excel-With-CSS
         * by Er. Puneet Goel
         */

        var uri = "data:application/vnd.ms-excel;base64,",
            template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';

        var ctx = {
            worksheet: name || "Worksheet",
            table: table.html()
        };
        return uri + base64(format(template, ctx));

        function base64(s) {
            return window.btoa(unescape(encodeURIComponent(s)));
        }

        function format(s, c) {
            return s.replace(/{(\w+)}/g, function (m, p) {
                return c[p];
            });
        }
    };

    ////////////////////////////////////////////////////////////////
    // getJSON
    // options { data, onSuccess, onUnsuccess, onError, onComplete }
    PN.getJSON = function (url, options) {
        options = $.extend({
            data: {},
            onSuccess: function (/*data, textStatus, jqXHR*/) { },
            onUnsuccess: function (/*data, textStatus, jqXHR*/) { },
            onError: function (/*jqXHR, textStatus, errorThrown*/) { },
            onComplete: function (/*jqXHR, textStatus*/) { },
            onUnauthenticated: function (/*jqXHR, textStatus*/) {
                window.location = window.location;
            }
        }, options);

        return $.getJSON(url, options.data)
            .success(function (data, textStatus, jqXHR) {
                if (data.success === true) {
                    options.onSuccess(data, textStatus, jqXHR);
                } else {
                    if (data.unauthenticated === true) {
                        options.onUnauthenticated(jqXHR, textStatus);
                    } else {
                        options.onUnsuccess(data, textStatus, jqXHR);
                    }
                }
            })
            .error(function (jqXHR, textStatus, errorThrown) {
                if (options.onError(jqXHR, textStatus, errorThrown) !== false) {
                    PN.showErrorMessages([errorThrown, jqXHR.responseText]);
                }
            })
            .complete(function (jqXHR, textStatus) {
                options.onComplete(jqXHR, textStatus);
            })
        ;
    };

    ////////////////////////////////////////////////////////////////
    // postJSON
    // options { data, onSuccess, onUnsuccess, onError, onComplete }
    PN.postJSON = function (url, options) {
        options = $.extend({
            data: {},
            onSuccess: function (/*data, textStatus, jqXHR*/) { },
            onUnsuccess: function (/*data, textStatus, jqXHR*/) { },
            onError: function (/*jqXHR, textStatus, errorThrown*/) { },
            onComplete: function (/*jqXHR, textStatus*/) { },
            onUnauthenticated: function (/*jqXHR, textStatus*/) {
                window.location = window.location;
            }
        }, options);
        return $.ajax({
            url: url,
            type: "POST",
            data: JSON.stringify(options.data),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (data, textStatus, jqXHR) {
                // TODO:: Migrate to new format
                if (data.success === true || data.Succeeded === true) {
                    options.onSuccess(data, textStatus, jqXHR);
                } else if (data.unauthenticated === true || data.Unauthenticated === true) {
                    options.onUnauthenticated(jqXHR, textStatus);
                } else {
                    options.onUnsuccess(data, textStatus, jqXHR);
                }
                options.onComplete(jqXHR, textStatus);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.responseText === "") {
                    options.onUnauthenticated(jqXHR, textStatus);
                } else if (options.onError(jqXHR, textStatus, errorThrown) !== false) {
                    PN.showErrorMessages([errorThrown, jqXHR.responseText]);
                }
                options.onComplete(jqXHR, textStatus);
            }
        });
    };

    ////////////////////////////////////////////////////////////////
    // initDatepickers
    PN.initDatepickers = function (elements, options) {
        if (!$.fn.datepicker) {
            return;
        }

        if (window.Modernizr && Modernizr.inputtypes.date) {
            if (!Modernizr.touch) {
                elements.attr('type', 'text');
                _initDatepickers(elements, options);
            }
        }
        else {
            _initDatepickers(elements, options);
        }

        function _initDatepickers(datepickers, options) {
            $.each(datepickers, function (index, value) {
                if (!options.yearRange) {
                    var yearRange = $(value).attr('data-pn-datepicker-year-range');
                    options.yearRange = yearRange ? yearRange : 'c-10:c+10';
                }
                $(value).datepicker(options);
            });
        }
    };

})(jQuery, window, document);

$(function () {
    $('[data-pn-focus]').focus();

    PN.initDatepickers($('[data-pn-datepicker]'),
        {
            showButtonPanel: true,
            changeMonth: true,
            changeYear: true
        });
});
