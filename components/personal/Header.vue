<template>
    <div class="header">
        <div class="header-left">
            <nuxt-link to="/"><img class="logo" src="/img/home/logo.svg" alt=""></nuxt-link>
        </div>
        <div class="header-right">
            <div class="info">
                <div class="info-link">
                    <img v-if="$store.state.login.avatar != 'null' && $store.state.login.avatar != ''" class="info-avatar" :src="$store.state.login.avatar.indexOf('http') > -1 ? $store.state.login.avatar :$store.state.port.imgBaseUrl + $store.state.login.avatar" alt="">
                    <div v-else class="avatar-wrap"></div>
                    <span class="el-dropdown-link">{{username}}</span>
                    <img src="/img/personal/drop_down.png" alt="">
                </div>
                <div class="info-dropdown">
                    <div class="item item1" @click="handleClick('/personal/acountcenter')">
                        <i></i>
                        <span>账号管理</span>
                    </div>
                    <!-- <div class="item item2" @click="handleClick('/team')">
                        <i></i>
                        <span>团队管理</span>
                    </div> -->
                    <!-- <div class="item item3" @click="handleJump('Vip')">
                        <i></i>
                        <span>VIP升级</span>
                    </div> -->
                    <div class="item item4" @click="handleLogout">
                        <i></i>
                        <span>退出登录</span>
                    </div>
                </div>
            </div> 
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            username: null,
            options: [],
            teamName: null,
            num: null,    // 团队编号
            image: '/img/personal/n_choose_icon.png',
            src: '/img/personal/choose_icon.png',
            messageList: [],
            show3: false
        }
    },
    methods: {
        setParam() {
            this.username = localStorage['userName']
            this.teamName = localStorage['teamName']
            this.num = localStorage['teamNum']
            this.$store.commit('login/setAvatar', localStorage['avatar'])
        },
        handleClick(url) {
            // if(url == '/team'){
            //     if(sessionStorage.getItem('teamType') == 'personal'){
            //         this.$message({type: 'warning', message: '您还没有团队'})
            //         return
            //     }else{
            //         this.$router.push(url)
            //         this.$emit('setData', 'center')
            //     }
            // }else{
            //     this.$router.push(url)
            //     this.$emit('setData', 'center')
            // }
            this.$router.push(url)
            this.$emit('setData', 'acountcenter')
        },
        // handleJump(msg) {
        //     this.$emit('setVip', msg)
        // },

        handleLogout() {   // 退出登录
            this.$store.commit('setToken', '')
            this.$store.commit('setUserName', '')
            localStorage.removeItem('userName')
            localStorage.removeItem('token')
            localStorage.removeItem('teamNum')
            localStorage.removeItem('teamName')
            sessionStorage.removeItem('teamType')
            localStorage.removeItem('isDesigner')
            localStorage.removeItem('avatar')
            localStorage.removeItem('phone')
            localStorage.removeItem('loginType')
            localStorage.removeItem('isBindWx')
            localStorage.removeItem('isBindQQ')
            localStorage.removeItem('userType')
            localStorage.removeItem('times')
            this.$router.push('/')
        },
    },
    mounted() {
        this.setParam()
    },
}
</script>

<style lang="scss" scoped>

.header /deep/ .header-right .news .el-badge__content{
    border: none;
    top: 16px;
    right: 24px;
}

.header /deep/ .header-right .news .news-dropdown .el-badge{
    .el-badge__content{
        right: -3px;
        top: 10px;
    }
}
.header{
    .header-left{
        padding: 8px 15px;
        display: flex;
        position: relative;
        .toggle-team{
            position: absolute;
            top: 52px;
            left: 0;
            .transition-box {
                width: 214px;
                height: auto;
                //background-color: #409EFF;
                background: rgba(255,255,255,1);
                box-shadow:0px 1px 27px 2px rgba(203,211,217,0.76);
                text-align: center;
                color: #fff;
                .team-item{
                    color: rgba(51,51,51,1);
                    text-align: left;
                    border-bottom: 1px solid rgba(203,211,217,0.76);
                    padding: 12px 48px 8px 42px;
                    cursor: pointer;
                    span{
                        display: inline-block;
                        width: 74px;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;
                    }
                    &:hover{
                        color: $color;
                        background: #ecf5ff;
                    }
                    .choose-img{
                        margin-right: 18px;
                    }
                    .active{
                        color: $color;
                    }
                }
                .create-team-btn{
                    text-align: center;
                    padding: 12px 0 10px;
                    color: $color;
                    cursor: pointer;
                    background:rgba(10,135,232,.2);
                    img{
                        display: inline-block;
                        vertical-align: middle;
                        margin-right: 14px;
                    }
                }
            }
        }
        .logo{
            width: 104px;
            height: 32px;
            cursor: pointer;
            margin-right: 150px;
        }
    }
    .header-right{
        display: flex;
        margin-right: 62px;
        .news{ 
            margin-right: 39px;
            cursor: pointer;
            position: relative;
            font-size:14px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            color:rgba(255,255,255,1);
            // line-height: 52px;
            // .news-image{
            //     display: inline-block;
            //     vertical-align: middle;
            // }
            &:hover .news-dropdown{
                display: block;
            }
            .news-link{
                display: flex;
                line-height: 52px;
                img{
                    vertical-align: middle;
                    margin-right: 11px;
                }
            }
            .news-dropdown{
                width: 221px;
                background: rgba(255,255,255,1);
                box-shadow:0px 1px 27px 2px rgba(203,211,217,0.76);
                position: absolute;
                top: 52px;
                right: -30px;
                color: rgba(51,51,51,1);
                display: none;
                .box-title{
                    display: flex;
                    justify-content: space-between;
                    border-bottom: 1px solid rgba(191,191,191,.2);
                    padding: 17px 16px 15px 17px;
                    span:first-child{
                        font-size: 16px;
                    }
                    span:last-child{
                        color: rgba(153,153,153,1);
                    }
                }
                .box-list{
                    padding: 16px 14px 0 16px;
                    .box-item{
                        line-height: 20px;
                        margin-bottom: 20px;
                        &:hover p{
                            color: $color;
                        }
                        p:first-child{
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        p:last-child{
                            font-size: 12px;
                        }
                    }
                }
                .box-more{
                    text-align: center;
                    line-height: 46px;
                    border-top: 1px solid rgba(191,191,191,.2);
                    color:rgba(153,153,153,1);
                    &:hover{
                        background: $color;
                        color: rgba(255,255,255,1);
                    }
                }
            }
        }
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
                    height: 30px;
                    margin-top: 11px;
                }
            }
            .info-dropdown{
                position: absolute;
                top: 52px;
                right: 0;
                width: 141px;
                background: rgba(255,255,255,1);
                box-shadow:0px 1px 10px 2px rgba(203,211,217,0.76);
                padding: 12px 15px;
                display: none;
                .item{
                    display: flex;
                    line-height: 34px;
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
                        margin-right: 10px;
                    }
                    span{
                        font-size:14px;
                        font-family:MicrosoftYaHei;
                        font-weight:400;
                        color:rgba(102,102,102,1);
                        min-width: 60px;
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


.team-btn{
    width: 100%;
    display: flex;
    justify-content: space-around;
}


// 创建团队弹出框
.header /deep/ .el-dialog{
    width:630px;
    border-radius:10px;
    text-align: center;
    .el-dialog__header{
        padding: 25px 20px 0;
        font-size:23px;
        font-family:MicrosoftYaHei-Bold;
        font-weight:bold;
        color:rgba(51,51,51,1);
        position: relative;
        .el-dialog__headerbtn{
            position: absolute;
            top: 17px;
            right: -45px;
            .el-dialog__close{
                width: 24px;
                height: 24px;
                color: rgba(255,255,255,1);
                background-image: url(/img/home/fork_white.png);
                &::before{
                    content: '';
                }
            }
        }
    }
    .el-dialog__body{
        padding: 31px 59px 39px 48px;
        .el-form-item__label{
            margin-right: 12px;
        }
        .el-form-item__content{
            width: 416px;
            display: inline-block;
            .el-upload{
                width:98px;
                height:98px;
                background:rgba(236,236,236,1);
                border-radius:5px;
                border: none;
                line-height: 130px;
                margin-left: 6px;
                .el-icon-plus{
                    background-image: url(/img/home/add_big_icon.png);
                    display: inline-block;
                    width: 43px;
                    height: 43px;
                }
                .el-icon-plus::before{
                    content: '';
                }
            }
        }
    }
}
</style>
