<template>
    <div id="add-invoice">
        <!-- <div class="invoice-type">
            <div :class="['type-btn', activeIndex == '1' ? 'active' : '']" @click="handleToggle('1')">增值税普通发票</div>
            <div :class="['type-btn', activeIndex == '2' ? 'active' : '']" @click="handleToggle('2')">增值税专用发票</div>
        </div> -->
        <div class="invoice-content">
            <div class="common" v-if="activeIndex == '1'">
                <el-form :model="form">
                    <el-form-item label="开具方式: ">
                        <el-radio v-model="form.mode" label="增值税普通发票(电子发票)"></el-radio>
                    </el-form-item>
                    <el-form-item label="开具类型: ">
                        <el-radio-group v-model="form.custom" @change="handleChangeCustom">
                            <el-radio label="公司"></el-radio>
                            <el-radio label="个人"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="发票抬头: ">
                        <el-input v-if="form.custom == '公司'" v-model="form.rise"></el-input>
                        <span v-else>个人</span>
                    </el-form-item>
                    <el-form-item label="纳税识别号: " class="number" v-if="form.custom == '公司'">
                        <el-input v-model="form.number"></el-input>
                    </el-form-item>
                    <el-form-item label="电子发票接收邮箱: " class="email">
                        <el-input v-model="form.email"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div class="special" v-if="activeIndex == '2'">
                <el-form :model="form">
                    <el-form-item label="发票抬头: ">
                        <el-input v-model="form.rise"></el-input>
                    </el-form-item>
                    <el-form-item label="纳税识别号: " class="number">
                        <el-input v-model="form.number"></el-input>
                    </el-form-item>
                    <el-form-item label="注册电话: ">
                        <el-input v-model="Phone" @blur="handleBlur" @focus="handleFocus"></el-input>
                        <span class="error-tips">{{error}}</span>
                    </el-form-item>
                    <el-form-item label="银行名称: ">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="银行账号: ">
                        <el-input v-model="form.account" @blur="handleBlurBank"></el-input>
                    </el-form-item>
                </el-form>
            </div>

            <div slot="footer" class="dialog-footer">
                <div class="sure-btn" @click="handleAddInvoice">确定添加</div>
                <div class="cancel-btn" @click="handleCancel">取消添加</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            form: {
                mode: '增值税普通发票(电子发票)',
                custom: '公司',
                rise: '',
                number: '',
                email: '',
                phone: '',
                name: '',
                account: ''
            },
            Phone: '',
            error: '',
            activeIndex: 1,
            taxType: 0,    // 发票类型
            makeType: '',  // 开具方式
            customId: 1,  // 开具类型
        }
    },
    methods: {
        handleToggle(i) {   // 选择发票类型
            this.activeIndex = i
            if(i == '1'){
                this.taxType = 0
            }else{
                this.taxType = 1
            }
        },
        handleChangeCustom(val) {  // 选择开具类型
            console.log(val)
            if(val == '公司'){
                this.customId = 1
            }else{
                this.customId = 0
            }
        },
        
        handleBlur() {  // 验证手机号格式
            if(!/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/.test(this.Phone) ) {
                this.error = '请输入正确的手机号'
            }else{
                this.error = ''
            }
        },
        handleFocus() {
            this.error = ''
        },
        handleBlurBank() {
            this.$axios.get('https://ccdcapi.alipay.com/validateAndCacheCardInfo.json?_input_charset=' + 'utf-8' + '&cardNo=' + this.form.account + '&cardBinCheck=' + true).then(res => {
                console.log(res.data)
            }) 
        },



        handleAddInvoice() {   // 添加发票
            if(this.form.custom == '公司'  && !this.form.rise){
                this.$message({type: 'warning', message: '请填写发票抬头'})
                return
            }
            
            let title = ''
            if(this.taxType == 0){
                this.makeType = 1
                if(this.form.custom == '公司'){
                    title = this.form.rise
                    if(!this.form.number){
                        this.$message({type: 'warning', message: '请填写纳税识别号'})
                        return
                    }
                }else{
                    title = '个人'
                }
                if(!this.form.email){
                    this.$message({type: 'warning', message: '请填写发票接收邮箱'})
                    return
                }
            }
            if(this.taxType == 1){
                this.makeType = 0
                title = this.form.rise
                if(this.form.phone == -1 || !this.Phone){
                    this.$message({type: 'warning', message: '请填写注册电话或手机号格式错误'})
                    return 
                }
                if(!this.form.name){
                    this.$message({type: 'warning', message: '请填写银行名称'})
                    return
                }
                if(!this.form.account){
                    this.$message({type: 'warning', message: '请填写银行卡号'})
                    return
                }
            }
            var formData = new FormData()
            formData.append('TaxpayerType', this.taxType);
            formData.append('MakeType', this.makeType);
            formData.append('CustomerType', this.customId);
            formData.append('InvoiceTitle', title);
            formData.append('Email', this.form.email);
            formData.append('RegisterNo', this.form.number);
            formData.append('Bank', this.form.name);
            formData.append('BankNo', this.form.account);
            formData.append('Phone', this.Phone);
            formData.append('TeamNum', localStorage['teamNum']);
            //console.log(this.taxType,this.makeType,this.customId,title,this.form.email,this.form.number,this.form.name,this.form.account,this.form.phone)
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.post('/TeamInvoice', formData, config).then(res => {
                console.log(res.data)
                if(JSON.stringify(res.data) === '{}'){
                    return
                }else{
                    this.$message({type: 'success', message: '添加成功'})
                    this.$store.commit('login/setDialogAddInvoice', false)
                    this.$emit('getInvoice')
                }
            }) 
        },
        handleCancel() {
            this.$store.commit('login/setDialogAddInvoice', false)
        }
    },
    watch: {
        Phone() {
            if(!/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/.test(this.Phone) ) {
                this.form.phone = -1
            }else{
                this.form.phone = 1
            }
        }
    }
}
</script>

<style lang="scss" scoped>

#add-invoice{
    .invoice-type{
        display: flex;
        padding: 0 60px;
        justify-content: space-between;
        .type-btn{
            text-align: center;
            line-height: 37px;
            border:1px solid rgba(220,220,220,1);
            border-radius:5px;
            color:rgba(51,51,51,1);
            width: 205px;
            cursor: pointer;
        }
        .active{
            border: 1px solid $color;
            background: $color;
            color: rgba(255,255,255,1);
        }
    }
    .invoice-content{
        .common{
            padding: 0 38px 38px;
        }
        .el-form-item{
            display: flex;
            height: 48px;
            line-height: 48px;
            position: relative;
            .error-tips{
                display: inline-block;
                width: 100%;
                font-size: 12px;
                line-height: 14px;
                color: rgba(255,0,0,1);
                position: absolute;
                top: 50px;
                left: 0;
            }
        }
        .special{
            padding: 42px 38px 38px;
        }
        .dialog-footer{
            display: flex;
            width: 389px;
            margin: 0 auto 35px;
            div{
                border-radius:5px;
                text-align: center;
                height: 48px;
                line-height: 48px;
                width: 179px;
                font-size: 18px;
                cursor: pointer;
            }
            .sure-btn{
                background:$color;
                color: rgba(255,255,255,1);
                margin-right: 31px;
            }
            .cancel-btn{
                border:1px solid rgba(210,210,210,1);
                color:rgba(153,153,153,1);
            }
        }
    }
}

#add-invoice /deep/ .el-form{
    .el-form-item__label{
        line-height: 48px;
        margin-right: 24px;
    }
    .el-form-item__content{
        width: 416px;
        text-align: left;
        line-height: 48px;
    }
    .el-input, .el-input .el-input__inner{
        height: 48px;
        line-height: 48px;
    }
    .email .el-form-item__label{
        line-height: 24px;
        width: 72px;
        text-align: left;
    }
    .number .el-form-item__label{
        margin-left: -14px;
    }
}
</style>
