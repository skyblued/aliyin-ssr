import cookiz from	'cookie-universal-nuxt';
console.log(cookiz)
export default({app}, inject) => {
	inject('cookiz', () => cookiz())
}