addNotifyEvent();
addFollowEvent();

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


