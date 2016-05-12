//工具方法
var Tool = {
	addCookie:function(objName,objValue,objHours,objDomain,objPath){	//添加cookie
	    var str = objName + "=" + encodeURIComponent(objValue);
	    if(objHours > 0){
	        var date = new Date();
	        var ms = objHours*3600*1000;
	        date.setTime(date.getTime() + ms);
	        str += "; expires=" + date.toGMTString();
	        if(objDomain){
	            str += ";domain="+objDomain;
	        }
	        if(objPath){
	            str += ";path="+objPath;
	        }
	    }
	    document.cookie = str;
	},
	getCookie:function(objName){										//获取指定名称的cookie的值
		var arrStr = document.cookie.split("; ");
		for(var i = 0;i < arrStr.length;i ++){
		var temp = arrStr[i].split("=");
		if(temp[0] == objName) return decodeURIComponent(temp[1]);
		}
	},
	delCookie:function(name){											//为了删除指定名称的cookie，可以将其过期时间设定为一个过去的时间
		var date = new Date();
		date.setTime(date.getTime() - 10000);
		document.cookie = name + "=a; expires=" + date.toGMTString();
	},
	extend:function (target, source) {
	    for (var p in source) {
	        if (source.hasOwnProperty(p)) {
	            target[p] = source[p];
	        }
	    }  
	    return target;
	},
	date:function(fmt,timestamp){
		// 对Date的扩展，将 Date 转化为指定格式的String 
		// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
		// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
		// 例子： 
		// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
		// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
		var day = new Date(timestamp);
		var o = { 
		    "M+" : day.getMonth()+1,                 //月份 
		    "d+" : day.getDate(),                    //日 
		    "h+" : day.getHours(),                   //小时 
		    "m+" : day.getMinutes(),                 //分 
		    "s+" : day.getSeconds(),                 //秒 
		    "q+" : Math.floor((day.getMonth()+3)/3), //季度 
		    "S"  : day.getMilliseconds()             //毫秒 
	  	};
		if(/(y+)/.test(fmt)){
			fmt=fmt.replace(RegExp.$1, (day.getFullYear()+"").substr(4 - RegExp.$1.length));
		}
		for(var k in o){
	    	if(new RegExp("("+ k +")").test(fmt)){
	    		fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length))); 
	    	}
		}
		return fmt; 
	},
	in_array:function(val,arr){						//元素是否在数组中
		for(i=0;i<arr.length&&arr[i]!=val;i++);
			return!(i==arr.length);
	},
	isNull: function(a){ 
	 	return a === null;
	},
	isUndefined: function(a){
	 	return a === undefined;
	},
	isNumber: function(a){
	 	return typeof a === 'number';
	},
	isString: function(a){
	 	return typeof a === 'string';
	},
	isBoolean: function(a){
	 	return typeof a === 'boolean';
	},
	isArray: function(a){
	 	return Object.prototype.toString.call(a) === '[object Array]';
	},
	isFunction: function(a){
	 	return Function.prototype.toString.call(a) === '[object Function]';
	},
	isWindow: function(o){
		return o && typeof o === 'object' && 'setInterval' in o;
	},
	isEmptyObject: function(o){
	    for(var a in o) {
	 		return false;
	    }
	    return true;
	}
}