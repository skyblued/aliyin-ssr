export default function ({app, $axios, store, req}) {
	let axios = $axios;
	if (!store.state.login.token && app.$cookies) store.commit('login/addToKen', app.$cookies.getAll().token || ''); // 添加token
	if (!store.state.productionObj) store.commit("getCar", app.$cookies.getAll().myCar || ''); // 添加购物车
	if (store.state.login.token) {
		axios.defaults.withCredentials = false;
		store.commit('login/changeLogin', true)
	}
   // 基本配置
	axios.defaults.timeout = 1000*60*60
	axios.defaults.baseURL = 'http://api.aliyin.com/api'; //配置接口地址
	// 请求回调
	axios.onRequest(config => {
		// console.log(app.$cookiz.getAll().token)
		if (store.state.login.token) {
			config.headers.common['token'] = store.state.login.token;
		}
		return config;
	})
  
	// 返回回调
	axios.onResponse(response => {
		if(response.config.headers.token){
			store.commit('login/addToKen', response.config.headers.token);
		}
		return response;
	})
  
	// 错误回调
	axios.onError(error => {})
  }