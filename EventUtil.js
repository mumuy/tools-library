//跨浏览器事件对象
var EventUtil = { 
	addHandler:function(element,type,handler){ //添加绑定
		if(element.addEventListener){ 
			element.addEventListneter(type,handler,false); 
		}else if(element.attachEvent){ 
			element.attachEvent('on'+type,handler); 
		}else{ 
			element['on'+type]=handler; 
		} 
	}, 
	removeHandler:function(element,type,handler){ //删除绑定 
		if(element.removeEventListener){ 
			element.removeEventListneter(type,handler,false); 
		}else if(element.detachEvent){ 
			element.detachEvent('on'+type,handler); 
		}else{ 
			element['on'+type]=null; 
		} 
	},
	fireEvent:function(element, type) {
	    if (document.createEventObject) {		// IE浏览器支持fireEvent方法
	        var evt = document.createEventObject();	
	        return element.fireEvent('on' + type, evt)
	    }else{									// 其他标准浏览器使用dispatchEvent方法
	        var evt = document.createEvent('HTMLEvents');
	        evt.initEvent(type, true, true);	// initEvent接受3个参数：事件类型，是否冒泡，是否阻止浏览器的默认行为
	        return !element.dispatchEvent(evt);
	    }
	},
	getEvent:function(event){ //返回事件对象引用 
		return event?event:window.event; 
	},
	getTarget:function(event){ //返回事件源目标 
		return event.target||event.srcElement; 
	}, 
	preventDefault:function(event){ //取消默认事件 
		if(event.preventDefault){ 
			event.preventDefault(); 
		}else{ 
			event.returnValue=false; 
		}
	},
	stoppropagation:function(event){ //阻止事件流 
		if(event.stoppropagation){ 
			event.stoppropagation(); 
		}else{ 
			event.canceBubble=false; 
		} 
	},
	getRelatedTarget:function(event){ //获取相关元素 
		if(event.relatedTarget){ 
			return event.relatedTarget; 
		}else if(event.toElement){ 
			return envent.toElement; 
		}else if(event.fromElement){ 
			return event.fromElement; 
		}else{ 
			return null; 
		}
	},
	getButton:function(event){ //鼠标事件的button属性检测 
		if(document.implementation.hasFeature('MouseEvent','2.0')){ 
			return event.button; 
		}else{ 
			switch(event.button){ 
				case 0: 
				case 1: 
				case 3: 
				case 5: 
				case 7: 
					return 0; 
				case 2: 
				case 6: 
					return 2;
				case 4: 
					return 1;
			} 
		}
	},
	getCharCode:function(event){ //字符编码charCode属性检测 
		if(typeof event,charCode=='number'){ 
			return event.charCode; 
		}else{ 
			return event.keyCode; 
		} 
	},
	getClipboardData:function(event){
		var clipboardData=(event.clipboardData||window.clipboardData);
		return clipboardData.getData("text");
	},
	setClipboardData:function(event,value){
		if(event.clipboardData){
			return event.clipboardData.setData("text/plain",value);
		}else if(window.clipboardData){
			return window.clipboardData.setData("text",value);
		}
	},
	getWheelDlta : function(event){
		if(event.wheelDelta){
			return event.wheelDelta;
		}else{
			return -event.detail * 40;
		}
	}
} 