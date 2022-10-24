function ajax(params){
	params = params||{};
	if (!params.url) {
        throw new Error('Necessary parameters are missing.'); //必要参数未填
    }
    var random = +new Date;
    var hander = null;
	var options = {
		url: '',								//接口地址
		type: 'GET',							//请求方式
		timeout: 5000,							//超时等待时间
		cache: true,							//缓存 
		async: true,							//是否异步
		headers: {},							//
		xhrFields: {},							//设置XHR对象属性键值对。如果需要，可设置withCredentials为true的跨域请求。
		dataType: 'json',						//请求的数据类型
		data: {},								//参数
		jsonp: 'callback',						//传递请求完成后的函数名
		jsonpCallback: 'jsonp_' + random,		//请求完成后的函数名
		error: function() {},					//请求失败后调用
		success: function(){},					//请求成功后调用
		complete: function(){}					//请求完成后调用
	};
	var formatParams = function(data) {
        var arr = [];
        if(data instanceof FormData){
        	data.forEach(function(value,key){
        		arr.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
        	});
        }else{    	
	        for(var i in data) {
	            arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
	        }
        }
        return arr.join("&");
    };
    for(var i in params){
    	switch(i){
    		case 'type':
    			options[i] = params[i].toUpperCase();
    			break;
    		case 'dataType':
    			options[i] = params[i].toLowerCase();
    			break;
    		default:
    			options[i] = params[i];
    	}
    }
    var params = '';
    if(typeof options.data =='object'){
        params = formatParams(options.data);
    }
	if(options.dataType=='jsonp'||options.dataType=='script'){
		options.cache = params.cache||false;
		//插入动态脚本及回调函数
		var $head = document.getElementsByTagName('head')[0];
		var $script = document.createElement('script');
		$head.appendChild($script);
		if(options.dataType=='jsonp'){
	        window[options.jsonpCallback] = function (json) {
	            $head.removeChild($script);
	            window[options.jsonpCallback] = null;
	            hander && clearTimeout(hander);
	            options.success(json);
	            options.complete();
	        };
		}else{
			$script.onload = function(){
				hander && clearTimeout(hander);
	            options.success();
	            options.complete();
			};
		}
        //发送请求
        if(options.cache){
	    	params += (params?'&':'')+('_'+random);
	    }
        if(options.dataType=='jsonp'){
        	params += (params?'&':'')+(options.jsonp+'='+options.jsonpCallback);
        }
        if(params){
        	options.url += (options.url.indexOf('?')>-1?'&':'?')+params;
        }
        $script.src = options.url;
        //超时处理
       	hander = setTimeout(function(){
            $head.removeChild($script);
            if(window[options.jsonpCallback]){
            	window[options.jsonpCallback] = null;
            }
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
		if (options.type == 'POST') {
			xhr.open(options.type, options.url, options.async);
			xhr.setRequestHeader('content-type','application/x-www-form-urlencoded');
		}else{
			if(options.cache){
		    	params += (params?'&':'')+('_'+random);
		    }
			if(params){
            	options.url += (options.url.indexOf('?')>-1?'&':'?')+params;
	        }
			xhr.open(options.type, options.url, options.async);
			params = '';
		}
		for(var name in options.headers){
			xhr.setRequestHeader(name,options.headers[name]);
		}
		if(options.xhrFields){
			for(var field in options.xhrFields){
				xhr[field]= options.xhrFields[field];
			}
		}
		xhr.send(params);
		//超时处理
		var requestDone = false;
		hander = setTimeout(function() {
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
				hander && clearTimeout(hander);
				options.complete();
			}
		};
	}
}
