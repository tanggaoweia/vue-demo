<template>
    <div class="commits">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 升级信息</el-breadcrumb-item>
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
            </div>
            <!---->

            <!--       表格     -->
            <el-table :data="value" border class="table" ref="multipleTable">
                <el-table-column fixed label="序号" width="50" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.$index + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="imei" prop="imei" show-overflow-tooltip></el-table-column>
                <el-table-column label="versionCode" prop="versionCode" show-overflow-tooltip></el-table-column>
                <el-table-column label="versionIdentification" prop="versionIdentification"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="apkPath" prop="path" show-overflow-tooltip></el-table-column>
                <el-table-column label="日期" prop="createTime" show-overflow-tooltip sortable
                                 width="200"></el-table-column>
                <el-table-column align="center" label="操作" show-overflow-tooltip width="160">
                    <template slot-scope="scope">
                        <el-button @click="handleEdit(scope.row)" icon="el-icon-edit" type="text">编辑</el-button>
                        <el-button @click="handleDelete(scope.row)" icon="el-icon-delete" type="text">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!---->

            <!-- 删除 -->
            <el-dialog :visible.sync="deleteVisible" title="删除" width="30%">
                <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
                <span class="dialog-footer" slot="footer">
                    <el-button @click="deleteVisible = false">取 消</el-button>
                    <el-button @click="deleteRow" type="primary">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 编辑 -->
            <el-dialog :visible.sync="editVisible" title="编辑" width="25%">

                <el-form :model="editForm" ref="ruleForm">
                    <el-form-item>
                        <el-input v-model="editForm.imei" placeholder="imei"
                                  class="handle-input mr10" disabled></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="editForm.versionCode" placeholder="imei"
                                  class="handle-input mr10" disabled></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="editForm.path" placeholder="imei"
                                  class="handle-input mr10" disabled></el-input>
                    </el-form-item>
                    <el-select @change="versionGet" placeholder="选择升级到的版本号" v-model="editForm.versionIdentification"
                               class="handle-input mr10" filterable>
                        <el-option
                                :key="item.id"
                                :label="item.name"
                                :value="item.versionIdentification"
                                v-for="item in versionList">
                        </el-option>
                    </el-select>

                </el-form>

                <span class="dialog-footer" slot="footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button @click="editRow" type="primary">确 定</el-button>
                </span>
            </el-dialog>

            <!--            分页-->
            <div class="pagination">
                <el-pagination
                        :current-page.sync="currentPage"
                        :page-size="10"
                        :total=total
                        @current-change="handleCurrentChange"
                        @size-change="handleSizeChange"
                        layout="prev, pager, next, jumper">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                delRow: '',
                akpInfoId: '',
                deleteVisible: false,
                editVisible: false,
                editForm: {
                    imei: '',
                    apkInfoId: '',
                    path: '',
                    id: '',
                    versionCode: '',
                    versionIdentification: '',
                },
                total: 0,
                currentPage: 1,
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

            versionGet() {
                let obj = {};
                obj = this.versionList.find((item) => {
                    return item.versionIdentification === this.editForm.versionIdentification; //筛选出匹配数据
                });
                this.editForm.apkInfoId = obj.id;
            },

            editRow() {
                this.editVisible = false;
                let api = '/apk/upgradeInfo';
                let params = new URLSearchParams();
                params.append('id', this.editForm.id);
                params.append('apkInfoId', this.editForm.apkInfoId);
                if (this.editForm.apkInfoId !== '') {
                    axios.patch(api, params).then((val) => {
                        let code = val.data.code;
                        let message = val.data.message;
                        if (code === responseSuccessCode) {
                            this.$message.success(message);
                            this.getData();
                        } else {
                            this.$message.error(message);
                        }
                    });
                }
            },

            deleteRow() {
                this.deleteVisible = false;
                let api = "/apk/upgradeInfo/" + this.delRow.id;
                axios.delete(api).then((val) => {
                    let code = val.data.code;
                    let message = val.data.message;
                    if (code === responseSuccessCode) {
                        this.$message.success(message);
                        this.getData();
                    } else {
                        this.$message.error(message);
                    }
                });
            },

            handleEdit(row) {
                this.editVisible = true;
                this.editForm.imei = row.imei;
                this.editForm.id = row.id;
                this.editForm.path = row.path;
                this.editForm.apkVersion = row.apkVersion;
                this.editForm.versionIdentification = row.versionIdentification;

            },

            handleDelete(row) {
                this.deleteVisible = true;
                this.delRow = row;
            },

            memberGet() {
                // 获得选择的member
                let obj = {};
                obj = this.memberList.find((item) => {
                    return item.text === this.selectMember;//筛选出匹配数据
                });
                this.member = obj.id;
                let group_api = '/deviceManager/deviceGroup/' + this.member;
                axios.get(group_api, {}).then(res => {
                    this.groupList = res.data.data;
                }).catch(error => {
                    console.log('Error', error.message)
                });
            },

            search() {
                this.currentPage = 1;
                let api = 'apk/upgradeInfo/1/10';
                if (this.member !== '' && this.selectGroup === '') {
                    api = 'apk/upgradeInfo/1/10/' + this.member
                }
                if (this.member !== '' && this.selectGroup !== '') {
                    api = 'apk/upgradeInfo/1/10/' + this.member + '/' + this.selectGroup
                }
                axios.get(api, {}).then(res => {
                    this.value = res.data.data;
                    this.total = res.data.total;
                    this.selectGroup = '';
                }).catch(error => {
                    console.log('Error', error.message)
                });
            },
            getData() {
                let api = 'apk/upgradeInfo/' + this.currentPage + '/10';
                axios.get(api, {}).then(res => {
                    this.value = res.data.data;
                    this.total = res.data.total;
                }).catch(error => {
                    console.log('Error', error.message)
                });
            },

            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },          // 每一页显示数据的数目，暂时无用

            handleCurrentChange(val) {            // 分页显示
                let api = 'apk/upgradeInfo/' + this.currentPage + '/10';
                if (this.member !== '' && this.selectGroup === '') {
                    api = 'apk/upgradeInfo/' + this.currentPage + '/10/' + this.member
                }
                if (this.member !== '' && this.selectGroup !== '') {
                    api = 'apk/upgradeInfo/' + this.currentPage + '/10/' + this.member + '/' + this.selectGroup
                }
                axios.get(api, {}).then(res => {
                    this.value = res.data.data;
                    this.total = res.data.total;
                }).catch(error => {
                    console.log('Error', error.message)
                });
            },       // 分页显示

        },


        created() {
            this.getData();
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
