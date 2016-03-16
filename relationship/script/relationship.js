(function(window){
	//简写
	var _filter = [
		{//自己是女性，女儿或儿子的妈妈是自己
			exp:/(,[mwd]|([olx]s)),[ds](&[ol])?,m/g,
			str:'$1'
		},
		{//自己是女性，女儿或儿子的爸爸是自己的丈夫
			exp:/(,[mwd]|([olx]s)),[ds](&[ol])?,f/g,
			str:'$1,h'
		},
		{//自己是男性，女儿或儿子的爸爸是自己
			exp:/(,[fhs]|([olx]b)),[ds](&[ol])?,f/g,
			str:'$1'
		},
		{//自己是男性，女儿或儿子的妈妈是自己的妻子
			exp:/(,[fhs]|([olx]b)),[ds](&[ol])?,m/g,
			str:'$1,w'
		},
		{//夫妻的孩子就是自己的孩子
			exp:/,[wh],([ds])/g,
			str:',$1'
		},
		{//夫妻的对方是自己
			exp:/(,w,h)|(,h,w)/g,
			str:''
		},
		{//兄弟的父母就是自己的父母
			exp:/[xol][sb],([mf])/g,
			str:'$1'
		},
		{//母亲的丈夫是自己的父亲
			exp:/m,h/g,
			str:'f',
		},
		{//父亲的妻子是自己的母亲
			exp:/f,w/g,
			str:'m',
		},
		{//孩子的姐妹是自己的女儿
			exp:/,[ds](&[ol])?,[olx]s/g,
			str:',d',
		},
		{//孩子的兄弟是自己的儿子
			exp:/,[ds](&[ol])?,[olx]b/g,
			str:',s',
		},

		{//如果自己是男性,兄弟姐妹的兄弟就是自己的兄弟或自己
			con:/(,[fhs]|([olx]b)),[olx][sb],[olx]b/,
			exp:/^(.+),[olx][sb],[olx]b(.+)$/,
			str:'$1,xb$2#$1$2',
		},
		{//如果自己是女性,兄弟姐妹的兄弟就是自己的兄弟
			con:/(,[mwd]|([olx]s)),[olx][sb],[olx]b/,
			exp:/,[olx][sb],[olx]b/,
			str:',xb',
		},
		{//如果自己是男性,兄弟姐妹的姐妹就是自己的姐妹
			con:/(,[fhs]|([olx]b)),[olx][sb],[olx]s/,
			exp:/,[olx][sb],[olx]s/,
			str:',xs',
		},
		{//如果自己是女性,兄弟姐妹的姐妹就是自己的姐妹或自己
			con:/(,[mwd]|([olx]s)),[olx][sb],[olx]s/,
			exp:/^(.+),[olx][sb],[olx]s(.+)$/,
			str:'$1,xs$2#$1$2',
		},

		{//如果自己是男性,父母的儿子是自己或者兄弟
			con:/(,[fhs]|([olx]b)),[mf],s/,
			exp:/^(.+),[mf],s(.+)$/,
			str:'$1$2#$1,xb$2'
		},
		{//如果自己是女性,父母的女儿是自己或者姐妹
			con:/(,[mwd]|([olx]s)),[mf],d/,
			exp:/^(.+),[mf],d(.+)$/,
			str:'$1$2#$1,xs$2'
		},
		{//如果自己是女性,父母的儿子是自己或者兄弟
			con:/(,[mwd]|([olx]s)),[mf],s/,
			exp:/,[mf],s/,
			str:',xb'
		},
		{//如果自己是男性,父母的女儿是自己或者姐妹
			con:/(,[fhs]|([olx]b)),[mf],d/,
			exp:/,[mf],d/,
			str:',xs'
		},
		{//父母的女儿是姐妹
			exp:/^,[mf],s$/,
			str:',#,xb'
		},
		{//父母的女儿是自己或者姐妹
			exp:/^,[mf],d$/,
			str:',#,xs'
		}
	];

	var _data = {
		'':['自己'],
		//外家
		'm,m':['外婆','姥姥'],
		'm,f':['外公','姥爷'],
		'm,m,m':['太姥姥'],
		'm,m,m,h':['太姥爷'],
		'm,m,xs':['姨姥姥'],
		'm,m,xs,w':['姨姥爷'],
		'm,m,xb':['舅姥爷'],
		'm,m,xb,w':['舅姥姥'],
		'm,f,m':['太姥姥'],
		'm,f,m,h':['太姥爷'],
		'm,f,xs':['姑姥姥'],
		'm,f,xs,h':['姑姥爷'],
		'm,f,xs,s':['表舅'],
		'm,f,xb':['xx姥爷'],
		'm,f,ob':['大姥爷'],
		'm,f,lb':['小姥爷'],
		//舅家
		'm,xb':['舅舅','舅'],
		'm,xb,w':['舅妈','舅母'],
		'm,xb,s&o':['表哥(舅家)','表哥'],
		'm,xb,s&o,w':['表嫂(舅家)','表嫂'],
		'm,xb,s&l':['表弟(舅家)','表弟'],
		'm,xb,s&l,w':['表弟媳(舅家)','表弟媳'],
		'm,xb,s,s':['表侄子'],
		'm,xb,s,d':['表侄女'],
		'm,xb,d&o':['表姐(舅家)','表姐'],
		'm,xb,d&o,h':['表姐夫(舅家)','表姐夫'],
		'm,xb,d&l':['表妹(舅家)','表妹'],
		'm,xb,d&l,h':['表妹夫(舅家)','表妹夫'],
		'm,xb,d,s':['表外甥'],
		'm,xb,d,d':['表外甥女'],
		'm,ob':['大舅'],
		'm,ob,w':['大舅妈'],
		'm,lb':['小舅'],
		'm,lb,w':['小舅妈'],
		//姨家
		'm,xs':['姨妈','姨姨','姨'],
		'm,xs,h':['姨父','姨丈'],
		'm,xs,s&o':['表哥(姨家)','表哥'],
		'm,xs,s&o,w':['表嫂(姨家)','表嫂'],
		'm,xs,s&l':['表弟(姨家)','表弟'],
		'm,xs,s&l,w':['表弟媳(姨家)','表弟媳'],
		'm,xs,s,s':['表侄子'],
		'm,xs,s,d':['表侄女'],
		'm,xs,d&o':['表姐(姨家)','表姐'],
		'm,xs,d&o,h':['表姐夫(姨家)','表姐夫'],
		'm,xs,d&l':['表妹(姨家)','表妹'],
		'm,xs,d&l,h':['表妹夫(姨家)','表妹夫'],
		'm,xs,d,s':['表外甥'],
		'm,xs,d,d':['表外甥女'],
		'm,os':['大姨','大姨妈'],
		'm,os,h':['大姨父','大姨丈','大姨夫'],
		'm,ls':['小姨','小姨妈'],
		'm,ls,h':['小姨父','小姨丈','小姨夫'],
		//姑家
		'f,xs':['姑妈','姑姑','姑'],
		'f,xs,h':['姑父','姑丈'],
		'f,xs,s&o':['表哥(姑家)','表哥'],
		'f,xs,s&o,w':['表嫂(姑家)','表嫂'],
		'f,xs,s&l':['表弟(姑家)','表弟'],
		'f,xs,s&l,w':['表弟媳(姑家)','表弟媳'],
		'f,xs,s,s':['表侄子'],
		'f,xs,s,d':['表侄女'],
		'f,xs,d&o':['表姐(姑家)','表姐'],
		'f,xs,d&o,h':['表姐夫(姑家)','表姐夫'],
		'f,xs,d&l':['表妹(姑家)','表妹'],
		'f,xs,d&l,h':['表妹夫(姑家)','表妹夫'],
		'f,xs,d,s':['表外甥'],
		'f,xs,d,d':['表外甥女'],
		'f,os':['姑母'],
		'f,ls':['姑姐'],
		//本家
		'f,xb,s&o':['堂哥'],
		'f,xb,s&o,w':['堂嫂'],
		'f,xb,s&l':['堂弟'],
		'f,xb,s&l,w':['堂弟媳'],
		'f,xb,s,s':['堂侄子'],
		'f,xb,s,d':['堂侄女'],
		'f,xb,d&o':['堂姐'],
		'f,xb,d&o,h':['堂姐夫'],
		'f,xb,d&l':['堂妹'],
		'f,xb,d&l,h':['堂妹夫'],
		'f,xb,d,s':['表外甥'],
		'f,xb,d,d':['表外甥女'],
		'f,ob':['伯父','伯伯','大伯'],
		'f,ob,w':['伯母','大娘'],	
		'f,lb':['叔叔','叔父','叔'],
		'f,lb,w':['婶婶','婶'],
		//岳家
		'w,m':['岳母','丈母娘'],
		'w,f':['岳父','老丈人','丈人'],
		'w,ob':['大舅哥','大舅子','内兄'],
		'w,ob,w':['嫂子','大妗子'],
		'w,lb':['小舅子','内弟'],
		'w,lb,w':['弟媳妇','小妗子'],
		'w,os':['大姨姐','妻姐'],
		'w,os,h':['大姨夫'],
		'w,ls':['小姨姐','妻妹'],
		'w,ls,h':['小姨夫'],
		//婆家
		'h,m':['婆婆'],
		'h,f':['公公'],
		'h,ob':['大伯子'],
		'h,ob,w':['大婶子','大伯娘','大嫂'],
		'h,ob,s':['侄子'],
		'h,ob,d':['侄女'],
		'h,lb':['小叔子'],
		'h,lb,w':['小婶子'],
		'h,lb,s':['侄子'],
		'h,lb,d':['侄女'],
		'h,os':['大姑子','大姑'],
		'h,os,s':['外甥'],
		'h,os,d':['外甥女'],
		'h,os,h':['大姑夫','姊丈'],
		'h,ls':['小姑子','小姑'],
		'h,ls,h':['小姑夫'],
		'h,ls,s':['外甥'],
		'h,ls,d':['外甥女'],
		//内家
		'f,f,f,f':['高祖父'],
		'f,f,f,m':['高祖母'],
		'f,f,f':['曾祖父'],
		'f,f,m':['曾祖母'],
		'f,m':['奶奶','祖母'],
		'f,f':['爷爷','祖父'],
		'f,f,f':['太爷爷'],
		'f,f,m':['太奶奶'],
		'f,f,ob':['大爷爷'],
		'f,f,ob,w':['大奶奶'],
		'f,f,lb':['小爷爷'],
		'f,f,lb,w':['小奶奶'],
		'f,f,xs':['姑奶奶'],
		'f,f,xs,h':['姑爷爷'],
		'f,m':['奶奶','祖母'],
		'f,m,f':['太爷爷'],
		'f,m,m':['太奶奶'],
		'f,m,xs':['姨爷爷','姨爷'],
		'f,m,xs,h':['姨奶奶'],
		'f,m,xb':['舅爷爷','舅爷'],
		'f,m,xb,w':['舅奶奶'],
		//自家
		'm':['妈妈','母亲','老妈','老母','娘','娘亲','妈咪'],
		'f':['爸爸','父亲','老爸','老豆','爹','爹地','老爷子'],
		'w':['老婆','妻子','太太','女人','贱内','婆娘','妻','爱人'],
		'h':['老公','丈夫','先生','男人','夫','爱人'],
		's':['儿子'],
		's,w':['儿媳妇'],
		's,s':['孙子'],
		's,s,w':['孙媳妇'],
		's,s,s':['曾孙'],
		's,s,s,s':['玄孙'],
		's,s,d':['曾孙女'],
		's,d':['孙女'],
		's,d,h':['孙女婿'],
		'd':['女儿','千金'],
		'd,h':['女婿'],
		'd,s':['外孙'],
		'd,s,w':['外孙媳'],
		'd,d':['外孙女'],
		'd,d,h':['外孙女婿'],
		//旁支
		'xb':['兄弟'],
		'xs':['姐妹'],
		'ob':['哥哥','兄'],
		'ob,w':['嫂子','嫂'],
		'ob,s':['侄子'],
		'ob,s,w':['侄媳妇'],
		'ob,d':['侄女'],
		'ob,d,h':['侄女婿'],
		'lb':['弟弟','第'],
		'lb,w':['弟妹'],
		'lb,s':['侄子'],
		'lb,s,w':['侄媳妇'],
		'lb,d':['侄女'],
		'lb,d,h':['侄女婿'],
		'os':['姐姐','姐'],
		'os,h':['姐夫'],
		'os,s':['外甥'],
		'os,d':['外甥女'],
		'ls':['妹妹','妹'],
		'ls,h':['妹夫'],
		'ls,s':['外甥'],
		'ls,d':['外甥女'],
		//其他
		's,w,m':['亲家母'],
		's,w,f':['亲家公'],
		'd,h,m':['亲家母'],
		'd,h,f':['亲家公'],
	};

	//数组去重
	var unique = function(arr) {
	    var result = [], hash = {};
	    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
	        if (!hash[elem]) {
	            result.push(elem);
	            hash[elem] = true;
	        }
	    }
	    return result;
	};

	var _attr = '';

	//分词解析
	function getSelectors(str){
		var lists = str.split('的');
		var result = [];						//所有可能性
		while(lists.length){
			var name = lists.shift();			//当前匹配词
			var arr = [];						//当前匹配词可能性
			for(var i in _data){
				var value = _data[i];
				if(value.indexOf(name)>-1){		//是否存在该关系
					arr.push(i);
				}
			}
			if(result.length){				//当前匹配词与之前可能性组合
				var res = [];
				for(var i=0;i<result.length;i++){
					for(var j=0;j<arr.length;j++){
						res.push(result[i] +','+arr[j]);
					}
				}
				result = res;
			}else{
				for(var i=0;i<arr.length;i++){
					result.push(','+arr[i]);
				}
			}
		}
		if(result.length){		//对年龄进行智能过滤
			var item = result[0];
			var o = item.match(/(&o)|o[sb]/);
			var l = item.match(/(&l)|l[sb]/);
			if(o&&l){
				var filter = /&[ol]/g;
				for(var i=0;i<result.length;i++){
					result[i]=result[i].replace(filter,'');
				}
			}else if(o&&!l){
				_attr = '&o';
			}else if(!o&&l){
				_attr = '&l';
			}
		}
		return result;
	}

	//简化选择器
	function selector2id(selector){
		var result = [];
		var getId = function(selector){
			var s;
			do{
				s = selector;
				for(var i in _filter){
					var item = _filter[i];
					if(item['con']){
						if(selector.match(item['con'])){
							selector = selector.replace(item['exp'],item['str']);
						}
					}else{
						selector = selector.replace(item['exp'],item['str']);
					}
				}
			}while(s!=selector);
			if(selector.indexOf('#')>-1){
				var arr = selector.split('#');
				for(var i=0;i<arr.length;i++){
					getId(arr[i]);
				}
			}else{
				selector = selector.substr(1); 	//去前面逗号
				if(selector.match(/,[ds]$/)&&_attr){
					selector += _attr;
				}
				result.push(selector);
			}
		}
		getId(selector);
		return result;
	}

	//获取数据
	function getDataById(id){
		var result = [];
		var filter = /&[olx]/g;			//忽略属性查找数据
		for(var i in _data){
			if(i.replace(filter,'')==id){
				result.push(_data[i]);
			}
		}
		return result;
	}

	function relationship(str){
		var selectors = getSelectors(str);
		console.log(selectors);
		var result = [];							//匹配结果
		for(var i = 0;i<selectors.length;i++){		//遍历所有可能性
			var ids = selector2id(selectors[i]);
			for(var j=0;j<ids.length;j++){
				var id = ids[j];
				if(_data[id]){							//直接匹配称呼
					result.push(_data[id][0]);
				}else{									//高级查找
					var data = getDataById(id);			//忽略属性查找
					if(!data.length){					//当无精确数据时，忽略年龄条件查找
						id = id.replace(/&[ol]/,'');
						data = getDataById(id);
					}
					if(!data.length){
						id = id.replace(/[ol]/g,'x');
						data = getDataById(id);
					}
					if(!data.length){
						var l = id.replace(/x/g,'l');
						data = getDataById(l);
						var o = id.replace(/x/g,'o');
						data = data.concat(getDataById(o));
					}
					for(var d=0;d<data.length;d++){
						result.push(data[d][0]);
					}	
				}
			}
		}
		return unique(result);
	}

	window.relationship = relationship;
})(window);

console.log(relationship('外婆的外孙'));