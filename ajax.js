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
		data: params.data||{}
	};	
	var formatParams = function(json) {
        var arr = [];
        for(var i in json) {
            arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(json[i]));    
        }
        return arr.join("&");
    };
	options.data = formatParams(options.data);

	var xhr = new (self.XMLHttpRequest||ActiveXObject)("Microsoft.XMLHTTP"); //最简实现xhr
	if(!xhr){
		return false;
	}
	if (options.type == 'POST') {
		xhr.open(options.type, options.url, options.async);
		xhr.setRequestHeader('content-type','application/x-www-form-urlencoded');
		xhr.send(options.data);
	}else{
		xhr.open(options.type, options.url + '?'+ options.data, options.async);
		xhr.send(null);
	}
	var requestDone = false;
	setTimeout(function() {
		requestDone = true;
		if(xhr.readyState != 4){
			xhr.abort();
		}
	}, options.timeout);
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