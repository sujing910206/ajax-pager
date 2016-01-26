/*
* Version 1.0
* 2015-12-20 by sullivan
* AJAX Pager
*/
;
(function (window, $) {

    var sjPager = window.sjPager = {
        opts: {
            pageSize: 10,
            preText: "pre",
            nextText: "next",
            firstText: "First",
            lastText: "Last",
            shiftingLeft: 3,
            shiftingRight: 3,
            preLeast: 2,
            nextLeast: 2,
            showFirst: true,
            showLast: true,
            url: "",
            type: "POST",
            dataType: "JSON",
            searchParam: {},
            beforeSend: null,
            success: null,
            complete: null,
            error: function() {
                alert("抱歉,请求出错,请重新请求！");
            },

            pageIndex: 1,
            totalCount: 0,
            totalPage: 0
        },
        pagerElement: null,
        commonHtmlText: {
            spanHtml: "<span class='{0}'>{1}</span>",
            pageIndexHtml: "<a href='javascript:void(0)' onclick='sjPager.doPage({0},{1},{2})'>{3}</a>",
            rightHtml: "<span class='text'> &nbsp; 共 {0} 页， 到第</span> <input type='text' id='txtToPager' value={1} /><span class='text'>页</span> <button id='btnJump' onclick='sjPager.jumpToPage();return false;' >跳转</button>",
            clearFloatHtml: "<div style='clear:both;'></div>",
            stringEmpty: ""
        },
        init: function (obj,op) {
            var _self = this;

            _self.opts = $.extend({}, _self.opts, op);
            _self.pagerElement = obj;

            _self.doPage(_self.opts.pageIndex, _self.opts.pageSize, _self.opts.searchParam);

            return _self.opts;
        },
        doPage: function (index, pageSize, searchParam) {
            var _self = this;

            _self.opts.pageIndex = index;
            _self.opts.pageSize = pageSize;
            _self.opts.searchParam = searchParam;

            $.ajax({
                type: _self.opts.type,
                data: $.extend(_self.opts.searchParam || {}, {
                    pageIndex: _self.opts.pageIndex,
                    pageSize: _self.opts.pageSize || 10
                }),
                dataType: _self.opts.dataType,
                url: _self.opts.url,
                beforeSend: function () {
                    _self.opts.beforeSend();
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    _self.opts.error(XMLHttpRequest, textStatus, errorThrown);
                },
                success: function (data) {
                    _self.opts.success(data);

                    //后台返回数据格式：{"total":0,"items":[]}
                    _self.opts.totalCount = data.total;
                    _self.getTotalPage();
                    if (_self.opts.totalCount > 0 && _self.opts.pageIndex > 0) {
                        var pageTextArr = new Array;

                        _self.createPreAndFirstBtn(pageTextArr);
                        _self.createIndexBtn(pageTextArr);
                        _self.createNextAndLastBtn(pageTextArr);
                        _self.renderHtml(pageTextArr);
                    }
                },
                complete: function () {
                    _self.opts.complete();
                }
            });
        },
        getTotalPage: function() {
            var _self = this;

            _self.opts.totalPage = Math.ceil(_self.opts.totalCount / _self.opts.pageSize);
        },
        createPreAndFirstBtn: function (pageTextArr) {
            var _self = this;

            if (_self.opts.pageIndex == 1) {
                if (_self.opts.showFirst)
                    pageTextArr.push(_self.createSpan(_self.opts.firstText, 'disenable'));

                pageTextArr.push(_self.createSpan(_self.opts.preText, 'disenable'));
            } else {
                if (_self.opts.showFirst) {
                    pageTextArr.push(_self.createIndexText(1, _self.opts.firstText));
                }

                pageTextArr.push(_self.createIndexText(_self.opts.pageIndex - 1, _self.opts.preText));
            }
        },
        createNextAndLastBtn: function (pageTextArr) {
            var _self = this;
            if (_self.opts.pageIndex == _self.opts.totalPage) {
                pageTextArr.push(_self.createSpan(_self.opts.nextText, 'disenable'));

                if (_self.opts.showLast)
                    pageTextArr.push(_self.createSpan(_self.opts.lastText, 'disenable'));
            } else {
                pageTextArr.push(_self.createIndexText(_self.opts.pageIndex + 1, _self.opts.nextText));
                if (_self.opts.showLast)
                    pageTextArr.push(_self.createIndexText(_self.opts.totalPage, _self.opts.lastText));
            }
        },
        createIndexBtn: function (pageTextArr) {
            /*
                前：当前页 > 偏移量 + 至少保留 + 1
                后：当前页 < 总页码 - 偏移量 - 至少保留
            */

            var _self = this;

            var shiftingLeftStart = _self.opts.shiftingLeft + _self.opts.preLeast + 1;
            var shiftingRightStart = _self.opts.totalPage - _self.opts.shiftingRight - _self.opts.nextLeast - 1;

            /*页码*/
            if (_self.opts.pageIndex > shiftingLeftStart) {
                for (i = 1; i <= _self.opts.preLeast; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }

                pageTextArr.push(_self.createSpan('...'));

                for (i = _self.opts.pageIndex - _self.opts.shiftingLeft; i < _self.opts.pageIndex; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }

            } else {
                for (i = 1; i < _self.opts.pageIndex; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }
            }

            pageTextArr.push(_self.createSpan(_self.opts.pageIndex, 'current'));

            if (_self.opts.pageIndex <= shiftingRightStart) {

                for (i = _self.opts.pageIndex + 1; i < _self.opts.pageIndex + 1 + _self.opts.shiftingRight; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }

                pageTextArr.push(_self.createSpan('...'));

                for (i = _self.opts.totalPage - 1; i <= _self.opts.totalPage; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }

            } else {
                for (i = _self.opts.pageIndex + 1; i <= _self.opts.totalPage; i++) {
                    pageTextArr.push(_self.createIndexText(i, i));
                }
            }
        },
        renderHtml: function (pageTextArr) {
            var _self = this;

            var pageText = _self.commonHtmlText.stringEmpty;

            for (var i = 0; i < pageTextArr.length; i++) {
                pageText += pageTextArr[i];
            }

            _self.pagerElement.html(pageText).append(stringFormat(_self.commonHtmlText.rightHtml, _self.opts.totalPage, _self.opts.pageIndex)).append(_self.commonHtmlText.clearFloatHtml);
        },
        createSpan: function (text, className) {
            var _self = this;

            return stringFormat(_self.commonHtmlText.spanHtml, className ? className : _self.commonHtmlText.stringEmpty, text);
        },
        createIndexText: function (index, text) {
            var _self = this;
            return stringFormat(_self.commonHtmlText.pageIndexHtml, index, _self.opts.pageSize, JSON.stringify(_self.opts.searchParam), text);
        },
        jumpToPage: function() {
            var _self = this;

            var $txtToPager = $("#txtToPager", _self.pagerElement);
            var index = parseInt($txtToPager.val());

            if (!isNaN(index) && index > 0 && index <= _self.opts.totalPage) {
                _self.doPage(index, _self.opts.pageSize, _self.opts.searchParam);
            } else {
                $txtToPager.focus();
            }
        }
    }

    $.fn.sjAjaxPager = function (option) {
        return sjPager.init($(this),option);
    };

})(window, jQuery);