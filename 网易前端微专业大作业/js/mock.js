/*
*	轮播图数据，模拟从服务器接收到 JSON 信息
*	控制轮播图动画的数据可以放在前端，这里暂时写在 JSON 文件里
*	total = 轮播图片总数
*	time = 切换时间
*	animationTime = 动画时间
* 	list = 轮播图数据
*		url = 跳转链接地址
*		src = 轮播图片路径
*/
MOCK_SLIDE_DATA = '{\
	"total":3,\
	"time":5000,\
	"animationTime":500,\
	"list":[\
		{\
			"url":"http://open.163.com/",\
			"src":"res/banner/slide-1.jpg"\
		},\
		{\
			"url":"http://study.163.com/",\
			"src":"res/banner/slide-2.jpg"\
		},\
		{\
			"url":"http://www.icourse163.org/",\
			"src":"res/banner/slide-3.jpg"\
		}\
	]\
}';

/*
*	课程列表数据，模拟从服务器接收到 JSON 信息，本地测试列表信息只放一个重复使用就好
*	totalCount = 返回的数据总数
*	totalPage = 返回的数据总页数
*	pagination = 页码的信息
*		pageIndex = 当前页码
*		pageSize = 每页的数据个数
*		totlePageCount = 总页数
*	list = 数据列表
*		id = 课程ID
*		name = 课程名称
*		bigPhotoUrl = 课程大图
*		middlePhotoUrl = 课程中图
*		smallPhotoUrl = 课程小图
*		provider = 机构发布者
*		learnerCount = 在学人数
*		price = 课程价格，0为免费
*		categoryName = 课程分类
*		description = 课程描述
*/
MOCK_COURSES_DATA = '{\
	"totalCount" : 80,\
	"totalPage" : 8,\
	"pagination" : {\
		"pageIndex" : 1,\
		"pageSize" : 10,\
		"totlePageCount" : 0\
	},\
	"list" : [{"id":"967019",\
		"name":"和秋叶一起学职场技能",\
		"bigPhotoUrl":"http://img1.ph.126.net/eg62.png",\
		"middlePhotoUrl ":"http://img1.ph.126.net/eg62.png",\
		"smallPhotoUrl":" http://img1.ph.126.net/eg62.png ",\
		"provider":"秋叶",\
		"learnerCount":"23",\
		"price":"128",\
		"categoryName":"办公技能",\
		"description":"适用人群：最适合即将实习、求职、就职的大学生，入职一、二三年的新人。别以为那些职场老人都知道！"\
		}]\
}';

/*
*	最热排行数据，模拟从服务器接收到 JSON 信息，本地测试列表信息只放一个重复使用就好
*	id = 课程ID
*	name = 课程名称
*	bigPhotoUrl = 课程大图
*	middlePhotoUrl = 课程中图
*	smallPhotoUrl = 课程小图
*	provider = 机构发布者
*	learnerCount = 在学人数
*	price = 课程价格，0为免费
*	categoryName = 课程分类
*	description = 课程描述
*/
MOCK_TOP_DATA = '[{\
	"id":"967019",\
	"name":"和秋叶一起学职场技能",\
	"bigPhotoUrl":"http://img1.ph.126.net/eg62.png",\
	"middlePhotoUrl ":"http://img1.ph.126.net/eg62.png",\
	"smallPhotoUrl":" http://img1.ph.126.net/eg62.png ",\
	"provider":"秋叶",\
	"learnerCount":"23",\
	"price":"128",\
	"categoryName":"办公技能",\
	"description":"适用人群：最适合即将实习、求职、就职的大学生，入职一、二三年的新人。别以为那些职场老人都知道！"\
}]';






