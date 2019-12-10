<template>
    <div class="commits">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> apk信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">

            <!--           添加版本号 -->
            <el-form :inline="true" :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-form-inline">
                <el-form-item prop="apkVersion">
                    <el-input v-model="ruleForm.apkVersion" placeholder="version code"></el-input>
                </el-form-item>
                <el-form-item prop="versionDetail">
                    <el-input v-model="ruleForm.versionDetail" placeholder="version identification"></el-input>
                </el-form-item>
                <el-form-item prop="apkPath">
                    <el-input v-model="ruleForm.apkPath" placeholder="apk path"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="ruleForm.updateNotes" placeholder="updateNotes"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')" :disabled="disabled">提交</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
            <!--            -->


            <!--            搜索版本号-->
            <div class="handle-box">
                <el-input class="handle-input mr10" placeholder="version code or version identification"
                          v-model="select_word"></el-input>
                <el-button @click="search" icon="el-icon-search" type="primary">搜索</el-button>
                <el-button @click="empty" icon="el-icon-delete" type="primary">清空</el-button>
            </div>
            <!--            -->


            <!--            -->
            <el-table :data="value" border class="table" ref="multipleTable">
                 <el-table-column fixed label="序号" width="50" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.$index + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="version code" prop="versionCode" show-overflow-tooltip
                                 width="200"></el-table-column>

                <el-table-column label="version identification" prop="versionIdentification"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="path" prop="path" show-overflow-tooltip></el-table-column>
                <el-table-column label="notes" prop="updateNotes" show-overflow-tooltip></el-table-column>
                <el-table-column label="日期" prop="createTime" show-overflow-tooltip sortable
                                 width="200"></el-table-column>
                <el-table-column align="center" label="操作" show-overflow-tooltip width="160">
                    <template slot-scope="scope">
                        <el-button @click="handleEdit(scope.row)" icon="el-icon-edit" type="text">编辑</el-button>
                        <el-button @click="handleDelete(scope.row)" icon="el-icon-delete" type="text">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--            -->


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
                    <el-form-item prop="apkVersion">
                        <el-input v-model="editForm.apkVersion" placeholder="version code"
                                  class="handle-input mr10"></el-input>
                    </el-form-item>
                    <el-form-item prop="versionDetail">
                        <el-input v-model="editForm.versionDetail" placeholder="version identification"
                                  class="handle-input mr10"></el-input>
                    </el-form-item>
                    <el-form-item prop="apkPath">
                        <el-input v-model="editForm.apkPath" placeholder="apk path"
                                  class="handle-input mr10"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="editForm.updateNotes" placeholder="updateNotes"
                                  class="handle-input mr10"></el-input>
                    </el-form-item>
                </el-form>

                <span class="dialog-footer" slot="footer">
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
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
        <!--            -->

    </div>
</template>

<script>

    export default {
        data() {
            let checkVersion = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('版本号不能为空'));
                }
                setTimeout(() => {
                    if (isNaN(value)) {
                        callback(new Error('请输入数字值'));
                    } else {
                        callback();
                    }
                }, 1000);
            };
            let checkPath = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('包路径不能为空'));
                }
                setTimeout(() => {
                    callback();
                }, 1000);
            };
            let checkDetail = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('版本名不能为空'));
                }
                setTimeout(() => {
                    callback();
                }, 1000);
            };
            return {
                delRow: '',
                eRow: '',
                currentPage: 1,
                disabled: false,
                deleteVisible: false,
                editVisible: false,
                select_word: '',
                total: 0,
                value: [],
                responseData: [],
                editForm: {
                    id: '',
                    apkPath: '',
                    apkVersion: '',
                    versionDetail: '',
                    updateNotes: '',
                },
                ruleForm: {
                    apkPath: '',
                    apkVersion: '',
                    versionDetail: '',
                    updateNotes: '',
                },
                rules: {
                    apkPath: [
                        {validator: checkPath, trigger: 'blur'}
                    ],
                    apkVersion: [
                        {validator: checkVersion, trigger: 'blur'}
                    ],
                    versionDetail: [
                        {validator: checkDetail, trigger: 'blur'}
                    ]
                },
            };
        },
        methods: {

            editRow() {
                this.editVisible = false;
                let api = '/apk/apkInfo';
                let params = new URLSearchParams();
                params.append('id', this.editForm.id);
                params.append('versionCode', this.editForm.apkVersion);
                params.append('path', this.editForm.apkPath);
                params.append('versionIdentification', this.editForm.versionDetail);
                params.append('updateNotes', this.editForm.updateNotes);
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
            },

            deleteRow() {
                this.deleteVisible = false;
                let api = "/apk/apkInfo/" + this.delRow.id;
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
                this.eRow = row;
                this.editForm.id = row.id;
                this.editForm.apkPath = row.path;
                this.editForm.apkVersion = row.versionCode;
                this.editForm.versionDetail = row.versionIdentification;
                this.editForm.updateNotes = row.updateNotes;

            },

            handleDelete(row) {
                this.deleteVisible = true;
                this.delRow = row;
            },

            submitForm(formName) {
                this.disabled = true;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let api = '/apk/apkInfo';
                        let params = new URLSearchParams();
                        params.append('versionCode', this.ruleForm.apkVersion);
                        params.append('path', this.ruleForm.apkPath);
                        params.append('versionIdentification', this.ruleForm.versionDetail);
                        params.append('updateNotes', this.ruleForm.updateNotes);
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
                    }
                });
                setTimeout(() => {
                    this.disabled = false
                }, 1000);
                // this.disabled = false
            },
            resetForm(formName) {
                this.ruleForm.apkPath = '';
                this.ruleForm.apkVersion = '';
                this.ruleForm.versionDetail = '';
                this.ruleForm.updateNotes = '';
                this.editForm.apkPath = '';
                this.editForm.apkVersion = '';
                this.editForm.versionDetail = '';
                this.editForm.updateNotes = '';
            },
            search() {
                let item = localStorage.getItem("ms_username");
                console.log(item);

                let api = '/apk/apkInfo/1/10/'  + this.select_word;
                if (this.select_word === "") {
                    api = '/apk/apkInfo/1/10';
                }
                axios.get(api, {}).then(res => {
                    this.value = res.data.data;
                    this.total = res.data.total;
                }).catch(error => {
                    console.log('Error', error.message)
                })
            },
            empty() {
                this.select_word = '';
                this.getData();
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },          // 每一页显示数据的数目，暂时无用

            handleCurrentChange(val) {            // 分页显示
                let api = '/apk/apkInfo/' + val + '/10/' + this.select_word;
                if (this.select_word === ''){
                    api = '/apk/apkInfo/' + val + '/10';
                }
                axios.get(api, {}).then(res => {
                    this.value = res.data.data;
                    this.total = res.data.total;
                }).catch(error => {
                    console.log('Error', error.message)
                })

            },       // 分页显示

            getData() {
                let api = '/apk/apkInfo/' + this.currentPage + '/10';
                axios.get(api, {}).then(res => {
                    this.value = res.data.data;
                    this.total = res.data.total;
                }).catch(error => {
                    console.log('Error', error.message)
                })
            },
        },

        created() {
            this.getData();
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
