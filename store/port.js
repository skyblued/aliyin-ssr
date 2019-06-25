export const state = () => ({
	// 静态资源图片地址
	ossPath: 'http://img.aliyin.com/',
	staticPath: '//static.aliyin.com', 
	netServer: 'http://api.aliyin.com/api',
	qqServer: 'http://api.aliyin.com',
	staticImgUrl: 'https://aliyinstatic.oss-cn-shenzhen.aliyuncs.com',
	nodeUrl: 'http://node.aliyin.com', // node服务器地址
	productThumbnail: 'http://node.aliyin.com/svgtopng', // 生成缩略图地址
	preveiwPort: 'http://node.aliyin.com/replace', // 生成预览图http://localhost:5050/replace
	textToSvg: 'http://open.aliyin.com/api/TextToSvg',



	UploadToOSS: '/UploadToOSS', // 图片上传
	TextToSvg: '/TextToSvg', // 文字生成path
	MaterialTypes: '/MaterialTypes', // 素材类型
	MaterialCategories: '/MaterialCategories', // 素材分类标签
	MaterialInfos: '/MaterialInfos', // 素材列表
	imgBaseUrl: 'http://img.aliyin.com/', // 阿里OS
	Advertise: '/Advertise', // 获取广告位

	/* 设计器  ↓ */
	// 团队保存, 更新,创建接口
	TeamMaterial: '/TeamMaterial', // 团队上传素材
	TeamMaterials: '/TeamMaterials', // 获取团队素材列表
	AllTemplate: '/AllTemplateClassification', // 获取首页全部模板分类
	SetUpTemplate: '/SetUpTemplate', //团队创建的模板列表
	TeamTemplate: '/TeamTemplate', // 获取团队模板详情
	TeamMaterials: '/TeamMaterials', // 用户团队自己上传的所有素材列表
	DocumentPage: '/DocumentPage', // 团队更新模板页
	DocumentPageSort: '/DocumentPageSort', // 团队模板页调顺序
	Document: '/Document', // 获取团队模板
	TeamMasters: '/TeamMasters', // 获取团队母版
	FavoritedTemplates: '/FavoritedTemplates', // 获取团队(个人)收藏模板

	// 设计师保存,创建接口, 更新
	Template: '/Template', // 获取公用模板
	DesignerTemplate: "/DesignerTemplate", // 设计师保存模板
	DesignerTemplatePage: '/DesignerTemplatePage', //设计师更新和添加页,修改页
	TemplatePageSort: '/TemplatePageSort', // 页面调顺序
	DesignerMaterial: '/DesignerMaterial', // 素材
	DesignerMaterials: '/DesignerMaterials', // 获取上传列表get
	/*设计器 ↑ */

	// 模板: 获取当前产品类型的所有页
	Templates: '/Templates',
	// 颜色: 团队专属颜色获取
	TeamColors: '/TeamColors',

	// 印刷接口
	print: {
		printprice: '/printprice', // 报价计算
		pay: '/pay', // 支付二维码获取
	},

	dialogUpload: false,  // 上传文件弹出框
})

export const mutations = {
	setDialogUpload(state,msg) {
		state.dialogUpload = msg
	}
}