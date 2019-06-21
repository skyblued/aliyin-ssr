<template>
    <div class="home-pagination">
        <div class="block">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="Page.currentPage"
                :page-size="Page.pageSize"
                layout="prev, pager, next, total, jumper"
                :total="Page.totalRecords">
            </el-pagination>
            <div class="sure" @click="handleJump">确定</div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            
        }
    },
    props: ['Page'],
    methods: {
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.$emit('getTempList')
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            //this.Page.pageSize = val
            this.$emit('getTempList')
        },
        handleJump() {
            // this.handleCurrentChange()
        }
    },
    mounted() {
        //console.log(this.Page)
    }
}
</script>

<style lang="scss" scoped>

// 分页
.home-pagination{
    text-align: center;
}
.home-pagination .block{
    height: 36px;
    margin: 30px auto;
    display: inline-block;
    position: relative;
    user-select: none;
    .sure{
        background: rgba(255, 255, 255,1);
        border: 1px solid rgba(204,204,204,1);
        border-radius: 2px;
        height: 36px;
        line-height: 36px;
        padding: 0 14px;
        margin-left: 20px;
        cursor: pointer;
        font-size:12px;
        color:rgba(51,51,51,1);
        position: absolute;
        top: 0;
        right: -74px;
    }
}
.home-pagination /deep/ .block .el-pagination{
    padding: 0;
    position: relative;
}
.home-pagination /deep/ .block .el-pagination .el-pager li{
    width:36px;
    height:36px;
    line-height: 36px;
    text-align: center;
    background:rgba(255,255,255,1);
    border:1px solid rgba(204,204,204,1);
    border-radius:2px;
    margin: 0 10px;
    padding: 0;
    cursor: pointer;
    font-size: 12px;
    color: rgba(51,51,51,1);
}
.home-pagination /deep/ .block .el-pagination .el-pager .number:first-child{
    margin-left: 20px;
}
.home-pagination /deep/ .block .el-pagination .el-pager .number:last-child{
    margin-right: 20px;
}
.home-pagination /deep/ .block .el-pagination .el-pager .number.active{
    background:$color;
    color: rgba(255, 255, 255,1);
    border-radius:2px;
}
.home-pagination /deep/ .block .el-pagination .el-pagination__total{
    display: inline-block;
    text-align: right;
    height:11px;
    line-height: 11px;
    font-size:12px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(51,51,51,1);
    margin: 13px 0 12px 20px;
}
.home-pagination /deep/ .block .el-pagination .el-pagination__jump{
    text-align: right;
    font-size:12px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(51,51,51,1);
}
.home-pagination /deep/ .block .el-pagination .el-pagination__jump .el-pagination__editor{
    width: 36px;
    height: 36px;
    margin: 0 11px;
    padding: 0;
}
.home-pagination /deep/ .block .el-pagination .el-pagination__jump .el-pagination__editor .el-input__inner{
    width:36px;
    height:36px;
    background:rgba(255,255,255,1);
    border:1px solid rgba(204,204,204,1);
    border-radius:2px;
}
.home-pagination /deep/ .block .el-pagination .btn-prev{
    width:60px;
    height:36px;
    background:rgba(255,255,255,1);
    border:1px solid rgba(204,204,204,1);
    border-radius:2px;
    padding: 0;
}
.home-pagination /deep/ .block .el-pagination .btn-next{
    width:60px;
    height:36px;
    background:rgba(255,255,255,1);
    border:1px solid rgba(204,204,204,1);
    border-radius:2px;
    padding: 0;
}
.home-pagination /deep/ .block .el-pagination .btn-next .el-icon-arrow-right::before{
    content: '下一页';
    font-size:12px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(51,51,51,1);
}
.home-pagination /deep/ .block .el-pagination .btn-prev .el-icon-arrow-left::before{
    content: '上一页';
    font-size:12px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(51,51,51,1);
}
</style>
