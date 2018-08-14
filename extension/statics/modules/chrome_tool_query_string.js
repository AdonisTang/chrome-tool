/**
 * 字符大小写
 */
layui.define(['chromeTool', 'jquery', 'chromeToolBase'], function (exports) {
    var $ = layui.$;
    var chrome_tool_query_string = function (tool_id) {
        var tool = new layui.chromeToolBase(tool_id);

        tool.getPageData = function (key) {
            return tool.pageData().get(key, function () {
                return {"tool_input_content": layui.chromeTool.clipboardPaste()}
            });
        };

        tool.loadComplete = function () {
            var toQueryString = function (obj) {
                var queryString = "";

                var keys = Object.keys(obj);
                keys.sort();

                for (var i = 0; i < keys.length; i++) {
                    var _key = keys[i];
                    queryString += _key + "=" + obj[_key];
                    if (i < keys.length - 1) {
                        queryString += "&";
                    }
                }

                return queryString;
            };

            var sortObj = function (obj) {
                var keys = Object.keys(obj);
                keys.sort();
                var rs = {};
                for (var i = 0; i < keys.length; i++) {
                    var _key = keys[i];
                    rs[_key] = obj[_key];
                }
                return rs;
            };

            var toJson = function (queryString) {
                var json = {};

                $.each(queryString.split("&"), function (index, param) {
                    var keyValue = param.split("=");
                    json[keyValue[0]] = keyValue[1];
                });

                return sortObj(json);
            };

            $("#tool_submit_queryString").on('click', function () {
                var charInput = $("#tool_input_content").val();
                if (!charInput) {
                    return;
                }

                var json = eval('(' + charInput + ')');
                var result = toQueryString(json);
                $("#tool_result").val(result);
                // 复制结果
                layui.chromeTool.resultAutoCopy(result);
            });

            $("#tool_submit_json").on('click', function () {
                var charInput = $("#tool_input_content").val();
                if (!charInput) {
                    return;
                }

                charInput = charInput.trim();
                var json = toJson(charInput);
                var result = JSON.stringify(json, null, 4);
                $("#tool_result").val(result);
                // 复制结果
                layui.chromeTool.resultAutoCopy(result);
            });
        };
        return tool;
    };
    exports('chrome_tool_query_string', chrome_tool_query_string);
});