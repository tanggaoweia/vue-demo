<style scoped>
.align{
    display: flex;
    align-items: center;
}
.alignT{
    display: flex;
    align-items: flex-start;
}
.iconBtn{
    color: #409EFF;
    font-size: 26px;
    cursor: pointer;
}
</style>
<template>
    <div>
        <el-form :model="formData" ref="formData" status-icon style="width:100%;">
            <!-- 参数输入 -->
            <el-row>信息输入：</el-row>
            <el-row :gutter="30">
                <el-col :span="20">
                    <el-row
                        :gutter="20"
                        v-for="(item,index) in formData.list"
                        :key="index"
                        class="alignT spaceTop1">
                        <el-col :span=".5">
                            <i class="iconBtn" @click="listMethod(index)" :class="{'el-icon-circle-plus-outline': index == 0,'el-icon-remove-outline': index>0}" style="margin-top:6px;"></i>
                        </el-col>
                            <el-col :span="10">
                                <el-form-item :prop="'list[' + index + '].name'" :rules="{validator: rule_name,trigger: 'blur'}">
                                    <el-input placeholder="请输入名称" v-model="item.name" auto-complete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item  :prop="'list[' + index + '].age'"  :rules="{validator: rule_age,trigger: 'blur'}">
                                    <el-input placeholder="请输入年龄" v-model="item.age" auto-complete="off"></el-input>
                                </el-form-item>
                            </el-col>
                    </el-row>
                </el-col>
            </el-row>

            <!-- 按钮 -->
            <el-row>
                <el-col :span=".5">
                    <el-form-item>
                        <el-button type="primary" @click="submit('formData')">提交</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: 'elementForm',            /* element-ui表单验证 */
        data() {
            return {
                formData: {
                    list: [{name: '',age: ''}]
                }
            };
        },
        mounted() {
        },
        methods: {
            // 表单增减操作
            listMethod(n) {
                if (n > 0) {
                    this.formData.list.splice(n,1);
                }else{
                    let o = {name: '',age: ''};
                    this.formData.list.push(o);
                };
            },
            // 姓名校验方法
            rule_name(rule,value,callback) {
                console.log(value);
                // 姓名不能为空
                if (!value) {
                    return callback(new Error('请输入姓名'));
                };
                callback();
            },
            // 年龄校验方法
            rule_age(rule,value,callback) {
                if (!value) {
                    return callback(new Error('请输入年龄'));
                };

                let n = Number(value);

                if (n < 1) {
                    return callback(new Error('年龄不能小于1岁'));
                };

                if (n > 200) {
                    return callback(new Error('年龄不能大于200岁'));
                };

                callback();
            },
            // 提交
            submit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (!valid) {
                        // 验证不通过禁止提交
                        console.log('验证不通过');
                        return false;
                    };

                    console.log('验证通过');
                });
            }
        }
    };
</script>
