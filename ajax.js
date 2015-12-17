function ajax(params){
    var xhr = new (self.XMLHttpRequest||ActiveXObject)("Microsoft.XMLHTTP");  //最简实现xhr
	if(!xhr){
		return false;
	}
	var options = {
		url: params.url||'',
		method: (params.method||'GET').toUpperCase(),
		timeout: params.timeout||5000,
		async : true,
		complete: params.complete||function(){},
		error: params.error||function() {},
		success: params.success||function(){},
		type: params.type||'json',
		data: params.data||{}
	};	
	var json2string = function(json) {
        var arr = [];
        for(var i in json) {
            arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(json[i]));    
        }
        return arr.join("&");
    };
	options.data = json2string(options.data);
	xhr.open(options.method, options.url, options.async);
	if (options.method == 'GET') {
		xhr.send(null);
	}else{
		xhr.setRequestHeader('content-type','application/x-www-form-urlencoded');
		xhr.send(options.data);
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
			if(xhr.status == 200) {
				var data = options.type == "xml" ? xhr.responseXML : xhr.responseText;
				if (options.type == "json") {
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
