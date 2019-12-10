<!--修改密码-->
<template>
    <div class="customerInfo">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-reading"></i> 修改密码</el-breadcrumb-item>
            </el-breadcrumb>
        </div>


        <div class="container">
            <!--            设备关联新增form-->
            <div class="form-box ">
                <el-form label-width="50%" ref="ruleForm">

                    <el-form-item label="原密码">
                        <el-input class="handle-input mr10" v-model="oldPwd" style="width: 150%" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码">
                        <el-input class="handle-input mr10" v-model="newPwd" style="width: 150%" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码">
                        <el-input class="handle-input mr10" v-model="newPwd2" style="width: 150%" type="password"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button :disabled="disabled" @click="submitForm" type="primary">提交</el-button>
                    </el-form-item>
                </el-form>
            </div>

        </div>
        <!--            -->
    </div>
</template>

<script>

    export default {
        data() {

            return {
                disabled: false,        // 控制按钮是否可点击
                oldPwd: '',             // 原密码
                newPwd: '',             // 新密码
                newPwd2: '',            // 新密码
            };
        },
        methods: {
            submitForm() {      // 提交表单信息
                this.disabled = true;
                let api = '/memberManager/alertPwd';
                if ((this.oldPwd !== '') && (this.newPwd !== '') && (this.newPwd2 !== '')) {
                    let params = new URLSearchParams();
                    params.append('oldPwd', this.oldPwd);
                    params.append('newPwd', this.newPwd);
                    params.append('newPwd2', this.newPwd2);
                    axios.post(api, params).then((val => {
                        let code = val.data.code;
                        let message = val.data.message;
                        if (code === responseSuccessCode) {
                            this.$message.success(message);
                            localStorage.removeItem('ms_username');
                            setTimeout(() => {
                                this.$router.push('/login');
                            }, 1000);
                        } else {
                            this.oldPwd = '';
                            this.newPwd = '';
                            this.newPwd2 = '';
                            this.$message.error(message);
                        }
                    })).catch(error => {
                        console.log('Error', error.message)
                    });
                } else {
                    this.$message.warning("三个框，你丫填了几个？");
                }
                setTimeout(() => {
                    this.disabled = false
                }, 1000);

            },  // 提交表单信息
        },
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
