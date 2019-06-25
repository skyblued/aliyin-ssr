<template>
    <div class="add-member">
        <div class="add-way-btn">
            <div :class="{'way-btn': true, 'active': activeIndex == i ? true: false}" v-for="(item,i) in btnList" :key="i" @click="handleChoose(i)">{{item.title}}</div>
        </div>
        <div class="container">
            <div class="qrcode" v-if="qrcode">
                <img class="qrcode-img" :src="Code" alt="">
                <p>
                    <img src="/img/personal/wechat.png" alt="">
                    <span>使用微信扫一扫</span>
                </p>
            </div>
            <div class="link" v-if="link">
                <div class="link-title">{{invitationLink}}</div>
                <p>收到邀请链接的人可以加入企业</p>
                <div class="copy-btn"
                    v-clipboard:copy="invitationLink"
                    v-clipboard:success="onCopy"
                    v-clipboard:error="onError">
                    复制链接
                </div>
                <!-- <span v-if="success">{{linkurl}}</span> -->
            </div>
            <div class="phone" v-if="phone">
                <el-input v-model="input" class="input" placeholder="输入手机号码、邮箱添加团队成员" @focus="error = ''" @blur="detection"></el-input>
                <span class="error-tips">{{error}}</span>
                <div class="send-btn" @click="handleSend">发送邀请短信</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            teamNum: localStorage['teamNum'],
            activeIndex: 0,
            btnList: [{
                id: '1',
                title: '二维码邀请'
            },{
                id: '2',
                title: '邀请链接'
            },{
                id: '3',
                title: '手机/邮箱邀请'
            }],
            qrcode: true,    // 显示二维码邀请页面
            link: false,     // 显示邀请链接页面
            phone: false,    // 显示手机邀请页面
            invitationLink: '',    // 邀请链接
            input: '',
            error: '',
            Code: '',
        }
    },
    methods: {
        openDialog() {
            var url = '/QrCode'
            var formData = new FormData();
            formData.append('teamnum', this.teamNum);
            formData.append('token', localStorage.getItem('token'));
            formData.append('content', '');
            formData.append('action', 'teaminvite');
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.post(url,formData,config).then(res => {
                //console.log(res)
                if(res.status == 200){
                    this.Code = res.data
                }
            })
        },

        // 切换添加方式
        handleChoose(i) {
            this.activeIndex = i
            if(i == 0) {
                this.qrcode = true
                this.link = false
                this.phone = false
                this.openDialog()
            }else if(i == 1) {
                this.qrcode = false
                this.link = true
                this.phone = false
                var formData = new FormData()
                formData.append('teamnum', this.teamNum);
                let config = {
                    headers:{'Content-Type': 'multipart/form-data'}
                }
                this.$axios.post('/Invitation', formData, config).then(res => {
                    // console.log(res.data)
                    this.invitationLink = res.data
                })
            }else{
                this.phone = true
                this.qrcode = false
                this.link = false
            }
        },
        // 复制链接
        onCopy(e) {  // 成功
            console.log(e)
            // this.linkurl = e.text
            // this.success = true
            if(e.action == 'copy'){
                this.$message({type: 'success', message: '复制成功'})
            }
        },
        onError(e){  // 失败
            console.log(e)
        },
        detection() {  // 验证手机号或邮箱
            if(!/(^1[0-9]{10}$)|(^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/.test(this.input) ) {
                this.error = '请输入正确的手机号'
            }else{
                this.error = ''
            }
        },
        // 发送短信邀请
        handleSend() {
            if(this.input){
                console.log(this.input)
                var formData = new FormData()
                formData.append('mobile', this.input);
                let config = {
                    headers:{'Content-Type': 'multipart/form-data'}
                }
                this.$axios.post('/Invitation', formData, config).then(res => {
                    console.log(res.data)
                })
            }
        },
    },
    mounted(){
        this.openDialog()
    }
}
</script>

<style lang="scss" scoped>

.add-way-btn{
    display: flex;
    justify-content: space-between;
    font-size:16px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(51,51,51,1);
    line-height:37px;
    height: 37px;
    .way-btn{
        width: 151px;
        border:1px solid rgba(220,220,220,1);
        border-radius:5px;
        cursor: pointer;
    }
    .active{
        color: rgba(255,255,255,1);
        background: $color;
    }
}
.container{
    .qrcode{
        margin-top: 46px;
        .qrcode-img{
            width: 155px;
            height: 155px;
            border:1px solid rgba(210,210,210,1);
        }
        p{
            font-size:14px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            color:rgba(153,153,153,1);
            img{
                width: 27px;
                height: 22px;
                vertical-align: middle;
                margin-right: 10px;
            }
        }
    }
    .link{
        margin-top: 37px;
        .link-title{
            font-size:14px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            color:rgba(51,51,51,1);
            border:1px solid rgba(210,210,210,1);
            border-radius:10px;
            padding: 26px 0;
            user-select: none;
        }
        p{
            font-size:14px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            color:rgba(153,153,153,1);
            text-align: left;
            margin-top: 18px;
        }
        .copy-btn{
            width: 132px;
            height: 48px;
            border: 1px solid $color;
            border-radius: 5px;
            line-height: 48px;
            font-size: 18px;
            font-family: MicrosoftYaHei;
            font-weight: 400;
            color: $color;
            cursor: pointer;
            margin-top: 27px;
        }
    }
    .phone{
        margin-top: 37px;
        position: relative;
        .error-tips{
            position: absolute;
            top: 48px;
            left: 0;
            color: rgba(255,0,0,1);
        }
        .send-btn{
            width: 167px;
            height: 48px;
            line-height: 48px;
            border: 1px solid $color;
            border-radius: 5px;
            font-size: 18px;
            font-family: MicrosoftYaHei;
            font-weight: 400;
            color: $color;
            cursor: pointer;
            margin-top: 39px;
        }
    }
}

.add-member /deep/ .phone .el-input__inner, .el-input{
    height: 48px;
    line-height: 48px;
}
</style>
