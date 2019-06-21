export default function (app) {
	let axios = app.$axios; 
   // 基本配置
	axios.defaults.timeout = 1000*60*60
	axios.defaults.baseURL = 'http://api.aliyin.com/api'; //配置接口地址
	// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
  
	// 请求回调
	axios.onRequest(config => {})
  
	// 返回回调
	axios.onResponse(res => {})
  
	// 错误回调
	axios.onError(error => {})
  }