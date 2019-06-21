<template>
    <div class="header">
        <div class="header-left">
            <router-link to="/"><img class="logo" :src="$store.state.port.staticPath + '/img/logo_designer.png'" alt=""></router-link>
        </div>
        <div class="header-right">
            <div class="news">
                <div class="news-link">
                    <el-badge :value="2"><img :src="$store.state.port.staticPath + '/img/news_icon.png'" alt=""></el-badge>
                    <span>消息</span>
                </div>
                <div class="news-dropdown">
                    <p class="box-title">
                        <span>站内消息通知</span>
                        <span>已读</span>
                    </p>
                    <div class="box-list">
                        <div class="box-item" v-for="(item,i) in messageList" :key="i">
                            <el-badge is-dot><p :title="item.title">{{item.title}}</p></el-badge>
                            <p>{{item.time}}</p>
                        </div>
                    </div>
                    <p class="box-more" @click="handleJump">查看更多</p>
                </div>
            </div>
            <div class="info">
                <div class="info-link">
                    <img class="info-avatar" :src="avatar" alt="">
                    <span class="el-dropdown-link">{{username}}</span>
                    <img :src="$store.state.port.staticPath + '/img/home/drop_down_white.png'" alt="">
                </div>
                <div class="info-dropdown">
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
            messageList: []
        }
    },
    methods: {
        handleLogout() {   // 退出登录
            this.$store.commit('setToken', '')
            this.$store.commit('setUserName', '')
            localStorage.removeItem('userName')
            localStorage.removeItem('token')
            sessionStorage.removeItem('teamNum')
            sessionStorage.removeItem('teamType')
            localStorage.removeItem('isDesigner')
            localStorage.removeItem('avatar')
            this.$router.push('/')
        },
        // 跳转到消息中心
        handleJump() {
            this.$router.push('/messagecenter')
            this.$store.commit('setPersonal', 'center')
        }
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
            height: 32px;
            cursor: pointer;
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
                color: rgba(255,255,255,1);
                cursor: pointer;
                .info-avatar{
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
