<template>
    <div class="kind">
        <div class="idustry" v-if="kindList.length && typeId">
            <div class="kind-item" v-for="(item,i) in kindList" :key="i" @click="handleChange(item,i)">
                <span class="kind-item-title">{{item.Name}}: </span>
                <span class="idustry-item" v-for="(items,i) in item.FilterValues" :key="i" @click="handleChangeValue(items,i)">
                    <img v-if="items.DisplayMode == 1" :src="$store.state.port.imgBaseUrl+items.ImageUrl" alt="">
                    <span v-else :class="{'active' : !items.IsEnable ? true : false}">{{items.Name}}</span>
                    <i v-if="items.DisplayMode == 1" :class="{'el-icon-check' : !items.IsEnable ? true : false}"></i>
                </span>
            </div>
        </div>
        <div class="kind-item">
            <div class="kind-select">
                <span class="kind-item-title">排序: </span>
                <el-dropdown @command="handleCommand1" v-if="sortList.length" class="sort">
                    <p class="el-dropdown-link">
                        <span>{{sort}}</span>
                        <img :src="$store.state.port.staticPath + '/img/home/drop_down.png'" alt="">
                    </p>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :command="item" v-for="(item,i) in sortList" :key="i">{{item.title}}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div class="kind-select">
                <span class="kind-item-title">价格: </span>
                <el-dropdown @command="handleCommand2" class="price">
                    <p class="el-dropdown-link">
                        <span>{{price}}</span>
                        <img :src="$store.state.port.staticPath + '/img/home/drop_down.png'" alt="">
                    </p>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :command="item" v-for="(item,i) in priceList" :key="i">{{item.tips}}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div class="kind-select" v-if="sizeList.length && typeId">
                <span class="kind-item-title">版式: </span>
                <el-dropdown @command="handleCommand3" class="format">
                    <p class="el-dropdown-link">
                        <span>{{plate}}</span>
                        <img :src="$store.state.port.staticPath + '/img/home/drop_down.png'" alt="">
                    </p>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="全部">全部</el-dropdown-item>
                        <el-dropdown-item :command="item" v-for="(item,i) in sizeList" :key="i">{{item.Name}}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            kindList: [],
            sizeList: [], // 尺寸分类
            plate: '全部',
            price: '全部',
            sort: '热门推荐',
            sortList: [{
                value: 0,
                title: '热门推荐'
            },
            {
                value: 1,
                title: '使用最多'
            },
            {
                value: 2,
                title: '收藏最多'
            },
            {
                value: 3,
                title: '最新上传'
            }],
            priceList: [{
                value: 3,
                tips: '全部'
            },{
                value: 0,
                tips: '免费'
            },{
                value: 1,
                tips: '会员免费'
            }],
            sizeId: '',
            // sortId: '',
            // priceId: '',
            // valueId: '',   // 分类id
            obj: {
                sortId: '',
                priceId: '',
                valueId: []
            },
            size: {width: '', height: ''},
            typeId: '',
            valueIdList: []
        }
    },
    props: ['typeid'],
    methods: {
		handleCommand3(command) {  // 版式
            console.log(command)
            let id = '';
            if(command == '全部'){
                this.plate = '全部'
                this.sizeId = '' 
                id = ''
            }else{
                this.plate = command.Name
                this.sizeId = command.ID
                id = command.ID
            }
            // this.getTemplateList()
			this.size = {height: command.Height , width: command.Width}
			this.$emit('setSizeID', {id, size: this.size})
        },
        handleCommand2(command) {  // 价格
            this.price = command.tips
            if(command.value == '3'){
                this.obj.priceId = ''
            }else{
                this.obj.priceId = command.value
            }
            this.$root.$emit('setPassValue', this.obj)
            // this.priceId = command.value
            // this.getTemplateList()    
        },
        handleCommand1(command) {  // 排序
            this.sort = command.title
            this.obj.sortId = command.value
            this.$root.$emit('setPassValue', this.obj)
            // this.getTemplateList()   
        },
        // 选择场景，行业，颜色
        handleChangeValue(items,i) {
            items.IsEnable = !items.IsEnable
            if(items.IsEnable == false){
                if(this.valueIdList.indexOf(items.ValueId) == -1){
                    this.valueIdList.push(items.ValueId)
                }
            }else{
                var index = this.valueIdList.indexOf(items.ValueId)
                this.valueIdList.splice(index,1)
            }
        },
        // 选择分类
        handleChange(item,i) {
            item.FilterValues.IsEnable = !item.FilterValues.IsEnable
            this.obj.valueId = this.valueIdList.join(',')
            //console.log(this.obj.valueId, 123)
            this.$root.$emit('setPassValue', this.obj)
        },
        // 获取行业分类列表
        getKindList() {
            if(!this.typeId){
                return
            }
            var url = '/ProductTypeFilter?productTypeID=' + this.typeId;
            this.$axios.get(url).then(res => {
                //console.log(res.data)
                this.kindList = res.data
            })
            // return this.$axios.get(url)
        },
        // 获取尺寸分类
        getProductSize() {
            if(!this.typeId){
                return
            }
            var url = '/ProductTypeSize?TypeID=' + this.typeId;
            this.$axios.get(url).then(result => {
                console.log(result.data)
                if(result.data.length>0){
                    this.sizeList = result.data
                    //this.plate = result.data[0].Name
                    //this.sizeId = result.data[0].ID
                    this.sizeId = result.data[0].ID
                    this.size = {height: result.data[0].Height, width: result.data[0].Width}
                    this.$emit('setSizeID', {id: this.sizeId, size: this.size})
                }
            })
            // return this.$axios.get(url) 
        },
		// 上传sizeId
		handleClick () {
			console.log(123)
		}
    },
    mounted() {
        //this.getKindList()
        //this.getProductSize()
        this.$bus.$on('useEventBus', (msg) =>{
            this.typeId = msg
        })
        this.typeId = this.$route.query.typeId || this.typeid
    },
    watch: {
        typeId(){
            this.$nextTick(() =>{
                this.getKindList()
                this.getProductSize()
            })
        }
    }
}
</script>

<style lang="scss" scoped>

.kind{
    //width:100%;
    //height:76px;
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 20px 1px rgba(203,211,217,0.3);
    border-radius:10px;  
    margin-top: 10px;
    padding: 20px 84px 19px 20px;
    .idustry .kind-item{
        display: flex;
        justify-content: flex-start;
        margin-bottom: 10px;
    }
}
.kind .kind-item{
    width: 1100px;
    height: 37px;
    display: flex;
    .idustry-item{
        line-height: 37px;
        font-size: 14px;
        color: rgba(51,51,51,1);
        margin-right: 24px;
        cursor: pointer;
        position: relative;
        span{
            padding: 5px;
            &:hover{
                background: $color;
                border-radius: 5px;
                color: white;
            }
        }
        .active{
            background: $color;
            border-radius: 5px;
            color: white;
        }
        img{
            width: 32px;
            height: 21px;
            border-radius:3px;
            vertical-align: middle;
        }
        i{
            display: inline-block;
            width: 100%;
            line-height: 21px;
            background: rgba(0,0,0,.1);
            font-weight: bold;
            color: rgba(255,255,255,1);
            text-align: center;
            position: absolute;
            top: 10px;
            left: 0;
        }
    }
}
.kind .kind-item .kind-select{
    display: flex;
    font-size:14px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color:rgba(102,102,102,1);
    margin-right: 35px;
    .sort .el-dropdown-link span{
        margin-right: 34px;
    }
    .price .el-dropdown-link span, .format .el-dropdown-link span{
        margin-right: 25px;
    }
    img{
        vertical-align: middle;
    }
}
.kind .kind-item .kind-select .price .el-dropdown-link span{
    width: 56px;
    display: inline-block;
}


.kind .kind-item .color-system{
    width: 510px;
}
.kind .kind-item .color-system .kind-select-tips{
    line-height: 22px;
    margin-top: 9px;
    margin-bottom: 7px;
}
.kind .kind-item .color-system .kind-select-tips span{
    cursor: pointer;
    display: inline-block;
    width:32px;
    height: 21px;
    border-radius:3px;
    margin: 0 3px;
    transition: transform 1s ease;
    text-align: center;
    &:hover {
        transform: scale(1.1);
    }
    i{
        display: inline-block;
        width: 100%;
        line-height: 21px;
        background: rgba(0,0,0,.1);
        font-weight: bold;
        color: rgba(255,255,255,1);
    }
}
.kind .kind-item .color-system .kind-select-tips span:first-child{
    margin-left: 0;
}
.kind .kind-item .color-system .kind-select-tips span:last-child{
    margin-right: 0;
}
.kind .kind-item .kind-item-title{
    line-height: 15px;
    font-size:14px;
    font-family:MicrosoftYaHei;
    font-weight:bold;
    color:rgba(51,51,51,1);
    margin: 12px 20px 10px 0;
}
.kind /deep/ .el-dropdown{
    display: inline-block;
    height:37px;
    line-height: 37px;
    border:1px solid rgba(210,210,210,1);
    border-radius:5px;
    padding-left: 17px;
    padding-right: 11px;
    .el-dropdown-link{
        margin: 0;
    }
}


.kind /deep/ .el-dropdown{
    cursor: pointer;
    .el-dropdown-link img{
        transition: transform .4s ease;
    }
    &:hover .el-dropdown-link img{
        transform: rotate(180deg)
    }
}

.el-dropdown-menu{
    z-index: 9999 !important;
    position: fixed;
    padding: 0;
}
</style>
