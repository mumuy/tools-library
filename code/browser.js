//浏览器信息
var browser = (function(){
	var u = navigator.userAgent;
	var obj = {
		//内核
		isTrident: u.indexOf('Trident')>0,
		isPresto: u.indexOf('Presto')>0,
        isWebKit: u.indexOf('AppleWebKit')>0,
        isGecko: u.indexOf('Gecko')>0,
		//浏览器
		isUC: u.indexOf('UC')>0||u.indexOf('UBrowser')>0,
		isQQ: u.indexOf('QQBrowser')>0,
		isBaiDu: u.indexOf('Baidu')>0||u.indexOf('BIDUBrowser')>0,
		isMaxthon: u.indexOf('Maxthon')>0,
		isSouGou: u.indexOf('MetaSr')>0||u.indexOf('Sogou')>0,
		isIE: u.indexOf('MSIE')>0,
		isFirefox: u.indexOf('Firefox')>0,
		isOpera: u.indexOf('Opera')>0||u.indexOf('OPR')>0,
		isSafari: u.indexOf('Safari')>0,
		isChrome:u.indexOf('Chrome')>0||u.indexOf('CriOS')>0,
		//系统或平台
		isWindows:u.indexOf('Windows')>0,
		isMac:u.indexOf('Macintosh')>0,
		isAndroid:u.indexOf('Android')>0||u.indexOf('Adr')>0,
		isWP:u.indexOf('IEMobile')>0,
		isBlackBerry:u.indexOf('BlackBerry')>0||u.indexOf('RIM')>0||u.indexOf('BB')>0,
		isMeeGo:u.indexOf('MeeGo')>0,
		isSymbian:u.indexOf('Symbian')>0,
		isIOS:u.indexOf('like Mac OS X')>0,
		isIPhone: u.indexOf('iPh')>0,
		isIPad:u.indexOf('iPad')>0,
		//设备
		isMobile:u.indexOf('Mobi')>0||u.indexOf('iPh')>0||u.indexOf('480')>0,
		isTablet:u.indexOf('Tablet')>0||u.indexOf('iPad')>0||u.indexOf('Nexus 7')>0,
		//语言
		language: (function(){
			var g = (navigator.browserLanguage || navigator.language).toLowerCase();
			return g=="c"?"zh-cn":g;
		})()
	}
	//修正
	if(!obj.isTrident){
		obj.isTrident = obj.isIE;
	}
	if(obj.isGecko){
		obj.isGecko = !obj.isWebKit;
	}
	if(obj.isChrome){
		obj.isChrome = !(obj.isOpera + obj.isBaiDu + obj.isMaxthon + obj.isSouGou + obj.isUC + obj.isQQ);
	}
	if(obj.isSafari){
		obj.isSafari = !(obj.isChrome + obj.isOpera + obj.isBaiDu + obj.isMaxthon + obj.isSouGou + obj.isUC + obj.isQQ);
	}
	if(obj.isMobile){
		obj.isMobile = !obj.isIPad;
	}
	return obj;
})();