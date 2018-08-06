/**
 * 查找页面指定元素的html，执行指定操作
 */
chrome.extension.onMessage.addListener(function (request, sender, sendMessage) {
    if (request.selector) {
        var el = chromejquip(request.selector);
        if (el.length) {
            sendMessage(el.html());
        }
    }
});