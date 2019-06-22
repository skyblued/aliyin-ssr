export default function ({$axios, store, req}) {
	let axios = $axios;
	if (!store.state.login.token && store.$cookiz) store.commit('login/addToKen', store.$cookiz.getAll().token || '');
	if (store.state.login.token) axios.defaults.withCredentials = false;
   // 基本配置
	axios.defaults.timeout = 1000*60*60
	axios.defaults.baseURL = 'http://api.aliyin.com/api'; //配置接口地址
	if (store.state.login.token) {
		axios.defaults.headers['token'] = store.state.login.token;
	}
	// 请求回调
	axios.onRequest(config => {})
  
	// 返回回调
	axios.onResponse(res => {})
  
	// 错误回调
	axios.onError(error => {})
  }