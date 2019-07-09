export default async function ({app, $axios, route, store, req, res, redirect}) {
	// if (store.state.login.token) return ;
	let token = app.$cookies.get('token');
	if (!store.state.login.isLogin && token) {
		let {data} =await $axios.post('/Login', 'token=' + token);
		store.commit('login/addToKen', data.Token); // 添加token
		store.commit('login/changeLogin', true);
	}
}