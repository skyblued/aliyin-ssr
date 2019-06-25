<template>
    <div class="personal-center">
        <div class="center-header">
            <span>{{title}}</span>
            <div class="back" v-if="sideTitle != 'ContentMiddle'" @click="handleClick">
                <i class="el-icon-arrow-left"></i>返回
            </div>
        </div>
        <div>
            <div v-if="sideTitle == 'ContentMiddle'">
                <ContentMiddle @setPersonal="setPersonal"></ContentMiddle>
            </div>
            <div v-if="sideTitle == 'ChangeAvatar'">
                <ChangeAvatar></ChangeAvatar>
            </div>
            <div v-if="sideTitle == 'ChangePhone'">
                <ChangePhone></ChangePhone>
            </div>
            <div v-if="sideTitle == 'BindingEmail'">
                <BindingEmail></BindingEmail>
            </div>
            <div v-if="sideTitle == 'BindingWx'">
                <BindingWx></BindingWx>
            </div>
            <div v-if="sideTitle == 'BindingPhone'">
                <BindingPhone></BindingPhone>
            </div>
            <div v-if="sideTitle == 'ResetPwd'">
                <ResetPwd></ResetPwd>
            </div>
        </div>
    </div>
</template>

<script>
import ContentMiddle from '@/components/personal/personalcenter/ContentMiddle.vue'
import ChangeAvatar from '@/components/personal/personalcenter/ChangeAvatar.vue'
import ChangePhone from '@/components/personal/personalcenter/ChangePhone.vue'
import BindingEmail from '@/components/personal/personalcenter/BindingEmail.vue'
import BindingWx from '@/components/personal/personalcenter/BindingWx.vue'
import BindingPhone from '@/components/personal/personalcenter/BindingPhone.vue'
import ResetPwd from '@/components/personal/personalcenter/ResetPwd.vue'
export default {
    data () {
        return {
            title: '账号管理',
            sideTitle: 'ContentMiddle',
        }
    },
    methods: {
        handleClick() {
            this.sideTitle = 'ContentMiddle'
            this.title = '账号管理'
        },
        setPersonal(msg) {
            //console.log(msg)
            this.sideTitle = msg.title
            this.title = msg.t
        }
    },
    mounted() {
        //console.log(this.sideTitle)
    },
    components: {
        ContentMiddle,
        ChangeAvatar,
        ChangePhone,
        BindingEmail,
        BindingWx,
        BindingPhone,
        ResetPwd
    },
    computed: {
        value() {
            return this.$route.fullPath
        },
    }
}
</script>

<style lang="scss" scoped>

.personal-center{
    background: rgba(255,255,255,1);
    padding: 70px 0 0 66px;
    height: 100%;
    min-height: 880px;
}
.personal-center .center-header{
    display: flex;
    width: 517px;
    justify-content: space-between;
    font-size:18px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(51,51,51,1);
    padding-bottom: 24px;
    border-bottom: 1px solid rgba(191,191,191,.2);
    user-select: none;
    .back{
        font-size:16px;
        color:rgba(153,153,153,1);
        cursor: pointer;
        &:hover{
            color: $color;
        }
    }
}
</style>
