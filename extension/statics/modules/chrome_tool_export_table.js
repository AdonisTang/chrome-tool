// 计算器
layui.define(['jquery', 'chromeToolBase', 'chromeTool'], function (exports) {
    var $ = layui.$, element = layui.element, layer = layui.layer;

    var chrome_tool_export_table = function (tool_id) {
        var tool = new layui.chromeToolBase(tool_id);
        tool.getPageData = function (key) {
            return tool.pageData().get(key, function () {
                return {"tool_input_content": layui.chromeTool.clipboardPaste()}
            });
        };

        var exportConfig = {};

        var loadConfigTab = function (exportConfig) {
            $.each(exportConfig, function (key, config) {
                var htmlTemp = $("#config_item_tpl").html();
                htmlTemp = htmlTemp.replace("${id}", config.id).replace("${id}", config.id).replace("${id}", config.id);
                htmlTemp = htmlTemp.replace("${name}", config.name);
                htmlTemp = htmlTemp.replace("${tableSelector}", config.tableSelector);
                htmlTemp = htmlTemp.replace("${trSelector}", config.trSelector);
                htmlTemp = htmlTemp.replace("${tdSelector}", config.tdSelector);
                htmlTemp = htmlTemp.replace("${tdSplit}", config.tdSplit);
                htmlTemp = htmlTemp.replace("${tdSpaceIndex}", config.tdSpaceIndex);

                element.tabAdd(
                    'config',
                    {
                        title: config.name,
                        content: htmlTemp,
                        id: config.id
                    }
                );
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

            $("#config-tab-box").delegate(".tool_submit_export_table", "click", function () {
                var tabId = $(this).attr("data-id");
                var tabConfig = exportConfig[tabId];

                var tableSelector = tabConfig.tableSelector,
                    trSelector = tabConfig.trSelector, tdSelector = tabConfig.tdSelector;
                if (!tableSelector || !trSelector || !tdSelector) {
                    return;
                }

                var tdSplit = tabConfig.tdSplit, spaceIndex = tabConfig.tdSpaceIndex;

                chrome.tabs.getSelected(null, function (tab) {　　// 先获取当前页面的tabID
                    chrome.tabs.sendMessage(tab.id, {selector: tableSelector}, function (html) {
                        var result = exportTable(html, trSelector, tdSelector, tdSplit, spaceIndex);

                        $("#tool_result").val(result);
                        // 复制结果
                        layui.chromeTool.resultAutoCopy(result);
                    });
                });
            });

            $("#config-tab-box").delegate(".tool_save_export_table_config", "click", function () {
                var tabId = $(this).attr("data-id"), configItemBox = $("[data-config-box-id='" + tabId + "']");

                var tabConfig = {
                    name: configItemBox.find(".tool_input_config_name").val(),
                    tableSelector: configItemBox.find(".tool_input_table_selector").val(),
                    trSelector: configItemBox.find(".tool_input_tr_selector").val(),
                    tdSelector: configItemBox.find(".tool_input_td_selector").val(),
                    tdSplit: configItemBox.find(".tool_input_td_split").val(),
                    tdSpaceIndex: configItemBox.find(".tool_input_td_space").val()
                };

                exportConfig[tabId] = $.extend(true, exportConfig[tabId], tabConfig);

                chrome.storage.local.set(
                    {"CHROME-STORAGE-TOOLS-EXPORT-TABLE-CONFIG": exportConfig},
                    function () {
                        layui.chromeTool.msg("保存成功 ^o^");
                    }
                );
            });

            $("#btn_importTabConfig").on("click", function () {
                var html = '<div id="config_import_tpl" style="padding: 5px">' +
                    '    <div class="layui-form-item layui-form-text">' +
                    '        <textarea placeholder="请输入配置" class="layui-textarea config_import_content">‘+’</textarea>' +
                    '    </div>' +
                    '    <div class="layui-form-item">' +
                    '        <div class="layui-inline">' +
                    '            <button type="button" class="layui-btn tool_submit_export_table_import_config">保存</button>' +
                    '        </div>' +
                    '    </div>' +
                    '</div>';
                layer.open({
                    type: 1,
                    area: ['450px', '230px'],
                    content: html
                });
                $("#config_import_tpl").find(".config_import_content").val(JSON.stringify(exportConfig, null, 4));
            });

            $(document).delegate(".tool_submit_export_table_import_config", "click", function () {
                var config = $(".config_import_content").val();
                if (!config) {
                    return;
                }

                var tabConfig = eval('(' + config + ')');
                exportConfig = $.extend(true, tabConfig, tabConfig);

                chrome.storage.local.set(
                    {"CHROME-STORAGE-TOOLS-EXPORT-TABLE-CONFIG": exportConfig},
                    function () {
                        layui.chromeTool.msg("保存成功 ^o^");
                    }
                );
            });

            chrome.storage.local.get("CHROME-STORAGE-TOOLS-EXPORT-TABLE-CONFIG", function (config) {
                if (config) {
                    exportConfig = config["CHROME-STORAGE-TOOLS-EXPORT-TABLE-CONFIG"];
                    loadConfigTab(exportConfig);
                }
            });
        };
        return tool;
    };

    exports('chrome_tool_export_table', chrome_tool_export_table);
});