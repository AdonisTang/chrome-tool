// 文本批量处理
layui.define(['chromeTool', 'jquery', 'chromeToolBase', 'code'], function (exports) {
    var $ = layui.$;
    var chrome_tool_text_batch = function (tool_id) {
        var tool = new layui.chromeToolBase(tool_id);
        tool.getPageData = function (key) {
            return tool.pageData().get(key, function () {
                return {"tool_input_content": layui.chromeTool.clipboardPaste()};
            });
        };

        var textBatch = function (textArr, batch, config) {
            if (!textArr || !textArr.length) {
                return;
            }

            $.each(textArr, function (index, value) {
                var isLast = index == textArr.length - 1;
                textArr[index] = batch(value, config, isLast);
            });
        };

        var batch = function (text, config, isLast) {
            var configDefault = {
                left: {
                    replace: true,
                    replaceText: '\''
                },
                right: {
                    replace: true,
                    replaceText: '\''
                },
                join: {
                    skipLast: true,
                    joinText: ','
                }
            };

            configDefault = $.extend(true, configDefault, config);

            text = text.trim();
            if (configDefault.left.replace) {
                text = configDefault.left.replaceText + text;
            }
            if (configDefault.right.replace) {
                text = text + configDefault.right.replaceText;
            }
            if (!isLast || (isLast && !configDefault.join.skipLast)) {
                text += configDefault.join.joinText;
            }

            return text;
        };

        var compare = function (operation, array1, array2) {
            //并集
            if (operation === "1") {
                return array1.concat(array2.filter(function (v) {
                    return array1.indexOf(v) === -1;
                }));
            }

            // 交集
            if (operation === "2") {
                return array1.filter(function (v) {
                    return array2.indexOf(v) > -1;
                });
            }

            // 补集
            if (operation === "3") {
                return array1.filter(function (v) {
                    return array2.indexOf(v) === -1;
                }).concat(array2.filter(function (v) {
                    return array1.indexOf(v) === -1;
                }));
            }
        };

        tool.loadComplete = function () {
            $("#tool_submit").on('click', function () {
                var config = {
                    left: {
                        replaceText: $("#tool_input_text_batch_config_left").val()
                    },
                    right: {
                        replaceText: $("#tool_input_text_batch_config_right").val()
                    },
                    join: {
                        joinText: $("#tool_input_text_batch_config_join").val()
                    }
                };

                var text = $("#tool_input_content").val();
                var textArr = text.split('\n');

                textBatch(textArr, batch, config);

                var textResult = "", joneChar = $("#tool_input_text_batch_config_rn").get(0).checked ? "\n" : "";
                $.each(textArr, function (index, value) {
                    textResult += value + joneChar;
                });

                $("#tool_result").html(textResult);

                // 复制结果
                layui.chromeTool.resultAutoCopy(textResult);
            });

            $("#tool_submit_array").on('click', function () {
                var textArr1 = $("#tool_input_content_array1").val().split('\n');
                var textArr2 = $("#tool_input_content_array2").val().split('\n');

                var operation = $("#select_operation").val();
                var array = compare(operation, textArr1, textArr2);

                var textResult = "";
                $.each(array, function (index, value) {
                    textResult += value + "\n";
                });

                $("#tool_result_array").html(textResult);

                // 复制结果
                layui.chromeTool.resultAutoCopy(textResult);
            });

            layui.code();
        };
        return tool;
    };
    exports('chrome_tool_text_batch', chrome_tool_text_batch);
});