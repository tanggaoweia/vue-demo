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
                <el-input class="handle-input mr10" placeholder="终端ID"
                          v-model="selectData.imei"></el-input>

                <el-select v-model="selectData.logType" placeholder="请选择日志类型" class="handle-input mr10">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>

                <el-date-picker class="handle-input mr10"
                                v-model="selectData.startData"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="开始时间">
                </el-date-picker>

                <el-date-picker class="handle-input mr10"
                                v-model="selectData.endData"
                                value-format="yyyy-MM-dd"
                                type="date"
                                placeholder="结束时间">
                </el-date-picker>

                <el-button @click="search" icon="el-icon-search" type="primary" :disabled="searchDisabled">搜索
                </el-button>
                <el-button @click="empty" icon="el-icon-delete" type="primary" :disabled="emptyDisabled">清空</el-button>
                <el-button @click="delPageLog" class="left" icon="el-icon-circle-plus" type="primary">删除本页日志</el-button>
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
                <el-table-column label="日志名称" prop="filename" show-overflow-tooltip></el-table-column>
                <el-table-column label="日志类型">
                    <template slot-scope="scope">
                        <el-button :type="buttonType[scope.row.logtype]">{{logDetail[scope.row.logtype]}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip sortable></el-table-column>
                <el-table-column align="center" label="操作" show-overflow-tooltip width="250%">
                    <template slot-scope="scope">
                        <el-button @click="handlePreview(scope.$index, scope.row)" icon="el-icon-view" type="text">预览
                        </el-button>
                        <el-button @click="handleDownload(scope.$index, scope.row)" icon="el-icon-bottom" type="text">下载
                        </el-button>
                        <el-button @click="handleDelete(scope.$index, scope.row)" icon="el-icon-delete" type="danger">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--            -->

            <!-- 删除本页日志的弹出提示框 -->
            <el-dialog :visible.sync="delPageLogVisible" title="删除本页日志" width="30%">
                <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
                <span class="dialog-footer" slot="footer">
                    <el-button @click="delPageLogVisible = false">取 消</el-button>
                    <el-button @click="delPageAll" type="primary">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 预览弹出框 -->
            <el-dialog :visible.sync="previewVisible" title="预览" width="85%">
                <div class="blog-content" v-html="contentText"></div>
            </el-dialog>

            <!-- 删除日志的弹出提示框 -->
            <el-dialog :visible.sync="delRowVisible" title="删除本页日志" width="30%">
                <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
                <span class="dialog-footer" slot="footer">
                    <el-button @click="delRowVisible = false">取 消</el-button>
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
                selectData: {
                    startData: '',              // 开始时间
                    endData: '',                // 结束时间
                    imei: '',                   // 终端ID
                    logType: '',                // 日志类型
                },
                current: 1,                // 页数
                searchDisabled: false,      // 搜索框是否可点击
                emptyDisabled: false,       // 清空框是否可点击
                value: [],                  // 表格数据
                total: 1,                   // 数据总条数
                delPageLogVisible: false,   // 控制删除本页日志弹出框
                previewVisible: false,      // 预览弹出框
                delRowVisible: false,       // 删除弹出框
                contentText: '',            // 预览的文案
                delId: '',                  // 删除行的ID
                options: [{
                    value: 1,
                    label: '查询全部',
                }, {
                    value: 0,
                    label: '正常',
                }, {
                    value: 2,
                    label: '异常',
                }],
                logDetail: {0: "正常", 2: "异常"},      // 日志类型映射
                buttonType: {0: "success", 2: "danger"},    // 日志类型的按钮类型映射
                currentPage: 1,             // 分页的默认页数
            };
        },
        methods: {

            delPageLog() {
                this.delPageLogVisible = true;
            },

            delPageAll() {           // 删除本页日志
                this.delPageLogVisible = false;
                let logIds = '';
                for (let i = 0; i < this.value.length; i++) {
                    logIds += this.value[i].id + ",";
                }
                logIds = logIds.slice(0, -1);
                let api = "/logManager/deletePageLog";
                let params = new URLSearchParams();
                params.append("logids", logIds);
                axios.post(api, params).then((val => {
                    let code = val.data.code;
                    let message = val.data.message;
                    if (code === 1) {
                        this.$message.success(message);
                        this.currentPage -= 1;
                        if (this.currentPage === 0) {
                            this.currentPage = 1
                        }
                        api = "/logManager/listlog/" + this.currentPage + "/10/1/1/1/1";
                        axios.get(api, {}).then(res => {
                            this.value = res.data.data.data.items;
                            this.total = res.data.data.data.pageBean.total;
                        }).catch(error => {
                            console.log('Error', error.message)
                        });
                    } else {
                        this.$message.err(message);
                    }
                })).catch(error => {
                    console.log('Error', error.message)
                });
            },      // 删除本页日志

            getData() {          // 获取表格数据
                let api = '/logManager/listlog/1/10/1/1/1/1';
                axios.get(api, {}).then(res => {
                    this.value = res.data.data.data.items;
                    this.total = res.data.data.data.pageBean.total;
                    this.current = res.data.data.data.pageBean.current;
                }).catch(error => {
                    console.log('Error', error.message)
                });
            },   // 获取表格数据

            handleDownload(index, row) {        // 日志下载
                let filePath = row.filepath;
                let api = "/logManager/logdownload?filepath=" + filePath;
                axios.get(api, {}).then((val => {
                    console.log(val)
                })).catch(error => {
                    console.log('Error', error.message)
                })
            },

            handlePreview(index, row) {
                this.contentText = '';
                this.previewVisible = true;
                let filePath = row.filepath;
                let api = "/logManager/preview";
                let params = new URLSearchParams();
                params.append("filepath", filePath);
                axios.post(api, params).then((val => {
                    let ret = val.data.content.split('\n');
                    for (let i = 0; i < ret.length; i++) {
                        this.contentText += '<div>' + ret[i] + '</div>'
                    }
                })).catch(error => {
                    console.log('Error', error.message)
                });


            },  // 预览

            handleDelete(index, row) {  // 删除车辆
                this.delRowVisible = true;
                this.delId = row.id;
            },   //  删除车辆

            deleteRow() {           // 确定删除数据
                this.delRowVisible = false;
                let api = '/logManager/deleteLog/' + this.delId;
                axios.post(api, {}).then(val => {
                    let code = val.data.code;
                    let message = val.data.message;
                    if (code === 1) {
                        this.$message.success(message);
                        api = "/logManager/listlog/" + this.currentPage + "/10/1/1/1/1";
                        axios.get(api, {}).then(res => {
                            this.value = res.data.data.data.items;
                            this.total = res.data.data.data.pageBean.total;
                        }).catch(error => {
                            console.log('Error', error.message)
                        });
                    } else if (code === 200) {
                        this.$message.warning(message);
                    } else {
                        this.$message.error(message);
                    }
                }).catch(error => {
                    console.log('Error', error.message)
                })


            },              // 确定删除数据


            empty() {       // 清空搜索框重置数据

                this.emptyDisabled = true;
                this.selectData.startData = '';
                this.selectData.endData = '';
                this.selectData.imei = '';
                this.selectData.logType = '';
                this.getData();
                setTimeout(() => {
                    this.emptyDisabled = false
                }, 1000);
            },

            search() {                          // 搜索按钮
                this.searchDisabled = true;     // 按钮置灰
                let imei = 1;
                let logType = 1;
                let startData = 1;
                let endData = 1;
                if (this.selectData.imei !== '') {
                    imei = this.selectData.imei
                }
                if (this.selectData.logType !== '') {
                    logType = this.selectData.logType;
                }
                if (this.selectData.startData !== '' || this.selectData.imei === null) {
                    startData = this.selectData.startData;
                }
                if (this.selectData.endData !== '' || this.selectData.imei === null) {
                    endData = this.selectData.endData;
                }
                let api = '/logManager/listlog/1/10/' + imei + '/' + logType +
                    '/' + startData + '/' + endData;
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
                let imei = 1;
                let logType = 1;
                let startData = 1;
                let endData = 1;
                if (this.selectData.imei !== '') {
                    imei = this.selectData.imei
                }
                if (this.selectData.logType !== '') {
                    logType = this.selectData.logType;
                }
                if (this.selectData.startData !== '') {
                    startData = this.selectData.startData;
                }
                if (this.selectData.endData !== '') {
                    endData = this.selectData.endData;
                }
                let api = '/logManager/listlog/' + val + '/10/' + imei + '/' + logType +
                    '/' + startData + '/' + endData;
                axios.get(api, {}).then(res => {
                    this.value = res.data.data.data.items;
                    this.current = res.data.data.data.pageBean.current;
                }).catch(error => {
                    console.log('Error', error.message)
                })
            },       // 分页显示
        },
        created() {     //初始化操作
            this.getData();             // 初始化表格数据
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
