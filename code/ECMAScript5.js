//函数
Function.prototype.bind = Function.prototype.bind || function(context){
    var self = this;
    return function() {
        return self.apply(context, arguments);
    }
};

//数值
if(!Number.toFixed){
    Number.prototype.toFixed = function(len){
        var times = Math.pow(10,len);
        return Math.round(this*times)/times;
    }
}

//字符串
if(!String.prototype.trim) {
	String.prototype.trim = function () {
    	return this.replace(/^\s+|\s+$/g,'');
	};
}

//日期
if (!Date.now) {
	Date.now = function now() {
    	return new Date().getTime();
	};
}

//对象
if (typeof Object.create !== 'function') {  
    Object.create = function(o) {  
        function F() {}  
        F.prototype = o;  
		return new F();  
    };  
}
if (!Object.keys) Object.keys = function(o) {
	if (o !== Object(o))
    	throw new TypeError('Object.keys called on a non-object');
  	var k=[],p;
  	for (p in o) if (Object.prototype.hasOwnProperty.call(o,p)) k.push(p);
  	return k;
}

//数组
if(!Array.isArray) {
    Array.isArray = function (obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
    };
}
if (typeof Array.prototype.forEach != "function") {
  	Array.prototype.forEach = function (fn, context) {
	    for (var k = 0, length = this.length; k < length; k++) {
	      	if (typeof fn === "function" && Object.prototype.hasOwnProperty.call(this, k)) {
	        	fn.call(context, this[k], k, this);
	      	}
	    }
  	};
}
if (typeof Array.prototype.map != "function") {
  	Array.prototype.map = function (fn, context) {
	    var arr = [];
	    if (typeof fn === "function") {
	      	for (var k = 0, length = this.length; k < length; k++) {      
	        	arr.push(fn.call(context, this[k], k, this));
	      	}
	    }
	    return arr;
  	};
}
if (typeof Array.prototype.filter != "function") {
	Array.prototype.filter = function (fn, context) {
	    var arr = [];
	    if (typeof fn === "function") {
	       	for (var k = 0, length = this.length; k < length; k++) {
	        	fn.call(context, this[k], k, this) && arr.push(this[k]);
	       	}
	    }
	    return arr;
	};
}
if (typeof Array.prototype.some != "function") {
	Array.prototype.some = function (fn, context) {
	    var passed = false;
	    if (typeof fn === "function") {
	        for (var k = 0, length = this.length; k < length; k++) {
	        	if (passed === true) break;
	          	passed = !!fn.call(context, this[k], k, this);
	      	}
	    }
	    return passed;
  	};
}
if (typeof Array.prototype.every != "function") {
	Array.prototype.every = function (fn, context) {
	    var passed = true;
	    if (typeof fn === "function") {
	       	for (var k = 0, length = this.length; k < length; k++) {
	        	if (passed === false) break;
	          	passed = !!fn.call(context, this[k], k, this);
	      	}
	    }
	    return passed;
  	};
}
if (typeof Array.prototype.indexOf != "function") {
	Array.prototype.indexOf = function (searchElement, fromIndex) {
    	var index = -1;
    	fromIndex = fromIndex * 1 || 0;
    	for (var k = 0, length = this.length; k < length; k++) {
      		if (k >= fromIndex && this[k] === searchElement) {
          		index = k;
          		break;
      		}
    	}
    	return index;
  	};
}
if (typeof Array.prototype.lastIndexOf != "function") {
  	Array.prototype.lastIndexOf = function (searchElement, fromIndex) {
	    var index = -1, length = this.length;
	    fromIndex = fromIndex * 1 || length - 1;
	    for (var k = length - 1; k > -1; k-=1) {
	        if (k <= fromIndex && this[k] === searchElement) {
	            index = k;
	            break;
	        }
	    }
	    return index;
  	};
}
if (typeof Array.prototype.reduce != "function") {
  	Array.prototype.reduce = function (callback, initialValue ) {
	    var previous = initialValue, k = 0, length = this.length;
	    if (typeof initialValue === "undefined") {
	        previous = this[0];
	        k = 1;
	    }
	    if (typeof callback === "function") {
	      	for (k; k < length; k++) {
	        	this.hasOwnProperty(k) && (previous = callback(previous, this[k], k, this));
	      	}
	    }
	    return previous;
  	};
}
if (typeof Array.prototype.reduceRight != "function") {
  	Array.prototype.reduceRight = function (callback, initialValue ) {
	    var length = this.length, k = length - 1, previous = initialValue;
	    if (typeof initialValue === "undefined") {
	        previous = this[length - 1];
	        k--;
	    }
	    if (typeof callback === "function") {
	       for (k; k > -1; k-=1) {          
	          this.hasOwnProperty(k) && (previous = callback(previous, this[k], k, this));
	       }
	    }
	    return previous;
  	};
}