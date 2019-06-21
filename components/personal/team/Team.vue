<template>
    <div id="team">
        <div class="team">
            <div class="team-top">
                <el-form :inline="true" class="team-search">
                    <el-form-item label="团队管理">
                        <el-input v-model="input" suffix-icon="el-icon-search" placeholder="请输入团队名称"></el-input>
                    </el-form-item>
                </el-form>
                <div class="create-btn" @click="dialogFormVisible = true">创建团队</div>
                <el-dialog title="创建团队" :visible.sync="dialogFormVisible" :lock-scroll="false" :close-on-click-modal="false">
                    <el-form :model="form" :rules="rules">
                        <el-form-item label="团队名称 : " prop="name" class="form-item">
                            <el-input v-model="form.name" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="团队LOGO: " class="upload-logo">
                            <el-upload
                                action="http://v1.yinbuting.cn/api/UploadToOSS"
                                list-type="picture-card"
                                :on-preview="handlePictureCardPreview"
                                :on-remove="handleRemove"
                                :headers="myHeader">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                            <span>上传团队logo</span>
                            <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
                                <img width="100%" :src="dialogImageUrl" alt="">
                            </el-dialog>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <div class="btn sure" @click="dialogFormVisible = false">确定</div>
                        <div class="btn cancel" @click="dialogFormVisible = false">取消</div>
                    </div>
                </el-dialog>
            </div>
            <div class="team-bottom">
                <el-table
                    :data="tableData"
                    :row-class-name="tableRowClassName"
                    :row-style="{height: '65px'}">
                    <el-table-column
                        prop="teamName"
                        label="团队名称">
                    </el-table-column>
                    <el-table-column
                        prop="createTime"
                        label="创建时间">
                    </el-table-column>
                    <el-table-column
                        prop="creater"
                        label="角色">
                    </el-table-column>
                    <el-table-column align="right" label="操作" width="405">
                        <template slot-scope="scope">
                            <div v-if="scope.row.creater == '创建者'" class="manage">
                                <div class="dissolve" @click="dialogDissolveVisible = true">
                                    <img :src="$store.state.port.staticPath + '/img/personal/dissolve_icon.png'" alt="">
                                    <span>解散</span>
                                </div>
                                <el-dialog :visible.sync="dialogDissolveVisible" :close-on-click-modal="false">
                                    <div class="dissolve-team">
                                        <img :src="$store.state.port.staticPath + '/img/personal/notice_icon.png'" alt="">
                                        <p>团队解散后团队数据将无法恢复，确定要<span style="color: rgba(255, 50, 50, 1);font-size: 23px;">解散</span>吗？</p>
                                    </div>
                                    <div slot="footer" class="dialog-footer">
                                        <div class="btn sure" @click="dialogDissolveVisible = false">确定解散</div>
                                        <div class="btn cancel" @click="dialogDissolveVisible = false">取消</div>
                                    </div>
                                </el-dialog>
                                <div class="manage-btn" @click="handleEdit(scope.$index, scope.row)">管理</div>
                                <el-dialog :visible.sync="dialogTeamVisible" :close-on-click-modal="false" :modal-append-to-body="false" :lock-scroll="false" title="团队管理">
                                    <el-form :model="form" :rules="rules">
                                        <el-form-item label="团队名称: " prop="teamname" class="form-item">
                                            <el-input v-model="form.teamname"></el-input>
                                        </el-form-item>
                                        <el-form-item label="团队LOGO: " class="upload-logo">
                                            <el-upload
                                                action="http://v1.yinbuting.cn/api/UploadToOSS"
                                                list-type="picture-card"
                                                :on-preview="handlePictureCardPreview"
                                                :on-remove="handleRemove"
                                                :headers="myHeader">
                                                <i class="el-icon-plus"></i>
                                            </el-upload>
                                            <span>上传团队logo</span>
                                            <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
                                                <img width="100%" :src="dialogImageUrl" alt="">
                                            </el-dialog>
                                        </el-form-item>
                                    </el-form>
                                    <div slot="footer" class="dialog-footer">
                                        <div class="btn sure" @click="dialogTeamVisible = false">确定修改</div>
                                        <div class="btn cancel" @click="dialogTeamVisible = false">取消</div>
                                    </div>
                                </el-dialog>
                            </div>
                            <div class="quit-btn" v-else>退出</div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            tableData: [],
            input: '',
            dialogFormVisible: false,    // 创建团队弹出框
            dialogTeamVisible: false,     // 管理团队弹框
            dialogDissolveVisible: false,  // 解散团队弹框
            teamname: '',
            form:{
                name: '',
                teamname: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入团队名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                teamname: [
                    { required: true, message: '请输入团队名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ]
            },
            dialogImageUrl: '',
            dialogVisible: false
        }
    },
    methods: {
        tableRowClassName({row, rowIndex}) {
            if (rowIndex%2 == 0) {
                return 'warning-row';
            }
            return '';
        },
        handleEdit(index, row) {
            console.log(row.teamName);
            this.dialogTeamVisible = true
            this.form.teamname = row.teamName
        },
        handleDelete(index, row) {
            console.log(index, row);
        },

        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        // 获取团队列表
        getTeamInfos() {
            this.$axios.post('/TeamInfos').then(res => {
                console.log(res.data)
                var teamInfo = []
                for(var i=0;i<res.data.length;i++){
                    var obj = {}
                    obj.createTime = res.data[i].CreateTime.replace('T', ' ')
                    //obj.creater = res.data[i].Creater
                    obj.creater = '创建者'
                    obj.teamName = res.data[i].TeamName
                    teamInfo[i] = obj
                }
                this.tableData = teamInfo
                //console.log(this.tableData)
            })   
        }
    },
    mounted() {
        this.getTeamInfos()
    },
    computed: {
        myHeader() {
            return {
                "token":window.localStorage.getItem('token')
            }
        }
    }
}
</script>

<style lang="scss" scoped>

#team{
    width: 100%;
    padding: 45px 63px;
    user-select: none;
}
.team{
    min-width: 1200px;
    margin: 0 auto;
    .team-top{
        background:rgba(255,255,255,1);
        box-shadow:0px 0px 20px 1px rgba(203,211,217,0.3);
        border-radius:10px;
        display: flex;
        justify-content: space-between;
        padding: 17px 28px 17px 21px;
        .team-search{
            height: 42px;
            line-height: 42px;
        }
        .create-btn{
            background: $color;
            border-radius: 21px;
            line-height: 42px;
            text-align: center;
            font-size: 16px;
            font-family: MicrosoftYaHei;
            font-weight: 400;
            color:rgba(255,255,255,1);
            cursor: pointer;
            padding: 0 23px 0 22px;
            &:hover{
                background: #0893ff;
            }
        }
    }
    .team-bottom .el-table{
        height: 807px;
        background:rgba(255,255,255,1);
        box-shadow: 0px 0px 20px 1px rgba(203,211,217,0.3);
        border-radius: 10px;
        margin-top: 37px;
        .manage{
            width: 186px;
            display: flex;
            cursor: pointer;
            margin: 0 auto;
            .dissolve{
                border:1px solid rgba(210,210,210,1);
                border-radius:5px;
                padding: 0 11px;
                margin-right: 21px;
                img{
                    vertical-align: middle;
                }
            }
            .manage-btn{
                background:rgba(243,152,0,1);
                border-radius:5px;
                font-size:14px;
                font-family:MicrosoftYaHei;
                font-weight:400;
                color:rgba(255,255,255,1);
                text-align: center;
                line-height: 34px;
                padding: 0 27px;
            }
        }
        .quit-btn{
            width: 82px;
            margin: 0 auto;
            background:rgba(255,87,87,1);
            border-radius:5px;
            font-size:14px;
            font-family:MicrosoftYaHei;
            font-weight:400;
            color:rgba(255,255,255,1);
            line-height: 34px;
            padding: 0 27px;
        }
    }
}
.team /deep/ .team-search{
    .el-form-item__label{
        float: left;
        padding-right: 35px;
    }
    .el-form-item__content{
        width: 266px
    }
}
.team /deep/ .el-form .form-item, .team /deep/ .form-item .el-form-item__label, .team /deep/ .form-item .el-form-item__content{
    height: 48px;
    line-height: 48px;
    .el-input__inner{
        height: 48px;
        line-height: 48px;
    }
}


// 团队表格样式
.team /deep/ .el-table th{
    font-size:16px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(102,102,102,1);
}
.team /deep/ .el-table td{
    font-size:14px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(51,51,51,1);
    padding: 0;
    border: 0;
    .cell{
        padding: 16px 0;
    }
}
.team /deep/ .el-table .warning-row {
    background:rgba(238,238,238,1);
}
.team /deep/ .el-table .el-table__body .el-table__row:hover>td{
    background: none;
}

.team /deep/ .team-bottom .el-table .cell{
    text-align: center;
}

// 创建团队弹出框
.team /deep/ .el-dialog{
    .el-dialog__footer{
        padding: 0 119px 43px;
        .dialog-footer{
            display: flex;
            height: 48px;
            line-height: 48px;
            text-align: center;
            .btn{
                width: 179px;
                border-radius: 5px;
                text-align: center;
                font-size: 18px;
                font-family: MicrosoftYaHei;
                font-weight: 400;
                cursor: pointer;
            }
            .sure{
                background: $color;
                color:rgba(254,254,254,1);
                margin-right: 31px;
                &:hover{
                    background: #0893ff;
                }
            }
            .cancel{
                border:1px solid rgba(210,210,210,1);
                color:rgba(153,153,153,1);
            }
        }
    }
}

.team /deep/ .el-dialog{
    width:630px;
    border-radius:10px;
    text-align: center;
    box-shadow: none;
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
            }
        }
    }
    .el-dialog__body{
        padding: 31px 59px 39px 48px;
        .el-form-item__content{
            width: 416px;
            display: inline-block;
        }
        .upload-logo{
            text-align: left;
            div{
                height: 98px;
            }
            .el-form-item__label{
                margin-right: 12px;
            }
        }
        .el-upload{
            width:98px;
            height:98px;
            background:rgba(236,236,236,1);
            border-radius:5px;
            border: none;
            line-height: 130px;
            .el-icon-plus{
                background-image: url(/img/home/add_big_icon.png);
                display: inline-block;
                width: 43px;
                height: 43px;
            }
            .el-icon-plus::before{
                content: '';
            }
        }
        span{
            font-size: 12px;
            color: rgba(102,102,102,1);
        }
        .el-upload-list__item{
            width: 98px;
            height: 98px;
        }
        i{
            color: rgba(255,255,255,1);
        }

        .dissolve-team{
            p{
                font-size:23px;
                font-family:MicrosoftYaHei-Bold;
                font-weight:bold;
                color:rgba(51,51,51,1);
                margin-top: 38px;
            }
        }
    }
}
</style>
