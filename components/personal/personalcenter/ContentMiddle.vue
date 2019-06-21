<template>
    <div class="content-middle">
        <div class="content-avatar">
            <div>
                <img :src="avatar" alt="">
                <div class="avatar-mask" @click="handleChoose('ChangeAvatar','更换头像')">
                    <span>更换头像</span>
                </div>
            </div>
            <p>{{username}}</p>
        </div>
        <div class="content">
            <div class="content-item">
                <span class="title">手机号: </span>
                <div class="item">
                    {{phone}}
                    <span v-if="Phone" class="link" @click="handleChoose('ChangePhone', '更换手机号')">更换手机号</span>
                    <span v-else class="link" @click="handleChoose('BindingPhone', '绑定手机')">绑定手机</span>
                </div>
            </div>
            <div class="content-item">
                <span class="title">微信号: </span>
                <div class="item">
                    <span>请绑定微信号以防信息丢失</span>
                    <span class="link" @click="handleChoose('BindingWx', '绑定微信')">绑定微信</span>
                </div>
            </div>
            <div class="content-item">
                <span class="title">QQ号 : </span>
                <div class="item">
                    <span>请绑定QQ号以防信息丢失</span>
                    <span class="link" @click="handleChoose('BindingEmail', '绑定QQ')">绑定QQ</span>
                </div>
            </div>
            <div class="content-item">
                <span class="title">账号密码: </span>
                <div class="item">
                    <span>.........</span>
                    <span class="link" @click="handleChoose('ResetPwd', '修改密码')">修改密码</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            avatar: localStorage['avatar'],
            username: localStorage['userName'],
            Phone: '15524525632'
        }
    },
    methods: {
        handleChoose(title, t) {
            //this.$router.push({path: url, query: {t}})
            this.$emit('setPersonal', {title,t})
        },
    },
    computed: {
        phone: {  // 对手机号中间四位隐藏
            get: function() {
                return this.Phone.toString().replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2');
            },
            set: function() {}
        }
    }
}
</script>

<style lang="scss" scoped>

.content-middle{
    width: 517px;
    text-align: center;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    .content-avatar{
        margin: 34px auto 39px;
        div{
            width: 107px;
            height: 107px;
            //background:rgba(197,235,255,1);
            border-radius: 50%;
            margin: 0 auto;
            cursor: pointer;
            position: relative;
            img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
            .avatar-mask{
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                background:rgba(0,0,0,.5);
                border-radius: 50%;
                display: none;
                font-size:16px;
                color:rgba(255,255,255,1);
                span{
                    position: absolute;
                    top: 45px;
                    left: 22px;
                }
            }
            &:hover .avatar-mask{
                display: block;
            }
        }
        p{
            font-size: 16px;
            color:rgba(51,51,51,1);
            margin-top: 23px;
        }
    }
    .content{
        text-align: left;
        user-select: none;
        .content-item{
            display: flex;
            line-height: 42px;
            font-size: 14px;
            cursor: pointer;
            .title{
                font-size:14px;
                color:rgba(153,153,153,1);
                margin-right: 24px;
            }
            .item{
                color:rgba(51,51,51,1);
                width: 422px;
                position: relative;
                &:hover{
                    background:rgba(244,244,244,1);
                    border-radius: 3px;
                }
            }
            .item:hover .link{
                opacity: 1;
            }
            .link{
                color: $color; 
                opacity: 0;
                position: absolute;
                right: 12px;
                top: 0;
            }
        }
        .content-item:last-child{
            margin-left: -16px;
        }
    }
}
</style>
