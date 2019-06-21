
module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#17b6ff' },
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
	{
		src: "@/plugins/axios",
		ssr: false
	},
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
	'@nuxtjs/axios',
	'@nuxtjs/style-resources'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
	baseURL: 'http://api.aliyin.com/api', //配置后台接口地址
	credentials: true, // 凭证携带cookie
  },
  /*
  ** Build configuration
  */
  build: {
	transpile: [/^element-ui/],
	
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
