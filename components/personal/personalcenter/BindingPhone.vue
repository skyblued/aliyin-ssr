<template>
    <div class="binding-phone">
        <div class="content-avatar">
            <img class="avatar" :src="avatar" alt="">
            <p>阿里印首席设计师</p>
        </div>
        <div class="content">
            <div class="content-title">
                <span class="title">手机号: </span>
                <el-input v-model="phone" placeholder="请输入手机号"></el-input>
            </div>
            <div class="content-input">
                <span class="title">验证码: </span>
                <div class="input-code">
                    <el-input v-model="code" placeholder="请输入验证码"></el-input>
                    <span>获取验证码</span>
                </div>
            </div>
            <div class="content-title">
                <span class="title">密码: </span>
                <el-input v-model="password" placeholder="设置阿里印密码"></el-input>
            </div>
        </div>
        <div class="btn">
            <el-button class="binding-btn" disabled>立即绑定</el-button>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            avatar: localStorage['avatar'],
            phone: '',
            code: '',
            password: ''
        }
    }
}
</script>

<style lang="scss">
.binding-phone{
    width: 517px;
    text-align: center;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    font-size: 14px;
    user-select: none;
    .content-title:last-child{
        margin-left: 14px;
    }
}
</style>
