
module.exports = {
	server: {host: '127.0.0.1'},
	mode: 'universal',
	/*
	** Headers of the page
	*/
	head: {
		htmlAttrs: {
			lang: 'en',
		},
		title: '阿里印_在线设计印刷_免费设计_工厂直供_全国发货',//process.env.npm_package_name ||
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'keywords', name: 'keywords', content: '在线设计工具，在线名片设计工具软件，免费名片模板，广告扇定做，在线印刷报价' },
			{ hid: 'description', name: 'description', content: '阿里印,海量精美正版模板免费使用，5G云端设计工具免费在线作图,全国联盟工厂就近生产制作，全国任何地方都可接单生产送货，厂价直销，价格一降到底，全国客服热线：4000-975-123。' },
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
	/* 添加新的路由 */
	router: {
		extendRoutes (routes, resolve) {
		  routes.push({
			name: 'notfound',
			path: '*',
			component: resolve(__dirname, 'pages/404.vue')
		  })
		}
	},
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
			if (process.env.NODE_ENV === 'production') {
				config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
			}
		},
		styleResources: {
			scss: './assets/css/index.scss',
		},
		
	}
}
