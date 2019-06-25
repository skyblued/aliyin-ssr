export const state = () => ({
	isLogin: false, // 是否登录
	token: '', // token 验证
	signType: 'wxpage',
	loginShow: false,
	userName: '', // 用户名
	avatar: '',   // 用户头像
	dialogAdd: false,   // 添加地址弹框
	dialogModify: false,  // 修改地址弹框
	dialogAddInvoice: false,  // 添加发票弹框
	dialogModifyInvoice: false,  // 修改发票弹框
})

export const mutations = {
	changeLogin(state, type) {
		state.isLogin = type;
	},
	addToKen(state, token) {
		state.token = token;
	},
	toggleSign(state, type) {
		state.signType = type
	},
	toggleShow(state, type) {
		state.loginShow = type;
	},
	setUserName(state, msg) {
		state.userName = msg
	},
	setAvatar(state,msg) {
		state.avatar = msg
	},
	setDialogAdd(state,msg) {
		state.dialogAdd = msg
	},
	setDialogModify(state,msg) {
		state.dialogModify = msg
	},
	setDialogAddInvoice(state,msg) {
		state.dialogAddInvoice = msg
	},
	setDialogModifyInvoice(state,msg) {
		state.dialogModifyInvoice = msg
	}
}