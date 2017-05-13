function parseParams(url){
	var a =  document.createElement('a');
    a.href = url;
    var ret = {},
        seg = a.search.replace(/^\?/,'').split('&'),
        len = seg.length, i = 0, s;
    for (i;i<len;i++) {
        if (!seg[i]) { continue; }
        s = seg[i].split('=');
        ret[s[0]] = s[1];
    }
    return ret;
}

function showNotifyOnPage(errorList) {
	var node=document.createElement("div");
	node.setAttribute("style", "display:block;position:fixed;left:5px;bottom:5px;z-index:100;" );
	var code = '<TABLE style="background: #ddd;">';
	var thStyle = ' style="line-height:10px;text-align:left;vertical-align:top;border-top:1px solid #ddd;width:200px;overflow:hidden;font-size:10px;" ';
	var tdStyle = ' style="padding:8px;line-height:20px;text-align:left;vertical-align:top;border-top:1px solid #ddd;background-color:#fcf8e3;width:200px;overflow:hidden;" ';
	code += '<TR><TH '+thStyle+'>URL</TH><TH '+thStyle+'>PARAMS MISSING</TH></TR>';
	var maxLength = 25;
	for (var i = 0; i < errorList.length; i++) {
		code += '<TR><TD '+tdStyle+' class="__paramMonitorMonitor"><a title="'+errorList[i].url+'">' +
				(errorList[i].url.length > maxLength ? errorList[i].url.substring(0, maxLength)+'...' : errorList[i].url) +
				'<br><span>'+errorList[i].url+'</span><button>!</button></a>\
				\
				</TD><TD '+tdStyle+'>' + errorList[i].params + '</TD></TR>';
	}
	node.innerHTML = code + '</TABLE>';
	document.getElementsByTagName("body")[0].appendChild(node);
}

function showNotifyOnConsole(errorList) {
	for (var i = 0; i < errorList.length; i++) {
		console.log('[ ** param monitor ** ]')
		console.log('URL: ' + errorList[i].url + ', MISSING PARAMS: ' + errorList[i].params)
	}
}

chrome.storage.sync.get(['__paramMonitorList', '__paramMonitorNotifyOnPage', '__paramMonitorNotifyOnConsole'], function (obj) {
	console.log('Param monitor initializing ...')
	var list = JSON.parse(obj.__paramMonitorList)
	if(typeof list == typeof [] && list.length){
		var el = document.getElementsByTagName('a')
		var urlList= []
		for (var i = 0; i < el.length; i++) {
			if(el[i].href.indexOf('http') != -1 && el[i].href.indexOf('?') != -1){
				urlList.push(el[i].href)
			}
		}

		var errorList = []
		for(var m = 0;m < list.length; m++){
			var item = list[m]
			var innerParams = item.params.split(',')
			var keyword = item.keyword
			var filter = item.filter
			for (var n in urlList) {
				var href = urlList[n]
				var innerParamsNew = []
				if(href.indexOf(keyword) != -1 && (!filter || href.indexOf(filter) == -1)){
					var params = parseParams(href)
					for (var m in innerParams) {
						if(!params[innerParams[m]]){
							innerParamsNew.push(innerParams[m])
						}
					}
					if(innerParamsNew.length){
						errorList.push({url:href, params:innerParamsNew.join(',')})
					}
				}
			}
		}
		if(errorList.length > 0){
			obj.__paramMonitorNotifyOnPage == 1 && showNotifyOnPage(errorList)
			obj.__paramMonitorNotifyOnConsole == 1 && showNotifyOnConsole(errorList)
		}
	}
})
