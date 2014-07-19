chrome.notifications.onButtonClicked.addListener(function (id, buttonIndex) { handleClick(id, buttonIndex); })
chrome.downloads.onChanged.addListener(function (obj) { createNotification(obj); });