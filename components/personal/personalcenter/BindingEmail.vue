<template>
    <div class="binding-email">
        <div class="content-avatar">
            <img class="avatar" :src="avatar" alt="">
            <p>阿里印首席设计师</p>
        </div>
        <div class="content">
            <div class="content-title">
                <span class="title">QQ : </span>
                <el-input v-model="email" placeholder="请输入QQ邮箱账号"></el-input>
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
            email: '',
            code: '',
            password: ''
        }
    }
}
</script>

<style lang="scss">

.binding-email{
    width: 517px;
    text-align: center;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    font-size: 14px;
    user-select: none;
    .content-title{
        margin-left: 15px;
    }
}

.content-avatar{
    margin: 34px auto 39px;
    div{
        width: 107px;
        height: 107px;
        background:rgba(197,235,255,1);
        border-radius: 50%;
        margin: 0 auto;
        cursor: pointer;
    }
    p{
        font-size: 16px;
        color:rgba(51,51,51,1);
        margin-top: 23px;
    }
}
.content{
    color:rgba(153,153,153,1);
    .content-title{
        display: flex;
        line-height: 40px;
    }
    .title{
        margin-right: 24px;
    }
    .content-input{
        display: flex;
        line-height: 40px;
        margin-top: 25px;
        margin-bottom: 26px;
        .input-code{
            width: 422px;
            display: flex;
            position: relative;
            span{
                color: $color;
                position: absolute;
                top: 0;
                right: 10px;
                cursor: pointer;
            }
        }
    }
    .el-input{
        width: 422px;
        .el-input__inner{
            background:rgba(244,244,244,1);
            border-radius: 3px;
            border: none;
        }
    }
}
.btn .binding-btn{
    //background: rgba(236,236,236,1);
    border-radius: 5px;
    width: 179px;
    height: 48px;
    margin: 48px auto 0;
    font-size: 18px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    cursor: pointer;
    border: none;
    padding: 0;
}
.btn .el-button.is-disabled{
    color:rgba(192,196,204,1);
    background: rgba(236,236,236,1);
    &:hover{
        color:rgba(192,196,204,1);
        background: rgba(236,236,236,1);
    }
}
</style>
