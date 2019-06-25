<template>
    <div class="modify-address">
        <el-form :model="form" v-if="shipaddress">
            <el-form-item label="收货区域: ">
                <el-select v-model="form.province" style="width: 130px" @change="handleChange">
                    <el-option value="请选择"></el-option>
                    <el-option v-for="item in provinceList" :key="item.value" :label="item.RegionName" :value="item.RegionId"></el-option>
                </el-select>
                <el-select v-model="form.city" style="width: 130px" @change="handleChangeCity" v-if="cityList.length || form.city">
                    <el-option value="请选择"></el-option>
                    <el-option v-for="item in cityList" :key="item.value" :label="item.RegionName" :value="item.RegionId"></el-option>
                </el-select>
                <el-select v-model="form.area" style="width: 130px" @change="handleChangeArea" v-if="areaList.length || form.area != '请选择'">
                    <el-option value="请选择"></el-option>
                    <el-option v-for="item in areaList" :key="item.value" :label="item.RegionName" :value="item.RegionId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="收货地址: ">
                <el-input style="width: 420px" v-model="form.address" placeholder="请输入详细收货地址"></el-input>
            </el-form-item>
            <el-form-item label="收货人: " class="receiver">
                <el-input style="width: 420px" v-model="form.name" placeholder="请输入收货人姓名"></el-input>
            </el-form-item>
            <el-form-item label="联系电话: ">
                <el-input style="width: 420px" v-model="shipaddress.CelPhone" placeholder="请输入收货人电话号码" @blur="handleBlur" @focus="handleFocus"></el-input>
                <span class="error-tips">{{error}}</span>
            </el-form-item>
            <el-form-item label="设为默认: ">
                <el-checkbox v-model="form.checked">默认</el-checkbox>
            </el-form-item>
        </el-form>
        <div class="footer">
            <div class="sure-btn" @click="handleModify">确定修改</div>
            <div class="cancel-btn" @click="handleCancel">取消修改</div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            form: {
                province: '请选择',
                city: '请选择',
                area: '请选择',
                address: '',
                name: '',
                phone: '',
                checked: true
            },
            Phone: '',
            error: '',
            provinceList: [],
            provinceId: '',
            cityList: [],
            cityId: '',
            areaList: [],
            areaId: '',
            regionName: [],

            shipaddress: null,

            
        }
    },
    props: ['id'],
    methods: {
        handleBlur() {  // 失去焦点验证手机号
            if(!/^((1[3-9][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/.test(this.shipaddress.CelPhone) ) {
                this.error = '请输入正确的手机号'
            }else{
                this.error = ''
            }
        },
        handleFocus() {
            this.error = ''
        },

        // 获取省份信息
        getProvinceList() {
            this.$axios.get('/regions').then(res => {
                //console.log(res.data)
                this.provinceList = res.data
            })
        },
        handleChange(val) {
            if(val == '请选择') return
            this.provinceId = val
            this.shipaddress.RegionId = val
            this.getCityList()
            this.form.city = '请选择'
            this.form.area = '请选择'
            var j = 0
            for(var i=0;i<this.provinceList.length;i++){
                if(val == this.provinceList[i].RegionId){
                    j = i
                }
            }
            if(this.regionName.length == 0) {
                this.regionName.push(this.provinceList[j].RegionName)
            }else if(this.regionName.length == 1){
                this.regionName.splice(0,1,this.provinceList[j].RegionName)
            }else{
                this.regionName.splice(0,1,this.provinceList[j].RegionName)
                this.regionName.splice(1)
            }
        },
        // 获取城市信息列表
        getCityList() {
            if(this.provinceId){
                this.$axios.get('/regions/?id=' + this.provinceId).then(res => {
                    //console.log(res.data)
                    this.cityList = res.data
                })
            }else{
                this.form.city = '请选择'
            }
        },
        handleChangeCity(val) {
            if(val == '请选择') {
                this.regionName.splice(1,1)
                return
            }
            this.cityId = val
            this.shipaddress.RegionId = val
            this.getAreaList()
            this.form.area = '请选择'
            var j = 0
            for(var i=0;i<this.cityList.length;i++){
                if(val == this.cityList[i].RegionId){
                    j = i
                }
            }
            if(this.regionName.length == 1) {
                this.regionName.push(this.cityList[j].RegionName)
            }else if(this.regionName.length == 2){
                this.regionName.splice(1,1,this.cityList[j].RegionName)
            }else{
                this.regionName.splice(1,1,this.cityList[j].RegionName)
                this.regionName.splice(2)
            }
        },
        // 获取地区信息列表
        getAreaList() {
            if(this.provinceId && this.cityId){
                this.$axios.get('/regions/?id=' + this.cityId).then(res => {
                    //console.log(res.data)
                    this.areaList = res.data
                })
            }else{
                this.form.area = '请选择'
            }
        },
        handleChangeArea(val) {
            if(val == '请选择') {
                this.regionName.splice(2,1)
                return
            }
            this.areaId = val
            this.shipaddress.RegionId = val
            var j = 0
            for(var i=0;i<this.areaList.length;i++){
                if(val == this.areaList[i].RegionId){
                    j = i
                }
            }
            if(this.regionName.length == 2) {
                this.regionName.push(this.areaList[j].RegionName)
            }else{
                this.regionName.splice(2,1,this.areaList[j].RegionName)
            }
        },


        handleModify() {  // 修改地址
            if(this.form.province == '请选择' && this.form.city == '请选择' && this.form.area == '请选择'){
                this.$message({type: 'warning', message: '请填写收货区域'})
                return
            }

            if(!this.shipaddress.Address){
                this.$message({type: 'warning', message: '请填写收货详细地址'})
                return
            }
            if(!this.shipaddress.ShipName){
                this.$message({type: 'warning', message: '请填写收货人姓名'})
                return
            }
            if(this.form.phone == -1 || !this.shipaddress.CelPhone){
                this.$message({type: 'warning', message: '请填写联系电话或输入正确的手机号'})
                return
            }
            this.shipaddress.RegionFullName = this.regionName.join('-')
            this.shipaddress.IsDefault = this.form.checked
            let config = {
                headers:{'Content-Type': 'application/json'}
            }
            this.$axios.put('/shipaddress', this.shipaddress, config).then(res => {
                // console.log(res.data)
                if(res.data == true){
                    this.$message.success('修改成功')
                    this.$store.commit('login/setDialogModify', false)
                    this.$emit('setAddress')
                }else{
                    this.$message.error('修改失败')
                }
            })
        },
        handleCancel() {
            this.$store.commit('login/setDialogModify', false)
        },


        // 获取当前点击的地址信息
        getAddressInfo() {
            this.$axios.get('/shipaddress?id=' + this.id).then(res =>{
                console.log(res.data)
                this.shipaddress = res.data
                this.form.checked = res.data.IsDefault
                this.form.address = this.shipaddress.Address
                this.form.name = this.shipaddress.ShipName
                let str = res.data.ProvinceCity.split('-')
                this.regionName = str
                this.form.province = str[0] || '请选择'
                this.form.city = str[1] || '请选择'
                this.form.area = str[2] || '请选择'
            })
        }
    },
    computed: {
        getShipaddress() {
            let phone,address,name,detailAddress;
            phone = this.shipaddress.CelPhone
            address = this.shipaddress.ProvinceCity.split('-')
            name = this.shipaddress.ShipName
            detailAddress = this.shipaddress.Address
            return {
                phone,
                address,
                name,
                detailAddress 
            }
        }
    },
    mounted() {
        this.getAddressInfo()
        this.getProvinceList()
    },
    watch: {
        id(){
            this.getAddressInfo()
        },
        shipaddress() {
            if(!/^((1[3-9][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/.test(this.shipaddress.CelPhone) ) {
                this.form.phone = -1
            }else{
                this.form.phone = 1
            }
        },
        form: {
            deep: true,
            handler(value) {
                this.shipaddress.Address = value.address
                this.shipaddress.ShipName = value.name
            }
        }
    }
}
</script>

<style lang="scss" scoped>

.modify-address .el-form{
    .el-form-item{
        display: flex;
        height: 48px;
        line-height: 48px;
        position: relative;
    }
}
.modify-address /deep/ .el-form{
    .el-form-item .el-form-item__label, .el-select,.el-input, .el-input__inner{
        height: 48px;
        line-height: 48px;
    }
    .el-form-item__label{
        margin-right: 20px;
    }
    .el-select{
        margin-right: 15px;
        .el-input__suffix .el-select__caret::before{
            content: '';
        }
        .el-input__suffix .el-select__caret{
            background-image: url(/img/home/drop_down.png);
            width: 11px;
            height: 6px;
            vertical-align: middle;
            display: inline-block;
            transform: rotateZ(0);
            margin-right: 10px;
        }
    }
    .el-select:last-child{
        margin-right: 0;
    }
    .receiver .el-form-item__label{
        margin-right: 34px;
    }
    .error-tips{
        position: absolute;
        top: 50px;
        left: 0;
        line-height: 16px;
        color: rgba(255,0,0,1);
    }
}
.modify-address .footer{
    display: flex;
    line-height: 48px;
    width: 389px;
    margin: 33px auto 0;
    div{
        text-align: center;
        border-radius:5px;
        font-size: 18px;
        width: 179px;
        cursor: pointer;
    }
    .sure-btn{
        background: $color;
        color: rgba(255,255,255,1);
        margin-right: 31px;
    }
    .cancel-btn{
        border:1px solid rgba(210,210,210,1);
        color:rgba(153,153,153,1);
    }
}
</style>

