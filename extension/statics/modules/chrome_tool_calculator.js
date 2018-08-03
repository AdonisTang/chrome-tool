// 计算器
layui.define(['jquery', 'chromeToolBase', 'chromeTool'], function (exports) {
    var $ = layui.$;

    var chrome_tool_calculator = function (tool_id) {
        var tool = new layui.chromeToolBase(tool_id);
        tool.getPageData = function (key) {
            return tool.pageData().get(key, function () {
                return {"tool_input_content": layui.chromeTool.clipboardPaste()}
            });
        };

        tool.loadComplete = function () {
            $("#tool_submit_calculator").on('click', function () {
                var equation = $("#tool_input_content").val();
                if (!equation) {
                    return;
                }

                equation = equation.trim();
                var result = eval(equation);
                $("#tool_result").val(result);
                // 复制结果
                layui.chromeTool.resultAutoCopy(result);
            });
        };
        return tool;
    };

    exports('chrome_tool_calculator', chrome_tool_calculator);
});