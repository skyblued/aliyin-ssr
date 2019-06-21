<template>
    <div id="ranking-list">
        <div class="ranking-list">
            <div class="ranking-title">
                <p class="titles">“睡后”收入排行榜</p>
                <p class="titles1">轻轻松松月入万元，睡着都能拿工资</p>
            </div>
            <el-table
                :data="tableData">
                <el-table-column
                    label="排行(月榜)">
                    <template slot-scope="scope">
                        <img v-if="scope.row.ranking == 1" :src="$store.state.port.staticPath + '/img/home/recruit/first_icon.png'" alt="">
                        <img v-else-if="scope.row.ranking == 2" :src="$store.state.port.staticPath + '/img/home/recruit/second_icon.png'" alt="">
                        <img v-else-if="scope.row.ranking == 3" :src="$store.state.port.staticPath + '/img/home/recruit/third_icon.png'" alt="">
                        <span v-else>{{scope.row.ranking}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="设计师昵称">
                    <template slot-scope="scope">
                        <div>
                            <img :src="scope.row.avatar" alt="">
                            <span>{{scope.row.nickname}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="works"
                    label="当月上传作品数"
                    width="192">
                </el-table-column>
                <el-table-column
                    prop="worksReward"
                    label="作品奖励">
                </el-table-column>
                <el-table-column
                    prop="printDivision"
                    label="印刷分成">
                </el-table-column>
                <el-table-column
                    prop="totalReward"
                    label="总奖励">
                </el-table-column>
                <el-table-column
                    prop="totalDivision"
                    label="总分成">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            tableData: [{
                id: 1,
                ranking: 1,
                avatar: '',
                nickname: '有趣的泡沫',
                works: '369',
                worksReward: '2985',
                printDivision: '549',
                totalReward: '365',
                totalDivision: '23698'
            },{
                id: 2,
                ranking: 2,
                avatar: '',
                nickname: '有趣的泡沫',
                works: '369',
                worksReward: '2985',
                printDivision: '549',
                totalReward: '365',
                totalDivision: '23698'
            }]
        }
    }
}
</script>

<style lang="scss" scoped>
#ranking-list{
    width: 100%;
    padding-bottom: 88px;
    .ranking-list{
        width: 1200px;
        margin: 178px auto 0;
        text-align: center;
        .ranking-title{
            color:rgba(18,15,75,1);
            width: 513px;
            height: 145px;
            padding-top: 47px;
            margin: 0 auto;
            background-image: url(/img/home/recruit/ball_icon1.png);
            background-repeat: no-repeat;
            .titles{
                position: relative;
                width: 294px;
                font-size: 36px;
                line-height: 36px;
                margin: 0 auto 20px;
            }
            .titles1{
                position: relative;
                font-size: 24px;
                line-height: 24px;
            }
            .icon1{
                display: inline-block;
                position: absolute;
                top: -40px;
                left: -88px;
                width: 61px;
                height: 61px;
                background: linear-gradient(-42deg,rgba(255,72,110,1) 0%,rgba(255,154,197,1) 49%,rgba(249,166,255,1) 86%);
                border-radius: 50%;
            }
            .icon2{
                display: inline-block;
                position: absolute;
                top: 3px;
                right: -115px;
                width: 54px;
                height: 54px;
                background: linear-gradient(-42deg,rgba(157,198,246,1) 0%,rgba(100,174,255,1) 51%,rgba(117,243,254,1) 86%);
                border-radius: 50%;
            }
            .icon3{
                display: inline-block;
                position: absolute;
                top: 1px;
                right: 377px;
                width: 37px;
                height: 37px;
                background: linear-gradient(45deg,rgba(250,90,127,1) 0%,rgba(247,167,106,1) 51%,rgba(248,216,46,1) 86%);
                border-radius: 50%;
            }
        }
    }
}

.ranking-list /deep/ .el-table{
    background:rgba(223,233,246,1);
    border-radius:10px;
    text-align: center;
    margin-top: 88px;
    color:rgba(51,51,51,1);
    tr,th{
        background:rgba(223,233,246,1);
    }
    th{
        padding: 8px 0 9px;
        font-size: 24px;
    }
    td .cell{
        font-size: 20px;
    }
    td{
        height: 151px;
    }
}
</style>
