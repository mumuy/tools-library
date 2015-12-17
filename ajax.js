function ajax(params){
	params = params||{};
	if (!params.url || !params.callback) {
        throw new Error('Necessary parameters are missing.'); //必要参数未填
    }
	var options = {
		url: params.url||'',
		type: (params.type||'GET').toUpperCase(),
		timeout: params.timeout||5000,
		async : true,
		complete: params.complete||function(){},
		error: params.error||function() {},
		success: params.success||function(){},
		dataType: params.dataType||'json',
		data: params.data||{},
		jsonp:'callback',
		jsonpCallback:('jsonp_' + Math.random()).replace('.','')
	};	
	var formatParams = function(json) {
        var arr = [];
        for(var i in json) {
            arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(json[i]));    
        }
        return arr.join("&");
    };
	if(options.dataType=='jsonp'){
		//插入动态脚本及回调函数
		var $head = document.getElementsByTagName('head')[0];
		var $script = document.createElement('script');
		$head.appendChild($script);	
        window[options.jsonpCallback] = function (json) {
            $head.removeChild($script);
            window[options.jsonpCallback] = null;
            options.success(json);
        };
        //发送请求
        options.data[options.jsonp] = options.jsonpCallback;
        $script.src = options.url + '?' + formatParams(options.data);
        //超时处理
        setTimeout(function(){
            $head.removeChild($script);
            window[options.jsonpCallback] = null;
            options.error();
        }, options.timeout);
	}else{
		//创建xhr对象
		var xhr = new (self.XMLHttpRequest||ActiveXObject)("Microsoft.XMLHTTP");
		if(!xhr){
			return false;
		}
		//发送请求
		options.data = formatParams(options.data);
		if (options.type == 'POST') {
			xhr.open(options.type, options.url, options.async);
			xhr.setRequestHeader('content-type','application/x-www-form-urlencoded');
			xhr.send(options.data);
		}else{
			xhr.open(options.type, options.url + '?'+ options.data, options.async);
			xhr.send(null);
		}
		//超时处理
		var requestDone = false;
		setTimeout(function() {
			requestDone = true;
			if(xhr.readyState != 4){
				xhr.abort();
			}
		}, options.timeout);
		//状态处理
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4&&!requestDone) {
				if(xhr.status>=200 && xhr.status<300) {
					var data = options.dataType == "xml" ? xhr.responseXML : xhr.responseText;
					if (options.dataType == "json") {
						try{
							data =  JSON.parse(data);
						}catch(e){
							data = eval('(' + data + ')');
						}
					}
					options.success(data);
				} else {
					options.error();
				}
				options.complete();
			}
		};		
	}
}