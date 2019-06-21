<template>
    <div class="header">
        <div class="header-left">
            <router-link to="/"><img class="logo" src="/img/logo_designer.png" alt=""></router-link>
            <div class="select">
                <!-- <el-dropdown @command="handleChange">
                    <span class="el-dropdown-link">
                        {{teamName}}
                        <img :src="$store.state.port.staticPath + '/img/personal/drop_down_white.png'">
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="(item,index) in options" :key="index" :command="item">
                            <img class="choose-img" :src="item.Num == num ? src: image" alt="">
                            {{item.TeamName}}
                        </el-dropdown-item>
                        <el-dropdown-item>
                        </el-dropdown-item>
                            <el-button type="text" @click="dialogVisible = true" class="create-btn">
                                <img :src="$store.state.port.staticPath + '/img/add_blue_icon.png'" alt="">
                                创建团队
                            </el-button>
                    </el-dropdown-menu>
                </el-dropdown> -->
                <el-dialog 
                    title="创建团队"
                    :modal-append-to-body="false"
                    :lock-scroll="false"
                    :close-on-click-modal="false"
                    :visible.sync="dialogVisible">
                    <el-form :model="form" :rules="rules">
                        <el-form-item label="团队名称 : " prop="name">
                            <el-input v-model="form.name" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div class="team-btn">
                        <el-button type="primary" @click="handleCreateTeam(2)">企业团队</el-button>
                        <el-button type="primary" @click="handleCreateTeam(3)">协作团队</el-button>
                    </div>
                </el-dialog>
            </div>
            <div class="toggle-team">
                <el-collapse-transition>
                    <div v-if="show3">
                        <div class="transition-box">
                            <div class="team-item" v-for="(item,i) in options" :key="i" @click="handleChange(item)">
                                <img class="choose-img" :src="item.Num == num ? src: image" alt="">
                                <span :class="item.Num == num ? 'active' : ''">{{item.TeamName}}</span>
                            </div>
                            <div class="create-team-btn" @click="handleOpen">
                                <img :src="$store.state.port.staticPath + '/img/personal/xqy_add_icon.png'" alt="">
                                <span>创建团队</span>
                            </div>
                        </div>
                    </div>
                </el-collapse-transition>
            </div>
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
                    <p class="box-more" @click="handleClick('/messagecenter')">查看更多</p>
                </div>
            </div>
            <div class="info">
                <div class="info-link">
                    <img class="info-avatar" :src="avatar" alt="">
                    <span class="el-dropdown-link">{{username}}</span>
                    <img :src="$store.state.port.staticPath + '/img/home/drop_down_white.png'" alt="">
                </div>
                <div class="info-dropdown">
                    <div class="item item1" @click="handleClick('/personalcenter')">
                        <i></i>
                        <span>账号管理</span>
                    </div>
                    <div class="item item2" @click="handleClick('/team')">
                        <i></i>
                        <span>团队管理</span>
                    </div>
                    <div class="item item3" @click="handleJump('Vip')">
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
            form: {
                name: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入团队名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ]
            },
            avatar: localStorage['avatar'],
            username: localStorage['userName'],
            options: [],
            teamName: '' || sessionStorage.getItem('teamName'),
            dialogVisible: false,
            num: '' || sessionStorage.getItem('teamNum'),    // 团队编号
            image: '/img/personal/n_choose_icon.png',
            src: '/img/personal/choose_icon.png',
            messageList: [],
            show3: false
        }
    },
    methods: {
        handleClick(url) {
            if(url == '/team'){
                if(sessionStorage.getItem('teamType') == 'personal'){
                    this.$message({type: 'warning', message: '您还没有团队'})
                    return
                }else{
                    this.$router.push(url)
                    this.$emit('setData', 'center')
                }
            }else{
                this.$router.push(url)
                this.$emit('setData', 'center')
            }
        },
        handleJump(msg) {
            this.$emit('setVip', msg)
        },

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

        // 打开创建团队弹框
        handleOpen() {
            this.show3 = false
            this.dialogVisible = true
        },
        handleChange(item) {  // 切换团队
            this.show3 = false
            this.num = item.Num
            console.log(this.num)
            var formData = new FormData()
            formData.append('teamnum', this.num);
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.post('/ChangeTeam', formData, config).then(res => {
                console.log(res)
                sessionStorage.setItem('identity', res.data)
                history.go()
            })
            if(item.TeamType == 1 || item.TeamType == 2){
                this.$nextTick(()=>this.$store.commit('setTeamType', 'personal'))
                sessionStorage.setItem('teamType', 'personal')
            }else{
                this.$store.commit('setTeamType', 'team')
                sessionStorage.setItem('teamType', 'team')
            }
            // console.log(this.num)
            this.teamName = item.TeamName
            this.$store.commit('setTeamNum', this.num)
            sessionStorage.setItem('teamNum', this.num)
            sessionStorage.setItem('teamName', this.teamName)
        },
        handleCreateTeam(num) {  // 创建团队 
            var formData = new FormData()
            formData.append('TeamName', this.form.name)
            formData.append('TeamType', num)
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.post('/TeamInfo', formData, config).then(res => {
                console.log(res)
                if(res.data.Status == 'success'){
                    this.$message(res.data.Message)
                    this.dialogVisible = false
                }else{
                    this.$message(res.data.Message)
                }
            })
        },
        // 获取团队列表
        getTeamInfos() {
            this.$axios.post('/TeamInfos').then(res => {
                console.log(res.data)
                this.options = res.data
            })   
        },
    },
    mounted () {
        this.getTeamInfos()
        this.$bus.$on('setToggle', (msg) =>{
            this.show3 = msg
        })
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
            width: auto;
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
                padding: 12px 20px;
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
        .el-form-item__content{
            width: 416px;
            display: inline-block;
        }
    }
}
</style>
