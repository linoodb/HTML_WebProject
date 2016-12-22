/*
*	屏幕宽度
*/
var SCREEN_SIZE = 1205; //窗口宽度<1205 时，使用小屏视觉布局；窗口宽度>=1205 时，使用大屏视觉布局
/*
*	请求服务端的 URL
*/
var COURSES_URL = 'http://study.163.com/webDev/couresByCategory.htm?'; //课程列表 URL
var TOP_URL = 'http://study.163.com/webDev/hotcouresByCategory.htm'; //热门排行 URL
var FOLLOW_URL = 'http://study.163.com/webDev/ attention.htm'; //关注 URL
var LOGIN_URL = 'http://study.163.com/webDev/login.htm?'; //用户登录 URL
var VIDEO_URL = 'http://mov.bn.netease.com/open-movie/nos/mp4/2014/12/30/SADQ86F5S_shd.mp4'; //视频 URL
/*
*	关注按钮
*/
var isFollow = false; //是否关注
/*
*	轮播图
*/
var slideContainer = null; //轮播图容器
var slideSelector = null; //轮播图选择器
var slideData = null; //轮播图数据
var curSlide = 0; //当前轮播的图片索引
var isSlideMove = true; //控制是否进行轮播
var timeID = null; //时间计时器 ID
var animationID = null; //动画时间计时器 ID
var delayID = null; //延迟计时器 ID
var designTab = null; //产品设计选项卡
var programTab = null; //编程语言选项卡
/*
*	滚动排行榜
*/
var TOTAL_SCROLL = 11; //排行榜列表项的数量
var DELAY_TIME = 5000; //排行榜等待滚动的时长
var SCROLL_TIME = 500; //滚动一次的时长（可自由设置）
var scroll = null; //排行榜
var scrollData = null; //排行榜数据
var scrollCount = 0; //记录排行榜滚动的次数
/*
* 课程列表
*/
var TOTAL_COURSES = 20; //列表项总数
var COURSE_DESIGN = 10; //产品设计
var COURSE_PROGRAM = 20; //编程语言
var courseList = null; //课程列表
var courseData = null; //课程数据
var floatLayer = null; //课程卡片浮层
var canScroll = true; //是否可滚动
/*
*	翻页器
*/
var curPage = 1; //当前页数

//程序开始
//初始化 JSON ，兼容 IE 低版本
compatibility.initJSON();
init();

//初始化
function init(){
	initUI();
	addEvent();
	setAnimation();
}

//初始化界面
function initUI(){
	initSlide();
	inisScroll();
	initCourse();
}

//添加事件
function addEvent(){
	addNotifyEvent();
	addFollowEvent();
	addSlideEvent();
	addTabEvent();
	addFloatEvent();
	addEquipEvent();
}

//设置动画
function setAnimation(){
	setSlideAnimation();
	setScrollAnimation();
}

//初始化轮播图
function initSlide(){
	slideContainer = document.getElementById('head-slide');
	slideSelector = compatibility.getElementsByClassName(slideContainer, 'selector')[0];
	//模拟从服务器接收到 JSON 信息，信息保存在 mock.js 里
	slideData = JSON.parse(MOCK_SLIDE_DATA);
	//设置轮播图选项，默认开始选中第一项
	setSlideItem(0);
	//创建轮播图选择器
	createSlideSelector();
}

//初始化排行榜
function inisScroll(){
	scroll = document.getElementById('top-scroll');
	//本地测试使用
	//模拟从服务器接收到 JSON 信息，信息保存在 mock.js 里
	// scrollData = JSON.parse(TOP_DATA);

	//通过 AJAX 请求服务端数据，只需请求一次
	compatibility.requestServer('GET', TOP_URL, function(data){
		//转化为 JS 对象
		scrollData = JSON.parse(data);
		//创建排行榜列表项
		createScrollItem();
		//填充排行榜
		setScrollItem();
	});
}

//初始化课程列表

function initCourse(){
	courseList = document.getElementById('coures-list');
	//本地测试使用
	//模拟从服务器接收到 JSON 信息，信息保存在 mock.js 里
	// courseData = JSON.parse(COURSES_DATA);

	//创建课程列表项
	createCourseItem();

	//默认请求第一页的产品设计，数量根据屏幕宽度来定
	var param = { pageNo: 1, psize: TOTAL_COURSES, type: COURSE_DESIGN };
	changeCourse(param);
}

//向服务器请求课程列表
//传入的参数 { pageNo: 1, psize: 20, type: 10 }
//pageNo: 当前页码
//psize: 每页返回数据个数
//type: 筛选类型（10：产品设计；20：编程语言）
function changeCourse(param){
	//拼接请求的参数
	var targetURL = COURSES_URL + compatibility.serialize(param);
	//通过 AJAX 请求服务端数据
	compatibility.requestServer('GET', targetURL, function(data){
		//转化为 JS 对象
		courseData = JSON.parse(data);
		//填充课程列表项
		setCourseItem();
	});
}

//创建轮播图选择器
function createSlideSelector(){
	var i_tag = null;
	//根据服务端的图片数量循环创建选择器
	for(var i = 0; i < slideData.total; i ++){
		i_tag = document.createElement('i');
		//保存索引用于后续点击选择器事件
		i_tag.setAttribute('dataset', i.toString());
		//默认选中第一个选择器
		if(i == 0){
			compatibility.addClass(i_tag, 'selected');
		}
		slideSelector.appendChild(i_tag);
	}
}

//创建排行榜列表项
function createScrollItem(){
	//列表单项
	var li_tag = null;
	//排行榜显示的图片为10，创建11个列表项就足够了，后续根据取余来更新数据
	for(var i = 0; i < TOTAL_SCROLL; i ++){
		li_tag = document.createElement('li');
		//使用模板构建
		li_tag.innerHTML = TEMPLATE_M_TOP;
		//添加类名
		compatibility.addClass(li_tag, 'item');
		compatibility.addClass(li_tag, 'clearfix');
		//添加到父节点
		scroll.appendChild(li_tag);
	}
}

//设置排行榜列表项
function setScrollItem(){
	var li_tag = null; //列表项
	var a_tag = null; //链接
	var img_tag = null; //课程图片
	var name_tag = null; //课程名称
	var learner_tag = null; //在学人数
	var index = null; //索引
	var length = scrollData.length; //数据总长度
	for(var i = 0; i < TOTAL_SCROLL; i ++){
		//通过取余来确定索引的位置
		index = (i + scrollCount) % length;
		//获取列表项
		li_tag = compatibility.getElementsByClassName(scroll, 'item')[i];
		//链接地址（暂时跳转到当前课程大图）
		a_tag = li_tag.querySelector('a');
		a_tag.href = scrollData[index].bigPhotoUrl;
		a_tag.title = scrollData[index].name;
		//课程图片
		img_tag = compatibility.getElementsByClassName(li_tag, 'img')[0];
		img_tag.style.background = 'url(' + scrollData[index].smallPhotoUrl + ') 0 0 no-repeat';
		//课程名称
		name_tag = compatibility.getElementsByClassName(li_tag, 'name')[0];
		name_tag.innerHTML = scrollData[index].name;
		//在学人数
		learner_tag = compatibility.getElementsByClassName(li_tag, 'learner')[0];
		learner_tag.innerHTML = scrollData[index].learnerCount;
	}
}

//创建课程列表项
function createCourseItem(){
	//列表单项
	var li_tag = null;
	//宽屏或窄屏都创建全部列表项，窄屏使用 overflow: hidden 隐藏多余的列表项
	//后续根据屏幕的宽度和用户点击的页数传递不同参数给服务器，确保所有的课程都会显示给用户观看
	for(var i = 0; i < TOTAL_COURSES; i ++){
		li_tag = document.createElement('li');
		//使用模板构建
		li_tag.innerHTML = TEMPLATE_M_LIST;
		//添加到父节点
		courseList.appendChild(li_tag);
	}
}

//设置课程列表项
function setCourseItem(){
	var li_tag = null; //列表项
	var a_tag = null; //链接
	var img_tag = null; //课程图片
	var name_tag = null; //课程名称
	var provider_tag = null; //机构发布者
	var learner_tag = null; //在学人数
	var price_tag = null; //课程价格
	for(var i = 0; i < TOTAL_COURSES; i ++){
		//获取列表项
		li_tag = courseList.getElementsByTagName('li')[i];
		//链接地址（暂时跳转到当前课程中图）
		a_tag = li_tag.querySelector('a');
		a_tag.href = courseData.list[i].bigPhotoUrl;
		a_tag.title = courseData.list[i].name;
		//课程图片
		img_tag = li_tag.querySelector('img');
		//保存节点索引用于后续浮层使用
		img_tag.setAttribute('dataset', i.toString());
		img_tag.src = courseData.list[i].middlePhotoUrl;
		//课程名称
		name_tag = compatibility.getElementsByClassName(li_tag, 'name')[0];
		name_tag.title = courseData.list[i].name;
		name_tag.innerHTML = courseData.list[i].name;
		//机构发布者
		provider_tag = compatibility.getElementsByClassName(li_tag, 'provider')[0];
		provider_tag.innerHTML = courseData.list[i].provider;
		//在学人数
		learner_tag = compatibility.getElementsByClassName(li_tag, 'learner')[0];
		learner_tag.innerHTML = courseData.list[i].learnerCount;
		//课程价格
		price_tag = compatibility.getElementsByClassName(li_tag, 'price')[0];
		price_tag.innerHTML = (courseData.list[i].price === 0) ? '免费' : '¥&nbsp;' + courseData.list[i].price;
	}
}

// 顶部通知栏事件
function addNotifyEvent(){
	var btnNotify = document.getElementById('btn-notify');
	var btnClose = compatibility.getElementsByClassName(btnNotify, 'close')[0];
	var btnCloseFv = compatibility.getElementsByClassName(btnNotify, 'close-fv')[0];
	compatibility.addEvent(btnClose, 'click', function(event){
		compatibility.addClass(btnNotify, 'z-hidden');
	});
	compatibility.addEvent(btnCloseFv, 'click', function(event){
		compatibility.addClass(btnNotify, 'z-hidden');
		//处理 Cookies ，以后登录同一账号不会再出现
	});
}

//关注按钮事件
function addFollowEvent(){
	var btnFollow = document.getElementById('btn-follow');
	compatibility.addEvent(btnFollow, 'click', function(event){
		//先要判断 Cookies ，如果没有登录则弹出登录框
		isFollow = !isFollow;
		if(isFollow){
			compatibility.replaceClass(btnFollow, 'follow', 'un-follow');
		}else{
			compatibility.replaceClass(btnFollow, 'un-follow', 'follow');
		}
	});
}

//轮播图事件
function addSlideEvent(){
	var img_tag = slideContainer.querySelector('img');
	//移入轮播图事件
	compatibility.addEvent(img_tag, 'mouseenter', function(event){
		isSlideMove = false;
	});
	//移出轮播图事件
	compatibility.addEvent(img_tag, 'mouseleave', function(event){
		isSlideMove = true;
	});

	//点击选择器事件
	compatibility.addEvent(slideSelector, 'click', function(event){
		event = event || window.event;
		event.target = event.target || event.srcElement;

		//是否点击在选择器上（有可能点击到ul上造成无法获得索引值）
		if(!compatibility.hasClass(event.target, 'selector')){
			//获取点击选择器的索引
			var clickSlide = parseInt(event.target.getAttribute('dataset'));
			//如果点击在当前播放的索引项，则无效
			if(curSlide !== clickSlide){
				curSlide = clickSlide;
				//清空所有计时器
				clearInterval(animationID);
				clearInterval(timeID);
				clearTimeout(delayID);
				//切换页面
				goToSlide(curSlide);
				//因为切换有动画延迟，所以需要加上切换时间的定时器，等待切换完毕后，重新计时
				delayID = setTimeout(setSlideAnimation, slideData.animationTime);
			}
		}
	});
}

//轮播图动画
function setSlideAnimation(){
	//轮播图切换定时器
	timeID = setInterval(function(){
		//移入到图片则暂停切换
		if(!isSlideMove) return;
		//索引加一，超过索引则重置
		curSlide = (curSlide < slideData.total - 1) ? curSlide + 1 : 0;
		//切换到某一页
		goToSlide(curSlide);
	}, slideData.time);
}

//切换到某一页
function goToSlide(index){
	//设置选择器样式
	setSelector();
	//设置图片和地址
	setSlideItem(curSlide);
	//播放切换动画
	playSlideAnimation();
}

//切换选择器
function setSelector(){
	//先重置所有选择器
	for(var i = 0; i < slideData.total; i ++){
		compatibility.removeClass(slideSelector.getElementsByTagName('i')[i], 'selected');
	}
	//再设置当前选中的选择器
	compatibility.addClass(slideSelector.getElementsByTagName('i')[curSlide], 'selected');
}

//设置轮播图选项
function setSlideItem(index){
	var slide = compatibility.getElementsByClassName(slideContainer, 'slide')[0];
	//设置链接
	var a_tag = slide.querySelector('a');
	a_tag.setAttribute('href', slideData.list[index].url);
	//设置图片路径
	var img_tag = slide.querySelector('img');
	img_tag.setAttribute('src', slideData.list[index].src);
}

//切换动画
//设置 img 的透明度为 0 然后淡入，并通过改变 img 和 a 标签的链接地址来模拟轮播图
function playSlideAnimation(){
	var opacity = 0; //透明度
    var loop = 100; //计时器间隔（毫秒），时间越短运行次数越多（可设置），不会影响到总时长
    var curTime = 0; //当前运行的总时长
    var totalTime = slideData.animationTime; //总运行时长

    //初始化图片透明度
    var img_tag = slideContainer.querySelector('img');
    if(window.getComputedStyle){
    	img_tag.style.opacity = 0;
    }else{
    	img_tag.style.filter = 'alpha(opacity=0)'; //兼容IE8
    }

    //淡入计时器
	animationID = setInterval(function(){
		//通过比例获得每次需要增加的透明度
        opacity += loop / totalTime;
        if(window.getComputedStyle){
        	img_tag.style.opacity = opacity;
        }else{
        	img_tag.style.filter = 'alpha(opacity' + (opacity * 100) + ')'; //兼容 IE8
        }
        //计算总时长
        curTime += loop;
        //超过或等于总时长移除计时器
        if(curTime >= totalTime){
            clearInterval(animationID);
        }
	}, loop);
}

//选项卡事件
function addTabEvent(){
	var tab = document.getElementById('main-tab');
	designTab = compatibility.getElementsByClassName(tab, 'design')[0];
	programTab = compatibility.getElementsByClassName(tab, 'program')[0];
	compatibility.addEvent(tab, 'click', function(event){
		event = event || window.event;
		event.target = event.target || event.srcElement;
		var curType = null; //当前点击的选项卡对应的服务端参数
		if(!compatibility.hasClass(event.target, 'selected')){
			if(compatibility.hasClass(event.target, 'design')){
				compatibility.removeClass(programTab, 'selected');
				compatibility.addClass(designTab, 'selected');
				curType = COURSE_DESIGN;
			}else if(compatibility.hasClass(event.target, 'program')){
				compatibility.removeClass(designTab, 'selected');
				compatibility.addClass(programTab, 'selected');
				curType = COURSE_PROGRAM;
			}
			//请求服务端数据
			//根据当前页数决定请求的页数
			//根据当前屏幕宽度决定请求的课程数量
			//根据点击的选项卡决定请求的课程类型
			var param = { pageNo: curPage, psize: TOTAL_COURSES, type: curType };
			changeCourse(param);
		}
	});
}

//热门排行榜动画
//每次移动一个列表项高度然后重置列表到移动前的位置，再根据记录的滚动数来刷新数据，模拟滚动列表的效果
function setScrollAnimation(){
	//永久滚动
    var foreverID = setInterval(function(){
        loopScroll();
        scrollCount++;
    }, DELAY_TIME);

    //本地测试使用
    // clearInterval(foreverID);
}

//循环滚动
function loopScroll(){
	var loop = 50; //计时器间隔（毫秒），时间越短运行次数越多（可设置），不会影响到总时长
	var curDis = 0; //当前滚动的距离
	var totalDis = 70; //总共要滚动的距离
	var onceDis = ( totalDis * loop ) / SCROLL_TIME; //通过比例获得每次需要增加的距离
	var onceID = setInterval(function(){
		curDis = parseInt(compatibility.getStyle(scroll, 'bottom'));
		scroll.style.bottom = (curDis + onceDis) + 'px';
		if(curDis >= totalDis){
			//修正坐标
            scroll.style.bottom = '0px';
            //刷新排行榜数据
            setScrollItem();
            //清除定时器
            clearInterval(onceID);
		}
	}, loop);
}

//浮层事件
function addFloatEvent(){
	floatLayer = document.getElementById('float-layer');

	//鼠标移出事件
	compatibility.addEvent(floatLayer, 'mouseleave', function(event){
		//鼠标移出隐藏浮层
		compatibility.replaceClass(floatLayer, 'z-hidden', 'z-show-blk');
		//移除浮层后开启滚动
		canScroll = true;
	});

	var wrap = null; //图片容器
	var rect = null; //图片容器相对屏幕的位置
	//鼠标移入事件
	compatibility.addEvent(courseList, 'mouseover', function(event){
		event = event || window.event;
		event.target = event.target || event.srcElement;
		//移入图片显示浮层
		if(compatibility.hasClass(event.target, 'img')){
			//设置图层内容
			setFloatLayer(event.target.getAttribute('dataset'));
			//以图片的父节点 img-wrap 来确定位置
			rect = event.target.parentNode.getBoundingClientRect();
			//设置浮层坐标
			floatLayer.style.top = rect.top - 11 + 'px';
			floatLayer.style.left = rect.left - 11 + 'px';
			//显示浮层
			compatibility.replaceClass(floatLayer, 'z-show-blk', 'z-hidden');
			//因为浮层使用 position: fixed 来定位，如果移入浮层后滚动会导致浮层错位，所以关闭了滚动
			canScroll = false;
		}
	});
}

//设置图层内容
function setFloatLayer(index){
	//课程图片
	var img_tag = compatibility.getElementsByClassName(floatLayer, 'img')[0];
	img_tag.src = courseData.list[index].middlePhotoUrl;
	//课程名称
	var name_tag = compatibility.getElementsByClassName(floatLayer, 'name')[0];
	name_tag.title = courseData.list[index].name;
	name_tag.innerHTML = courseData.list[index].name;
	//在学人数
	var learner_tag = compatibility.getElementsByClassName(floatLayer, 'learner')[0];
	learner_tag.innerHTML = courseData.list[index].learnerCount + '人在学';
	//机构发布者
	var provider_tag = compatibility.getElementsByClassName(floatLayer, 'provider')[0];
	provider_tag.innerHTML = '发布者：' + courseData.list[index].provider;
	//分类（服务端categoryName返回null？？？，可能会暂时使用targetUser）
	var category_tag = compatibility.getElementsByClassName(floatLayer, 'category')[0];
	if(courseData.list[index].categoryName === null){
		category_tag.innerHTML = '分类：无';
	}else{
		category_tag.innerHTML = '分类：' + courseData.list[index].categoryName;
	}
	// category_tag.innerHTML = '分类：' + courseData.list[index].targetUser;
	//描述
	var des_tag = compatibility.getElementsByClassName(floatLayer, 'description')[0];
	des_tag.innerHTML = courseData.list[index].description;
}

//鼠标键盘设备事件
//为了防止浮层移动位置而设置的，具体操作起来用户体验很不好。。等后续修改
function addEquipEvent(){
	//鼠标中键事件
	compatibility.addEvent(document, 'mousewheel', function(event){
		event = event || window.event;
		event.target = event.target || event.srcElement;
		//阻止鼠标中键滚动
		if(!canScroll) compatibility.stopDefault(event);
	});
	//鼠标中键事件，兼容 FireFox
	compatibility.addEvent(document, 'wheel', function(event){
		event = event || window.event;
		event.target = event.target || event.srcElement;
		//阻止鼠标中键滚动
		if(!canScroll) compatibility.stopDefault(event);
	});

	//键盘按下事件
	compatibility.addEvent(document, 'keydown', function(event){
		event = event || window.event;
		//阻止键盘上下滚动
		if(event.keyCode === 38 || event.keyCode === 40){
			if(!canScroll) compatibility.stopDefault(event);
		}
	})
}

