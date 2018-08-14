/**
 * 字符大小写
 */
layui.define(['chromeTool', 'jquery', 'chromeToolBase'], function (exports) {
    var $ = layui.$;
    var chrome_tool_char_upper_lower_case = function (tool_id) {
        var tool = new layui.chromeToolBase(tool_id);

        tool.getPageData = function (key) {
            return tool.pageData().get(key, function () {
                return {"tool_input_content": layui.chromeTool.clipboardPaste()}
            });
        };

        tool.loadComplete = function () {
            $("#tool_submit_char_toUpperCase").on('click', function () {
                var charInput = $("#tool_input_content").val();
                if (!charInput) {
                    return;
                }

                charInput = charInput.trim();
                var result = charInput.toUpperCase();
                $("#tool_result").val(result);
                // 复制结果
                layui.chromeTool.resultAutoCopy(result);
            });

            $("#tool_submit_char_toLowerCase").on('click', function () {
                var charInput = $("#tool_input_content").val();
                if (!charInput) {
                    return;
                }

                charInput = charInput.trim();
                var result = charInput.toLowerCase();
                $("#tool_result").val(result);
                // 复制结果
                layui.chromeTool.resultAutoCopy(result);
            });
        };
        return tool;
    };
    exports('chrome_tool_char_upper_lower_case', chrome_tool_char_upper_lower_case);
});