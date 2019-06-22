export const state = () => ({
	isLogin: false, // 是否登录
	token: '', // token 验证
	signType: 'wxpage'
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
	}
}