/*
*	轮播图数据，模拟从服务器接收到 JSON 信息
*	控制轮播图动画的数据可以放在前端，这里暂时写在 JSON 文件里
*	total = 轮播图片总数
*	time = 切换时间
*	animationTime = 动画时间
* 	date = 轮播图数据
*/
SLIDE_DATE = '{\
	"total":3,\
	"time":5000,\
	"animationTime":500,\
	"date":[\
		{\
			"url":"http://open.163.com/",\
			"src":"res/banner/banner-1.jpg"\
		},\
		{\
			"url":"http://study.163.com/",\
			"src":"res/banner/banner-2.jpg"\
		},\
		{\
			"url":"http://www.icourse163.org/",\
			"src":"res/banner/banner-3.jpg"\
		}\
	]\
}';




