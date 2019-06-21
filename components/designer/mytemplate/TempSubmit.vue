<template>
    <div class="submit">
        <el-form :model="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="模板名称: ">
                <el-input v-model="ruleForm.name" maxlength="20" placeholder="不得超过20个字符"></el-input>
            </el-form-item>
            <el-form-item label="选择场景: " class="industry" v-if="scene.length">
                <el-select v-model="sceneList" multiple :multiple-limit= "3" placeholder="至多选三个" style="height: 40px;">
                    <el-option v-for="(items,i) in scene" :key="i" :label="items.Name" :value="items.ValueId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属行业: " class="industry" v-if="options.length">
                <el-select v-model="industryList" multiple :multiple-limit= "3" placeholder="至多选三个">
                    <el-option v-for="(items,i) in options" :key="i" :label="items.Name" :value="items.ValueId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="模板色调: " class="temp-color" v-if="colorList.length">
                <div class="temp-color-list">
                    <span v-for="(item,id) in colorList" :key="id" @click="handleColor(item,id)">
                        <img v-if="item.DisplayMode == 1" :src="$store.state.port.imgBaseUrl+item.ImageUrl" alt="">
                        <span v-else>{{item.Name}}</span>
                        <i :class="{'el-icon-check' : !item.IsEnable ? true : false}"></i>
                    </span>
                </div>
            </el-form-item>
            <el-form-item label="关键词标签: " class="keyword">
                <el-input v-model="ruleForm.keyword" placeholder="关键词之间用“enter”隔开"></el-input>
                <!-- <span class="keyword-item" v-if="show">
                    @keyup.native="handleEnter($event)"
                    <span class="keyword-tip" v-for="(item,i) in keywordList" :key="i">{{item}}</span>
                </span> -->
            </el-form-item>
            <el-form-item label="收入专题: " class="subject">
                <el-select v-model="subject" multiple :multiple-limit= "3" placeholder="至多选三个">
                    <el-option v-for="(item,i) in subjectList" :key="i" :label="item.Name" :value="item.Num"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="模板介绍: " class="desc">
                <el-input type="textarea" :rows="5" maxlength="150" v-model="ruleForm.desc" placeholder="请简要概述"></el-input>
            </el-form-item>
        </el-form>
        <div class="temp-cover">
            <span class="temp-cover-title">模板封面 : </span> 
            <el-upload
                list-type="picture-card"
                action="http://v1.yinbuting.cn/api/UploadToOSS"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="uploadSuccess"
                :onError="uploadError"
                :headers="myHeader"
                :show-file-list="true">
                <img class="el-icon-plus" src="/img/personal/qyadd_icon.png" alt="">
            </el-upload>
            <el-dialog :visible.sync="dialogVisible" :append-to-body="true" :modal="false">
                <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
            <span class="upload-tips">建议上传尺寸280*374px</span>
        </div>
        <div class="submit-btn">
            <div class="btn" @click="submitForm">提交审核</div>
            <div class="btn" @click="$store.state.dialogSubmit = false">继续编辑</div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            ruleForm: {
                name: '',
                desc: '',
                keyword: ''
            },
            industry: '至多选3个',
            dialogImageUrl: '',
            dialogVisible: false,
            scene: [],     // 获取的场景列表
            options: [],   // 获取的行业列表
            image: '/img/home/rectangle_icon.png',
            src: '/img/home/rectangle_icon_hl.png',
            industryList: [],  // 选取的行业列表
            sceneList: [],     // 选取的场景列表
            subjectList: [],   // 获取的专题列表
            subject: [],       // 选取的专题列表
            colorList: [],     // 获取的颜色列表
            color: [],         // 选取的颜色列表
            cover: '',     // 封面路径
            filters: [],
            show: false,
            //keywordList: []
        }
    },
    props: ['productId','tempNum'],
    methods: {

        // handleEnter(e) {
        //     if(e.keyCode == 13){
        //         this.keywordList.push(this.ruleForm.keyword)
        //         this.show = true
        //         this.ruleForm.keyword = ''
        //     }
        // },


        // 所属行业列表
        getIndustryList() {
            var url = '/ProductTypeFilter?productTypeID=' + this.productId
            this.$axios.get(url).then(res => {
                //console.log(res.data)
                this.filters = res.data
                for(var i=0;i<res.data.length;i++){
                    if(res.data[i].Name == '颜色'){
                        this.colorList = res.data[i].FilterValues
                    }else if(res.data[i].Name == '行业'){
                        this.options = res.data[i].FilterValues
                    }else{
                        this.scene = res.data[i].FilterValues
                    }
                }
                // this.scene = res.data[0].FilterValues
                // this.options = res.data[1].FilterValues
                // this.colorList = res.data[2].FilterValues
            })
        },


        handleColor(item,id){
            this.colorList[id].IsEnable = !this.colorList[id].IsEnable
            if(this.colorList[id].IsEnable == false){
                if(this.color.indexOf(item.ValueId) == -1){
                    this.color.push(item.ValueId)
                }
            }else{
                var index = this.color.indexOf(item.ValueId)
                this.color.splice(index,1)
            }
        },

        // 收入专题列表
        getSubjectList() {
            var url = "/ThematicColumn?Visiable=" + 1 +"&IsHot="+ 1
            this.$axios.get(url).then(res => {
                this.subjectList = res.data
                //console.log(this.subjectList)
            })
        },

        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
            this.dialogImageUrl = file.response.url;
            this.dialogVisible = true;
        },
        uploadSuccess (response, file, fileList) {
            console.log('上传文件', response)
            this.cover = response.key
            //this.uploadCover = response.key
        },
        uploadError (response, file, fileList) {
            console.log('上传失败，请重试！',response)
        },
        submitForm() {
            var color = []
            for(var i=0;i<this.color.length;i++){
                color.push(this.color[i])
            }
            var filterValues = color.concat(this.industryList,this.sceneList).join(',')

            if(this.cover && this.ruleForm && this.subject){
                let filters = []
                if(this.industryList.length>0){
                    filters.push(this.filters[1].FilterId)
                }
                if(this.color.length>0){
                    filters.push(this.filters[2].FilterId)
                }
                if(this.sceneList.length>0){
                    filters.push(this.filters[0].FilterId)
                }
                filters = filters.join(',')
                console.log(filters,123)
                var formData = new FormData()
                formData.append('TemplateNumber', this.tempNum);
                formData.append('FacePicture', this.cover);
                formData.append('Content', this.ruleForm.desc);
                formData.append('TemplateName', this.ruleForm.name);
                formData.append('Keywords', this.ruleForm.keyword);
                formData.append('StrThematic', this.subject);
                formData.append('FilterVaules', filterValues);
                formData.append('Filters', filters);
                let config = {
                    headers:{'Content-Type': 'multipart/form-data'}
                }
                this.$axios.post('/DesignerSubmitTemplate', formData, config).then(res => {
                    console.log(res.data)
                    if(res.data == 'Success'){
                        this.$message({type: 'success', message: '提交成功'})
                        this.$store.commit('setDialogSubmit', false)
                        this.$emit('getRecord')
                    }
                })
            }else{
                this.$message('请选择上传模板封面并填写模板信息')
                return
            }
        },
    },
    mounted() {
        this.getIndustryList()
        this.getSubjectList()
    },
    computed: {
        myHeader() {
            return {
                "token":window.localStorage.getItem('token')
            }
        }
    },
}
</script>

<style lang="scss">

.submit{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    user-select: none;
    .el-form{
        width: 514px;
        margin-right: 48px;
    }
    .demo-ruleForm .el-select{
        width: 100%;
        .el-input .el-input__inner{
            height: 40px !important;
            line-height: 40px;
        }
        .el-input__suffix-inner i::before{
            content: '',
        }
        .el-input__suffix-inner i::after{
            display: inline-block;
            background-image: url(/img/personal/drop_down.png);
            width: 100%;
            height: 30px; 
        }
        .el-input__suffix-inner .el-select__caret{
            transform: rotateZ(0);
        }
        .el-select__tags .el-tag{
            background:rgba(229,229,229,1);
            color: rgba(51,51,51,1);
        }
    }
    .keyword{
        position: relative;
        .keyword-item{
            display: flex;
            justify-content: space-around;
            position: absolute;
            top: 8px;
            left: 8px;
            line-height: 24px;
        }
        .keyword-tip{
            background: rgba(229,229,229,1);
            padding: 0 12px;
            border-radius: 5px;
            margin-right: 5px;
        }
    }
    .temp-color, .demo-ruleForm .temp-color .el-form-item__content, .demo-ruleForm .temp-color .el-form-item__label{
        line-height: 31px;
        height: 31px;
        .temp-color-list{ 
            display: flex;
            flex-wrap: wrap;
            height: 31px;
            text-align: left;
            img{
                line-height: 31px;
                width: 47px;
                border-radius: 3px;
            }
            span{
                display: inline-block;
                width: 47px;
                height: 31px;
                border-radius: 3px;
                cursor: pointer;
                position: relative;
                transition: transform 1s ease;
                margin-right: 11px;
                text-align: center;
                &:hover {
                    transform: scale(1.1);
                }
                i{
                    display: inline-block;
                    width: 100%;
                    line-height: 31px;
                    background: rgba(0,0,0,.1);
                    font-weight: bold;
                    color: rgba(255,255,255,1);
                    position: absolute;
                    top: 0;
                    left: 0;
                }
            }
            span:last-child{
                margin-right: 0;
            }
        }
    }
    .desc{
        .el-textarea .el-textarea__inner{
            //height: 118px;
            position: relative;
        }
        .el-form-item__error{
            top: 118px;
        }
    }
    .temp-cover{
        width: 221px;
        text-align: left;
        font-family:MicrosoftYaHei;
        font-weight:400;
        line-height:26px;
        position: relative;
        .temp-cover-title{
            font-size:16px;
            color:rgba(51,51,51,1);
        }
        .upload-tips{
            font-size: 14px;
            color:rgba(153,153,153,1);
            margin-left: 32px;
            margin-right: 33px;
        }
    }
}
.submit .temp-cover .el-upload{
    width: 100%;
    height: 319px;
    background:rgba(236,236,236,1);
    border: none;
    margin-top: 15px;
    margin-bottom: 20px;
    .el-icon-plus{
        margin-top: 124px;
    }
}
.submit .temp-cover .el-upload-list__item{
    width: 100%;
    height: 319px;
    position: absolute;
    top: 43px;
    left: 0;
}

.submit-btn{
    margin-top: 78px;
    display: flex;
    margin-left: 175px;
    .btn{
        width: 179px;
        border-radius: 5px;
        line-height: 48px;
        text-align: center;
        font-size: 18px;
        cursor: pointer;
    }
    .btn:first-child{
        background: $color;
        color: rgba(255,255,255,1);
        margin-right: 73px;
    }
    .btn:last-child{
        border:1px solid rgba(210,210,210,1);
        color:rgba(153,153,153,1);
    }
}
</style>
