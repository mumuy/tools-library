//跨浏览器DOM对象
var DOMUtil = {
	getStyle:function(node,attr){
    	return node.currentStyle ? node.currentStyle[attr] : getComputedStyle(node,0)[attr];
    },
    getScroll:function(){			//获取滚动条的滚动距离
    	var scrollPos={};
	    if (window.pageYOffset||window.pageXOffset) {
	    	scrollPos['top'] = window.pageYOffset;
	    	scrollPos['left'] = window.pageXOffset;
	    }else if (document.compatMode && document.compatMode != 'BackCompat'){
	    	scrollPos['top'] = document.documentElement.scrollTop;
	    	scrollPos['left'] = document.documentElement.scrollLeft;
	    }else if(document.body){
	    	scrollPos['top'] = document.body.scrollTop;
	    	scrollPos['left'] = document.body.scrollLeft;
	    }
	    return scrollPos;
    },
    getWindow:function(){	//获取可视窗口大小
	    if(typeof window.innerWidth !='undefined') {
	        return{
	            width : window.innerWidth,
	            height : window.innerHeight
	        }
	    }else{
	        return {
	            width : document.documentElement.clientWidth,
	            height : document.documentElement.clientHeight
	        }
	    }
	},
  	getClient:function(){			//获取浏览器的可视区域位置
		var l,t,w,h;
		l  =  document.documentElement.scrollLeft || document.body.scrollLeft;
		t  =  document.documentElement.scrollTop || document.body.scrollTop;
		w =   document.documentElement.clientWidth;
		h =   document.documentElement.clientHeight;
		return {'left':l,'top':t,'width':w,'height':h} ;
	},
  	getNextElement:function(node){	//获取下一个节点
    	if(node.nextElementSibling){
    		return node.nextElementSibling;
    	}else{
	        var NextElementNode = node.nextSibling;
	        while(NextElementNode.nodeValue != null){
	            NextElementNode = NextElementNode.nextSibling
	        }
	        return NextElementNode;
    	}
	},
	getElementById:function(idName){
	    return document.getElementById(idName);
	},
	getElementsByClassName:function(className,context,tagName){	//根据class获取节点
		if(typeof context == 'string'){
			tagName = context;
			context = document;
		}else{
			context = context || document;
			tagName = tagName || '*';
		}
	    if(context.getElementsByClassName){
	        return context.getElementsByClassName(className);
	    }
	    var nodes = context.getElementsByTagName(tagName);
	    var results= [];
	    for (var i = 0; i < nodes.length; i++) {
	        var node = nodes[i];
	        var classNames = node.className.split(' ');
	        for (var j = 0; j < classNames.length; j++) {
	            if (classNames[j] == className) {
	                results.push(node);
	                break;
	            }
	        }
	    }
	    return results;
	},
	hasClass:function(node,classname){
		return node.className.match(new RegExp('(\\s|^)'+classname+'(\\s|$)'));
	},
	addClass:function(node,classname){ 			//对节点增加class
		if(!this.hasClass(node,classname)){
	   		node.className = (node.className+" "+classname).replace(/^\s+|\s+$/g,'');
	  	}
	},
	removeClass:function(node,classname){		//对节点删除class
		node.className = (node.className.replace(classname,"")).replace(/^\s+|\s+$/g,'');
	}
}
