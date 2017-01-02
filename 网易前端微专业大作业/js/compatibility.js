//使用一个对象包裹所有兼容方法，防止命名空间被污染
var compatibility = {};

//JSON 转 JS 对象兼容低版本IE
compatibility.initJSON = function(){
    if(!window.JSON){
        window.JSON = {
                parse: function(sJSON){
                   return eval( "(" + sJSON + ")" );
              }
        };
    };
}

//AJAX 调用，请求服务端数据
compatibility.requestServer = function(method, url, header, data, callback){
	//创建 XHR 对象
	var xhr = null;
	//兼容 IE
	if(window.XMLHttpRequest){
	     xhr = new XMLHttpRequest();
	}else{
	     xhr = new ActiveXObject('Microsoft XMLHTTP');
	}
	//监听 AJAX 事件
    compatibility.addEvent(xhr, 'readystatechange', function(event){
		if(xhr.readyState == 4){
            //200-300 为成功，304 为读取缓存
            if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
                callback(xhr.responseText);
            }else{
                alert('Request was unsuccessful: ' + xhr.status);
            }
        }
	});
	//向服务端发起请求
	xhr.open(method, url, true);
    if(header) xhr.setRequestHeader('Content-Type', header);
	xhr.send(data);
}

//传入的 data 一般类似于 {name1:value1, name2:value2,...}
//需要序列化为字符串类似于 "name1=value1&name2=value2&..."
compatibility.serialize = function(data){
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
compatibility.getElementsByClassName = function(node, classNames){
    //特性侦测
    if(node.getElementsByClassName){
        //优先使用 W3C 的规范接口
        return node.getElementsByClassName(classNames);
    }else{
        var elements = node.getElementsByTagName('*'); //获取所有后代节点
        var names = classNames.split(' '); //通过空格分割多个类名
        var result = []; //保存返回的结果
        var classNameStr; //处理过的类名
        var flag; //标记类名是否找到

        //遍历所有的后代节点
        for(var i = 0, element; element = elements[i]; i++){
            //前后加一个空格字符串，是为了防止当类名为类似 user 时，如果传入 use 也会被 indexOf 找到
            classNameStr = ' ' + element.className + ' ';
            flag = true;
            for(var j = 0, name; name = names[j]; j++){
                //没有找到则标记为 false
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
compatibility.getStyle = function(element, att){
    //特性侦测
    if(window.getComputedStyle){
        //优先使用 W3C 规范
        return window.getComputedStyle(element)[att];
    }else{
        //针对 IE9 以下兼容
        return element.currentStyle[att];
    }
}

//阻止默认行为
compatibility.stopDefault = function(event){
    if(event.preventDefault){
        event.preventDefault();
    }else{
        //针对 IE8 以下兼容
        window.event.returnValue = false;
    }
}

//注册事件
compatibility.addEvent = function(node, type, handler){
     if (node.addEventListener){
        node.addEventListener(type, handler, false);
     }else if(node.attachEvent){ //兼容 IE
        node.attachEvent('on' + type, handler);
     }else{
        node['on' + type] = handler;
     }
}

//是否包含类名
compatibility.hasClass = function(node, name){
    if(node.classList){
        return node.classList.contains(name);
    }else{ //兼容 IE，使用正则匹配类名
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
compatibility.addClass = function(node, name){
    if(node.classList){
        node.classList.add(name);
    }else{ //兼容 IE
        node.className += ' ' + name;
    }
}

//删除类（同时删除多个同名类）
compatibility.removeClass = function(node, name){
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
compatibility.replaceClass = function(node, newClass, oldClass){
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

//设置 Cookie
compatibility.setCookie = function(name, value, expires, path, domain, secure){
    var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    if(expires) cookie += '; expires=' + expires.toUTCString();
    if(path) cookie += '; path=' + path;
    if(domain) cookie += '; domain=' + domain;
    if(secure) cookie += '; secure=' + secure;
    document.cookie = cookie;
}

//获取 Cookie
compatibility.getCookie = function(){
    var cookie = {};
    var all = document.cookie;
    if(all === '') return cookie;
    //以分号加空格分隔
    var list = all.split('; ');
    for(var i = 0, length = list.length; i < length; i ++){
        var item = list[i];
        //取等号两边的键和值
        var p = item.indexOf('=');
        var name = item.substring(0, p);
        name = decodeURIComponent(name);
        var value = item.substring(p + 1);
        value = decodeURIComponent(value);
        cookie[name] = value;
    }
    return cookie;
}

//删除 Cookie
compatibility.removeCookie = function(name, path, domain){
    var cookie = encodeURIComponent(name) + '=';
    if(path) cookie += '; path=' + path;
    if(domain) cookie += '; domain=' + domain;
    cookie += '; max-age=0';
    document.cookie = cookie;
}
