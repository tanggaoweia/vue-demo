<!--销售激活统计-->
<template>
    <div class="commits">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 销售激活统计</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">

            <!--            -->
            <div class="handle-box">

                <el-select v-model="selectData.selectMember" placeholder="客户信息" class="mr10">
                    <el-option
                            v-for="item in memberList"
                            :key="item.id"
                            :label="item.text"
                            :value="item.id">
                    </el-option>
                </el-select>

                <el-input class="handle-input mr10" placeholder="省市信息" v-model="selectData.proAndCityInfo"></el-input>
                <el-select v-model="selectData.selectType" placeholder="筛选方式" class="mr10" @change="typeChange">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>

                <div class="handle-input" v-if="yearShow">
                    <el-date-picker
                            v-model="selectData.year"
                            type="year"
                            value-format="yyyy"
                            placeholder="选择年">
                    </el-date-picker>
                </div>

                <div class="handle-input" v-if="monthShow">
                    <el-date-picker
                            v-model="selectData.month"
                            type="month"
                            value-format="yyyy/MM"
                            placeholder="选择月">
                    </el-date-picker>
                </div>

                <el-button @click="search" icon="el-icon-search" type="primary" :disabled="searchDisabled">搜索
                </el-button>
                <el-button @click="empty" icon="el-icon-delete" type="primary" :disabled="emptyDisabled">清空</el-button>
            </div>


            <!--            图表的显示-->
            <div class="MyAchievement">
                <div class="MyAchievement-echart">
                    <!--                    <div class="echart-title">我的业绩</div>-->
                    <div class="echart-content">
                        <div id="myChart" :style="{width: '1500px', height: '460px'}"></div>
                    </div>
                </div>
            </div>

            <!--       表格     -->
            <el-table :data="value" border class="table" ref="multipleTable">
                <el-table-column fixed label="序号" width="50" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.$index + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="时间" prop="time" show-overflow-tooltip></el-table-column>
                <el-table-column label="销售数量" prop="sell" show-overflow-tooltip></el-table-column>
                <el-table-column label="激活数量" prop="activation" show-overflow-tooltip></el-table-column>

            </el-table>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                chartShow: false,
                tableShow: false,
                yearShow: false,
                monthShow: true,
                searchDisabled: false,
                emptyDisabled: false,
                value: [],
                time: '',
                memberList: [{
                    id: -1,
                    text: '查询全部',
                }],
                options: [{
                    value: 1,
                    label: '月份',
                }, {
                    value: 2,
                    label: '年份',
                }],
                selectData: {
                    clientInfo: '',
                    proAndCityInfo: '',
                    selectType: '月份',
                    time: '',
                    selectMember: -1,
                    year: '',
                    month: '',
                },
                timeData: [],
                sellData: [],
                activationData: [],
            }
        },
        // mounted() {
        //     this.drawLine();
        // },
        methods: {

            typeChange() {
                this.selectData.year = '';
                this.selectData.month = '';
                if (this.selectData.selectType === 1) {
                    this.yearShow = false;
                    this.monthShow = true;
                } else {
                    this.yearShow = true;
                    this.monthShow = false;
                }
            },

            getMemberList() {
                let api = "/memberManager/listSelectMember";
                axios.get(api, {}).then(res => {
                    for (let i = 0; i < res.data.length; i++) {
                        this.memberList.push(res.data[i]);
                    }
                }).catch(error => {
                    console.log('Error', error.message)
                });
            },

            search() {
                this.value = [];
                let api = '';
                let pro = '';
                if (this.selectData.proAndCityInfo === '') {
                    pro = 1;
                } else {
                    pro = this.selectData.proAndCityInfo;
                }

                if (this.selectData.year !== '' && this.selectData.selectMember === -1) {
                    api = '/countManager/newCountCommonByYear/' + this.selectData.year + '/' + pro;
                } else if (this.selectData.month !== '' && this.selectData.selectMember === -1) {
                    api = '/countManager/newCountCommonByMonth/' + this.selectData.month + '/' + pro;
                } else if (this.selectData.year !== '') {
                    api = '/countManager/newCountByYear/' + this.selectData.year + '/' + this.selectData.selectMember + '/' + pro;
                } else if (this.selectData.month !== '') {
                    api = '/countManager/newCountByMonth/' + this.selectData.month + '/' + this.selectData.selectMember + '/' + pro;
                } else {
                    this.$message.warning("请选择日期")
                }
                this.getData(api);
                setTimeout(() => {  // 异步请求，等待数据
                    if (this.timeData === []) {
                        this.$message.warning("要给网速加加油了哦！~");
                    } else {
                        this.drawLine(this.timeData, this.sellData, this.activationData);
                    }
                }, 1000);

            },

            empty() {
            },

            getData(api) {
                axios.get(api, {}).then(res => {
                    this.selectData.year = '';
                    this.sellData.month = '';
                    this.timeData = res.data.time;
                    this.sellData = res.data.sell;
                    this.activationData = res.data.activation;
                    for (let i = 0; i < res.data.sell.length; i++) {
                        this.value.push({
                            "activation": res.data.activation[i],
                            "sell": res.data.sell[i],
                            "time": res.data.time[i]
                        })
                    }
                }).catch(error => {
                    console.log('Error', error.message)
                });
            },

            drawLine(timeData, sellData, activationData) {
                let myChart = this.$echarts.init(document.getElementById('myChart'));//获取容器元素
                let option = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        left: '6%',
                        right: '6%',
                        bottom: '6%',
                        containLabel: true
                    },
                    legend: {
                        data: ['销售', '激活'],
                        left: '6%',
                        top: 'top',
                        itemWidth: 15,//图例图标的宽
                        itemHeight: 15,//图例图标的高
                        textStyle: {
                            color: '#3a6186',
                            fontSize: 20,
                        }
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            magicType: {show: true, type: ['line', 'bar']},
                        },
                        right: '6%',
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category',
                            // data: ['01-01', '01-02', '01-03', '01-04', '01-05', '01-06', '01-07'],
                            data: timeData,
                            splitLine: {show: false},//去除网格分割线
                            axisTick: {//刻度
                                show: false//不显示刻度线
                            },
                            axisLine: {//坐标线
                                lineStyle: {
                                    type: 'solid',
                                    color: '#e7e7e7',//轴线的颜色
                                    width: '2'//坐标线的宽度
                                }
                            },
                            axisLabel: {
                                textStyle: {
                                    color: '#3a6186',//坐标值的具体的颜色
                                }
                            },
                            splitLine: {
                                show: false//去掉分割线
                            },
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            axisLine: {//线
                                show: false
                            },
                            axisTick: {//刻度
                                show: false
                            },
                            axisLabel: {
                                textStyle: {
                                    color: '#3a6186',//坐标值的具体的颜色
                                }
                            },
                            splitLine: {
                                lineStyle: {
                                    color: ['#e7e7e7'],//分割线的颜色
                                }
                            }
                        }
                    ],
                    series: [
                        {
                            name: '销售',
                            type: 'bar',
                            barWidth: 10,
                            // data: [20, 35, 55, 60, 120, 150, 140],
                            data: sellData,
                            itemStyle: {
                                normal: {
                                    color: '#00abf7',//设置柱子颜色
                                    label: {
                                        show: false,//柱子上显示值
                                        position: 'top',//值在柱子上方显示
                                        textStyle: {
                                            color: '#00abf7',//值的颜色
                                            fontSize: 10,
                                        }
                                    }
                                }
                            },
                        },
                        {
                            name: '激活',
                            type: 'bar',
                            barWidth: 10,
                            // data: [40, 50, 90, 110, 130, 160, 150],
                            data: activationData,
                            itemStyle: {
                                normal: {
                                    color: '#ff4f76',//设置柱子颜色
                                    label: {
                                        show: false,//柱子上显示值
                                        position: 'top',//值在柱子上方显示
                                        textStyle: {
                                            color: '#ff4f76',//值的颜色
                                            fontSize: 10,
                                        }
                                    }
                                }
                            },
                        }
                    ]
                };
                window.onresize = myChart.resize;
                myChart.setOption(option);//设置option
            }
        },
        created() {
            this.getMemberList();

        }
    }
</script>

<style lang="scss" scoped>
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

    /*.MyAchievement {*/
    /*    display: flex;*/
    /*    flex-direction: column;*/
    /*    padding: 0px 90px;*/
    /*}*/

    .MyAchievement .MyAchievement-echart {
        width: 100%;
        height: 570px;
        border-radius: 10px;
        border: 1px solid #d3d9e9;
        box-shadow: 4px 6px 10px -2px #d3d9e9;
        background-color: #fff;
        display: flex;
        flex-direction: column;
    }

    .MyAchievement-echart .echart-title {
        width: 100%;
        height: 70px;
        background-color: #00abf7;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        font-size: 26px;
        color: #fff;
        text-align: center;
        line-height: 75px;
    }

    .MyAchievement-echart .echart-content {
        width: 100%;
        height: 500px;
        display: flex;
        // align-items: center;
        justify-content: center;
    }

    .echart-content #myChart {
        margin-top: 35px;
    }
</style>