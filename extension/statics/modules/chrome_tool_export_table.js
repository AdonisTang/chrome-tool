// 计算器
layui.define(['jquery', 'chromeToolBase', 'chromeTool'], function (exports) {
    var $ = layui.$;

    var chrome_tool_export_table = function (tool_id) {
        var tool = new layui.chromeToolBase(tool_id);
        tool.getPageData = function (key) {
            return tool.pageData().get(key, function () {
                return {"tool_input_content": layui.chromeTool.clipboardPaste()}
            });
        };

        tool.loadComplete = function () {
            var exportTd = function (tr, tdSelector, tdSplit, spaceIndex) {
                var tdText = "";
                var tds = tr.find(tdSelector), tdLength = tds.length;
                if (!tdLength) {
                    return tdText;
                }

                tds.each(function (index) {
                    var text = $(this).text().replace(/[\r\n]/g, "");

                    var indexTemp = index + 1;
                    if (spaceIndex.indexOf(indexTemp) === -1) {
                        text = text.replace(/[ ]/g, "");
                    }

                    tdText += text;
                    if (index < tdLength - 1) {
                        if (tdSplit === "t") {
                            tdSplit = "\t";
                        }
                        tdText += tdSplit;
                    }
                });
                return tdText;
            };

            var exportTable = function (tableHtml, trSelector, tdSelector, tdSplit, spaceIndex) {
                var exportText = "";

                var table = $(tableHtml);
                table.find(trSelector).each(function () {
                    var tr = $(this);
                    exportText += exportTd(tr, tdSelector, tdSplit, spaceIndex);
                    exportText += "\r\n";
                });
                return exportText;
            };


            $("#tool_submit_export_table").on('click', function () {
                var tableSelector = $("#tool_input_table_selector").val(),
                    trSelector = $("#tool_input_tr_selector").val(), tdSelector = $("#tool_input_td_selector").val();
                if (!tableSelector || !trSelector || !tdSelector) {
                    return;
                }

                var tdSplit = $("#tool_input_td_split").val(), spaceIndex = $("#tool_input_td_space").val();

                chrome.tabs.getSelected(null, function (tab) {　　// 先获取当前页面的tabID
                    chrome.tabs.sendMessage(tab.id, {selector: tableSelector}, function (html) {
                        var result = exportTable(html, trSelector, tdSelector, tdSplit, spaceIndex);

                        $("#tool_result").val(result);
                        // 复制结果
                        layui.chromeTool.resultAutoCopy(result);
                    });
                });
            });
        };
        return tool;
    };

    exports('chrome_tool_export_table', chrome_tool_export_table);
});