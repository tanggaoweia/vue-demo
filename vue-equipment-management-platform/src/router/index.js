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
                    path: '/icon',
                    component: () => import(/* webpackChunkName: "icon" */ '../components/page/Icon.vue'),
                    meta: { title: '自定义图标' }
                },
                {
                    path: '/table',
                    component: () => import(/* webpackChunkName: "table" */ '../components/page/BaseTable.vue'),
                    meta: { title: '基础表格' }
                },
                {
                    path: '/tabs',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/Tabs.vue'),
                    meta: { title: 'tab选项卡' }
                },
                {
                    path: '/form',
                    component: () => import(/* webpackChunkName: "form" */ '../components/page/BaseForm.vue'),
                    meta: { title: '基本表单' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: () => import(/* webpackChunkName: "editor" */ '../components/page/VueEditor.vue'),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: () => import(/* webpackChunkName: "markdown" */ '../components/page/Markdown.vue'),
                    meta: { title: 'markdown编辑器' }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: () => import(/* webpackChunkName: "upload" */ '../components/page/Upload.vue'),
                    meta: { title: '文件上传' }
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: () => import(/* webpackChunkName: "chart" */ '../components/page/BaseCharts.vue'),
                    meta: { title: 'schart图表' }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: () => import(/* webpackChunkName: "drag" */ '../components/page/DragList.vue'),
                    meta: { title: '拖拽列表' }
                },
                {
                    // 拖拽Dialog组件
                    path: '/dialog',
                    component: () => import(/* webpackChunkName: "dragdialog" */ '../components/page/DragDialog.vue'),
                    meta: { title: '拖拽弹框' }
                },
                {
                    // 国际化组件
                    path: '/i18n',
                    component: () => import(/* webpackChunkName: "i18n" */ '../components/page/I18n.vue'),
                    meta: { title: '国际化' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                },
                {
                    path: '/donate',
                    component: () => import(/* webpackChunkName: "donate" */ '../components/page/Donate.vue'),
                    meta: { title: '支持作者' }
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
