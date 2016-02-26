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
	}
}