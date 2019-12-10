import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    mode: 'history',  //去掉url中的#
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/',
            component: () => import('../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                 {
                    path: '/deviceRelations',
                    component: () => import( '../components/page/DeviceRelations.vue'),
                    meta: { title: '设备关联' }
                },
                 {
                    path: '/customerInfo',
                    component: () => import( '../components/page/CustomerInfo.vue'),
                    meta: { title: '客户信息' }
                },
                 {
                    path: '/orderInfo',
                    component: () => import( '../components/page/OrderInfo.vue'),
                    meta: { title: '订单信息' }
                },
                 {
                    path: '/terminalInfo',
                    component: () => import( '../components/page/TerminalInfo.vue'),
                    meta: { title: '终端信息' }
                },
                 {
                    path: '/carInfo',
                    component: () => import('../components/page/CarInfo.vue'),
                    meta: { title: '车辆信息' }
                },
                 {
                    path: '/logInfo',
                    component: () => import('../components/page/LogInfo.vue'),
                    meta: { title: '日志信息' }
                },
                 {
                    path: '/salesActivationStatistics',
                    component: () => import('../components/page/SalesActivationStatistics.vue'),
                    meta: { title: '销售激活统计' }
                },
                {
                    path: '/changePassword',
                    component: () => import('../components/page/ChangePassword.vue'),
                    meta: { title: '修改密码' }
                },
                {
                    path: '/home',
                    component: () => import('../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/apkInfo',
                    component: () => import('../components/page/ApkInfo.vue'),
                    meta: { title: 'apk信息设置'}
                },
                {
                    path: '/upgradeSet',
                    component: () => import('../components/page/UpgradeSet.vue'),
                    meta: { title: 'apk信息设置'}
                },
                {
                    path: '/upgradeInfo',
                    component: () => import('../components/page/UpgradeInfo.vue'),
                    meta: { title: 'apk信息设置'}
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue')
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});
