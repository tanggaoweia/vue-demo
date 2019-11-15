<!--车辆信息-->
<template>
    <div class="customerInfo">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-reading"></i> 车辆信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">


            <!--    条件搜索 和 添加账号      -->
            <div class="handle-box">
                <el-input class="handle-input mr10" placeholder="车牌号"
                          v-model="selectData.plateNo"></el-input>
                <el-input class="handle-input mr10" placeholder="车架号"
                          v-model="selectData.vin"></el-input>
                <el-input class="handle-input mr10" placeholder="绑定终端"
                          v-model="selectData.imei"></el-input>
                <el-input class="handle-input mr10" placeholder="省市信息"
                          v-model="selectData.place"></el-input>
                <el-button @click="search" icon="el-icon-search" type="primary" :disabled="searchDisabled">搜索
                </el-button>
                <el-button @click="empty" icon="el-icon-delete" type="primary" :disabled="emptyDisabled">清空</el-button>
                <el-button @click="addCar" class="left" icon="el-icon-circle-plus" type="primary">添加车辆</el-button>
            </div>
            <!--            -->


            <!--     表格信息显示       -->
            <el-table :data="value" border class="table" ref="multipleTable">
                <el-table-column align="center" fixed label="编号" width="50">
                    <template slot-scope="scope">
                        <span>{{scope.$index + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="车牌号" prop="plateno" show-overflow-tooltip></el-table-column>
                <el-table-column label="车架号" prop="vin" show-overflow-tooltip></el-table-column>
                <el-table-column label="车辆品牌" prop="brand" show-overflow-tooltip></el-table-column>
                <el-table-column label="车辆型号" prop="carmodel" show-overflow-tooltip></el-table-column>
                <el-table-column label="车牌颜色" prop="carcolor" show-overflow-tooltip></el-table-column>
                <el-table-column label="所在省市" prop="place" show-overflow-tooltip></el-table-column>
                <el-table-column label="关联终端" prop="imei" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" label="操作" show-overflow-tooltip width="180%">
                    <template slot-scope="scope">
                        <el-button @click="handleEdit(scope.$index, scope.row)" icon="el-icon-edit" type="text">修改
                        </el-button>
                        <el-button @click="handleDelete(scope.$index, scope.row)" icon="el-icon-delete" type="danger">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--            -->

            <!-- 添加车辆信息 -->
            <el-dialog :visible.sync="addCarVisible" title="添加车辆" width="30%">
                <el-form label-width="80px">
                    <el-form-item label="客户名称">
                        <el-select @change="addNameIdGet" class="handle-input mr10"
                                   placeholder="请选择客户名称"
                                   v-model="addCarData.name">
                            <el-option
                                    :key="item.id"
                                    :label="item.text"
                                    :value="item.id"
                                    v-for="item in editData.nameList">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="车牌号">
                        <el-input class="handle-input mr10" v-model="addCarData.plateNo"></el-input>
                    </el-form-item>
                    <el-form-item label="车架号">
                        <el-input class="handle-input mr10" v-model="addCarData.vin"></el-input>
                    </el-form-item>
                    <el-form-item label="车辆品牌">
                        <el-input class="handle-input mr10" v-model="addCarData.brand"></el-input>
                    </el-form-item>
                    <el-form-item label="车辆型号">
                        <el-input class="handle-input mr10" v-model="addCarData.carModel"></el-input>
                    </el-form-item>
                    <el-form-item label="车牌颜色">
                        <el-input class="handle-input mr10" v-model="addCarData.carColor"></el-input>
                    </el-form-item>
                    <el-form-item label="所在省市">
                        <el-input class="handle-input mr10" v-model="addCarData.place"></el-input>
                    </el-form-item>
                    <el-form-item label="关联终端">
                        <el-input class="handle-input mr10" v-model="addCarData.imei"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="addCarSubmitForm">提交</el-button>
                        <el-button @click="addCarVisible=false"> 取消</el-button>
                    </el-form-item>

                </el-form>
            </el-dialog>

            <!-- 修改车辆信息 -->
            <el-dialog :visible.sync="editVisible" title="修改终端" width="30%">
                <el-form label-width="80px">
                    <el-form-item label="客户名称">
                        <el-select @change="editNameListGet" class="handle-input mr10"
                                   placeholder="请选择客户名称"
                                   v-model="editData.name">
                            <el-option
                                    :key="item.id"
                                    :label="item.text"
                                    :value="item.id"
                                    v-for="item in editData.nameList">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="车牌号">
                        <el-input class="handle-input mr10" v-model="editData.plateNo"></el-input>
                    </el-form-item>
                    <el-form-item label="车架号">
                        <el-input class="handle-input mr10" v-model="editData.vin"></el-input>
                    </el-form-item>
                    <el-form-item label="车辆品牌">
                        <el-input class="handle-input mr10" v-model="editData.brand"></el-input>
                    </el-form-item>
                    <el-form-item label="车辆型号">
                        <el-input class="handle-input mr10" v-model="editData.carModel"></el-input>
                    </el-form-item>
                    <el-form-item label="车牌颜色">
                        <el-input class="handle-input mr10" v-model="editData.carColor"></el-input>
                    </el-form-item>
                    <el-form-item label="所在省市">
                        <el-input class="handle-input mr10" v-model="editData.place"></el-input>
                    </el-form-item>
                    <el-form-item label="关联终端">
                        <el-input class="handle-input mr10" v-model="editData.imei"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="editSubmitForm">提交</el-button>
                        <el-button @click="editVisible=false"> 取消</el-button>
                    </el-form-item>

                </el-form>
            </el-dialog>

            <!-- 删除车辆信息 -->
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
                addCarVisible: false,          // 控制添加车辆弹出框
                editVisible: false,         // 控制编辑终端弹出框
                deleteVisible: false,       // 控制删除终端弹出框
                delId: '',                  // 删除终端的Id
                currentPage: 1,             // 分页的默认页数
                addCarData: {
                    nameId: '',             // 客户名称ID
                    name: '',               // 客户名称
                    plateNo: '',            // 车牌号
                    vin: '',                // 车架号
                    brand: '',              // 车辆品牌
                    carModel: '',           // 车辆型号
                    carColor: '',           // 车辆颜色
                    place: '',              // 所在省市
                    imei: '',               // 关联终端
                    id: '',                 // 传参ID
                },               // 添加车辆数据
                selectData: {               // 搜索框数据
                    plateNo: '',            // 车牌号
                    vin: '',                // 车架号
                    imei: '',               // 绑定终端
                    place: '',              // 省市信息
                },    // 搜索框数据
                editData: {
                    nameId: null,             // 客户名称ID
                    name: null,               // 客户名称
                    plateNo: null,            // 车牌号
                    vin: null,                // 车架号
                    brand: null,              // 车辆品牌
                    carModel: null,           // 车辆型号
                    carColor: null,           // 车辆颜色
                    place: null,              // 所在省市
                    imei: null,               // 关联终端
                    id: null,                 // 传参ID
                    nameList: null,
                },      // 修改数据
            };
        },
        methods: {
            getData() {          // 获取表格数据
                let api = '/carinfoManager/newListCarinfo/1/10/1/1/1/1';
                axios.get(api, {}).then(res => {
                    this.value = res.data.data.data.items;
                    this.total = res.data.data.data.pageBean.total;
                }).catch(error => {
                    console.log('Error', error.message)
                });
            },   // 获取表格数据

            addCar() {
                this.addCarVisible = true;
                this.addCarData.id = '';
                this.addCarData.plateNo = '';
                this.addCarData.vin = '';
                this.addCarData.brand = '';
                this.addCarData.carModel = '';
                this.addCarData.carColor = '';
                this.addCarData.place = '';
                this.addCarData.nameId = '';
                this.addCarData.imei = '';
                this.addCarData.name = '';
            },

            addNameIdGet() {                        // 获得添加车辆的客户名称
                let obj = {};
                obj = this.editData.nameList.find((item) => {
                    return item.id === this.addCarData.name; //筛选出匹配数据
                });
                this.addCarData.name = obj.text;

            },              // 获得添加车辆的客户名称

            addCarSubmitForm() {                        // 添加车辆信息数据提交
                this.addCarVisible = false;
                let list = JSON.parse(JSON.stringify(this.editData.nameList));

                list.forEach((item, index, array) => {
                    if (item.text === this.addCarData.name) {
                        this.addCarData.nameId = item.id;
                    }
                });
                let api = '/carinfoManager/addCarinfo';
                let params = new URLSearchParams();
                params.append('plateno', this.addCarData.plateNo);
                if (this.addCarData.vin !== '') {
                    params.append('vin', this.addCarData.vin);
                }
                if (this.addCarData.brand !== '') {
                    params.append('brand', this.addCarData.brand);
                }
                if (this.addCarData.carModel !== '') {
                    params.append('carmodel', this.addCarData.carModel);
                }
                if (this.addCarData.carColor !== '') {
                    params.append('carcolor', this.addCarData.carColor);
                }
                if (this.addCarData.place !== '') {
                    params.append('place', this.addCarData.place);
                }
                if (this.addCarData.imei !== '') {
                    params.append('imei', this.addCarData.imei);
                }
                params.append('memeberId', this.addCarData.nameId);
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
            },          // 添加车辆信息数据提交


            editSubmitForm() {              // 编辑终端数据提交
                this.editVisible = false;
                let api = '/carinfoManager/editCarinfo';
                let params = new URLSearchParams();
                params.append('id', this.editData.id);
                params.append('plateno', this.editData.plateNo);
                params.append('vin', this.editData.vin);
                params.append('brand', this.editData.brand);
                params.append('carmodel', this.editData.carModel);
                params.append('carcolor', this.editData.carColor);
                params.append('place', this.editData.place);
                params.append('memeberId', this.editData.nameId);
                console.log(111, this.editData.carColor );
                params.append('imei', this.editData.imei);
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
            },      // 编辑数据提交

            editNameListGet() {         // 编辑客户名称ID获取
                let obj = {};
                obj = this.editData.nameList.find((item) => {
                    return item.id === this.editData.name; //筛选出匹配数据
                });
                this.editData.name = obj.id;
            },      // 编辑客户名称ID获取

            handleEdit(index, row) {    // 编辑车辆
                this.editVisible = true;
                let list = JSON.parse(JSON.stringify(this.editData.nameList));

                list.forEach((item, index, array) => {
                    // 没有选择客户等级时，赋值默认客户等级
                    if (item.id == row.memberId) {
                        this.editData.name = item.text;
                        this.editData.nameId = item.id;
                    }
                });
                this.editData.id = row.id;
                this.editData.plateNo = row.plateno;
                this.editData.vin = row.vin;
                this.editData.brand = row.brand;
                this.editData.carModel = row.carmodel;
                this.editData.carColor = row.carcolor;

                this.editData.place = row.place;
                this.editData.imei = row.imei;
            },   // 编辑车辆

            handleDelete(index, row) {  // 删除车辆
                this.deleteVisible = true;
                this.delId = row.id;
            },   //  删除车辆

            deleteRow() {           // 确定删除数据
                this.deleteVisible = false;
                let api = '/carinfoManager/deleteCarinfo/' + this.delId;
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
                    this.editData.nameList = res.data;
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
                this.selectData.plateNo = '';
                this.selectData.vin = '';
                this.selectData.imei = '';
                this.selectData.place = '';
                this.getData();
                setTimeout(() => {
                    this.emptyDisabled = false
                }, 1000);
            },

            search() {                          // 搜索按钮
                this.searchDisabled = true;     // 按钮置灰
                let plateNo = 1;
                let vin = 1;
                let imei = 1;
                let place = 1;
                let api = '/carinfoManager/newListCarinfo/1/10/1/1/1/1';
                if (this.selectData.plateNo !== '') {    // 车牌号为空，给默认值1
                    plateNo = this.selectData.plateNo;
                }
                if (this.selectData.vin !== '') {  // 车架号为空，给默认值1
                    vin = this.selectData.vin;
                }
                if (this.selectData.imei !== '') {   // 绑定终端为空，给默认值1
                    imei = this.selectData.imei;
                }
                if (this.selectData.place !== '') {     // 省市信息为空，给默认值1
                    place = this.selectData.place;
                }

                if (                                        // 输入框 全部为空，则不进行Ajax请求
                    (this.selectData.plateNo !== '') ||
                    (this.selectData.vin !== '') ||
                    (this.selectData.imei !== '') ||
                    (this.selectData.place !== '')) {
                    api = '/carinfoManager/newListCarinfo/1/10/' + plateNo + '/' + imei +
                        '/' + vin + '/' + place;
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
                let api = '/carinfoManager/newListCarinfo/' + val + '/10/1/1/1/1';
                let plateNo = 1;
                let vin = 1;
                let imei = 1;
                let place = 1;

                if (this.selectData.plateNo !== '') {    // 车牌号为空，给默认值1
                    plateNo = this.selectData.plateNo;
                }
                if (this.selectData.vin !== '') {  // 车架号为空，给默认值1
                    vin = this.selectData.vin;
                }
                if (this.selectData.imei !== '') {   // 绑定终端为空，给默认值1
                    imei = this.selectData.imei;
                }
                if (this.selectData.place !== '') {     // 省市信息为空，给默认值1
                    place = this.selectData.place;
                }

                if (                                        // 输入框 全部为空，则不进行Ajax请求
                    (this.selectData.plateNo !== '') ||
                    (this.selectData.vin !== '') ||
                    (this.selectData.imei !== '') ||
                    (this.selectData.place !== '')) {
                    api = '/deviceManager/newListDevice/' + val + '/10/' + plateNo + '/' + imei +
                        '/' + vin + '/' + place;
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
