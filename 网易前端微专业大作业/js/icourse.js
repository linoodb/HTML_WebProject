var slideContainer = null; //轮播图容器
var slideSelector = null; //轮播图选择器
var slideDate = null; //轮播图数据
var curSlide = 0; //当前轮播的图片索引
var isSlideMove = true; //控制是否进行轮播
var timeID = null; //时间计时器ID
var animationID = null; //动画时间计时器ID
var delayID = null; //延迟计时器ID
var designTab = null; //产品设计选项卡
var programTab = null; //编程语言选项卡

init();

//初始化
function init(){
	initUI();
	addNotifyEvent();
	addFollowEvent();
	addSlideEvent();
	setSlideAnimation();
	addTabEvent();
}

//初始化界面
function initUI(){
	initSlide();
}

//初始化轮播图
function initSlide(){
	slideContainer = document.getElementById('slide');
	slideSelector = getElementsByClassName(slideContainer, 'selector')[0];
	//模拟从服务器接收到 JSON 信息，信息保存在 mock.js 里
	slideDate = JSON.parse(SLIDE_DATE);

	//设置轮播图选项，默认开始选中第一项
	setSlideItem(0);
	//创建轮播图选择器
	createSlideSelector();
}

//设置轮播图选项
function setSlideItem(index){
	var slide = getElementsByClassName(slideContainer, 'slide')[0];
	//设置链接
	var a_tag = slide.querySelector('a');
	a_tag.setAttribute('href', slideDate.date[index].url);
	//设置图片路径
	var img = slide.querySelector('img');
	img.setAttribute('src', slideDate.date[index].src);
}

//创建轮播图选择器
function createSlideSelector(){
	var i_tag = null;
	//根据服务端的图片数量循环创建选择器
	for(var i = 0; i < slideDate.total; i ++){
		i_tag = document.createElement('i');
		//保存索引用于后续点击选择器事件
		i_tag.setAttribute('dataset', i.toString());
		//默认选中第一个选择器
		if(i == 0){
			addClass(i_tag, 'selected');
		}
		slideSelector.appendChild(i_tag);
	}
}

// 顶部通知栏事件
function addNotifyEvent(){
	var btnNotify = document.getElementById('btn-notify');
	var btnClose = getElementsByClassName(btnNotify, 'close')[0];
	var btnCloseFv = getElementsByClassName(btnNotify, 'close-fv')[0];
	addEvent(btnClose, 'click', function(event){
		addClass(btnNotify, 'z-hidden');
	});
	addEvent(btnCloseFv, 'click', function(event){
		addClass(btnNotify, 'z-hidden');
		//处理Cookies，以后登录同一账号不会再出现
	});
}

//关注按钮事件
function addFollowEvent(){
	var btnFollow = document.getElementById('btn-follow');
	replaceClass.isFollow = false;
	addEvent(btnFollow, 'click', function(event){
		//先要判断Cookies，如果没有登录则弹出登录框
		replaceClass.isFollow = !replaceClass.isFollow;
		if(replaceClass.isFollow){
			replaceClass(btnFollow, 'follow', 'un-follow');
		}else{
			replaceClass(btnFollow, 'un-follow', 'follow');
		}
	});
}

//轮播图事件
function addSlideEvent(){
	var img = slideContainer.querySelector('img');
	//移入轮播图事件
	addEvent(img, 'mouseenter', function(event){
		isSlideMove = false;
	});
	//移出轮播图事件
	addEvent(img, 'mouseleave', function(event){
		isSlideMove = true;
	});

	//点击选择器事件
	addEvent(slideSelector, 'click', function(event){
		event = event || window.event;
		event.target = event.target || event.srcElement;

		//是否点击在选择器上（有可能点击到ul上造成无法获得索引值）
		if(!hasClass(event.target, 'selector')){
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
				delayID = setTimeout(setSlideAnimation, slideDate.animationTime);
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
		curSlide = (curSlide < slideDate.total - 1) ? curSlide + 1 : 0;
		//切换到某一页
		goToSlide(curSlide);
	}, slideDate.time);
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
	for(var i = 0; i < slideDate.total; i ++){
		removeClass(slideSelector.children[i], 'selected');
	}
	//再设置当前选中的选择器
	addClass(slideSelector.children[curSlide], 'selected');
}

//切换动画
function playSlideAnimation(){
	var opacity = 0; //透明度
    var loop = 100; //计时器间隔（毫秒），时间越短运行次数越多（可设置），不会影响到总时长
    var curTime = 0; //当前运行的总时长
    var totalTime = slideDate.animationTime; //总运行时长

    //初始化图片透明度
    var img = slideContainer.querySelector('img');
    if(window.getComputedStyle){
    	img.style.opacity = 0;
    }else{
    	img.style.filter = 'alpha(opacity=0)'; //兼容IE8
    }

    //淡入计时器
	animationID = setInterval(function(){
		//通过比例获得每次需要增加的透明度
        opacity += loop / totalTime;
        if(window.getComputedStyle){
        	img.style.opacity = opacity;
        }else{
        	img.style.filter = 'alpha(opacity' + (opacity * 100) + ')'; //兼容IE8
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
	var tab = document.getElementById('tab');
	designTab = getElementsByClassName(tab, 'design')[0];
	programTab = getElementsByClassName(tab, 'program')[0];
	addEvent(tab, 'click', function(event){
		event = event || window.event;
		event.target = event.target || event.srcElement;
		//先重置所有样式
		removeClass(designTab, 'selected');
		removeClass(programTab, 'selected');
		//再单独设置样式
		if(hasClass(event.target, 'design')){
			addClass(designTab, 'selected');
			//获取课程信息


		}else if(hasClass(event.target, 'program')){
			addClass(programTab, 'selected');
			//获取课程信息


		}
	});
}

