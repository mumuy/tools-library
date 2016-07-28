/*
	ECMAScript5 Polyfill
*/

//函数
if (!Function.prototype.bind) {
  	Function.prototype.bind = function(oThis) {
	    if (typeof this !== 'function') {
	      	// closest thing possible to the ECMAScript 5
	      	// internal IsCallable function
	      	throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
	    }
	    var aArgs   = Array.prototype.slice.call(arguments, 1),
	        fToBind = this,
	        fNOP    = function() {},
	        fBound  = function() {
	          	return fToBind.apply(this instanceof fNOP
	                ? this
	                : oThis,
	                aArgs.concat(Array.prototype.slice.call(arguments)));
	        };
	    if (this.prototype) {
	      	// Function.prototype doesn't have a prototype property
	      	fNOP.prototype = this.prototype; 
	    }
	    fBound.prototype = new fNOP();
	    return fBound;
  	};
}

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
if (!Date.now){
	Date.now = function now(){
    	return new Date().getTime();
	};
}
if (!Date.prototype.toISOString) {
  	(function() {
    function pad(number) {
      if (number < 10) {
        return '0' + number;
      }
      return number;
    }
    Date.prototype.toISOString = function() {
      return this.getUTCFullYear() +
        '-' + pad(this.getUTCMonth() + 1) +
        '-' + pad(this.getUTCDate()) +
        'T' + pad(this.getUTCHours()) +
        ':' + pad(this.getUTCMinutes()) +
        ':' + pad(this.getUTCSeconds()) +
        '.' + (this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
        'Z';
    };
  }());
}

//对象
if (typeof Object.create != 'function') {
  	Object.create = (function(undefined) {
	    var Temp = function() {};
	    return function (prototype, propertiesObject) {
		    if(prototype !== Object(prototype) && prototype !== null) {
		    	throw TypeError('Argument must be an object, or null');
		    }
		    Temp.prototype = prototype || {};
		    if (propertiesObject !== undefined) {
		        Object.defineProperties(Temp.prototype, propertiesObject);
		    } 
		    var result = new Temp(); 
		    Temp.prototype = null;
		    // to imitate the case of Object.create(null)
		    if(prototype === null) {
		        result.__proto__ = null;
		    } 
		    return result;
	    };
  	})();
}
if (!Object.keys) {
  	Object.keys = (function() {
    	'use strict';
    	var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
        dontEnums = [
        	'toString',
        	'toLocaleString',
        	'valueOf',
        	'hasOwnProperty',
        	'isPrototypeOf',
        	'propertyIsEnumerable',
        	'constructor'
        ],
        dontEnumsLength = dontEnums.length;
	    return function(obj) {
	      	if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
	        	throw new TypeError('Object.keys called on non-object');
	      	}
	      	var result = [], prop, i;
	      	for (prop in obj) {
	        	if (hasOwnProperty.call(obj, prop)) {
	          		result.push(prop);
	        	}
	      	}
	      	if (hasDontEnumBug) {
	        	for (i = 0; i < dontEnumsLength; i++) {
	          		if (hasOwnProperty.call(obj, dontEnums[i])) {
	            		result.push(dontEnums[i]);
	          		}
	        	}
	      	}
	      	return result;
	    };
  	}());
}

//数组
if (!Array.isArray) {
  	Array.isArray = function(arg) {
    	return Object.prototype.toString.call(arg) === '[object Array]';
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