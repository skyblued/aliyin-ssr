<template>
    <div class="submit">
		<div class="submit-content">
            <div class="submit-info">
                <div class="submit-info-item">
                    <div class="submit-info-title">模板名称: </div>
                    <div class="submit-info-content">
                        <el-input v-model="templateData.TemplateName" maxlength="20" placeholder="不得超过20个字符"></el-input>
                    </div>
                </div>
                <div class="submit-info-item" v-for="(item,i) in templateData.filters" :key="i">
                    <div class="submit-info-title">{{item.Name}}: </div>
                    <div class="submit-info-content">
                        <el-select 
                            v-model="FilterVaules[i]"
                            :multiple-limit="3"
                            multiple placeholder="至多选三个">
                            <el-option v-for="filter in item.FilterValues" :key="filter.ValueId" :label="filter.Name" :value="filter.ValueId">
                                <img v-if="filter.DisplayMode == 1" :src="$store.state.port.ossPath + filter.ImageUrl" alt="">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="submit-info-item">
                    <div class="submit-info-title">关键词标签: </div>
                    <div class="submit-info-content keyword">
                        <div style="text-align:left;line-height: 24px;">
                            <span class="keyword-list" v-for="(item,i) in templateData.Keywords" :key="i">{{item}}<i class="el-icon-circle-close" @click="handleDelKeyword(i)"></i></span>
                        </div>
                        <input ref="keyInput" placeholder="关键词之间用“enter”隔开,最少五个" @keydown.enter="setKeyword" @blur="setKeyword">
                    </div>
                </div>
                <div class="submit-info-item">
                    <div class="submit-info-title">模板介绍: </div>
                    <div class="submit-info-content">
                        <el-input type="textarea" :rows="5" maxlength="150" v-model="templateData.Content" placeholder="请简要概述"></el-input>
                    </div>
                </div>
                <!-- <el-form-item label="收入专题: " class="subject" v-if="subjectList.length">
					<el-select v-model="subject" multiple :multiple-limit= "3" placeholder="至多选三个" style="width: 100%">
						<el-option v-for="(item,i) in subjectList" :key="i" :label="item.Name" :value="item.Num"></el-option>
					</el-select>
				</el-form-item> -->
            </div>
            <div class="temp-cover">
                <span class="temp-cover-title">模板封面 : </span> 
                <el-upload
                    v-if="needFace"
                    ref="upload"
                    list-type="picture-card"
                    accept="image/*"
                    :action="$store.state.port.netServer + '/UploadToOSS'"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-success="uploadSuccess"
                    :onError="uploadError"
                    :headers="myHeader"
                    :file-list="fileList">
                    <img class="el-icon-plus" src="/img/personal/qyadd_icon.png" alt="">
                </el-upload>
                <img v-if="!needFace" width="100%" :src="$store.state.port.imgBaseUrl + templateData.FacePicture + '?v=' + new Date().getTime()" alt="" @click="isBig = !isBig" title="点击预览">
                <el-dialog :visible.sync="dialogVisible" append-to-body top="10vh">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </div>
		</div>
        <transition name="el-zoom-in-center">
            <div v-if="isBig" class="big-image" @click="isBig = false" title="点击收起">
                <img :src="$store.state.port.imgBaseUrl + templateData.FacePicture + '?v=' + new Date().getTime()" alt="">
            </div>
        </transition>
        <div class="submit-btn">
            <div class="btn" @click="submitForm">提交审核</div>
            <div class="btn" @click="closeDialog">继续编辑</div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            templateData: {
				FilterVaules: null,//属性实际ID,逗号隔开
				StrThematic: '',//所属专题
				Keywords: [],//关键词
				Content: null,//内容
				TemplateName: null,//模板名称 
				FacePicture: null,//封面
				TemplateNumber: null, //模板编号
                filters: [],
            },  // 模板数据
            typeId: '',
            FilterVaules: [], // 分类选择
            dialogImageUrl: '',
            dialogVisible: false,
            filters: [],
            subjectList: [],
            show: false,
            isSubmit: true, // 是否提交过
            needFace: true,  // 是否需要封面
            isBig: false,
            fileList: [{url: ''}]
        }
    },
    props: ['tempInfo','TemplateNumber', 'ProductTypeId', 'faceImg'],
    methods: {
		closeDialog() { // 向上传递关闭
			this.$emit('toggleDialog', false)
		},
        // 输入关键词
        setKeyword() {
            let keyword = this.$refs.keyInput.value
            keyword && this.templateData.Keywords.push(keyword)
            this.$refs.keyInput.value = ''
        },
        handleDelKeyword(i) {  // 删除关键词
            this.templateData.Keywords.splice(i,1)
        },

        // 所属行业列表
        getIndustryList() {
            var url = '/ProductTypeFilter?productTypeID=' + this.ProductTypeId
            this.$axios.get(url).then(res => {
                if(res === undefined) return console.log('没有数据')
                console.log(res.data)
                this.needFace = res.data.NeedFacePic
                this.filters = res.data.FilterList
                this.templateData.filters = res.data.FilterList
                this.templateData.FacePicture = this.faceImg
                this.templateData.TemplateNumber = this.TemplateNumber
                
                this.getTemplateInfo()
            })
        },
        // 获取模板提交信息
        getTemplateInfo() {
            this.$axios.get('/DesignerSubmitTemplate?TemplateNumber=' + this.TemplateNumber)
            .then(res => {
                console.log(res.data)
                if(res.data == null) return this.$refs.upload.clearFiles()
                this.templateData.TemplateName = res.data.TemplateName
                this.templateData.TemplateNumber = res.data.TemplateNum
                this.templateData.FacePicture = res.data.FacePicture
                this.templateData.StrThematic = res.data.StrThematic
                this.templateData.Content = res.data.Contents
                this.templateData.Keywords = res.data.Keywords.split(',')
                this.templateData.filters = this.parsing(res.data)
                this.templateData.FilterVaules = this.reparsing(this.templateData.filters)
                this.fileList[0].url = this.$store.state.port.imgBaseUrl + res.data.FacePicture
            }).catch(() => {
                this.templateData.TemplateName = ''
                this.templateData.TemplateNumber = this.TemplateNumber
                this.templateData.FacePicture = this.faceImg
                this.fileList[0].url = ''
                this.templateData.StrThematic = ''
                this.templateData.Content = ''
                this.templateData.Keywords = []
                this.templateData.filters = this.filters
                console.log(this.templateData)
            })
        },


        // 收入专题列表
        getSubjectList() {
            var url = "/ThematicColumn?Visiable=" + 1 +"&IsHot="+ 1
            this.$axios.get(url).then(res => {
                //console.log(res.data)
                this.subjectList = res.data
            })
        },

        handleRemove(file, fileList) {
            // console.log(file, fileList);
        },
        handlePreview(file) {
            // console.log(file, 'sdfsd');
            if(file.response) {
                this.dialogImageUrl = file.response.url
            }else{
                this.dialogImageUrl = file.url
            }
            this.dialogVisible = true;
        },
        uploadSuccess (response, file, fileList) {
            // console.log('上传文件', response)
            this.templateData.FacePicture = response.key
        },
        uploadError (response, file, fileList) {
            // console.log('上传失败，请重试！',response)
        },

        handleprompt(message, type) { // 提示
			this.$message.closeAll();
			this.$message({message, type, customClass: 'info'});
		},
        submitForm() {
            if (!this.isSubmit) return this.handleprompt("正在处理,请稍后再试", 'warning');
            if (!this.templateData.TemplateName) return this.handleprompt('没有模板名称', 'warning');
            if (this.FilterVaules.join(',') == '') return this.handleprompt('没有选择分类信息', 'warning');
            if (!this.templateData.FacePicture) return this.handleprompt('没有上传封面', 'warning');
            if (this.templateData.Keywords.length <= 4) return this.handleprompt('关键词最少五个', 'warning');
            let arr = ['TemplateNumber', 'FacePicture', 'Content', 'TemplateName', 'Keywords', 'StrThematic'],
                formData = new FormData();
            formData.append('FilterVaules', this.FilterVaules.join(','));
            formData.append('Filters', '')
            for(let key in arr) {
				if (key == 'Keywords') {
					formData.append(arr[key], this.templateData[arr[key]].join(','))
				} else {
					formData.append(arr[key], this.templateData[arr[key]])
				}
            }
            let config = {
                headers:{'Content-Type': 'multipart/form-data'}
            }
            this.isSubmit = false;
            // let subject;
            // if(this.subject.length > 0) {
            //     subject = this.subject.join(',')
            // }else{
            //     subject = ''
            // }
			console.log(this.templateData,this.FilterVaules)
			this.$axios.post('/DesignerSubmitTemplate', formData, config)
            .then(res => {
                console.log(res.data)
                if(res.data == 'Success'){
                    this.isSubmit = true
                    this.handleprompt('提交成功,等待审核', 'success')
                    // this.$store.commit('setDialogSubmit', false)
                    this.$emit('getRecord')
                    this.$emit('toggleDialog', false)
                }
            }).catch(err => {
                this.isSubmit = true
                this.handleprompt('服务器出错, 请稍后再试')
            })
        },

        parsing(data) {
            let arr = [], filterVlaue = data.FilterValues;
            this.filters.forEach(item => {
                item.FilterValues.forEach((filter, j) => {
                    if (filterVlaue.indexOf(filter.ValueId) > -1) {
                        filter.isSelected = true
                    } else {
                        filter.isSelected = false
                    }
                })
                arr.push(item)
            })
            return arr
        },
        reparsing(data) {
            let arr = [];
            this.FilterVaules = []
            data.forEach((item, i) => {
				this.FilterVaules.push([])
				item.FilterValues.forEach(filter => {
					if (filter.isSelected) {
						arr.push(filter.ValueId)
						this.FilterVaules[i].push(filter.ValueId)
					}
                })
            })
			return arr
        }
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

<style lang="scss" scoped>
.submit{
    .submit-content{
        display: flex;
        .submit-info{
            flex: 1;
            .submit-info-item{
                display: flex;
                align-items: center;
                // width: 430px;
                padding: 10px;
                .submit-info-title{
                    width: 100px;
                    font-size: 16px;
                    text-align: right;
                    margin-right: 20px;
                }
                .submit-info-content{
                    width: 416px;
                }
            }
        }
        .temp-cover{
            flex: 1;
            text-align: center;
            padding: 10px;
            padding-left: 20px;
            width: 221px;
            position: relative;
            .temp-cover-title{
                font-size:16px;
                color:rgba(51,51,51,1);
            }
        }
    }
    .big-image{
        position: fixed;
        z-index: 2019;
        padding: 20px;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,.3);
        overflow: auto;
        img {
            display: block;
            margin:70px auto 0;
            max-width: 100%;
        }
    }
}
.submit /deep/ .el-select{
    width: 100%;
    height: 40px;
    .el-input, .el-input__inner{
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

.submit /deep/ .el-upload{
    width: 221px;
    min-height: 320px;
    background:rgba(236,236,236,1);
    border-radius:5px;
    border: 1px solid rgba(236,236,236,1);
    position: relative;
    .el-icon-plus{
        display: inline-block;
        margin-top: 126px;
    }
}
.submit /deep/ .temp-cover .el-upload-list--picture-card .el-upload-list__item{
    width: 231px;
    height: 100%;
    position: absolute;
    top: 29px;
    left: 21px;
    z-index: 1000;
    img{
        // object-fit: contain;
        width: 100%;
    }
}

.submit-btn{
	width: 100%;
    padding-top: 50px;
    padding-bottom: 0;
    text-align: center;
    .btn{
        display: inline-block;
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

.keyword{
    display: flex;
    flex-wrap: wrap;
    border: 1px solid rgba(210,210,210,1);
    border-radius: 4px;
    padding: 5px;
    .keyword-list{
        display: inline-block;
        padding: 0 5px;
        // height: 24px;
        // line-height: 24px;
        margin: 5px 5px 5px 0;
        font-size: 14px;
        background-color: #f0f2f5;
        color: #909399;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        .el-icon-circle-close{
            display: inline-block;
            margin-left: 5px;
            cursor: pointer;
        }
    }
    input{
        width: 220px;
        height: 26px;
        border: 1px solid #dcdfe6;
		border-radius: 4px;
        margin: 5px 5px 5px 0;
    }
}

</style>
