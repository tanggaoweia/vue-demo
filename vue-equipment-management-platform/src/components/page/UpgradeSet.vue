<template>
    <div class="commits">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 升级设置</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!--    选择member group-->
            <div class="handle-box">
                <el-select @change="memberGet" placeholder="选择成员" v-model="selectMember" class="handle-input mr10">
                    <el-option
                            :key="item.id"
                            :label="item.name"
                            :value="item.text"
                            v-for="item in memberList">
                    </el-option>
                </el-select>
                <el-select placeholder="选择组别" v-model="selectGroup" class="handle-input mr10">
                    <el-option
                            :key="item.id"
                            :label="item.name"
                            :value="item.name"
                            v-for="item in groupList">
                    </el-option>
                </el-select>
                <el-button @click="search" icon="el-icon-search" type="primary" class="mr10">搜索</el-button>
                <el-select @change="versionGet" placeholder="选择升级到的版本号" v-model="selectVersion"
                           class="handle-input mr10" filterable>
                    <el-option
                            :key="item.id"
                            :label="item.name"
                            :value="item.versionIdentification"
                            v-for="item in versionList">
                    </el-option>
                </el-select>
                <el-button type="primary" @click="upgrade" :disabled="disabled" icon="el-icon-circle-check">升级
                </el-button>
            </div>
            <!---->

            <!--       表格     -->
            <el-table :data="value" border class="table" ref="multipleTable" @selection-change="changeFun">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column fixed label="序号" width="50" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.$index + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="imei" prop="imei" show-overflow-tooltip width="350"></el-table-column>
                <el-table-column label="version" prop="version" show-overflow-tooltip width="350"></el-table-column>
                <el-table-column label="日期" prop="createTime" show-overflow-tooltip sortable
                                 width="200"></el-table-column>
            </el-table>
            <!---->
        </div>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                disabled: false,
                imeis: [],
                groupList: [],
                memberList: [],
                versionList: [],
                pathList: [],
                selectMember: '',
                selectGroup: '',
                selectVersion: '',
                apkInfoId: '',
                selectPath: '',
                member: '',
                group: '',
                version: '',
                path: '',
                value: [],
            }
        },
        methods: {

            memberGet() {
                // 获得选择的member
                let obj = {};
                obj = this.memberList.find((item) => {
                    return item.text === this.selectMember;//筛选出匹配数据
                });
                console.log(obj);
                this.member = obj.id;
                let group_api = '/deviceManager/deviceGroup/' + this.member;
                axios.get(group_api, {}).then(res => {
                    this.groupList = res.data.data;
                }).catch(error => {
                    console.log('Error', error.message)
                });
            },

            versionGet() {
                let obj = {};
                obj = this.versionList.find((item) => {
                    return item.versionIdentification === this.selectVersion; //筛选出匹配数据
                });
                this.apkInfoId = obj.id;

            },
            search() {
                let api = '';
                if (this.selectGroup === '') {
                    api = '/deviceManager/deviceInfo/' + this.member
                } else {
                    api = '/deviceManager/deviceInfo/' + this.member + '/' + this.selectGroup
                }
                axios.get(api, {}).then(res => {
                    this.value = res.data.data;
                    this.selectGroup = '';
                }).catch(error => {
                    console.log('Error', error.message)
                });
            },
            upgrade() {
                this.disabled = true;
                let api = '/apk/upgradeInfo';
                let params = new URLSearchParams();
                params.append('apkInfoId', this.apkInfoId);
                params.append('imeis', this.imeis);
                if (this.apkInfoId !== '' && this.imeis !== '') {
                    axios.post(api, params).then((val) => {
                        let code = val.data.code;
                        let message = val.data.message;
                        if (code === responseSuccessCode) {
                            this.$message.success(message);
                            this.getData();
                        } else {
                            this.$message.error(message);
                        }
                    });
                }else {
                    this.$message.warning("丫的，不把要升级的参数选全？是要让我猜么？")
                }
                setTimeout(() => {
                    this.disabled = false
                }, 3000);
            },
            changeFun(val) {
                this.imeis = [];
                for (let i = 0; i < val.length; i++) {
                    this.imeis.push(val[i].imei);
                }
            }
        },
        created() {
            let member_api = '/memberManager/listSelectMember';
            axios.get(member_api, {}).then(res => {
                this.memberList = res.data;
            }).catch(error => {
                console.log('Error', error.message)
            });
            let version_api = '/apk/apkInfo/1/10000';
            axios.get(version_api, {}).then(res => {
                this.versionList = res.data.data;
            }).catch(error => {
                console.log('Error', error.message)
            });
        }
    }
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .mr10 {
        margin-right: 10px;
    }

</style>
