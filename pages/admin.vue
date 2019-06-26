<template>
    <div class="admin">
        <header class="admin-header">
            <nuxt-link to="/"><img class="logo" src="/img/home/logo.svg" alt=""></nuxt-link>
            <span class="admin-title">管理员中心</span>
        </header>

        <div class="admin-main" style="height: 860px;">
            <div class="aside">
                <ul>
                    <li :class="{active: asideTitle == 'designTemplate'}" @click="handleToggle('designTemplate')">
                        <span>模板提交</span>
                    </li>
                    <li :class="{active: asideTitle == ''}" @click="handleToggle('')">
                        <span>模板审核</span>
                    </li>
                    <li :class="{active: asideTitle == 'templateUpperShelf'}" @click="handleToggle('templateUpperShelf')">
                        <span>模板上架</span>
                    </li>
                    <li :class="{active: asideTitle == 'materialAudit'}" @click="handleToggle('materialAudit')">
                        <span>素材审核</span>
                    </li>
                    <li :class="{active: asideTitle == 'materialUpperShelf'}" @click="handleToggle('materialUpperShelf')">
                        <span>素材上架</span>
                    </li>
                    <li :class="{active: asideTitle == 'orderManage'}" @click="handleToggle('orderManage')">
                        <span>订单管理</span>
                    </li>
                    <li :class="{active: asideTitle == 'designAllTemplate'}" @click="handleToggle('designAllTemplate')">
                        <span>模板统计</span>
                    </li>
                    <li :class="{active: asideTitle == 'masterTemplate'}" @click="handleToggle('masterTemplate')">
                        <span>专属模板</span>
                    </li>
                </ul>
            </div>

            <div class="admin-container">
                <nuxt-child />
            </div>
        </div>
    </div>
</template>

<script>
// import DesignTemplate from '@/components/admin/DesignTemplate.vue'
// import TemplateAudit from '@/components/admin/TemplateAudit.vue'
// import MaterialAudit from '@/components/admin/MaterialAudit.vue'
// import TemplateUpperShelf from '@/components/admin/TemplateUpperShelf.vue'
// import MaterialUpperShelf from '@/components/admin/MaterialUpperShelf.vue'
// import OrderManage from '@/components/admin/OrderManage.vue'
// import DesignAllTemplate from '@/components/admin/DesignAllTemplate.vue'
// import MasterTemplate from '@/components/admin/MasterTemplate.vue'
export default {
    data () {
        return {
            asideTitle: ''
        }
    },
    methods: {
        handleToggle(title) {
            this.asideTitle = title
            this.$router.push('/admin/' + title)
        }
    },
    created() {
        var title = this.$route.fullPath.split('/')[2]
        if(title == undefined) {
            this.asideTitle = ''
        }else{
            this.asideTitle = title
        }
    },
    mounted() {
        if(localStorage['userType'] == 'UU') {
            this.$message.warning('你不是管理员')
            this.$router.push('/')
        }
    },
    components: {
        // DesignTemplate,
        // TemplateAudit,
        // MaterialAudit,
        // TemplateUpperShelf,
        // MaterialUpperShelf,
        // OrderManage,
        // DesignAllTemplate,
        // MasterTemplate
    }
}
</script>

<style lang="scss" scoped>
.admin{
    height: 100%;
}
.admin-header{
    height: 78px;
    min-width: 1200px;
    display: flex;
    align-items: center;
    border-bottom: 4px solid $color;
    padding-left: 20px;
    background: #fff;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2000;
    .logo{
        width: 181px;
        height: 57px;
    }
    .admin-title{
        font-size: 24px;
        font-weight: bold;
        color: rgba(51,51,51,1);
        margin-left: 30px;
    }
}

.admin-main{
    width: 100%;
    height: 100%;
    margin-top: 78px;
    padding-left: 214px;
    .aside{
        width: 214px;
        min-width: 214px;
        position: fixed;
        top: 78px;
        left: 0;
        bottom: 0;
        color:rgba(102,102,102,1);
        box-shadow: 0px 1px 27px 2px rgba(203,211,217,0.76);
        ul{
            display: flex;
            height: 100%;
            flex-direction: column;
            padding-top: 50px;
            li{
                width: 100%;
                text-align: center;
                font-size:16px;
                font-family:MicrosoftYaHei;
                font-weight:400;
                padding: 12px 0 11px 55px;
                text-align: left;
                cursor: pointer;
                // margin-bottom: 15px;
                &:hover{
                    background: $gradient;
                    color: rgba(255,255,255,1);
                }
            }
            .active{
                background: $gradient;
                color: rgba(255,255,255,1);
            }
        }
    }
    .admin-container{
        width: 100%;
        height: 100%;
    }
}
</style>
