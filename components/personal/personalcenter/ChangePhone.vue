<template>
    <div class="change-phone">
        <div class="content-avatar">
            <img v-if="$store.state.avatar != 'null' && $store.state.avatar != ''" class="avatar" :src="$store.state.avatar.indexOf('http') > -1 ? $store.state.avatar :$store.state.port.imgBaseUrl + $store.state.avatar" alt="">
            <div v-else class="avatar-wrap"></div>
            <p>{{username}}</p>
        </div>
        <div class="change-phone-content" v-if="first">
            <div class="content">
                <div class="content-title">
                    <span class="title">现有手机: </span>
                    <span>{{oldphone}}</span>
                </div>
                <div class="content-input">
                    <span class="title">验证码: </span>
                    <div class="input-code">
                        <el-input v-model="oldcode" placeholder="请输入验证码"></el-input>
                        <span>获取验证码</span>
                    </div>
                </div>
            </div>
            <el-button class="next-btn" disabled @click="handleNext">下一步</el-button>
        </div>
        <div class="change-phone-content" v-if="second">
            <div class="content">
                <div class="content-title">
                    <span class="title">新手机号: </span>
                    <el-input v-model="newphone" placeholder="请输入新手机号"></el-input>
                </div>
                <div class="content-input">
                    <span class="title">验证码: </span>
                    <div class="input-code">
                        <el-input v-model="newcode" placeholder="请输入验证码"></el-input>
                        <span>获取验证码</span>
                    </div>
                </div>
            </div>
            <el-button class="next-btn" disabled>确认绑定</el-button>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            // avatar: localStorage['avatar'],
            username: localStorage['userName'],
            oldphone: localStorage['phone'],
            oldcode: '', 
            newcode: '',
            newphone: '',
            first: true,
            second: false
        }
    },
    methods: {
        handleNext() {
            this.first = false
            this.second = true
        }
    }
}
</script>

<style lang="scss">

.change-phone{
    width: 517px;
    text-align: center;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    font-size: 14px;
    user-select: none;
    .content{
        color:rgba(153,153,153,1);
        .content-title{
            display: flex;
            line-height: 40px;
            margin-left: -15px;
            span:last-child{
                color: rgba(51,51,51,1);
            }
        }
    }
    .next-btn{
        background: rgba(236,236,236,1);
        border-radius: 5px;
        width: 179px;
        height: 48px;
        margin: 116px auto 0;
        font-size: 18px;
        font-family: MicrosoftYaHei;
        font-weight: 400;
        color:rgba(51,51,51,1);
        cursor: pointer;
        &:hover{
            color:rgba(51,51,51,1);
            background: rgba(236,236,236,1);
        }
    }
}
.content-avatar .avatar-wrap{
    background-image: url(/img/personal/avatar_icon.png);
    background-size: 100%;
}
</style>
