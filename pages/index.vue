<template>
  <div class="container">
    <div>
      <logo />
      <h1 class="title">
        aliyin-mobile
      </h1>
      <h2 class="subtitle">
        My super-duper Nuxt.js project
      </h2>
      <div class="links">
		  <a target="_blank" href="/about">about</a>
        <a
          href="http://www.aliyin.com"
          target="_blank"
          class="button--grey"
        >阿里印第三方</a>
		<div @click="handleClick">{{host}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from "~/components/Logo.vue";

export default {
  layout: "home",
  components: {
    Logo
  },
  async asyncData({
    isDev,
    route,
    store,
    env,
    params,
    query,
    req,
    res,
    redirect,
    error
  }) {
    // console.log(window)
    return new Promise(resolve => {
      setTimeout(function() {
        resolve({ host: req.headers.host });
      }, 1000);
    });
  },
  fetch({ store, params }) {
    // console.log(store)
  },
  methods: {
	  handleClick() {
		let a = document.createElement('a')
		a.href = 'http://www.aliyin.com';
		a.target = '_blank'
		a.click();
	  }
  }
};
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
