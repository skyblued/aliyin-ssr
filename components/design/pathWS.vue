<template>
	<div class="websoket" @click="websocketsend">
		发送
	</div>
</template>

<script>
export default {
	props: ['textObj'],
	mounted () {
		this.initWebSocket();
	},
	destroyed () {
		this.closeWebWocket();
	},
	data () {
		return {
			ws: null,
			i: 0,
		}
	},
	methods: {
		initWebSocket(){ //初始化weosocket 
			console.log('加载websoket组件')
			const wsuri = 'ws://localhost:5000';//ws地址
			this.ws = new WebSocket(wsuri);
			this.ws.onopen = this.websocketonopen;
			this.ws.onerror = this.websocketonerror;
			this.ws.onmessage = this.websocketonmessage; 
			this.ws.onclose = this.closeWebWocket;
		}, 
		websocketonopen() {
			　console.log("WebSocket连接成功");
			},
		websocketonerror(e) { //错误
			console.log("WebSocket连接发生错误");
		},
		websocketonmessage(e){ //数据接收 
			console.log(e.data)
			// const redata = JSON.parse(e.data);
			// console.log(redata.value); 
			// this.websocketsend('我是浏览器')
	　	}, 
		websocketsend(agentData){//数据发送 
			this.i++;
			let str = JSON.stringify(this.textObj)
			this.ws.send(str); 
	　	}, 
		closeWebWocket(e){ //关闭 
			console.log(e); 
		},
	}
}
</script>

<style scoped>
.websoket {
	/* display: none; */
	position: fixed;
	left: 100px;
	top: 0;
	z-index: 99;
}
</style>
