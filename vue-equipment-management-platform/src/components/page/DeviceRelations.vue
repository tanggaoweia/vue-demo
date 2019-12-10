<!--设备关联-->
<template>
    <div class="customerInfo">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-reading"></i> 设备关联</el-breadcrumb-item>
            </el-breadcrumb>
        </div>


        <div class="container">
            <!--            设备关联新增form-->
            <div class="form-box ">
                <el-form :model="ruleForm" :rules="rules" label-width="50%" ref="ruleForm">
                    <el-form-item label="客户名称" prop="selectMember">
                        <el-select @change="memberGet" class="handle-input "
                                   placeholder="请选择客户等级"
                                   v-model="ruleForm.selectMember" style="width: 150%">
                            <el-option
                                    :key="item.id"
                                    :label="item.text"
                                    :value="item.id"
                                    v-for="item in ruleForm.memberList">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="终端ID" prop="imei">
                        <el-input class="handle-input mr10" v-model="ruleForm.imei" style="width: 150%"></el-input>
                    </el-form-item>
                    <el-form-item label="终端型号">
                        <el-input class="handle-input mr10" type="text" v-model="ruleForm.projectNo"
                                  style="width: 150%"></el-input>
                    </el-form-item>
                    <el-form-item label="终端批次">
                        <el-input class="handle-input mr10" v-model="ruleForm.version" style="width: 150%"></el-input>
                    </el-form-item>
                    <el-form-item label="终端sn号">
                        <el-input class="handle-input mr10" v-model="ruleForm.sn" style="width: 150%"></el-input>
                    </el-form-item>
                    <el-form-item label="终端mac">
                        <el-input class="handle-input mr10" v-model="ruleForm.mac" style="width: 150%"></el-input>
                    </el-form-item>
                    <el-form-item label="车牌号">
                        <el-input class="handle-input mr10" v-model="ruleForm.plateNo" style="width: 150%"></el-input>
                    </el-form-item>
                    <el-form-item label="车架号">
                        <el-input class="handle-input mr10" v-model="ruleForm.vin" style="width: 150%"></el-input>
                    </el-form-item>
                    <el-form-item label="城市">
                        <el-input class="handle-input mr10" v-model="ruleForm.citySet" style="width: 150%"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button :disabled="disabled" @click="submitForm('ruleForm')" type="primary">提交</el-button>
                        <el-button @click="addVisible = true" type="primary">导入excel数据</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <!--            导入excel弹出框-->
            <el-dialog :visible.sync="addVisible" title="设备数据导入" width="30%">
                <el-upload
                        class="upload-demo"
                        :before-upload="beforeUpload"
                        :drag='true'
                        action=''
                        :http-request="uploadFile"
                        :limit="1"
                        :on-exceed="handleExceed"
                        multiple>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">请上传xls，xlsx后缀Excel文件</div>
                </el-upload>
            </el-dialog>
        </div>
        <!--            -->
    </div>
</template>

<script>

    export default {
        data() {
            let checkImei = (rules, value, callback) => {    //校验客户账号不能为空
                if (!value) {
                    return callback(new Error('终端ID不能为空'));
                }
                setTimeout(() => {
                    callback();
                }, 1000);
            };  // 检查客户账号数据
            let checkSelectMember = (rules, value, callback) => {  //校验客户等级不能为空
                if (!value) {
                    return callback(new Error('客户名称不能为空'));
                }
                setTimeout(() => {
                    callback();
                }, 1000);
            };  //检查选择的客户等级数据
            return {
                addVisible: false,      // 控制excel导入数据弹出框
                disabled: false,        // 控制按钮是否可点击
                ruleForm: {             // 输入框数据
                    selectMember: '',   // 选择的客户名称
                    selectMemberId: -1, // 选择的客户名称ID
                    memberList: [],     // 选择的客户名称列表
                    projectNo: '',      // 终端型号
                    version: '',        // 终端批次
                    sn: '',             // 终端sn
                    mac: '',            // 终端mac
                    citySet: '',        // 城市
                    imei: '',           // 终端ID
                    vin: '',            // 车架号
                    plateNo: '',        // 车牌号
                },
                rules: {                // 客户名称和终端ID 非空校验
                    imei: [             // 终端ID非空校验
                        {validator: checkImei, trigger: 'blur'}
                    ],
                    selectMember: [     // 客户名称非空校验
                        {validator: checkSelectMember, trigger: 'blur'}
                    ],
                },
            };
        },
        methods: {
            beforeUpload(file) {  //判断文件格式

                let hz = file.name.split(".")[1];
                if (hz !== 'xlsx' && hz !== 'xls') {
                    this.$message.warning(`请上传xls，xlsx后缀Excel文件`);
                    return false;
                }
            },

            handleExceed(files, fileList) {   // 上传文件个数超过定义的数量
                this.$message.warning(`当前限制选择 1 个文件，请删除后继续上传`)
            },

            uploadFile(item) {   // 上传文件
                console.log(item.file);
                let api = '/upload/uploadfile';
                let fileObj = item.file;
                const param = new FormData(); // FormData 对象
                param.append("file", fileObj);
                let config = {
                    headers: {"Content-Type": "multipart/form-data"},
                };
                axios.post(api, param, config).then((val => {
                            let code = val.data.code;
                            let message = val.data.message;
                            if (code === responseSuccessCode) {
                                this.$message.success(message);
                            } else if (code === 200) {
                                this.$message.warning(message);
                            }  else {
                                this.$message.error(message);
                            }
                        })).catch(error => {
                            console.log('Error', error.message)
                        });
                 setTimeout(() => {
                     this.addVisible = false;
                }, 1000);

            },


            memberGet() {  // 获得选择的客户名称ID
                let obj = {};
                obj = this.ruleForm.memberList.find((item) => {
                    return item.id === this.ruleForm.selectMember;//筛选出匹配数据
                });
                this.ruleForm.selectMemberId = obj.id;
            },  // 获得选择的客户名称ID

            submitForm(formName) {      // 提交表单信息
                this.disabled = true;
                this.$refs[formName].validate((valid) => {
                    let api = '/deviceManager/newAddDeviceByAdmin';
                    if (valid && (this.ruleForm.selectMemberId !== -1)) {   // 校验非空项是否合法
                        let params = new URLSearchParams();
                        params.append('memberId', this.ruleForm.selectMemberId);
                        params.append('projectNo', this.ruleForm.projectNo);
                        params.append('version', this.ruleForm.version);
                        params.append('sn', this.ruleForm.sn);
                        params.append('mac', this.ruleForm.mac);
                        params.append('citySet', this.ruleForm.citySet);
                        params.append('imei', this.ruleForm.imei);
                        params.append('vin', this.ruleForm.vin);
                        params.append('plateno', this.ruleForm.plateNo);
                        axios.post(api, params).then((val => {
                            let code = val.data.code;
                            let message = val.data.message;
                            if (code === responseSuccessCode) {
                                this.$message.success(message);
                            } else if (code === 200) {
                                this.$message.warning(message);
                            } else {
                                this.$message.error(message);
                            }
                        })).catch(error => {
                            console.log('Error', error.message)
                        });


                    }
                });
                setTimeout(() => {
                    this.disabled = false
                }, 1000);
                // this.disabled = false

            },  // 提交表单信息

        },
        created() {                     // 初始化数据
            let api = "/memberManager/listSelectMember";
            axios.get(api, {}).then(res => {
                this.ruleForm.memberList = res.data;
            }).catch(error => {
                console.log('Error', error.message)
            });

        }

    }
</script>

<style scoped>


    .handle-input {
        width: 300px;
        display: inline-block;
    }


    .mr10 {
        margin-right: 10px;
    }

</style>
