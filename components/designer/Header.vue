<template>
    <div class="header">
        <div class="header-left">
            <nuxt-link to="/"><img class="logo" src="/img/home/logo.svg" alt=""></nuxt-link>
        </div>
        <div class="header-right">
            <div class="info">
                <div class="info-link">
                    <img v-if="$store.state.login.avatar != 'null'" class="info-avatar" :src="$store.state.login.avatar.indexOf('http') > -1 ? $store.state.login.avatar : $store.state.port.imgBaseUrl + $store.state.login.avatar" alt="">
                    <div v-else class="avatar-wrap"></div>
                    <span class="el-dropdown-link">{{username}}</span>
                </div>
                <!-- <div class="info-dropdown">
                    <div class="item item1">
                        <i></i>
                        <span>账号管理</span>
                    </div>
                    <div class="item item2">
                        <i></i>
                        <span>团队管理</span>
                    </div>
                    <div class="item item3">
                        <i></i>
                        <span>VIP升级</span>
                    </div>
                    <div class="item item4" @click="handleLogout">
                        <i></i>
                        <span>退出登录</span>
                    </div>
                </div>    -->
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            username: null,
        }
    },
    methods: {
        handleLogout() {   // 退出登录
            this.$store.commit('login/addToKen', '')
            this.$store.commit('login/setUserName', '')
            localStorage.removeItem('userName')
            localStorage.removeItem('token')
            localStorage.removeItem('isDesigner')
            localStorage.removeItem('avatar')
            localStorage.removeItem('userType')
            localStorage.removeItem('teamNum')
            sessionStorage.removeItem('teamType')
            localStorage.removeItem('teamName')
            localStorage.removeItem('phone')
            localStorage.removeItem('loginType')
            localStorage.removeItem('isBindWx')
            localStorage.removeItem('isBindQQ')
			localStorage.removeItem('times')
            this.$cookies.remove('token')
            this.$router.push('/')
        },
    },
    mounted() {
        this.username = localStorage['userName']
    }
}
</script>

<style lang="scss" scoped>

.header /deep/ .header-right .news .el-badge__content{
    border: none;
    top: 16px;
    right: 24px;
}
.header /deep/ .header-right .news .news-dropdown .el-badge .el-badge__content{
    right: -3px;
    top: 10px;
}

.header{
    .header-left{
        padding: 10px 15px;
        .logo{
            width: 104px;
            height: 32px;
            cursor: pointer;
        }
    }
    .header-right{
        display: flex;
        margin-right: 62px;
        .info{
            position: relative;
            user-select: none;
            &:hover .info-dropdown{
                display: block;
            }
            .info-link{
                display: flex;
                line-height: 52px;
                color: rgba(51,51,51,1);
                cursor: pointer;
                .avatar-wrap{
                    background-image: url(/img/personal/avatar_icon.png);
                    background-repeat: no-repeat;
                    background-size: 100%;
                }
                .info-avatar, .avatar-wrap{
                    display: inline-block;
                    width:29px;
                    height:29px;
                    border-radius:50%;
                    margin: 12px 10px 11px 0;
                }
                img{
                    vertical-align: middle;
                    height: 30px;
                    margin-top: 12px;
                }
            }
            .info-dropdown{
                position: absolute;
                top: 52px;
                right: 0;
                width: 141px;
                background: rgba(255,255,255,1);
                box-shadow:0px 1px 10px 2px rgba(203,211,217,0.76);
                padding: 20px;
                display: none;
                .item{
                    display: flex;
                    line-height: 30px;
                    cursor: pointer;
                    margin-bottom: 7px;
                    &:hover span{
                        color: $color;
                    }
                    i{
                        display: inline-block;
                        width: 30px;
                        height: 30px;
                        vertical-align: middle;
                        margin-right: 13px;
                    }
                    span{
                        font-size:14px;
                        font-family:MicrosoftYaHei;
                        font-weight:400;
                        color:rgba(102,102,102,1);
                    }
                }
            }
        }
    }
}

.item1 i{
    background: url(/img/personal/xlzhgl_icon.png);
}
.item1:hover i{
    background: url(/img/personal/xlzhgl_blue_icon.png);
}
.item2 i{
    background: url(/img/personal/xltdgl_icon.png);
}
.item2:hover i{
    background: url(/img/personal/xltdgl_blue_icon.png);
}
.item3 i{
    background: url(/img/personal/xlvipsj_icon.png);
}
.item3:hover i{
    background: url(/img/personal/xlvipsj_blue_icon.png);
}
.item4 i{
    background: url(/img/personal/xltcdl_icon.png);
}
.item4:hover i{
    background: url(/img/personal/xltcdl_blue_icon.png);
}
</style>
