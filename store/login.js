export const state = () => ({
	isLogin: false, // 是否登录
	token: '', // token 验证
	signType: 'wxpage',
	loginShow: false,
	userName: '', // 用户名
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
	}
}