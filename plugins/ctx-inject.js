export default ({app}, inject) => {
	app.myInjectedFunction = (string) => console.log('这是服务端注入', string)
}