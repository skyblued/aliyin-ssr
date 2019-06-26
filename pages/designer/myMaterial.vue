<template>
    <div id="my-material">
        <div class="my-material">
            <div class="material-header">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="素材类型 : " class="select">
                        <el-select v-model="formInline.type" style="width: 98px;" @change="handleChooseType" placeholder="全部">
                            <el-option label="全部类型" value=""></el-option>
                            <el-option v-for="(item,index) in materialTypeList" :key="index" :label="item.TypeName" :value="item.Num"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="素材分类 : " class="select" v-if="materialClassList.length">
                        <el-select v-model="formInline.classify" style="width: 98px;" @change="handleChooseClassify" placeholder="全部">
                            <el-option label="全部分类" value=""></el-option>
                            <el-option v-for="(item,index) in materialClassList" :key="index" :label="item.TypeCategoryName" :value="item.Num"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="提交状态 : " class="select">
                        <el-select v-model="formInline.value1" style="width: 80px;" @change="handleChange1" placeholder="全部">
                            <el-option v-for="(item,index) in submitStateList" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="审核状态 : " class="select">
                        <el-select v-model="formInline.value2" style="width: 80px;" @change="handleChange2" placeholder="全部">
                            <el-option v-for="(item,index) in examineStateList" :key="index" :label="item.label" :value="item.value" :disabled="disabled"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="设计时间 : " class="form-item">
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
                </el-form>
                <div class="screen" @click="handleScreen">筛选</div>
                <div class="add-material-btn" @click="handleOpenAdd">添加素材</div>
                <el-dialog
                    title="上传素材"
                    :visible.sync="dialogMaterialVisible"
                    :lock-scroll="false"
                    :show-close="false"
                    :modal-append-to-body="false"
                    :close-on-click-modal="false">
                    <div class="form">
                        <el-form :model="form" class="demo-form-inline">
                            <el-form-item label="素材类型: " class="form-item">
                                <el-select v-model="form.type" placeholder="选择素材类型" @change="handleChangeType">
                                    <el-option v-for="(item,i) in materialTypeList" :key="i" :label="item.TypeName" :value="item.Num"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="素材分类: " class="form-item">
                                <el-select v-model="form.classify" placeholder="选择素材分类" @focus="getMaterialClass(form.type)" @change="handleChangeClassify">
                                    <el-option v-for="(item,i) in materialClassList" :key="i" :label="item.TypeCategoryName" :value="item.Num"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="关键词: " class="keyword">
                                <el-input class="input" v-model="form.keyword" placeholder="请输入关键词用顿号“、”隔开"></el-input>
                            </el-form-item>
                            <el-form-item label="素材文件: ">
                                <el-upload
                                    ref="upload"
                                    drag
                                    :action="$store.state.port.netServer + '/UploadToOSS'"
                                    :on-preview="handlePreview"
                                    :on-remove="handleRemove"
                                    :onSuccess="uploadSuccess"
                                    :onError="uploadError"
                                    list-type="picture-card"
                                    :headers="myHeader"
                                    :before-upload="beforeAvatarUpload">
                                    <img class="el-icon-upload" src="/img/home/add_big_icon.png" alt="">
                                </el-upload>
                                <el-dialog :visible.sync="dialogVisible" :append-to-body="true" :modal="false">
                                    <img width="100%" :src="dialogImageUrl" alt="">
                                </el-dialog>                      
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="close-btn" style="right: -55px;top: 8px;" @click="dialogMaterialVisible = false"></div>
                    <div class="footer">
                        <el-button class="sure-btn" @click="handleUpload">确定上传</el-button>
                        <el-button @click="dialogMaterialVisible = false">取消</el-button>
                    </div>
                </el-dialog>
            </div>
            <el-table
                v-loading="loading"
                :data="tableData"
                :row-class-name="tableRowClassName"
                @selection-change="handleSelectionChange">
                <el-table-column
                    min-width="78">
                    <template slot="header" slot-scope="scope">
                        <el-checkbox :indeterminate="isIndeterminate" :label="scope.row" v-model="checkAll" @change="handleCheckAllChange">编号</el-checkbox>
                    </template>
                    <template slot-scope="scope">
                        <el-checkbox-group v-model="checkedList" @change="handleCheckedListChange">
                            <el-checkbox :label="scope.row.id">{{scope.row.num}}</el-checkbox>
                        </el-checkbox-group>
                    </template>
                </el-table-column>
                <el-table-column
                    label="缩略图"
                    min-width="127">
                    <template slot-scope="scope">
                        <!-- <img :src="$store.state.port.imgBaseUrl+scope.row.thumb" alt="" style="width: 100px;height: 100px;"> -->
                        <div class="material-thumb" :style="{'background-image': `url(${$store.state.port.imgBaseUrl+scope.row.thumb})`}"></div>
                    </template>
                </el-table-column>
                <!-- <el-table-column
                    prop="name"
                    label="素材名称"
                    width="126">
                </el-table-column> -->
                <el-table-column
                    label="素材格式"
                    min-width="87">
                    <template slot-scope="scope">
                        <span class="format" v-if="scope.row.format == ''">图片</span>
                        <span class="format" v-else>SVG</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="素材类型"
                    min-width="87">
                    <template slot-scope="scope"><span class="type">{{scope.row.type}}</span></template>
                </el-table-column>
                <el-table-column
                    label="素材分类"
                    min-width="87">
                    <template slot-scope="scope"><span class="classify">{{scope.row.classify}}</span></template>
                </el-table-column>
                <el-table-column
                    label="关键词"
                    min-width="106">
                    <template slot-scope="scope"><span class="material-keyword">{{scope.row.keyword}}</span></template>
                </el-table-column>
                <el-table-column
                    label="上传时间"
                    width="107">
                    <template slot-scope="scope"><p class="uploaddate">{{scope.row.uploaddate}}</p></template>
                </el-table-column>
                <el-table-column
                    label="提交状态"
                    min-width="87">
                    <template slot-scope="scope">
                        <span class="substate" v-if="scope.row.state == 2 " style="color: rgba(51,51,51,1)">未提交</span>
                        <span class="substate" v-else style="color: rgba(34,204,118,1)">已提交</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="提交时间"
                    width="107">
                    <template slot-scope="scope">
                        <p class="subtime" v-if="scope.row.submitdate">{{scope.row.submitdate.split('T').join(' ')}}</p>
                    </template>
                </el-table-column>
                <el-table-column
                    label="审核状态"
                    width="106">
                        <template slot-scope="scope">
                            <p class="audstate" v-if="scope.row.state == 0" style="color: rgba(51,51,51,1)">待审核</p>
                            <p class="audstate" v-if="scope.row.state == 1" style="color: rgba(34,204,118,1)">审核通过</p>
                            <p class="audstate" v-if="scope.row.state == -1" style="color: rgba(255,87,87,1)">
                                审核未通过
                                <span style="color: rgba(51,51,51,1);display:block;">{{scope.row.refuse}}</span>
                            </p>
                        </template>
                </el-table-column>
                <el-table-column
                    label="审核时间"
                    width="107">
                    <template slot-scope="scope">
                        <p class="audtime" v-if="scope.row.auditingdate">{{scope.row.auditingdate.split('T').join(' ')}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="success" v-if="scope.row.state == 2 || scope.row.state == -1" @click="handleOpenSubmit(scope.row)">提交</el-button>
                        <el-dialog
                            title="提交素材"
                            :visible.sync="dialogSubmit"
                            @close="handleCloseDialog"
                            :lock-scroll="false"
                            :show-close="false"
                            :modal-append-to-body="false"
                            :close-on-click-modal="false">
                            <el-form :model="form" class="demo-form-inline">
                                <el-form-item label="素材类型: " class="form-item">
                                    <el-select v-model="form.type" placeholder="选择素材类型" @change="handleChangeType">
                                        <el-option v-for="(item,i) in materialTypeList" :key="i" :label="item.TypeName" :value="item.Num"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="素材分类: " class="form-item"> 
                                    <el-select v-model="form.classify" placeholder="选择素材分类" @focus="getMaterialClass(form.type)" @change="handleChangeClassify">
                                        <el-option v-for="(item,i) in materialClassList" :key="i" :label="item.TypeCategoryName" :value="item.Num"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="关键词: " class="keyword">
                                    <el-input class="input" v-model="keyword" placeholder="请输入关键词用顿号“、”隔开"></el-input>
                                </el-form-item>
                            </el-form>
                            <div class="close-btn" style="right: -55px;top: 8px;" @click="dialogSubmit = false"></div>
                            <div class="footer">
                                <el-button class="sure-btn" @click="handleSubmit">确定提交</el-button>
                                <el-button @click="dialogSubmit = false">取消</el-button>
                            </div>
                        </el-dialog>
                        <el-button type="danger" v-if="scope.row.state == 2 || scope.row.state == -1" @click="handleDelete(scope.row.id,scope.row.num)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block" v-if="tableData.length && page.totalRecords > 18">
                <HomePagination :Page="page" @getTempList="getMaterialList" />
            </div>
        </div>
    </div>
</template>

<script>
import HomePagination from '@/components/home/HomePagination.vue'
export default {
    data () {
        return {
            formInline: {
                type: '',
                classify: '',
                value1: '0',
                value2: '',
                //date: ''
                startTime: '',
                endTime: ''
            },
            form: {
                type: '',
                classify: '',
                keyword: ''
            },
            keyword: '',
            // 提交状态分类
            submitStateList: [{
                value: '0',
                label: '全部'
            },{
                value: '-1',
                label: '未提交'
            },{
                value: '1',
                label: '已提交'
            }], 
            // 审核状态分类
            examineStateList: [{
                value: '',
                label: '全部'
            },{
                value: '0',
                label: '待审核'
            },{
                value: '1',
                label: '通过'
            },{
                value: '2',
                label: '未通过'
            }],
            disabled: false,
            startTime: '',
            endTime: '',
            substate: '',
            audstate: '',
            tableData: [],   // 素材列表
            multipleSelection: [],
            dialogMaterialVisible: false,   // 添加素材弹出框
            dialogImageUrl: '',    // 预览上传图片地址
            dialogVisible: false,  // 预览上传图片弹出框
            dialogSubmit: false,   // 提交素材弹出框
            imgUrl: '',
            content: '',
            materialClassList: [],    // 素材分类列表
            materialTypeList: [],     // 素材类型列表
            page: {
                currentPage: 1,  // 当前页
                totalRecords: 0,   // 总条数
                pageSize: 10,    // 每页个数
            },
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
            checkAll: false,
            checkedList: [],
            isIndeterminate: true,
            checkedId: [],
            materialNum: '',    // 提交素材时的素材编号
            success: false,
            loading: true,   // 加载动画
            classify: '',
            type: '',
            list: []
        }
    },
    methods: {
        handleCheckAllChange(val) {
            console.log(val)
            this.checkedList = val ? this.checkedId : []
            this.isIndeterminate = false;
        },
        handleCheckedListChange(value) {
            let checkedCount = value.length
            this.checkAll = checkedCount === this.checkedId.length
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkedId.length
        },

        // 全选
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        tableRowClassName({row, rowIndex}) {
            if (rowIndex%2 == 0) {
                return 'warning-row';
            }
            return '';
        },

        // 关闭提交素材弹框
        handleCloseDialog() {
            this.form = {}
            this.type = ''
        },

        handleChange(val) {
            console.log(val)
        },

        // 获取素材类型列表
        getMaterialType() {
            this.$axios.get(this.$store.state.port.MaterialTypes).then(res => {
                // console.log(res.data)
                this.materialTypeList = res.data
            })
        },
        // 获取素材分类列表
        getMaterialClass(num) {
            if(!num) return this.$message.warning('请先选择素材类型')
            if(this.type){
                console.log(this.type, 123)
                num = this.type
            }
            console.log(num, 456)
            this.$axios.get(this.$store.state.port.MaterialCategories+'?TypeNum='+num).then(res => {
                //console.log(res.data)
                this.materialClassList = res.data
                var i = 0
                if(this.materialClassList.length>0){
                    for(var j=0;j<this.materialClassList.length;j++) {
                        if(this.materialClassList[j].TypeCategoryName == this.form.classify){
                            i = j
                        }
                    }
                    this.classify = this.materialClassList[i].Num
                }
            })
        },

        // 打开提交素材弹框
        handleOpenSubmit(row) {
            this.dialogSubmit = true
            if(row.keyword){
                this.keyword = row.keyword
            }else{
                this.keyword = ''
            }
            this.materialNum = row.num
            this.form.classify = row.classify
            this.form.type = row.type
            var index = 0
            for(var i=0;i<this.materialTypeList.length;i++) {
                if(this.materialTypeList[i].TypeName == row.type){
                    index = i
                }
            }
            this.type = this.materialTypeList[index].Num
            this.getMaterialClass(this.type)
        },
        handleChangeType(val) {
            this.type = val
            this.form.classify = ''
        },
        handleChangeClassify(val) {
            this.classify = val
        },
        // 提交素材
        handleSubmit() {
            if(this.form.keyword){
                this.keyword = this.form.keyword
            }
            if(this.keyword){
                var formData = new FormData()
                formData.append('MaterialNum', this.materialNum)
                formData.append('TypeNum', this.type)
                formData.append('TypeCategoryNum', this.classify)
                formData.append('KeyWords', this.keyword)
                let config = {
                    headers:{'Content-Type': 'multipart/form-data'}
                }
                console.log(this.materialNum,this.type,this.classify,this.keyword)
                this.$axios.post('/DesignerSubmitMaterial', formData, config).then(res => {
                    console.log(res.data)
                    if(res.data == true){
                        this.$message({type: 'success', message: '提交成功,等待审核'})
                        this.dialogSubmit = false
                        this.getMaterialList()
                        this.form = {}
                    }else{
                        this.$message({type: 'error', message: '提交失败,请重新提交'})
                        return
                    }
                })
            }else{
                this.$message({type: 'warning', message: '请输入素材关键字'})
                return
            }
        },
        beforeAvatarUpload(file) {  
            if(this.form.type == '' && this.form.classify == '' && this.form.keyword == ''){
                this.$message({type: 'error', message: '请先选择素材类型和分类'})
                return false
            }
            const isLt2M = file.size <  1024 * 1024 * 20;
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 20MB!');
            }
            return isLt2M;

        },
        uploadSuccess (response, file, fileList) {
            console.log('上传文件', response)
            if(response.status == 'ok'){
                this.success = true
                this.imgUrl = response.key
                this.content = response.content || ''
                return
            }
        },
        uploadError (response, file, fileList) {
            console.log('上传失败，请重试！',response)
            
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
            this.dialogImageUrl = file.url
            this.dialogVisible = true
        },
        // 打开添加素材弹框
        handleOpenAdd() {
            this.dialogMaterialVisible = true
            this.form.type = ''
            this.form.classify = ''
            //this.formInline = {}
        },
        handleUpload() {
            this.formInline.startTime = ''
            this.formInline.endTime = ''
            if(!this.form.keyword){
                this.$message({type: 'warning', message: '请填写素材关键词'})
                return
            }
            if(this.success){
                var param = {
                    'SvgContent':this.content,
                    'TypeNum':this.form.type,
                    'TypeCategoryNum':this.form.classify,
                    'KeyWords':this.form.keyword,
                    'FilePath':this.imgUrl
                }
                let config = {
                    headers:{'Content-Type': 'application/json'}
                }
                this.$axios.post('/DesignerMaterialEx', param, config).then(res =>{
                    console.log(res.data)
                    if(res.data != 0){
                        this.materialNum = res.data
                        this.handleSubmit()
                        this.form = {}
                    }
                })
                this.dialogMaterialVisible = false
                this.$refs.upload.clearFiles()
            }else{
                this.dialogMaterialVisible = true
                this.$message({type: 'warning', message: '请先上传素材'})
                return
            }
        },
        handleChooseType(val) {
            this.formInline.classify = ''
            if(val == ''){
                this.materialClassList = []
            }else{
                this.getMaterialClass(val)
            }
        },
        handleChooseClassify(val) {

        },
        handleChange1(val) {
            this.formInline.value2 = ''
            this.substate = val
            if(val == '-1'){
                this.disabled = true
                this.formInline.value2 = ''
            }else{
                this.disabled = false
                this.audstate = ''
            }
        },
        handleChange2(val) {
            this.audstate = val
            if(val != ''){
                this.formInline.value1 = '1'
                this.substate = '1'
            }
        },

        // 筛选
        handleScreen() {
            console.log('筛选')
            this.tableData = []
            if((this.formInline.startTime == '' && this.formInline.endTime == '') || (this.formInline.startTime == null && this.formInline.endTime == null)){
                this.startTime = ''
                this.endTime = ''
            }else{
                this.startTime = this.formInline.startTime
                this.endTime = this.formInline.endTime
            }
            this.substate = this.substate || '0'
            var url = '/DesignerMaterials?pageIndex=' + this.page.currentPage + '&SubStatus=' + this.substate + '&AudStatus=' + this.audstate + '&StarTime=' + this.startTime + '&EndTime=' + this.endTime + '&TypeNum=' + this.formInline.type + '&TypeCateNum=' + this.formInline.classify + '&Keywords=' + ''
            this.$axios.get(url).then(res =>{
                this.loading = false
                var data;
                if(res.data == '暂无数据'){
                    data = []
                }else{
                    data = JSON.parse(res.data).Data
                    var pagedata = JSON.parse(res.data)['X-Pagination']
                    this.page.totalRecords = pagedata.TotalCount
                    this.page.pageSize = Math.ceil(pagedata.TotalCount / pagedata.TotalPages)
                }
                var list = []
                for(var i =0;i<data.length;i++){
                    var obj = {}
                    obj.id = data[i].ID
                    obj.thumb = data[i].FilePath
                    obj.format = data[i].Svgtext
                    obj.type = data[i].TypeName
                    obj.classify = data[i].TypeCategoryName
                    obj.keyword = data[i].KeyWords
                    obj.uploaddate = data[i].AddTime.split('T').join(' ')
                    obj.state = data[i].Status
                    obj.submitdate = data[i].SubTime
                    obj.auditingdate = data[i].AudTime
                    obj.num = data[i].Num
                    list[i] = obj
                }
                this.tableData = list
                //console.log(this.tableData)
                for (let i = 0; i < this.tableData.length; i++) {
                    this.checkedId.push(this.tableData[i].id)
                    this.multipleSelection = this.checkedId
                }
            })
        },
        // 获取设计师素材列表
        getMaterialList() {
            this.tableData = []
            var url = '/DesignerMaterials?pageIndex=' + this.page.currentPage + '&SubStatus=' + this.formInline.value1 + '&AudStatus=' + this.formInline.value2 + '&StarTime=' + this.startTime + '&EndTime=' + this.endTime + '&TypeNum=' + this.formInline.type + '&TypeCateNum=' + this.formInline.classify + '&Keywords=' + ''
            this.$axios.get(url).then(res => {
                console.log(JSON.parse(res.data))
                //this.loading = false
                var data;
                if(res.data == '暂无数据'){
                    data = []
                }else{
                    this.loading = false
                    data = JSON.parse(res.data).Data
                    var pagedata = JSON.parse(res.data)['X-Pagination']
                    this.page.totalRecords = pagedata.TotalCount
                    this.page.pageSize = Math.ceil(pagedata.TotalCount / pagedata.TotalPages)
                }
                var list = []
                for(var i =0;i<data.length;i++){
                    var obj = {}
                    obj.id = data[i].ID
                    obj.thumb = data[i].FilePath
                    obj.format = data[i].Svgtext
                    obj.type = data[i].TypeName
                    obj.classify = data[i].TypeCategoryName
                    obj.keyword = data[i].KeyWords
                    obj.uploaddate = data[i].AddTime.split('T').join(' ')
                    obj.state = data[i].Status
                    obj.submitdate = data[i].SubTime
                    obj.auditingdate = data[i].AudTime
                    obj.refuse = data[i].RefuseRemark
                    obj.num = data[i].Num
                    list[i] = obj
                }
                this.tableData = list
                //console.log(this.tableData)
                for (let i = 0; i < this.tableData.length; i++) {
                    this.checkedId.push(this.tableData[i].id)
                    this.multipleSelection = this.checkedId
                }
            })
        },
        // 删除素材
        handleDelete(id,num) {
            this.$confirm('是否删除该素材?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                lockScroll: false
            }).then(() => {
                var formData = new FormData(); 
                formData.append("Id", id);
                formData.append("MaterialNum", num);
                this.$axios.delete('/DesignerMaterial',{data: formData}).then(res => {
                    // console.log(res)
                    if(res.data = 'success') {
                        this.$message({type: 'success',message: '删除成功!'});
                        this.getMaterialList()
                        this.page.totalRecords = this.page.totalRecords - 1
                    }
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消删除'
                });          
            });
        },
    },
    mounted() {
        this.getMaterialList()
        this.getMaterialType()
    },
    computed: {
        // paramsData: function() {
        //     let params = {
        //         TypeNum: this.form.type,
        //         TypeCategoryNum: this.form.classify,
        //         KeyWords: this.form.keyword
        //     }
        //     return params
        // },
        myHeader() {
            return {
                "token": this.$cookies.get('token')
            }
        }
    },
    components: {
        HomePagination
    }
}
</script>

<style lang="scss">

#my-material{
    width: 100%;
   // min-width: 1200px;
    margin: 65px auto 0;
    padding: 0 65px;
    display: flex;
}

.my-material{
    width: 1500px;
    min-width: 1200px;
    margin: 0 auto;
    user-select: none;
    .el-table{
        width: 100%;
    }
}

.material-header{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 57px;
    height: 76px;
    box-shadow: 0px 0px 20px 1px rgba(203,211,217,0.3);
    border-radius: 10px;
    background:rgba(254,254,254,1);
    padding: 20px 0 19px 20px;
    position: relative;
    // 搜索按钮样式
    .screen{
        background: $color;
        display: inline-block;
        height: 37px;
        line-height: 37px;
        padding: 0 12px;
        border-radius: 5px;
        color: rgba(254,254,254,1);
        cursor: pointer;
    }
    .demo-form-inline .el-form-item{
        margin-right: 24px;
        height: 37px;
        .el-button{
            height: 37px;
        }
    }
    .demo-form-inline .el-form-item:last-child{
        margin-right: 0;
    }
    .el-input__inner{
        padding: 0 10px;
        font-size: 12px;
    }
    .add-material-btn{
        background: $color;
        border-radius: 21px;
        font-size: 16px;
        font-family: MicrosoftYaHei;
        font-weight: 400;
        color:rgba(255,255,255,1);
        text-align: center;
        height: 37px;
        line-height: 37px;
        padding: 0 22px;
        cursor: pointer;
    }
}


// 素材表格样式
.my-material .el-table th .cell{
    padding: 20px 0;
}
.my-material .el-table td{
    padding: 0;
    height: 135px;
    line-height: 135px;
    .cell{
        padding: 0 10px;
        .material-thumb{
            display: inline-block;
            height: 90px;
            width: 80%;
            background-position: 50%;
            background-size: contain;
            background-repeat: no-repeat;
        }
    }
}
.my-material .el-table td:last-child .cell{
    width: 69px;
    margin: 0 auto;
    padding: 22px 0;
    .el-button{
        width: 100%;
        height: 34px;
        line-height: 34px;
        margin: 5px 0;
        padding: 0;
    }
}

.my-material .el-table .el-table__body .el-table__row td{
    border-right: 1px solid rgba(255,255,255,1);
    color: rgba(51,51,51,1);
}
.my-material .el-table .el-table__body .el-table__row td:last-child{
    border-right: 0;
}

// 弹出框关闭按钮样式
.my-material .el-dialog{
    width: 33%;
    min-width: 630px;
    border-radius:10px;
    text-align: center;
    box-shadow: none;
    .el-dialog__header{
        padding: 25px 20px 0;
        line-height: 21px;
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
}

.my-material .el-dialog{
    .el-dialog__body{
        padding: 31px 58px 57px;
        .el-form-item{
            display: flex;
            width: 100%;
        }
        .form-item .el-select{
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
        }
        .el-form-item, .el-input__inner, .el-form-item__label, .el-form-item__content{
            height: 48px;
            line-height: 48px;
            .el-input{
                width: 416px;
            }
            .input{
                margin-left: 14px;
            }
            .el-form-item__label{
                margin-right: 24px;
            }
            .el-upload-dragger, .el-upload--picture-card{
                width:98px;
                height:98px;
                line-height: 132px;
                background:rgba(236,236,236,1);
                border: none;
                .el-icon-upload{
                    margin: 0;
                }
            }
            .el-upload-list__item{
                width: 98px;
                height: 98px;
            }
        }
        .keyword .el-form-item__label{
            margin-left: 14px;
            margin-right: 10px;
        }
        .form{
            height: 317px;
        }
        .demo-form-inline .el-form-item__content .el-input{
            height: 100%;
            .el-input__suffix-inner i::after{
                height: 20px;
            }
        }
        .footer{
            width: 389px;
            margin: 80px auto 0;
            display: flex;
            .sure-btn{
                background: $color;
                color: rgba(255,255,255,1);
            }
            .el-button{
                width: 179px;
                height: 48px !important;
            }
            .el-button+.el-button{
                margin-left: 31px;
            }
        }
    }
}

</style>
