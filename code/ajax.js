function ajax(params){
	params = params||{};
	if (!params.url) {
        throw new Error('Necessary parameters are missing.'); //必要参数未填
    }
	var options = {
		url: params.url||'',								//接口地址
		type: (params.type||'GET').toUpperCase(),			//请求方式
		timeout: params.timeout||5000,						//超时等待时间
		async : true,										//是否异步
		xhrFields:{},										//设置XHR对象属性键值对。如果需要，可设置withCredentials为true的跨域请求。
		dataType: (params.dataType||'json').toLowerCase(),	//请求的数据类型
		data: params.data||{},								//参数
		jsonp:'callback',											//传递请求完成后的函数名
		jsonpCallback:('jsonp_' + Math.random()).replace('.',''),	//请求完成后的函数名
		error: params.error||function() {},					//请求失败后调用
		success: params.success||function(){},				//请求成功后调用
		complete: params.complete||function(){}				//请求完成后调用
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
            hander && clearTimeout(hander);
            options.success(json);
            options.complete();
        };
        //发送请求
        options.data[options.jsonp] = options.jsonpCallback;
        $script.src = options.url + '?' + formatParams(options.data);
        //超时处理
        var hander = setTimeout(function(){
            $head.removeChild($script);
            window[options.jsonpCallback] = null;
            options.error();
            options.complete();
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
		}else{
			options.url += options.url.indexOf('?')>-1?'&'+options.data:'?'+options.data;
			xhr.open(options.type, options.url, options.async);
			options.data = null;
		}
		if(options.xhrFields){
			for(var field in options.xhrFields){
				xhr[field]= options.xhrFields[field];
			}
		}
		xhr.send(options.data);
		//超时处理
		var requestDone = false;
		setTimeout(function() {
			requestDone = true;
			if(xhr.readyState != 4){
				xhr.abort();
				options.error();
			}
			options.complete();
		}, options.timeout);
		//状态处理
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4&&!requestDone) {
				if(xhr.status>=200 && xhr.status<300||xhr.status == 304) {
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
