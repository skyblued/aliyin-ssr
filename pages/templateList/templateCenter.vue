<template>
    <div>
        <TemplateCenter :center="templateList"></TemplateCenter>
    </div>
</template>

<script>
// import request from 'request'
import TemplateCenter from '@/components/createdesign/TemplateCenter'
export default {
    components: {
        TemplateCenter
    },
    async asyncData({app, $axios, isDev,route, store, env, params, query, req, res, redirect, error}) {
		// console.log(query, '服务端' + process.server , '客服端' + process.client);
		// console.log(FormData);
		let templateList = null;
		var templateParam = {  // 获取模板参数
			ProductCategorieNum: query.n,
			ProductTypeId: query.id,
			SizeId: '',
			pageIndex: 1,
			pageSize: 19,
			SortOrder: 0,
			ChargingMode: '',
			StrFilterValue: '',
			TeamNum: '',
			keywords: ''
		}
		// var formData = new FormData();
		var str = ''
		for (let key in templateParam) {
			str += `${key}=${templateParam[key]}&`
			// formData.append(key, templateParam[key])
		}
		let [center] = await Promise.all([
			$axios.post('/TemplateCenter', str)
		])
		templateList = center.data;
		// console.log(templateList, '服务端')
		return {
            templateParam,
			templateList,
			query: query
		}
	},
	fetch() {
		// console.log(123213)
	},
	head() {
		return {
			title: `免费${this.query.subtitle}模板列表_海量免费纸质名片模板无限制使用_免费下载${this.query.subtitle}高清无水印文件_阿里印`
		}
	},
    mounted() {
		// console.log(this.templateList)
        // console.log(this.templateParam,this.templateList)
	}
}
</script>

<style lang="scss" scoped>

</style>
