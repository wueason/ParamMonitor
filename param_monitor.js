
var appendHtml = '\
    <div class="input-append">\
        <input class="span2" name="keyword" type="text" placeholder="Keyword">\
        <input class="span2" name="filter" type="text" placeholder="Filter">\
        <input class="span3" name="params" type="text" placeholder="Params (split with ,)">\
        <button class="btn" name="deleteRow">DELETE</button>\
    </div>'

chrome.storage.sync.get('__paramMonitorList', function(obj) {
    var list = obj.__paramMonitorList
    if(list && (list = JSON.parse(list)) && typeof list == typeof [] && list.length > 0){
        var html = ''
        for (var i = 0; i < list.length; i++) {
            html += '\
            <div class="input-append">\
                <input class="span2" name="keyword" type="text" placeholder="Keyword" value="' + list[i].keyword + '">\
                <input class="span2" name="filter" type="text" placeholder="Filter" value="' + list[i].filter + '">\
                <input class="span3" name="params" type="text" placeholder="Params(split with ,)" value="' + list[i].params + '">\
                <button class="btn" name="deleteRow">DELETE</button>\
            </div>'
        }
        jQuery('.monitor-container').append(html);
    }else{
        jQuery('.monitor-container').append(appendHtml);
    }
    deleteRowRefresh()
})
if(localStorage.notifyOnPage == 1) jQuery('#notifyOnPage').attr("checked","true")
if(localStorage.notifyOnConsole == 1) jQuery('#notifyOnConsole').attr("checked","true")

jQuery('#addRow').click(function () {
    jQuery('.monitor-container').append(appendHtml);
    deleteRowRefresh()
})

function deleteRowRefresh() {
    jQuery('[name="deleteRow"]').click(function () {
        if(jQuery('.input-append').length == 1){
            jQuery('.input-append input').val('')
        }else{
            $(this).parent().remove()
        }
    })
}

jQuery('#saveAll').click(function () {
    var keywords = jQuery('[name="keyword"]')
    var filters = jQuery('[name="filter"]')
    var params = jQuery('[name="params"]')
    var paramsList = []
    for (var i = 0; i < keywords.length; i++) {
        if(keywords[i].value && params[i].value){
            paramsList.push({keyword: keywords[i].value, filter: filters[i].value, params: params[i].value})
        }
    }
    localStorage.notifyOnPage = jQuery('#notifyOnPage').is(':checked') ? 1 : 0
    localStorage.notifyOnConsole = jQuery('#notifyOnConsole').is(':checked') ? 1 : 0

    chrome.storage.sync.set({'__paramMonitorList': JSON.stringify(paramsList)}, function() {
        jQuery('#notice').text('Success!').show().fadeOut(1500, function () {
            jQuery('#notice').text('')
        })
    });
    chrome.storage.sync.set({'__paramMonitorNotifyOnPage': localStorage.notifyOnPage}, function() {})
    chrome.storage.sync.set({'__paramMonitorNotifyOnConsole': localStorage.notifyOnConsole}, function() {})
})
