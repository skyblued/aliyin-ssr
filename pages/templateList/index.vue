<template>
    <div>
        <TemplateList :banner="banner" :templateList="templateList"></TemplateList>
    </div>
</template>

<script>
import TemplateList from '@/components/createdesign/TemplateList'
export default {
    components: {
        TemplateList
    },
    async asyncData({$axios, isDev,route, store, env, params, query, req, res, redirect, error}) {
		let [TemplateListBanner,TemplateList] = await Promise.all([
			$axios.get(store.state.port.Advertise + '?ID=132'),
			$axios.get(store.state.port.AllTemplate),
		])
		return {
			banner: TemplateListBanner.data.Advertisements,
			templateList: TemplateList.data,
		}
	},
}
</script>

<style lang="scss" scoped>

</style>
