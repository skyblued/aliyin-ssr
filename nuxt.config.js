
module.exports = {
	mode: 'universal',
	/*
	** Headers of the page
	*/
	head: {
		title: '阿里印_在线设计印刷_免费设计_工厂直供_全国发货',//process.env.npm_package_name ||
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '//static.aliyin.com/favicon.ico' },
			// { rel: 'stylesheet', href: '//static.aliyin.com/service/css/element.css?v=123' }
		]
	},
	/*
	** Customize the progress-bar color
	*/
	loading: false,//{color: '#0ca7fd'},
	/*
	** Global CSS
	*/
	css: [
		'element-ui/lib/theme-chalk/index.css',
		'@/assets/css/init.scss',
		'@/assets/css/animation.css'
	],
	/*
	** Plugins to load before mounting the App
	*/
		
	plugins: [
		'@/plugins/element-ui',
		'@/plugins/axios',
		'@/plugins/ctx-inject',
		'~/plugins/vue-inject.js',
		{src: '@/plugins/needWindow', ssr: false}
	],
	/*
	** Nuxt.js modules
	*/
	modules: [
		// Doc: https://axios.nuxtjs.org/usage
		'@nuxtjs/axios',
		'@nuxtjs/proxy',
		'@nuxtjs/style-resources',
		// Simple usage
		'cookie-universal-nuxt',
		// // With options
		['cookie-universal-nuxt', { alias: 'cookies' }],
	],
	/*
	** Axios module configuration
	** See https://axios.nuxtjs.org/options
	*/
	axios: {
		proxy: true,
	},
	proxy: {
		'/api': {
			target: 'http://api.aliyin.com/',
			pathRewrite: {
			'^/api' : '/'
			}
		}
		},
	/*
	** Build configuration
	*/
	build: {
		transpile: [/^element-ui/],
		extractCSS: true,
		/*
		** You can extend webpack config here
		*/
		extend(config, ctx) {
		},
		styleResources: {
			scss: './assets/css/index.scss',
		},
	}
}
