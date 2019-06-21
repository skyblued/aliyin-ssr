<template>
    <div id="team-detail">
        <div class="team-detail">
            <div class="team-header">
                <div class="team-tabs">
                    <div class="team-tab" @click="handleToggle('TeamInfo')">
                        <span :class="asideTitle == 'TeamInfo' ? 'active' : ''">团队信息</span>
                        <i v-if="asideTitle == 'TeamInfo'"></i>
                    </div>
                    <div class="team-tab" @click="handleToggle('Member')">
                        <span :class="asideTitle == 'Member' ? 'active' : ''">团队成员</span>
                        <i v-if="asideTitle == 'Member'"></i>
                    </div>
                    <div class="team-tab" @click="handleToggle('TeamVi')">
                        <span :class="asideTitle == 'TeamVi' ? 'active' : ''">团队VI</span>
                        <i v-if="asideTitle == 'TeamVi'"></i>
                    </div>
                    <div class="team-tab" @click="handleToggle('TeamTemplet')">
                        <span :class="asideTitle == 'TeamTemplet' ? 'active' : ''">团队模板</span>
                        <i v-if="asideTitle == 'TeamTemplet'"></i>
                    </div>
                    <div class="team-tab" @click="handleToggle('Material')">
                        <span :class="asideTitle == 'Material' ? 'active' : ''">团队素材</span>
                        <i v-if="asideTitle == 'Material'"></i>
                    </div>
                </div>
                <div v-if="asideTitle == 'Member'" class="add-member-btn" @click="dialogAddVisible = true">添加成员</div>
                <el-dialog :visible.sync="dialogAddVisible" :close-on-click-modal="false" title="添加成员">
                    <AddMember></AddMember>
                </el-dialog>
            </div>

            <div class="team-content">
                <div v-if="asideTitle == 'TeamInfo'">
                    <TeamInfo></TeamInfo>
                </div>
                <div v-if="asideTitle == 'Member'">
                    <Member></Member>
                </div>
                <div v-if="asideTitle == 'TeamVi'">
                    <TeamVi></TeamVi>
                </div>
                <div v-if="asideTitle == 'TeamTemplet'">
                    <TeamTemplet></TeamTemplet>
                </div>
                <div v-if="asideTitle == 'Material'">
                    <Material></Material>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TeamInfo from '@/components/personal/teamDetail/TeamInfo.vue'
import Member from '@/components/personal/teamDetail/Member.vue'
import TeamVi from '@/components/personal/teamDetail/TeamVI.vue'
import TeamTemplet from '@/components/personal/teamDetail/Templet.vue'
import Material from '@/components/personal/teamDetail/Material.vue'
import AddMember from '@/components/personal/teamDetail/AddMember.vue'
export default {
    data () {
        return {
            asideTitle: 'TeamInfo',
            dialogAddVisible: false
        }
    },
    methods: {
        // 切换团队设置
        handleToggle(title) {
            this.asideTitle = title
        },
    },
    components: {
        TeamInfo,
        Member,
        TeamVi,
        TeamTemplet,
        Material,
        AddMember
    }
}
</script>

<style lang="scss" scoped>

#team-detail{
    width: 100%;
    padding: 45px 63px;
    user-select: none;
}
.team-detail{
    min-width: 1200px;
    .team-header{
        background: rgba(254,254,254,1);
        border-radius: 10px;
        box-shadow: 0px 0px 20px 1px rgba(203,211,217,0.3);
        padding: 0 28px;
        display: flex;
        justify-content: space-between;
        .add-member-btn{
            background: $color;
            border-radius: 21px;
            text-align: center;
            height: 42px;
            line-height: 42px;
            margin: 17px 0;
            color: rgba(255,255,255,1);
            padding: 0 22px 0 23px;
            cursor: pointer;
            &:hover{
                background: #0893ff;
            }
        }
        .team-tabs{
            display: flex;
            .team-tab{
                position: relative;
                height: 76px;
                width: 82px;
                text-align: center;
                line-height: 76px;
                cursor: pointer;
                color: rgba(102,102,102,1);
                margin-right: 44px;
                &:hover{
                    color: $color;
                }
                i{
                    background-image: url(/img/personal/line_icon.png);
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 4px;
                }
            }
            .active{
                color: $color;
            }
        }
    }
}

.team-detail /deep/ .team-header .el-dialog{
    width: 630px;
    text-align: center;
    border-radius: 10px;
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
                background-image: url(/img/home/fork_white.png);
                &::before{
                    content: '';
                }
            }
        }
    }
}
</style>
