//JSON 转 JS 对象兼容低版本IE
function initJSON(){
    if(!window.JSON){
        window.JSON = {
                parse: function(sJSON) {
                   return eval( "(" + sJSON + ")" );
              }
        };
    };
}

//AJAX调用，请求服务端数据
function requestServer(method, url, callback){
	//创建XHR对象
	var xhr = null;
	//兼容IE
	if(window.XMLHttpRequest){
	     xhr = new XMLHttpRequest();
	}else{
	     xhr = new ActiveXObject('Microsoft XMLHTTP');
	}
	//监听AJAX事件
    addEvent(xhr, 'readystatechange', function(event){
		if(xhr.readyState == 4){
            //200-300为成功，304为读取缓存
            if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
                callback(xhr.responseText);
            }else{
                alert('Request was unsuccessful: ' + xhr.status);
            }
        }
	});
	//向服务端发起请求
	xhr.open(method, url, true);
	xhr.send(null);
}

//传入的data一般类似于{name1:value1, name2:value2,...}
//需要序列化为字符串类似于"name1=value1&name2=value2&..."
function serialize(data){
     if(!data) return "";
     var pairs = [];
     for(var name in data){
          if(!data.hasOwnProperty(name)) continue;
          if(typeof data[name] === "function") continue;
          var value = data[name].toString();
          name = encodeURIComponent(name);
          value = encodeURIComponent(value);
          pairs.push(name + "=" + value);
     }
     return pairs.join("&");
}

//支持使用空格分隔多个类名
function getElementsByClassName(node, classNames){
    //特性侦测
    if(node.getElementsByClassName){
        //优先使用W3C的规范接口
        return node.getElementsByClassName(classNames);
    }else{
        var elements = node.getElementsByTagName('*'); //获取所有后代节点
        var names = classNames.split(' '); //通过空格分割多个类名
        var result = []; //保存返回的结果
        var classNameStr; //处理过的类名
        var flag; //标记类名是否找到

        //遍历所有的后代节点
        for(var i = 0, element; element = elements[i]; i++){
            //前后加一个空格字符串，是为了防止当类名为类似user时，如果传入use也会被indexOf找到
            classNameStr = ' ' + element.className + ' ';
            flag = true;
            for(var j = 0, name; name = names[j]; j++){
                //没有找到则标记为false
                if(classNameStr.indexOf(' ' + name + ' ') == -1){
                    flag = false;
                    break;
                }
            }
            //多个类名都被找到把元素放到结果数组
            if(flag){
                result.push(element);
            }
        }
        return result;
    }
}

//获取当前样式
function getStyle(element, att){
    //特性侦测
    if(window.getComputedStyle){
        //优先使用W3C规范
        return window.getComputedStyle(element)[att];
    }else{
        //针对IE9以下兼容
        return element.currentStyle[att];
    }
}

//注册事件
function addEvent(node, type, handler){
     if (node.addEventListener){
        node.addEventListener(type, handler, false);
     }else if(node.attachEvent){ //兼容IE
        node.attachEvent('on' + type, handler);
     }else{
        node['on' + type] = handler;
     }
}

//是否包含类名
function hasClass(node, name){
    if(node.classList){
        return node.classList.contains(name);
    }else{ //兼容IE，使用正则匹配类名
        //根据一个或多个空格分割类名
        var classList = node.className.split(/\s+/);
        name = '^' + name + '$'; //增加头尾限制
        for(var i = classList.length - 1; i >= 0; i --){
            if(new RegExp(name).test(classList[i])){
                return true;
            }
        }
        return false;
    }
}

//添加类
function addClass(node, name){
    if(node.classList){
        node.classList.add(name);
    }else{ //兼容IE
        node.className += ' ' + name;
    }
}

//删除类（同时删除多个同名类）
function removeClass(node, name){
    //根据一个或多个空格分割类名
    var classList = node.className.split(/\s+/);
    name = '^' + name + '$'; //增加头尾限制
    for(var i = classList.length - 1; i >= 0; i--){
        if(new RegExp(name).test(classList[i])){
            classList.splice(i, 1);
        }
    }
    node.className = classList.join(' ');
}

//替换类（同时修改多个同名类）
function replaceClass(node, newClass, oldClass){
    //根据一个或多个空格分割类名
    var classList = node.className.split(/\s+/);
    oldClass = '^' + oldClass + '$'; //增加头尾限制
    for(var i = classList.length - 1; i >= 0; i--){
        if(new RegExp(oldClass).test(classList[i])){
            classList[i] = newClass;
        }
    }
    node.className = classList.join(' ');
}
