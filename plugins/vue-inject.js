import Vue from 'vue'

Vue.prototype.$addCart = addCart;
Vue.prototype.$getCart = getCart;
Vue.prototype.$deleteCart = deleteCart;
Vue.prototype.$putCart = putCart;


function addCart(obj) { // 添加
	let car = localStorage['shopingCar'], list;
	try {	
		list = JSON.parse(car)
	} catch (error) {
		list = []
	}
	list.unshift(obj)
	localStorage['shopingCar'] = JSON.stringify(list)
}

function getCart() { // 获取
	let car = localStorage['shopingCar'], list;
	try {	
		list = JSON.parse(car)
	} catch (error) {
		list = []
	}
	return list;
}

function deleteCart(obj) { // 删除
	let car = localStorage['shopingCar'], list;
	try {	
		list = JSON.parse(car)
	} catch (error) {
		list = []
	}
	if (list.length) {
		list.splice(obj.i, obj.num)
	}
	localStorage['shopingCar'] = JSON.stringify(list)
}

function putCart(obj) { // 修改
	let car = localStorage['shopingCar'], list;
	try {	
		list = JSON.parse(car)
	} catch (error) {
		list = []
	}
	if (list.length) {
		list[obj.i].Selected = obj.type;
	}
	localStorage['shopingCar'] = JSON.stringify(list)
}