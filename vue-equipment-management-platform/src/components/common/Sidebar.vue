<template>
    <div class="sidebar">
        <el-menu
                class="sidebar-el-menu"
                :default-active="onRoutes"
                :collapse="collapse"
                background-color="#324157"
                text-color="#bfcbd9"
                active-text-color="#20a0ff"
                unique-opened
                router
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu
                                    v-if="subItem.subs"
                                    :index="subItem.index"
                                    :key="subItem.index"
                            >
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                        v-for="(threeItem,i) in subItem.subs"
                                        :key="i"
                                        :index="threeItem.index"
                                >{{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                    v-else
                                    :index="subItem.index"
                                    :key="subItem.index"
                            >{{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';

    export default {
        data() {
            return {
                collapse: false,
                items: [
                    {
                        icon: 'el-icon-lx-home',
                        index: 'home',
                        title: '系统首页'
                    },
                    {
                        icon: 'el-icon-s-custom',
                        index: '1',
                        title: '管理员中心',
                        subs: [
                            {
                                index: 'deviceRelations',
                                title: '设备关联',
                            },
                            {
                                index: 'customerInfo',
                                title: '客户信息',
                            }, {
                                index: 'orderInfo',
                                title: '订单信息',
                            }, {
                                index: 'terminalInfo',
                                title: '终端信息',
                            },
                            {
                                index: 'carInfo',
                                title: '车辆信息',
                            },
                            {
                                index: 'logInfo',
                                title: '日志信息',
                            },

                        ]
                    },
                    {
                        icon: 'el-icon-pie-chart',
                        index: '2',
                        title: '运营统计',
                        subs: [
                            {
                                index: 'salesActivationStatistics',
                                title: '销售激活统计',
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-user',
                        index: '4',
                        title: '个人中心',
                        subs: [
                            {
                                index: 'changePassword',
                                title: '修改密码',
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-top',
                        index: '5',
                        title: '设备升级',
                        subs: [
                            {
                                index: 'apkInfo',
                                title: 'apk信息',
                            },
                            {
                                index: 'upgradeSet',
                                title: '升级设置',
                            }, {
                                index: 'upgradeInfo',
                                title: '升级信息',
                            }

                        ]
                    },
                ]
            };
        },
        computed: {
            onRoutes() {
                return this.$route.path.replace('/', '');
            }
        },
        created() {
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
                bus.$emit('collapse-content', msg);
            });
        }
    };
</script>

<style scoped>
    .sidebar {
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom: 0;
        overflow-y: scroll;
    }

    .sidebar::-webkit-scrollbar {
        width: 0;
    }

    .sidebar-el-menu:not(.el-menu--collapse) {
        width: 250px;
    }

    .sidebar > ul {
        height: 100%;
    }
</style>
