<template>
    <div id="member">
        <div class="member">
            <!-- :row-style="{height: '82px'}" -->
            <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                :default-sort = "{prop: 'identity', order: 'ascending'}">
                <el-table-column label="头像">
                    <template slot-scope="scope">
                        <img v-if="scope.row.avatar != 'null' && $store.state.avatar != ''" class="avatar" :src="scope.row.avatar.indexOf('http') > -1 ? scope.row.avatar :$store.state.port.imgBaseUrl + scope.row.avatar" alt="">
                        <img v-else class="avatar" src="/img/personal/avatar_icon.png" alt="">
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="成员用户名">
                </el-table-column>
                <el-table-column
                    prop="phone"
                    label="账号">
                </el-table-column>
                <el-table-column
                    prop="identity"
                    label="角色">
                    <template slot-scope="scope">
                        <span v-if="scope.row.identity == '1'">团队创建者</span>
                        <span v-else>成员</span>
                    </template>
                </el-table-column>
                <el-table-column align="right" label="操作" width="405">
                    <template slot-scope="scope">
                        <div v-if="identity == true" class="manage">
                            <div class="remove-btn" v-if="scope.row.identity == '2'" @click="handleDelete(scope.row.id)">
                                <img src="/img/personal/delete_icon.png" alt="">
                                移除
                            </div>
                            <div class="identity-btn" @click="handleAuthority(scope.row.id)" v-if="scope.row.identity == '2'">权限设置</div>
                            <el-dialog title="成员权限设置" :visible.sync="dialogVisible" :lock-scroll="false" top="10vh"> 
                                <div class="authority" v-for="(item,index) in list" :key="index">
                                    <div>{{item.Name}}</div>    
                                    <div class="check-item" v-for="(tmp,i) in item.SonList" :key="i" @click="handleSet({index:index,i:i,num:tmp.Num})">
                                        <img :src="tmp.Check == false ? image:src" alt="">
                                        <span>{{tmp.Name}}</span>
                                    </div>
                                </div>
                                <div class="footer" @click="dialogVisible = false">确定</div>
                            </el-dialog>
                        </div>
                        <el-button v-if="identity == false && scope.row.identity == '2' && scope.row.name === userName" size="small" type="danger" @click="handleDelete(scope.row.id)">退出</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            teamNum: localStorage['teamNum'],
            tableData: [],
            dialogVisible: false,
            list: [],
            memberId: '',   // 成员id
            image: '/img/home/choose.png',     // 未设置权限图片
            src: '/img/home/choose_hl.png',     // 设置权限成功图片
        }
    },
    methods: {
        tableRowClassName({row, rowIndex}) {
            if (rowIndex%2 == 0) {
                return 'warning-row';
            }
            return '';
        },
        // 移除成员
        handleDelete(id) {
            console.log(id)
            var formData = new FormData()
            formData.append('TeamNum', this.teamNum);
            formData.append('Id', id);
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.delete('/TeamMember',{data: formData},config).then(res => {
                console.log(res)
                if(res.data == 'Success') {
                    this.$message('删除成功')
                }else if(res.data == 'Fail'){
                    this.$message('删除失败')
                }else if(res.data == 'NoAuthority'){
                    this.$message('没有这个权限')
                }else{
                    this.$message('未找到此成员')
                }
            })
        },
        // 获取团队成员列表
        getMembers() {
            var formData = new FormData()
            formData.append('TeamNum', this.teamNum)
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.post('/TeamMembers',formData,config).then(res => {
                console.log(res.data)
                // this.tableData = res.data
                var memberList = []
                for(var i=0;i<res.data.length;i++){
                    var obj = {}
                    obj.avatar = localStorage['avatar']
                    obj.name = res.data[i].NickName
                    obj.phone = res.data[i].Phone
                    obj.identity = res.data[i].Identity
                    obj.id = res.data[i].ID
                    obj.userId = res.data[i].UserID
                    memberList[i] = obj
                }
                this.tableData = memberList
                //console.log(this.tableData)
            })
        },
        // 获取所有权限列表
        handleAuthority(id) {
            // console.log(id)
            this.memberId = id
            this.dialogVisible = true
            var formData = new FormData()
            formData.append('TeamNum', this.teamNum);
            formData.append('MemberID', this.memberId);
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.$axios.post('/Authorities', formData,config).then(res => {
                console.log(res.data)
                this.list = res.data
                
            })
        },
        // 给成员设置权限
        handleSet({index,i,num}) {
            // console.log(num)  //权限编号
            // console.log(tmp)
            var formData = new FormData()
            formData.append('TeamNum', this.teamNum);
            formData.append('AuthorityNum', num);
            formData.append('MemberID', this.memberId);
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            if(this.list[index].SonList[i].Check == true){
                this.$axios.delete('/TeamAuthority',{data: formData},config).then(result => {
                    console.log(11)
                    if(result.data.Status == 'Success'){
                        this.$message(result.data.Message)
                        this.list[index].SonList[i].Check = false
                    }else{
                        this.$message(result.data.Message)
                    }
                })
                return
            }else{
                this.$axios.post('/TeamAuthority',formData,config).then(res => {
                    console.log(res)
                    if(res.data.Status == 'Success') {
                        this.$message(res.data.Message)
                        this.list[index].SonList[i].Check = true
                        
                    }else{
                        this.$message(res.data.Message)
                    }
                })
            }
        },
    },
    mounted() {
        this.getMembers()
    },
    computed: {
        identity() {
            if(sessionStorage.getItem('identity') === 'Creater'){
                return true
            }else if(sessionStorage.getItem('identity') === 'Member'){
                return false
            }else{
                return
            }
        },
        userName() {
            return localStorage.getItem('userName')
        }
    }
}
</script>

<style lang="scss" scoped>

#member{
    width: 100%;
    padding: 45px 0;
    user-select: none;
}
.member{
    // min-width: 960px;
    margin: 0 auto;
    .header{
        background:rgba(255,255,255,1);
        box-shadow:0px 0px 20px 1px rgba(203,211,217,0.3);
        border-radius:10px;
        padding: 20px;
        line-height: 37px;
        display: flex;
        justify-content: space-between;
        font-size:16px;
        font-family:MicrosoftYaHei;
        font-weight:400;
        color:rgba(51,51,51,1);
        .add-member-btn{
            background: $color;
            border-radius: 21px;
            text-align: center;
            color: rgba(255,255,255,1);
            padding: 0 22px 0 23px;
            cursor: pointer;
            &:hover{
                background: #0893ff;
            }
        }
    }
}

// 添加成员弹框
.member /deep/ .header .el-dialog{
    width: 630px;
    height: 404px;
    border-radius: 10px;
    text-align: center;
    .el-dialog__header{
        font-size:23px;
        padding-top: 11px;
    }
    .el-dialog__body{
        padding: 28px 59px 41px 58px;
    }
}


.member /deep/ .el-table{
    // min-width: 960px;
    height:807px;
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 20px 1px rgba(203,211,217,0.3);
    border-radius:10px;
    margin-top: 37px;
}
.member /deep/ .el-table .cell{
    text-align: center;
    font-weight:400;
    font-family:MicrosoftYaHei;
    line-height: none;
}
.member /deep/ .el-table th{
    color: rgba(102,102,102,1);
    font-size:16px;
}
.member /deep/ .el-table td .cell{
    font-size:14px;
    color:rgba(51,51,51,1);
    user-select: none;
}
.member /deep/ .el-table td{
    padding: 8px 0;
}

.avatar{
    width:47px;
    height:47px;
    border-radius:50%;
}
.manage{
    width: 186px;
    display: flex;
    line-height: 32px;
    cursor: pointer;
    margin: 0 auto;
    .remove-btn{
        border:1px solid rgba(210,210,210,1);
        border-radius:5px;
        padding: 0 9px;
        margin-right: 21px;
        img{
            vertical-align: middle;
        }
    }
    .identity-btn{
        background:rgba(243,152,0,1);
        border-radius:5px;
        font-size:14px;
        font-family:MicrosoftYaHei;
        font-weight:400;
        color:rgba(255,255,255,1);
        text-align: center;
        padding: 0 13px;
    }
}
// 权限设置弹框
.member /deep/ .manage .el-dialog{
    width: 630px;
    border-radius:10px;
    text-align: center;
    .authority{
        background:rgba(236,236,236,1);
        border-radius:5px;
        margin-bottom: 12px;
        text-align: left;
        padding: 17px 0 16px 20px;
        line-height: 28px;
        div:first-child{
            font-size: 16px;
        }
        .check-item{
            display: inline-block;
            margin-right: 63px; 
            img{
                vertical-align: middle;
                margin-right: 10px;
            }
        }
    }
    .el-dialog__body{
        padding: 25px 38px 35px 37px;
    }
    .footer{
        width: 179px;
        background: $color;
        border-radius: 5px;
        line-height: 48px;
        margin: 23px auto 7px;
        font-size: 18px;
        font-family: MicrosoftYaHei;
        font-weight: 400;
        color:rgba(254,254,254,1);
        cursor: pointer;
        &:hover{
            background: #0893ff;
        }
    }
}

// 弹出框关闭按钮样式
.member /deep/ .el-dialog .el-dialog__header{
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

// 成员表格样式
.member /deep/ .el-table .warning-row {
    background:rgba(238,238,238,1);
}
.member /deep/ .el-table .el-table__body .el-table__row:hover>td{
    background: none;
}
</style>
