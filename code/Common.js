//图片加载完成后执行
function imageDownload(resources, callback) {
    var len = resources.length;
    var num = len;
    var list = [];
    for(var i=0;i<len;i++){
    	(function(url){
    		var $item = new Image();
    		$item.src = url;
    		list.push($item);
	        var doSomething = function(){
	            num--;
	            if (!num) {
	                callback(list);
	            }
	            $item.onload = null;
	        };
	        if ($item.complete && $item.width) {
	            doSomething();
	        } else {
	            $item.onload = doSomething;
	        }
    	})(resources[i]);
    }
}

//添加到收藏夹
function addFavorite(url, t) {
    if (t == undefined)
        t = document.title;
    if (url == undefined)
        url = location.href;
    try {
        window.external.addFavorite(url, t);
    }
    catch (e) {
        try {
            window.sidebar.addPanel(t, url, "");
        } catch (e) {
            alert("加入收藏失败，请使用Ctrl+D进行添加");
        }
    }
}

//设置为首页
function setHomePage () {
    if (document.all) {
        document.body.style.behavior = 'url(#default#homepage)';
        document.body.setHomePage(window.location.href);
    } else if (window.sidebar) {
        if (window.netscape) {
            try {
                netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
            } catch (e) {
                alert("该操作被浏览器拒绝，请在地址栏内输入 about:config,然后将项 signed.applets.codebase_principal_support 值该为true");
            }
        }
        var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
        prefs.setCharPref('browser.startup.homepage', window.location.href);
    } else {
        alert('您的浏览器不支持自动自动设置首页, 请使用浏览器菜单手动设置!');
    }
}
