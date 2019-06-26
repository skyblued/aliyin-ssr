import cookies from 'cookie-universal-nuxt'
export const state = () => ({
	productionObj: null
})
export const mutations = {
	getCar(state, str) {
		 state.productionObj = getCar(str)
	},
	addShopingCar(state, shop) { // 添加购物车商品
		let res = JSON.parse(JSON.stringify(shop))
		state.productionObj.unshift(res);
		setCar(state.productionObj);
	},
	setShopingCar(state,res) { // 上传文件修改购物车产品文件
		state.productionObj.splice(res.i, 1, res.shop)
		setCar(state.productionObj);
	},
	setShopingState(state, index) { // 修改购物车产品状态
		state.productionObj[index.i].Selected = index.type;
		setCar(state.productionObj);
	},
	delShopingCar(state, index) { // 删除购物车商品
		state.productionObj.splice(index.i, index.num);
		setCar(state.productionObj);
	},
	
}
function setCar(arr) { // 加入购物车
	console.log(cookies)
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
	// Cookie.set('myCar', str, { expires: 7 })
}

function getCar(str) { // 获取购物车
	if (!str) return [];
	str = str.replace('=', ':') 
	let arr = str.split('___'),
		list = [];
	// console.log(arr)
	arr.forEach((item, i) => {
		if (item == '') return;
		let keyList = item.split('&'),
			obj = {};
		keyList.forEach((key) => {
			key = key.split(':');
			obj[key[0]] = key[1] || "";
		})
		list.push(obj)
	})
	// console.log(list)
	return list
}