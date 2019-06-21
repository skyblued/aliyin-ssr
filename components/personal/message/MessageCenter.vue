<template>
    <div class="message-center">
        <div class="message-title">
            <span>站内消息通知</span>
            <div class="back" @click="handleClick" v-if="sideTitle == 'MessageDetail'">
                <i class="el-icon-arrow-left"></i>返回
            </div>
        </div>
        <div class="message-content">
            <div v-if="sideTitle == 'MessageList'">
                <MessageList @setMessage="setMessage"></MessageList>
            </div>
            <div v-if="sideTitle == 'MessageDetail'">
                <MessageDetail></MessageDetail>
            </div>
        </div>
    </div>
</template>

<script>
import MessageList from '@/components/personal/message/MessageList.vue'
import MessageDetail from '@/components/personal/message/MessageDetail.vue'
export default {
    data () {
        return {
            sideTitle: 'MessageList'
        }
    },
    methods: {
        setMessage(msg) {
            this.sideTitle = msg
        },
        handleClick() {  // 返回消息列表
            this.sideTitle = 'MessageList'
        }
    },
    computed: {
        value() {
            return this.$route.fullPath
        }
    },
    components: {
        MessageList,
        MessageDetail
    }
}
</script>

<style lang="scss" scoped>

.message-center{
    padding: 70px 0 0 97px;
    background: rgba(255,255,255,1);
    font-family:MicrosoftYaHei;
    font-weight:400;
    user-select: none;
    height: 100%;
    .message-title{
        width: 888px;
        display: flex;
        justify-content: space-between;
        font-size:18px;
        color:rgba(51,51,51,1);
        padding-bottom: 24px;
        border-bottom: 1px solid rgba(191,191,191,.2);
        .back{
            font-size:16px;
            color:rgba(153,153,153,1);
            cursor: pointer;
        }
    }
}
</style>
