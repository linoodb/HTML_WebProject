setNotify();


// 设置顶部通知条
function setNotify(){
	var ntf = document.getElementsByClassName('m-ntf')[0];
	var ntfClose = ntf.getElementsByClassName('close')[0];
	var ntfCloseFv = ntf.getElementsByClassName('close-fv')[0];
	addEvent(ntfClose, 'click', function(event){
		addClass(ntf, 'hidden');
	});
	addEvent(ntfCloseFv, 'click', function(event){
		addClass(ntf, 'hidden');
		//处理Cookies，以后不会出现
	});
}


