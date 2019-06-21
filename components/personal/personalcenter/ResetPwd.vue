<template>
    <div class="reset-pwd">
        <div class="content-avatar">
            <img class="avatar" :src="avatar" alt="">
            <p>阿里印首席设计师</p>
        </div>
        <div class="content">
            <div class="content-title">
                <span class="title">旧密码: </span>
                <el-input type="password" v-model="oldpassword" placeholder="请输入当前密码"></el-input>
            </div>
            <div class="content-title">
                <span class="title">新密码: </span>
                <el-input type="password" v-model="newpassword" placeholder="请输入新密码"></el-input>
            </div>
            <div class="content-title">
                <span class="title">确认密码: </span>
                <el-input type="password" v-model="confirmnewpassword" placeholder="确认新密码" @blur="confirm"></el-input>
                <span class="err-tips">{{error}}</span>
            </div>
        </div>
        <el-button class="reset-btn" :disabled="newpassword == confirmnewpassword && newpassword != '' ? false: true" :style="{background: newpassword == confirmnewpassword && newpassword != '' ? bgColor2 : bgColor1}" @click="handleResetPwd">立即修改</el-button>
    </div>
</template>

<script>
export default {
    data () {
        return {
            avatar: localStorage['avatar'],
            oldpassword: '',
            newpassword: '',
            confirmnewpassword: '',
            error: '',
            disabled: true,
            bgColor1: 'rgba(236,236,236,1)',
            bgColor2: 'rgba(0,131,233,1)'
        }
    },
    methods: {
        confirm() {
            if(this.newpassword != this.confirmnewpassword) {
                this.error = '两次输入的密码不一致，请重新输入'
                return
            }else{
                this.error = ''
            }
        },
        handleResetPwd() {
            var url = '/ChangePassword'
            var formData = new FormData()
            formData.append('oldpassword', this.form.oldpassword);
            formData.append('newpassword', this.form.newpassword);
            formData.append('token', sessionStorage.getItem('token'));
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.post(url,formData,config).then(res => {
                // console.log(res.data)
                if(res.data.state == 'Success') {
                    this.$message(res.data.message)
                    this.$router.push('/personalcenter')
                }else{
                    this.$message(res.data.message)
                }
            })
        }
    }
}
</script>

<style lang="scss">

.reset-pwd{
    width: 517px;
    text-align: center;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    font-size: 14px;
    .content{
        .content-title{
            margin-bottom: 25px;
            position: relative;
            .err-tips{
                color: red;
                position: absolute;
                bottom: -18px;
                left: 85px;
                line-height: 14px;
            }
        }
        .content-title:last-child{
            margin-left: -14px;
        }
    }
    .reset-btn{
        border-radius: 5px;
        width: 179px;
        height: 48px;
        margin: 23px auto 0;
        font-size: 18px;
        font-family: MicrosoftYaHei;
        font-weight: 400;
        color:rgba(254,254,254,1);
        cursor: pointer;
        user-select: none;
        border: none;
        &:hover{
            color: rgba(254,254,254,1);
        }
    }
}
.content-avatar{
    .avatar{
        width: 107px;
        height: 107px;
        border-radius: 50%;
        margin: 0 auto;
        cursor: pointer;
        position: relative;
    }
}
</style>
