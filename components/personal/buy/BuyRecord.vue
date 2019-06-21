<template>
    <div id="buy-record">
        <div class="buy-record">
            <el-form :inline="true" class="form-inline">
                <el-form-item label="产品分类: ">
                    <el-select v-model="formInline.product" clearable class="select">
                        <el-option label="全部" value="0"></el-option>
                        <el-option v-for="(item,index) in productList" :key="index" :label="item.ClassName" :value="item.ClassNum"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="设计时间: " class="form-item">
                    <div class="block-date">
                        <el-date-picker
                            v-model="formInline.startTime"
                            type="date"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择开始日期"
                            :picker-options="pickerOptions0">
                        </el-date-picker>
                    </div>
                    <span class="range">~</span>
                    <div class="block-date">
                        <el-date-picker
                            v-model="formInline.endTime"
                            type="date"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="选择结束日期"
                            :picker-options="pickerOptions1">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <div class="screen" @click="getBuyRecord">筛选</div>
            </el-form>
            <div class="to-buy">
                <span>您还没有购买记录</span>
                <p>去购买</p>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    data () {
        return {
            formInline: {
                product: '',
                date: ''
            },
            productList: [],
            pickerOptions0: {
                disabledDate: (time) => {
                    if (this.formInline.endTime) {
                        return time.getTime() > new Date(this.formInline.endTime).getTime();
                    } else {
                        return time.getTime() > Date.now();
                    }
                }
            },
            pickerOptions1: {
                disabledDate: (time) => {
                    if(this.formInline.startTime){
                        return (
                            time.getTime() > Date.now() ||
                            time.getTime() < new Date(this.formInline.startTime).getTime()
                        );
                    }else{
                        return time.getTime() > Date.now();
                    }
                }
            },
        }
    },
    methods: {
        getBuyRecord() {
            let product;
            if(this.formInline.product == 0){
                product = ''
            }else{
                product = this.formInline.product
            }
            if((this.formInline.startTime == '' && this.formInline.endTime == '') || (this.formInline.startTime == null && this.formInline.endTime == null)){
                this.startTime = ''
                this.endTime = ''
            }else{
                this.startTime = this.formInline.startTime
                this.endTime = this.formInline.endTime
            }
        }
    },
    mounted() {
        this.$axios.get('/ProductCategories').then(res => {
            // console.log(res)
            this.productList = res.data
        })
    },
}
</script>

<style lang="scss" scoped>

#buy-record{
    width: 100%;
    padding: 45px 63px;
    user-select: none;
    .buy-record{
        min-width: 1200px;
        margin: 0 auto;
    }
    .to-buy{
        text-align: center;
        margin-top: 200px;
        p{
            border-radius: 5px;
            background: $color;
            line-height: 40px;
            width: 98px;
            margin: 0 auto;
            color: rgba(255,255,255,1);
            cursor: pointer;
            margin-top: 20px;
            &:hover{
                background: #0893ff;
            }
        }
    }
}
</style>
