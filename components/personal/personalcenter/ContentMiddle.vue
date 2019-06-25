<template>
    <div class="content-middle">
        <div class="content-avatar">
            <div>
                <img v-if="$store.state.login.avatar != 'null' && $store.state.login.avatar != ''" :src="$store.state.login.avatar.indexOf('http') > -1 ? $store.state.login.avatar :$store.state.port.imgBaseUrl + $store.state.login.avatar" alt="">
                <div v-else class="avatar-wrap"></div>
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
                    {{Phone == 'null' ? '' : Phone}}
                    <span v-if="Phone && Phone != 'null'" class="link" @click="handleChoose('ChangePhone', '更换手机号')">更换手机号</span>
                    <span v-else class="link" @click="handleChoose('BindingPhone', '绑定手机')">绑定手机</span>
                </div>
            </div>
            <div class="content-item" v-if="logintype == 'WeiXin'">
                <span class="title">微信号: </span>
                <!-- <div class="item" v-if="logintype !== 'WeiXin' && !isbindwx">
                    <span>请绑定微信号以防信息丢失</span>
                    <span class="link" @click="handleChoose('BindingWx', '绑定微信')">绑定微信</span>
                </div> -->
                <div class="item">
                    <span>已绑定</span>
                    <!-- <span class="link" @click="DialogVisibleTips = true">解除绑定</span> -->
                </div>
            </div>
            <!-- <el-dialog
                title="您是否要解除微信绑定?"
                :visible.sync="DialogVisibleTips"
                width="30%"
                center>
                <span>解绑后将无法使用该微信号登录此账号, 请谨慎操作</span>
                <span slot="footer" class="dialog-footer">
                    <el-button>确 定</el-button>
                    <el-button type="primary" @click="DialogVisibleTips = false">取 消</el-button>
                </span>
            </el-dialog> -->
            <div class="content-item" v-if="isbindqq == 'false'">
                <span class="title">QQ号 : </span>
                <div class="item">
                    <span>请绑定QQ号以防信息丢失</span>
                    <!-- <span class="link" @click="handleChoose('BindingEmail', '绑定QQ')">绑定QQ</span> -->
                    <span class="link" @click="handleOpen">绑定QQ</span>
                </div>
            </div>
            <div class="It-modal" v-if="qqLogin">
                <div class="It-modal-mask"></div>
                <div class="It-modal-content">
                    <iframe id="iframeqq" class="modal-iframe" :src="$store.state.port.qqServer + '/QQLogin.aspx'" frameborder="0"></iframe>
                    <i class="It-modal-close" @click="qqLogin = false"></i>
                </div>
            </div>
            <div class="content-item account" v-if="logintype == 'Sign'">
                <span class="title">账号密码: </span>
                <div class="item">
                    <span style="display: inline-block;width: 100%;height: 100%;" @click="handleChoose('ResetPwd', '修改密码')">修改密码</span>
                    <!-- <span class="link" @click="handleChoose('ResetPwd', '修改密码')">修改密码</span> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            // avatar: localStorage['avatar'],
            username: null,
            Phone: null,
            isbindwx: null,
            isbindqq: null,
            logintype: null,
            qqLogin: false,
            DialogVisibleTips: false
        }
    },
    methods: {
        setParam() {
            this.username = localStorage['userName']
            this.Phone = localStorage['phone']
            this.isbindwx = localStorage['isBindWx']
            this.isbindqq = localStorage['isBindQQ']
            this.logintype = localStorage['loginType']
        },
        handleChoose(title, t) {
            //this.$router.push({path: url, query: {t}})  
            this.$emit('setPersonal', {title,t})
        },

        handleOpen() {
            this.qqLogin = true
            this.$nextTick(() => {
                window.addEventListener("message",(result)=>{
                    if(!result) return console.log('登录失败')
                    this.qqLogin = false
                    console.log(result)
                    let openid = result.data.openid
                    let name,pic,sex;
                    if(result.data.data !== undefined){
                        name = result.data.data.nickname
                        pic = result.data.data.figureurl_qq_2
                        sex = result.data.data.gender
                    }
                    console.log(openid,name,pic,sex)
                    var formData = new FormData()
                    formData.append('QQNickName', name);
                    formData.append('Headimgurl', pic);
                    formData.append('Sex', sex);
                    formData.append('OpenID', openid);
                    let config = {
                        headers:{'Content-Type': 'multipart/form-data'}
                    }
                    this.$axios.post('/UserBindQQ', formData, config).then(res => {
                        console.log(res.data)
                        if (res.data == true) {
                            this.qqLogin = false
                            this.$message({type: 'success', message: res.data.message})
                            //history.go(0)
                        } else {
                            this.$message({type: 'warning', message: res.data.message})
                            this.qqLogin = true
                        }
                    })
                });
            })
        }
    },
    mounted() {
        this.setParam()
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
            .avatar-wrap{
                background-image: url(/img/personal/avatar_icon.png);
                background-size: 100%;
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
        .account{
            margin-left: -16px;
        }
        .It-modal{
            position: fixed;
            z-index: 1000;
        }
        .It-modal-mask{
            position: absolute;
            background-color: rgba(0,0,0,.5);
        }
        .It-modal, .It-modal-mask{
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
        }
        .It-modal-content{
            position: absolute;
            top: 47%;
            left: 50%;
            transform: translate(-50%,-50%);
            .It-modal-close{
                position: absolute;
                right: -36px;
                top: -4px;
                color: #fff;
                cursor: pointer;
                &::before{
                    content: '';
                    background-image: url(/img/home/fork_gray.png);
                    display: inline-block;
                    width: 24px;
                    height: 24px;
                }
            }
        }
        .modal-iframe{
            width: 620px;
            height: 600px;
            background-color: #fff;
        }
    }
}
</style>
