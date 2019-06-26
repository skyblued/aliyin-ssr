
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
	},
	setShopingCar(state,res) { // 上传文件修改购物车产品文件
		state.productionObj.splice(res.i, 1, res.shop)
	},
	setShopingState(state, index) { // 修改购物车产品状态
		state.productionObj[index.i].Selected = index.type;
	},
	delShopingCar(state, index) { // 删除购物车商品
		state.productionObj.splice(index.i, index.num);
	},
	
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