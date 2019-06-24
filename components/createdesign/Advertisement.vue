<template>
    <div class="template-list-banner" v-if="banner">
        <img :src="$store.state.port.imgBaseUrl + banner[0].FileUrl" alt="">
    </div>
</template>

<script>
export default {
    props: ['banner']
}
</script>

<style lang="scss" scoped>

</style>
