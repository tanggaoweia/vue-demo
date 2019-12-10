<!--客户中心-->
<template>
    <div class="customerInfo">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-reading"></i> 客户信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">


            <!--    搜索用户名称      -->
            <div class="handle-box">
                <el-input class="handle-input mr10" placeholder="请输入用户名称"
                          v-model="select_word"></el-input>
                <el-button @click="search" icon="el-icon-search" type="primary">搜索</el-button>
                <el-button @click="empty" icon="el-icon-delete" type="primary">清空</el-button>
                <el-button @click="handleAdd" class="right" icon="el-icon-circle-plus" type="primary">添加客户账号</el-button>

            </div>
            <!--            -->


            <!--     表格信息显示       -->
            <el-table :data="value" border class="table" ref="multipleTable">
                <el-table-column align="center" fixed label="编号" width="50">
                    <template slot-scope="scope">
                        <span>{{scope.$index + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="用户账号" prop="name" show-overflow-tooltip></el-table-column>
                <el-table-column label="用户名称" prop="realName" show-overflow-tooltip></el-table-column>
                <el-table-column label="用户等级" prop="memberLevel" show-overflow-tooltip></el-table-column>
                <el-table-column label="备注信息" prop="comment" show-overflow-tooltip></el-table-column>
                <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip sortable></el-table-column>
                <el-table-column align="center" label="操作" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button @click="handleEdit(scope.$index, scope.row)" icon="el-icon-edit" type="text">编辑
                        </el-button>
                        <el-button @click="handleRefresh(scope.$index, scope.row)" icon="el-icon-refresh-left"
                                   type="text">重置密码
                        </el-button>
                        <el-button @click="handleDelete(scope.$index, scope.row)" icon="el-icon-delete" type="danger">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--            -->


            <!-- 添加客户账号 -->
            <el-dialog :visible.sync="addVisible" title="客户信息" width="30%">
                <div class="form-box">
                    <el-form :model="ruleForm" :rules="rules" label-width="80px" ref="ruleForm">
                        <el-form-item label="客户账号" prop="account">
                            <el-input class="handle-input mr10" v-model="ruleForm.account"></el-input>
                        </el-form-item>
                        <el-form-item label="客户密码" prop="pwd">
                            <el-input class="handle-input mr10" type="password" v-model="ruleForm.pwd"></el-input>
                        </el-form-item>
                        <el-form-item label="客户等级" prop="selectMemberLevel">
                            <el-select @change="memberLevelGet" class="handle-input mr10"
                                       placeholder="请选择客户等级"
                                       v-model="ruleForm.selectMemberLevel">
                                <el-option
                                        :key="item.id"
                                        :label="item.text"
                                        :value="item.id"
                                        v-for="item in ruleForm.memberLevelList">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="客户名称" prop="name">
                            <el-input class="handle-input mr10" v-model="ruleForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="备注">
                            <el-input class="handle-input mr10" v-model="ruleForm.remarks"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button :disabled="disabled" @click="submitForm('ruleForm')" type="primary">提交
                            </el-button>
                            <el-button @click="addVisible = false">取消</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-dialog>

            <!-- 编辑弹出框 -->
            <el-dialog :visible.sync="editVisible" title="编辑" width="30%">

            </el-dialog>

            <!-- 重置密码弹出框 -->
            <el-dialog :visible.sync="refreshVisible" title="重置密码" width="30%">
                <div class="del-dialog-cnt">重置成功 初始密码： 123</div>
                <span class="dialog-footer" slot="footer">
                    <el-button @click="refreshVisible = false" type="primary">确 定</el-button>
                </span>

            </el-dialog>


            <!-- 删除弹出框 -->
            <el-dialog :visible.sync="deleteVisible" title="删除" width="30%">
                <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
                <span class="dialog-footer" slot="footer">
                    <el-button @click="deleteVisible = false">取 消</el-button>
                    <el-button @click="deleteRow" type="primary">确 定</el-button>
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
            let checkAccount = (rules, value, callback) => {    //校验客户账号不能为空
                if (!value) {
                    return callback(new Error('客户账号不能为空'));
                }
                setTimeout(() => {
                    callback();
                }, 1000);
            };  // 检查客户账号数据
            let checkName = (rules, value, callback) => {   //校验客户名称不嫩为空
                if (!value) {
                    return callback(new Error('客户名称不能为空'));
                }
                setTimeout(() => {
                    callback();
                }, 1000);
            };     // 检查客户名称数据
            let checkPwd = (rules, value, callback) => {    //校验客户密码不能为空
                if (!value) {
                    return callback(new Error('客户密码不能为空'));
                }
                setTimeout(() => {
                    callback();
                }, 1000);
            };      //检查客户密码数据
            let checkSelectMemberLevel = (rules, value, callback) => {  //校验客户等级不能为空
                if (!value) {
                    return callback(new Error('客户等级不能为空'));
                }
                setTimeout(() => {
                    callback();
                }, 1000);
            };  //检查选择的客户等级数据
            return {
                operationType: 0,       // 操作类型： 0 新增用户信息，1 编辑用户信息
                total: 100,
                select_word: '',        // 搜索框输入的文字
                value: [],              //客户信息表格数据
                addVisible: false,      //控制 添加客户 弹出框是否弹出
                editVisible: false,     //控制 编辑 弹出框是否弹出
                refreshVisible: false,  //控制 重置密码 弹出框是否弹出
                deleteVisible: false,   //控制 删除 弹出框是否弹出
                disabled: false,        //控制按钮是否可点击
                ruleForm: {             // 添加客户账号 弹出框的数据
                    account: '',        // 客户账号数据
                    name: '',           //客户名称数据
                    pwd: '',            //客户密码数据
                    remarks: '',        //备注数据
                    selectMemberLevel: '',  //选择的客户等级数据
                    selectMemberLevelId: '',  //选择的客户等级数据
                    memberLevelList: [],    //客户等级下拉框数据
                    id: 0,                  // id
                },  //添加客户账号 弹出框的数据
                rules: {        // 对添加客户账号 数据进行校验
                    account: [
                        {validator: checkAccount, trigger: 'blur'}
                    ],
                    name: [
                        {validator: checkName, trigger: 'blur'}
                    ],
                    pwd: [
                        {validator: checkPwd, trigger: 'blur'}
                    ],
                    selectMemberLevel: [
                        {validator: checkSelectMemberLevel, trigger: 'blur'}
                    ],
                },              //form 表单规则设置
                delId: 1,              // 删除的数据ID
                refreshId: 1,         //重置密码的ID
                currentPage: 1         //分页的默认页数
            };
        },

        methods: {
            memberLevelGet() {  //添加客户账号弹出框中 客户等级选择
                let obj = {};
                obj = this.ruleForm.memberLevelList.find((item) => {
                    return item.id === this.ruleForm.selectMemberLevel;//筛选出匹配数据
                });
                this.ruleForm.selectMemberLevelId = obj.id;
            },  //添加客户账号弹出框中 客户等级选择

            submitForm(formName) {      // 添加客户账号 提交表单校验
                this.disabled = true;
                this.$refs[formName].validate((valid) => {
                    let api = '/memberManager/addMember';
                    if (this.operationType === 1) {
                        api = 'memberManager/editMember';
                    }
                    if (valid) {
                        let params = new URLSearchParams();
                        params.append('name', this.ruleForm.account);
                        params.append('pwd', this.ruleForm.pwd);
                        params.append('realName', this.ruleForm.name);
                        params.append('level', this.ruleForm.selectMemberLevelId);
                        params.append('comment', this.ruleForm.remarks);
                        params.append('id', this.ruleForm.id);
                        axios.post(api, params).then((val => {
                            let code = val.data.code;
                            let message = val.data.message;
                            if (code === responseSuccessCode) {
                                this.$message.success(message);
                                this.addVisible = false;
                                this.getData();
                                this.currentPage = 1;
                            } else if (code === 200) {
                                this.$message.warning(message);
                            } else if (code === 400) {
                                this.$message.warning(message);
                            } else {
                                this.$message.error(message);
                            }
                        })).catch(error => {
                            console.log('Error', error.message)
                        })
                    }
                });
                setTimeout(() => {
                    this.disabled = false
                }, 1000);
                // this.disabled = false

            },  // 添加客户账号 提交表单校验

            search() {      // 搜索用户名称
                let api = '';
                if (this.select_word !== '') {
                    api = '/memberManager/listMember/1/10/' + this.select_word;
                }else {
                   api = '/memberManager/listMember/1/10/1';
                }
                axios.get(api, {}).then(res => {
                        this.value = res.data.data.data.items;
                        this.currentPage = 1;
                        this.total = res.data.data.data.pageBean.total;
                    }).catch(error => {
                        console.log('Error', error.message)
                    })
            },      // 搜索用户名称

            empty() {       // 搜索框数据清空
                this.select_word = '';
                this.getData();
            },      // 搜索框数据清空

            handleAdd() {  //添加客户账号
                this.operationType = 0;
                this.addVisible = true;
                this.ruleForm.account = '';
                this.ruleForm.name = '';
                this.ruleForm.remarks = '';
                this.ruleForm.selectMemberLevel = '';
                this.ruleForm.pwd = '';
            },      //添加客户账号

            handleEdit(index, row) {    //编辑客户账号
                let list = JSON.parse(JSON.stringify(this.ruleForm.memberLevelList));
                list.forEach((item, index, array) => {
                    // 没有选择客户等级时，赋值默认客户等级
                    if (item.text === row.memberLevel) {
                        this.ruleForm.selectMemberLevelId = item.id
                    }
                });

                this.addVisible = true;
                this.ruleForm.account = row.name;
                this.ruleForm.name = row.realName;
                this.ruleForm.remarks = row.comment;
                this.ruleForm.selectMemberLevel = row.memberLevel;
                this.ruleForm.id = row.id;
                this.ruleForm.pwd = '';
                this.operationType = 1;
            },  //编辑客户账号

            handleRefresh(index, row) {            //重置密码
                this.refreshId = row.id;
                let api = '/memberManager/resetPwd/' + this.refreshId;
                this.refreshOrDelRowPostMethod(api);
            },  //重置密码

            handleDelete(index, row) {  //获取将要删除的用户ID
                this.deleteVisible = true;
                this.delId = row.id;
            },   //获取将要删除的用户ID

            deleteRow() {    //确定删除选中的数据
                this.deleteVisible = false;
                let api = '/memberManager/deleteMemeber/' + this.delId;
                this.refreshOrDelRowPostMethod(api);
            }, //确定删除选中的数据

            refreshOrDelRowPostMethod(api) {         // 删除或重置密码的POST公用方法
                axios.post(api, {}).then(val => {
                    let code = val.data.code;
                    let message = val.data.message;
                    if (code === responseSuccessCode) {
                        this.$message.success(message);
                        this.getData();
                    } else if (code === 200) {
                        this.$message.warning(message);
                    } else {
                        this.$message.error(message);
                    }
                }).catch(error => {
                    console.log('Error', error.message)
                })
            },  // 删除或重置密码的POST公用方法

            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },          // 每一页显示数据的数目，暂时无用

            handleCurrentChange(val) {            // 分页显示
                let api = '/memberManager/listMember/'+ val +'/10/1';
                if (this.select_word !== ''){
                    api = '/memberManager/listMember/'+ val +'/10/' + this.select_word;
                }
                axios.get(api, {}).then(res => {
                    this.value = res.data.data.data.items;
                }).catch(error => {
                    console.log('Error', error.message)
                })
            },       // 分页显示

            getData() {     // 请求表格数据
                let api = '/memberManager/listMember/1/10/1';
                axios.get(api, {}).then(res => {
                    this.value = res.data.data.data.items;
                    this.total = res.data.data.data.pageBean.total;
                }).catch(error => {
                    console.log('Error', error.message)
                })
            },  // 请求表格数据
        },

        created() {     //初始化操作
            this.getData();     //初始化加载表格数据
            let api = '/memberLevel/listMemberLevel';   //初始化 客户等级数据
            axios.get(api, {}).then(res => {
                this.ruleForm.memberLevelList = res.data;
            }).catch(error => {
                console.log('Error', error.message)
            })
        }   //初始化操作
    }
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
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
