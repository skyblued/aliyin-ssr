<template>
    <div class="message-list">
        <p @click="handleJump">
            <span>【更新】阿里印2.9.6版本更新：更方便的筛选，更快的播放<i></i></span>
            <span>2019-1-12 12:20</span>
        </p>
        <p>
            <span>【更新】阿里印2.9.5版本更新：更方便的筛选<i></i></span>
            <span>2019-1-12 12:20</span>
        </p>
        <p>
            <span>【更新】阿里印限时会员优惠卷</span>
            <span>2019-1-12 12:20</span>
        </p>
        <p>
            <span>2019阿里印开工大吉，系统全面升级啦~</span>
            <span>2019-1-12 12:20</span>
        </p>
        <p>
            <span>【更新】阿里印2.9.6版本更新：更方便的筛选，更快的播放</span>
            <span>2019-1-12 12:20</span>
        </p>
        <p>
            <span>【更新】阿里印限时会员优惠卷</span>
            <span>2019-1-12 12:20</span>
        </p>
    </div>
</template>

<script>
export default {
    methods: {
        handleJump() {
            this.$emit('setMessage','MessageDetail')
        }
    }
}
</script>

<style lang="scss" scoped>

.message-list p{
        width: 888px;
        padding: 26px 0;
        border-bottom: 1px solid rgba(191,191,191,.2);
        cursor: pointer;
        span{
            display: block;
        }
        span:first-child{
            font-size:16px;
            color:rgba(51,51,51,1);
            margin-bottom: 7px;
        }
        i{
            display: inline-block;
            width:7px;
            height:7px;
            background:rgba(230,0,18,1);
            border-radius:50%;
            margin-left: 13px;
        }
        span:last-child{
            font-size:14px;
            color:rgba(153,153,153,1);
        }
        &:hover span{
            color: $color;
        }
    }
</style>
