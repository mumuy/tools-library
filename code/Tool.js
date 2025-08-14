//工具方法
var Tool = {
    // Cookie设置
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
    // 对象合并
    extend:function (target, source) {
        for (var p in source) {
            if (source.hasOwnProperty(p)) {
                target[p] = source[p];
            }
        }  
        return target;
    },
    // 格式化
    date:function(fmt,timestamp){
        // 对Date的扩展，将 Date 转化为指定格式的String 
        // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
        // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
        // 例子： 
        // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
        // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
        var day = timestamp?new Date(timestamp):new Date();
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
    // 复制文本
    setClipboard(text,callback){
        var callback = callback||function(){};
        window.getSelection().removeAllRanges();
        var selection = window.getSelection();
        var newdiv = document.createElement('div');
        newdiv.style.position = 'absolute';
        newdiv.style.left = '-99999px';
        document.body.appendChild(newdiv);
        newdiv.innerHTML = text;
        selection.selectAllChildren(newdiv);
        document.execCommand("Copy");
        window.setTimeout(function () {
            document.body.removeChild(newdiv);
            callback();
        }, 100);
    },
    // 下载图片
    downloadImage(src){
        var canvas = document.createElement('canvas');
        var img = document.createElement('img');
        var format = src.indexOf('.png')>-1?"image/png":"image/jpeg";
        img.onload = function(e) {
            canvas.width = img.width;
            canvas.height = img.height;
            var context = canvas.getContext('2d');
            context.drawImage(img, 0, 0, img.width, img.height);
            canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
            canvas.toBlob((blob)=>{
                let link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'aaa'; 
                link.click();  
            }, format);
        }
        img.setAttribute("crossOrigin",'Anonymous');
        img.src = src;
    },
    // 解析URL
    parseURL:function(url){			//URL解析
        var a =  document.createElement('a');
        a.href = url;
        return {
            source: url,
            protocol: a.protocol.replace(':',''),
            host: a.hostname,
            port: a.port,
            query: a.search,
            params: (function(){
                var ret = {},
                    seg = a.search.replace(/^\?/,'').split('&'),
                    len = seg.length, i = 0, s;
                for (;i<len;i++) {
                    if (!seg[i]) { continue; }
                    s = seg[i].split('=');
                    ret[s[0]] = s[1];
                }
                return ret;
            })(),
            file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
            hash: a.hash.replace('#',''),
            path: a.pathname.replace(/^([^\/])/,'/$1'),
            relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
            segments: a.pathname.replace(/^\//,'').split('/')
        };
    },
    // 加载script
    loadScript:function(url, callback){
        var script = document.createElement("script");
        script.type = "text/javascript";
        if (script.readyState){		//IE
            script.onreadystatechange = function(){
                if (script.readyState == "loaded" || script.readyState == "complete"){
                    script.onreadystatechange = null;
                    callback();
                };
            };
        } else {					//Others: Firefox, Safari, Chrome, and Opera
            script.onload = function(){
                callback();
            };
        };
        script.src = url;
        document.body.appendChild(script);
    },
    // 防抖
    debounce:function(fn,delay){
        var timer;
        return function(){
            var context = this;
            var args = arguments;
            timer&&clearTimeout(timer);
            timer = setTimeout(function(){
                fn.apply(context,args);
            },delay);
        }
    },
    // 节流
    throttle:function(fn, threshhold){
        var last;
        var timer;
        threshhold || (threshhold = 250);
        return function(){
            var context = this;
            var args = arguments;
            var now = + new Date();
            if(last && now < last + threshhold){
                timer&&clearTimeout(timer);
                timer = setTimeout(function(){
                    last = now;
                    fn.apply(context, args);
                },threshhold);
            }else{
                last = now;
                fn.apply(context,args);
            }
        }
    },
    // 高频拦截，最后一次必执行
    debounceThrottle:function(fn, wait = 500) {
        let timer = null;
        let lastExecTime = 0;
        let lastArgs = null;
        let lastThis = null;
        let lastResult = null;
        async function invokeFn() {
            const result = fn.apply(lastThis, lastArgs);
            lastExecTime = Date.now();
            return result;
        }
        return async function(...args) {
            const now = Date.now();
            lastArgs = args;
            lastThis = this;
            const elapsed = now - lastExecTime; // 计算距离上次执行的时间
            if (elapsed >= wait) {              // 如果距离上次执行超过了等待时间，立即执行
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
                lastResult = await invokeFn();
            } else {
                if (!timer) {                   // 如果没有定时器，设置一个定时器确保在wait时间后执行
                    return new Promise((resolve)=>{
                        timer = setTimeout(async () => {
                            lastResult = await invokeFn();
                            timer = null;
                            resolve(lastResult);
                        }, wait - elapsed);
                    });
                } else {                        // 否则更新防抖定时器，确保最后一次调用一定会执行
                    clearTimeout(timer);
                    return new Promise((resolve)=>{
                        timer = setTimeout(async () => {
                            lastResult = await invokeFn();
                            timer = null;
                            resolve(lastResult);
                        }, wait);
                    });
                }
            }
            return lastResult;
        };
    },
    // 类型判断
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