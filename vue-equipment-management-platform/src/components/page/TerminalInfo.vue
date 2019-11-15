<!--终端信息-->
<template>
    <div class="customerInfo">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-reading"></i> 终端信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">


            <!--    搜索用户名称      -->
            <div class="handle-box">
                <el-input class="handle-input mr10" placeholder="终端ID"
                          v-model="selectData.id"></el-input>
                <el-input class="handle-input mr10" placeholder="终端型号"
                          v-model="selectData.type"></el-input>
                <el-input class="handle-input mr10" placeholder="终端版本"
                          v-model="selectData.version"></el-input>
                <el-input class="handle-input mr10" placeholder="终端批次"
                          v-model="selectData.batch"></el-input>
            </div>
            <div class="handle-box">
                <el-select @change="nameListGet" class="handle-input mr10"
                           placeholder="请选择客户名称"
                           v-model="selectData.selectName">
                    <el-option
                            :key="item.id"
                            :label="item.text"
                            :value="item.id"
                            v-for="item in selectData.nameList">
                    </el-option>
                </el-select>
                <el-button @click="search" icon="el-icon-search" type="primary" :disabled="searchDisabled">搜索
                </el-button>
                <el-button @click="empty" icon="el-icon-delete" type="primary" :disabled="emptyDisabled">清空</el-button>
            </div>
            <!--            -->


            <!--     表格信息显示       -->
            <el-table :data="value" border class="table" ref="multipleTable">
                <el-table-column align="center" fixed label="编号" width="50">
                    <template slot-scope="scope">
                        <span>{{scope.$index + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="终端ID" prop="imei" show-overflow-tooltip></el-table-column>
                <el-table-column label="客户名称" prop="memeber" show-overflow-tooltip></el-table-column>
                <el-table-column label="终端型号" prop="projectno" show-overflow-tooltip></el-table-column>
                <el-table-column label="终端批次" prop="version" show-overflow-tooltip></el-table-column>
                <el-table-column label="终端版本" prop="type" show-overflow-tooltip></el-table-column>
                <el-table-column label="终端SN号" prop="sn" show-overflow-tooltip></el-table-column>
                <el-table-column label="终端mac" prop="mac" show-overflow-tooltip></el-table-column>
                <el-table-column label="城市信息" prop="citySet" show-overflow-tooltip></el-table-column>
                <el-table-column label="车辆详情">
                    <template slot-scope="scope">
                        <el-button type="text" @click="handleCarDetail(scope.$index, scope.row)">{{scope.row.plateNo}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="是否激活" prop="isActivate" show-overflow-tooltip></el-table-column>
                <el-table-column label="激活时间" prop="activeTime" show-overflow-tooltip sortable></el-table-column>
                <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip sortable></el-table-column>
                <el-table-column align="center" label="操作" show-overflow-tooltip width="200%">
                    <template slot-scope="scope">
                        <el-button @click="handleBind(scope.$index, scope.row)" icon="el-icon-circle-plus"
                                   type="text">绑定
                        </el-button>
                        <el-button @click="handleEdit(scope.$index, scope.row)" icon="el-icon-edit" type="text">修改
                        </el-button>
                        <el-button @click="handleDelete(scope.$index, scope.row)" icon="el-icon-delete" type="danger">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--            -->

            <!-- 车辆详情 -->
            <el-dialog :visible.sync="detailVisible" title="车辆详情" width="15%">
                <div class="handle-box"><p>汽车品牌： {{carDetailData.carBrand}}</p></div>
                <div class="handle-box"><p>汽车型号： {{carDetailData.carType}}</p></div>
                <div class="handle-box"><p>车牌号： {{carDetailData.plateNo}}</p></div>
                <div class="handle-box"><p>车架号： {{carDetailData.vin}}</p></div>
                <div class="handle-box"><p>车牌颜色： {{carDetailData.plateColor}}</p></div>
                <div class="handle-box"><p>地址： {{carDetailData.address}}</p></div>
            </el-dialog>


            <!-- 绑定终端 -->
            <el-dialog :visible.sync="bindVisible" title="绑定终端" width="30%">
                <el-form label-width="80px">
                    <el-form-item label="终端ID">
                        <el-input class="handle-input mr10" v-model="bindData.id"></el-input>
                    </el-form-item>
                    <el-form-item label="客户名称">
                        <el-select @change="bindNameListGet" class="handle-input mr10"
                                   placeholder="请选择客户名称"
                                   v-model="bindData.name">
                            <el-option
                                    :key="item.id"
                                    :label="item.text"
                                    :value="item.id"
                                    v-for="item in selectData.nameList">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="车牌号">
                        <el-input class="handle-input mr10" v-model="bindData.plateNo"></el-input>
                    </el-form-item>
                    <el-form-item label="车架号">
                        <el-input class="handle-input mr10" v-model="bindData.vin"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="bindSubmitForm">提交</el-button>
                        <el-button @click="bindVisible=false"> 取消</el-button>
                    </el-form-item>

                </el-form>
            </el-dialog>

            <!-- 修改终端 -->
            <el-dialog :visible.sync="editVisible" title="修改终端" width="30%">
                <el-form label-width="80px">
                    <el-form-item label="终端ID">
                        <el-input class="handle-input mr10" v-model="editData.id"></el-input>
                    </el-form-item>
                    <el-form-item label="客户名称">
                        <el-select @change="editNameListGet" class="handle-input mr10"
                                   placeholder="请选择客户名称"
                                   v-model="editData.name">
                            <el-option
                                    :key="item.id"
                                    :label="item.text"
                                    :value="item.id"
                                    v-for="item in selectData.nameList">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="终端型号">
                        <el-input class="handle-input mr10" v-model="editData.type"></el-input>
                    </el-form-item>
                    <el-form-item label="终端批次">
                        <el-input class="handle-input mr10" v-model="editData.batch"></el-input>
                    </el-form-item>
                    <el-form-item label="终端版本">
                        <el-input class="handle-input mr10" v-model="editData.version"></el-input>
                    </el-form-item>
                    <el-form-item label="终端sn">
                        <el-input class="handle-input mr10" v-model="editData.sn"></el-input>
                    </el-form-item>
                    <el-form-item label="终端mac">
                        <el-input class="handle-input mr10" v-model="editData.mac"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="editSubmitForm">提交</el-button>
                        <el-button @click="editVisible=false"> 取消</el-button>
                    </el-form-item>

                </el-form>
            </el-dialog>

            <!-- 删除终端 -->
            <el-dialog :visible.sync="deleteVisible" title="删除终端" width="30%">
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
            return {
                searchDisabled: false,      // 搜索框是否可点击
                emptyDisabled: false,       // 清空框是否可点击
                value: [],                  // 表格数据
                total: 1,                   // 数据总条数
                bindVisible: false,         // 控制绑定终端弹出框
                editVisible: false,         // 控制编辑终端弹出框
                deleteVisible: false,       // 控制删除终端弹出框
                detailVisible: false,       // 控制车来给你详情弹出框
                delId: '',                  // 删除终端的Id
                currentPage: 1,             // 分页的默认页数
                selectData: {               // 搜索框数据
                    id: '',                 // 终端ID
                    type: '',               // 终端型号
                    version: '',            // 终端版本
                    batch: '',              // 终端批次
                    nameList: [],           // 客户名称
                    selectName: '',         // 下拉框选择的客户名称
                    selectNameId: '',       //  下拉框选择的客户名称Id
                },    // 搜索框数据
                bindData: {
                    id: '',              // 终端ID
                    name: '',            // 客户名称
                    vin: '',            // 车架号
                    plateNo: '',        // 车牌号
                },      // 终端绑定数据
                editData: {
                    id: '',                 // 终端ID
                    name: '',               // 客户名称
                    type: '',               // 终端型号
                    batch: '',              // 终端批次
                    version: '',            // 终端版本
                    sn: '',                 // 终端sn
                    mac: '',                // 终端mac
                },      // 终端修改数据
                carDetailData: {
                    carBrand: '',           // 汽车品牌
                    carType: '',            // 汽车型号
                    vin: '',                // 车架号
                    plateNo: '',            // 车牌号
                    plateColor: '',         // 车牌颜色
                    address: '',            // 地址
                },
            };
        },
        methods: {
            getData() {          // 获取表格数据
                let api = '/deviceManager/newListDevice/1/10/1/1/1/1/1';
                axios.get(api, {}).then(res => {
                    this.value = res.data.data.data.items;
                    this.total = res.data.data.data.pageBean.total;
                }).catch(error => {
                    console.log('Error', error.message)
                });
            },   // 获取表格数据

            handleCarDetail(index, row) {
                this.detailVisible = true;
                let imei = row.imei;
                let api = 'deviceManager/getCarInfo/' + imei;
                axios.get(api, {}).then(res => {
                    if (res.data.code === 1) {
                        this.carDetailData.carBrand = res.data.brand;
                        this.carDetailData.carType = res.data.carmodel;
                        this.carDetailData.address = res.data.place;
                        this.carDetailData.plateColor = res.data.carcolor;
                        this.carDetailData.plateNo = res.data.plateNo;
                        this.carDetailData.vin = res.data.vin
                    } else {
                        this.$message.error(res.data.message);
                    }
                }).catch(error => {
                    console.log('Error', error.message)
                });

            },

            handleBind(index, row) {    // 绑定终端
                let list = JSON.parse(JSON.stringify(this.selectData.nameList));
                list.forEach((item, index, array) => {
                    // 没有选择客户等级时，赋值默认客户等级
                    if (item.text === row.memeber) {
                        this.bindData.name = item.id
                    }
                });
                this.bindVisible = true;
                this.bindData.id = row.imei;
                this.bindData.plateNo = row.plateNo;
                this.bindData.vin = row.vin;
            },   // 绑定终端

            bindNameListGet() {             // 绑定终端弹出框中的客户信息获取
                let obj = {};
                obj = this.selectData.nameList.find((item) => {
                    return item.id === this.bindData.name; //筛选出匹配数据
                });
                this.bindData.name = obj.id;
            },      // 绑定终端弹出框中的客户信息获取

            bindSubmitForm() {      // 绑定终端数据提交
                this.bindVisible = false;
                let api = '/deviceManager/bindTerminal';
                let params = new URLSearchParams();
                params.append('imei', this.bindData.id);
                params.append('memeberId', this.bindData.name);
                params.append('plateNo', this.bindData.plateNo);
                params.append('vin', this.bindData.vin);
                axios.post(api, params).then((val => {
                    let code = val.data.code;
                    let message = val.data.message;
                    if (code === 1) {
                        this.$message.success(message);
                        this.getData();
                        this.currentPage = 1;
                    } else {
                        this.$message.error(message);
                    }
                })).catch(error => {
                    console.log('Error', error.message)
                })
            },      // 绑定终端数据提交

            editSubmitForm() {              // 编辑终端数据提交
                this.editVisible = false;
                let api = '/deviceManager/editTerminal';
                let params = new URLSearchParams();
                params.append('imei', this.editData.id);
                params.append('memeberId', this.editData.name);
                params.append('projectNo', this.editData.type);
                params.append('version', this.editData.batch);
                params.append('type', this.editData.version);
                params.append('sn', this.editData.sn);
                params.append('mac', this.editData.mac);
                axios.post(api, params).then((val => {
                    let code = val.data.code;
                    let message = val.data.message;
                    if (code === 1) {
                        this.$message.success(message);
                        this.getData();
                        this.currentPage = 1;
                    } else {
                        this.$message.error(message);
                    }
                })).catch(error => {
                    console.log('Error', error.message)
                })
            },      // 编辑终端数据提交

            editNameListGet() {         // 编辑终端客户名称ID获取
                let obj = {};
                obj = this.selectData.nameList.find((item) => {
                    return item.id === this.editData.name; //筛选出匹配数据
                });
                this.editData.name = obj.id;
            },      // 编辑终端客户名称ID获取

            handleEdit(index, row) {    // 编辑终端
                this.editVisible = true;
                let list = JSON.parse(JSON.stringify(this.selectData.nameList));
                list.forEach((item, index, array) => {
                    // 没有选择客户等级时，赋值默认客户等级
                    if (item.text === row.memeber) {
                        this.editData.name = item.id
                    }
                });
                this.editData.id = row.imei;
                this.editData.type = row.projectno;
                this.editData.batch = row.version;
                this.editData.version = row.type;
                this.editData.sn = row.sn;
                this.editData.mac = row.mac;
            },   // 编辑终端

            handleDelete(index, row) {  // 删除终端
                this.deleteVisible = true;
                this.delId = row.id;
            },   //  删除终端

            deleteRow() {           // 确定删除数据
                this.deleteVisible = false;
                let api = 'deviceManager/deleteDevice/' + this.delId;
                axios.post(api, {}).then(val => {
                    let code = val.data.code;
                    let message = val.data.message;
                    if (code === 1) {
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


            },              // 确定删除数据

            nameList() {                       // 获得客户名称下拉框数据
                let api = '/memberManager/listSelectMember';
                axios.get(api, {}).then(res => {
                    this.selectData.nameList = res.data;
                }).catch(error => {
                    console.log('Error', error.message)
                });
            },              // 获得客户名称下拉框数据

            nameListGet() {                  // 获得选择的客户名称ID
                let obj = {};
                obj = this.selectData.nameList.find((item) => {
                    return item.id === this.selectData.selectName;//筛选出匹配数据
                });
                this.selectData.selectNameId = obj.id;
                console.log(this.selectData.selectNameId)
            },              // 获得选择的客户名称ID

            empty() {       // 清空搜索框重置数据
                this.emptyDisabled = true;
                this.selectData.id = '';
                this.selectData.type = '';
                this.selectData.version = '';
                this.selectData.batch = '';
                this.selectData.selectName = '';
                this.selectData.selectNameId = '';
                this.getData();
                setTimeout(() => {
                    this.emptyDisabled = false
                }, 1000);
            },

            search() {                          // 搜索按钮
                this.searchDisabled = true;     // 按钮置灰
                let id = 1;
                let type = 1;
                let version = 1;
                let batch = 1;
                let selectNameId = 1;
                let api = '/deviceManager/newListDevice/1/10/1/1/1/1/1';
                if (this.selectData.id !== '') {    // 终端ID为空，给默认值1
                    id = this.selectData.id;
                }
                if (this.selectData.type !== '') {  // 终端型号为空，给默认值1
                    type = this.selectData.type;
                }
                if (this.selectData.version !== '') {   // 终端版本为空，给默认值1
                    version = this.selectData.version;
                }
                if (this.selectData.batch !== '') {     // 终端批次为空，给默认值1
                    batch = this.selectData.batch;
                }
                if (this.selectData.selectNameId !== '') {  // 客户名称未选择，给默认值1
                    selectNameId = this.selectData.selectNameId;
                }
                if (                                        // 输入框 全部为空，则不进行Ajax请求
                    (this.selectData.id !== '') ||
                    (this.selectData.type !== '') ||
                    (this.selectData.version !== '') ||
                    (this.selectData.batch !== '') ||
                    (this.selectData.selectNameId !== '')) {
                    api = '/deviceManager/newListDevice/1/10/' + selectNameId + '/' + id +
                        '/' + version + '/' + batch + '/' + type;
                }
                axios.get(api, {}).then(res => {
                    this.value = res.data.data.data.items;
                    this.total = res.data.data.data.pageBean.total;
                }).catch(error => {
                    this.$message.error(error.message);
                    console.log('Error', error.message);
                });
                setTimeout(() => {
                    this.searchDisabled = false
                }, 1000);
            },

            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },          // 每一页显示数据的数目，暂时无用

            handleCurrentChange(val) {            // 分页显示
                let api = '/deviceManager/newListDevice/' + val + '/10/1/1/1/1/1';
                let id = 1;
                let type = 1;
                let version = 1;
                let batch = 1;
                let selectNameId = 1;
                if (this.selectData.id !== '') {    // 终端ID为空，给默认值1
                    id = this.selectData.id;
                }
                if (this.selectData.type !== '') {  // 终端型号为空，给默认值1
                    type = this.selectData.type;
                }
                if (this.selectData.version !== '') {   // 终端版本为空，给默认值1
                    version = this.selectData.version;
                }
                if (this.selectData.batch !== '') {     // 终端批次为空，给默认值1
                    batch = this.selectData.batch;
                }
                if (this.selectData.selectNameId !== '') {  // 客户名称未选择，给默认值1
                    selectNameId = this.selectData.selectNameId;
                }
                if (                                        // 输入框 全部为空，则不进行Ajax请求
                    (this.selectData.id !== '') ||
                    (this.selectData.type !== '') ||
                    (this.selectData.version !== '') ||
                    (this.selectData.batch !== '') ||
                    (this.selectData.selectNameId !== '')) {
                    api = '/deviceManager/newListDevice/' + val + '/10/' + selectNameId + '/' + id +
                        '/' + version + '/' + batch + '/' + type;
                }
                axios.get(api, {}).then(res => {
                    this.value = res.data.data.data.items;
                }).catch(error => {
                    console.log('Error', error.message)
                })
            },       // 分页显示

        },

        created() {     //初始化操作
            this.getData();             // 初始化表格数据
            this.nameList();         // 初始化客户名称下拉框数据
        }
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
