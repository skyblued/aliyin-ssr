<template>
    <div>
        <TemplateCenter></TemplateCenter>
    </div>
</template>

<script>
import TemplateCenter from '@/components/createdesign/TemplateCenter'
export default {
    components: {
        TemplateCenter
    },
    // async asyncData({$axios, isDev,route, store, env, params, query, req, res, redirect, error}) {
    //     console.log(route)
    //     var templateParam = {  // 获取模板参数
    //         ProductCategorieNum: route.query.n,
    //         ProductTypeId: route.query.id,
    //         SizeId: '',
    //         pageIndex: 1,
    //         pageSize: 19,
    //         SortOrder: 0,
    //         ChargingMode: '',
    //         StrFilterValue: '',
    //         TeamNum: '',
    //         keywords: ''
    //     }
    //     var formData = new FormData();
    //     for (let key in templateParam) {formData.append(key, templateParam[key])}
	// 	let [TemplateCenter] = await Promise.all([
	// 		$axios.post('/TemplateCenter', formData)
    //     ])
	// 	return {
    //         templateParam,
    //         templateList: TemplateCenter.data
	// 	}
    // },
    mounted() {
        // console.log(this.templateParam,this.templateList)
    },
}
</script>

<style lang="scss" scoped>

</style>
