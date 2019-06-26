import Vue from 'vue'

Vue.prototype.$myParseCookie = myParseCookie

function myParseCookie(arr) { // 加入购物车
	let str = '';
	arr.forEach((item, index) => {
		for (let key in item) {
			str += `${key}:${item[key] || ''}&`
		}
		str = str.slice(0, -1)
		str += '___'
	})
	str = str.slice(0,-3)
	console.log(str)
	return str
}