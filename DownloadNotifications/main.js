function handleClick(notificationId, buttonIndex){
    var downloadId = parseInt(notificationId);
    var query = { id: downloadId };
    chrome.downloads.search(query, function (obj){
        console.log("Last error:", chrome.runtime.lastError);
        var state = obj[0].state;
        if (state === "complete") {
        // if(buttonIndex == 0) {
            // chrome.downloads.open(downloadId);
            // return;
        // }    
        chrome.downloads.show(downloadId);
        return;
    }
    if(obj[0].canResume) {
        chrome.downloads.resume(downloadId, function(){});
        return;
    }
    var newDownload = {
        url: obj[0].url,
        filename: obj[0].filename
    }
    chrome.downloads.download(newDownload, function(){});
});
}

function createNotification(downloadDelta) {
    if(!downloadDelta.hasOwnProperty("state")) return; 
    if(!(downloadDelta.state.current === "complete" 
        || downloadDelta.state.current === "interrupted")) return;
        var state = downloadDelta.state.current;
    var id = downloadDelta.id;
    var query = { id: id };
    chrome.downloads.search(query, function (obj){
        chrome.downloads.getFileIcon(id, {}, function (iconUrl){
            var notificationParameters = {
                type: "basic",
                title: "Download " + state,
                message: obj[0].filename.split(/[\/\\]/).pop(),
                iconUrl: "icon.png",
                buttons: [
    //{ title: "Open", iconUrl: iconUrl},
    { title: "Show", iconUrl : iconUrl}]
};

if (state === "interrupted") {
    notificationParameters.buttons[0].title = "Restart";
}

chrome.notifications.create(downloadDelta.id.toString() , notificationParameters, 
    function(id) {});});});
}