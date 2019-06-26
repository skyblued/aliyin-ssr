<template>
    <div class="header-top">
        <div id="header-top">
            <div class="headerTop-left" style="font-size: 14px">海量模板免费使用，印刷订单全国包邮</div>
            <div class="login-btn" v-if="!userName">
                <div class="label"  @click="$store.commit('login/toggleShow', true)">
                    <span class="label-item">登录/注册</span>
                </div>
            </div>
            <div class="loginout-btn" v-if="userName">
                <nuxt-link to="/personal/acountcenter"><span class="label-item-name">嗨，{{userName}}</span></nuxt-link>
                <i class="label-line"></i>
                <nuxt-link to="/personal">
                    <span class="item">会员中心</span>
                </nuxt-link>
                <i class="label-line"></i>
                <span class="item" @click="handleToDesigner">设计师入口</span>
                <i class="label-line"></i>
                <nuxt-link to="/admin"><span v-if="userType == 'AA'" class="item">管理员入口</span></nuxt-link>
                <i v-if="userType == 'AA'" class="label-line"></i>
                <span class="item" @click="loginOut">注销</span>
            </div>
        </div>
		<!-- 设计师申请弹框 -->
		<el-dialog  :visible.sync="dialogApply" top="7vh">
			<ApplyDesigner :state="state"></ApplyDesigner>
			<div class="close-btn" style="right: -55px;top: 8px;" @click="dialogApply = false"></div>
		</el-dialog>
    </div>
</template>

<script>
import ApplyDesigner from '@/components/ApplyDesigner'
export default {
	name: 'header-top',
	components: {
        ApplyDesigner,
        // CreateTeam
    },
    data() {
        return {
            form: {
                name: ''
            },
            isDesigner: '',
            options: [],
			teamName: '',
			dialogApply: false, // 设计师申请弹框
            // dialogVisible: false,
            dialogVisibleImg: false,
            dialogImageUrl: '',
            teamNum: '',  // 团队编号
            userType: null,
            image: '/img/personal/n_choose_icon.png',
            src: '/img/personal/choose_icon.png',
            state: ''
        }
    },
    methods: {
        // 打开登录弹出框
        handleClick() {  // 进入会员中心
            // this.$router.push('/personal/create')
        },
        handleToDesigner() {
            if(this.$store.state.login.isLogin){
                this.$axios.get('/ApplyDesigner').then(res => {
                    console.log(res.data)
                    if(res.data.code == '1'){
                        this.$router.push('/designer')
                        localStorage.setItem('isDesigner', '1')
                    }else if(res.data.code == '0'){
                        this.state = res.data.state
                       	this.dialogApply = true;
                    }else if(res.data.code == '-1') {
                        this.$message.warning(res.data.msg)
						this.dialogApply = true;
						console.log(this.dialogApply)
                    }else{
                        this.$message.warning(res.data.msg)
                    }
                })
            }else{
                this.$store.commit('login/toggleShow', false);
            }
        },
        // 管理员中心
        handleToAdmin() {
            window.open('/admin')
        },

        // 注销登录
        loginOut() {
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
            history.go(0)
        },
    },
    mounted () {
        this.userType = localStorage['userType']
        if(localStorage['token']) {
            this.$store.commit('login/setUserName', localStorage['userName'])
            this.$store.commit('login/changeLogin', true)
        }
    },
    computed:{
        userName() {
            // console.log(this.$store.state.port.userName)
            return this.$store.state.login.userName
        },
        myHeader() {
            return {
                "token":window.localStorage.getItem('token')
            }
        }
    }
    
}
</script>

<style lang="scss" scoped>
.header-top{
    height:40px;
    background:rgba(243,243,243,1);
    position: relative;
}


#header-top{
    width: 1200px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 auto;
}
#header-top .select{
    padding: 10px 0 13px;
    font-size:14px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(153,153,153,1);
    cursor: pointer;
    img{
        vertical-align: middle;
    }
}
#header-top .login-btn{
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
}
#header-top .label{
    width:99px;
    height:24px;
    line-height: 20px;
    text-align: center;
    font-size: 12px;
    border:2px solid $color;
    border-radius:12px;
}
.item{
    height: 11px;
    line-height: 11px; 
    font-size:12px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(153,153,153,1);
    cursor: pointer;
    margin-top: 7px;
    margin-left: 24px;
    &:hover{
        color: $color;
    }
}
#header-top .label .label-item{
    display: inline-block;
    font-size:12px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(153,153,153,1);
    cursor: pointer;
}
.loginout-btn{
    display: flex;
    height: 100%;
    justify-content: space-around;
    align-items: center;
    .label-item-name{
        font-size:12px;
        color: $color;
        cursor: pointer;
    }
    a{
        font-size: 12px;
    }
    span{
        margin: 0;
    }
    .label-line{
        display: inline-block;
        width: 1px;
        height: 17px;
        background:rgba(153,153,153,1);
        margin: 0 15px;
    }
}



// 关闭按钮
.close{
    display: inline-block;
    position: absolute;
    top: 17px;
    right: -45px;
    width: 24px;
    height: 24px;
    background-image: url(/img/home/fork_white.png);
    cursor: pointer;
}

</style>
