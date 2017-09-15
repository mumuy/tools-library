/*
	ECMAScript6 Polyfill
*/

if (typeof Object.assign != 'function') {
  	Object.assign = function(target) {
	    'use strict';
	    if (target == null) {
	      	throw new TypeError('Cannot convert undefined or null to object');
	    }
	    target = Object(target);
	    for (var index = 1; index < arguments.length; index++) {
	      var source = arguments[index];
	      if (source != null) {
	        for (var key in source) {
	          if (Object.prototype.hasOwnProperty.call(source, key)) {
	            target[key] = source[key];
	          }
	        }
	      }
	    }
	    return target;
  	};
}
if (!Object.is) {
  	Object.is = function(x, y) {
    	// SameValue algorithm
	    if (x === y) { // Steps 1-5, 7-10
	    	// Steps 6.b-6.e: +0 != -0
	      	return x !== 0 || 1 / x === 1 / y;
	    } else {
	    	// Step 6.a: NaN == NaN
	    	return x !== x && y !== y;
	    }
  	};
}