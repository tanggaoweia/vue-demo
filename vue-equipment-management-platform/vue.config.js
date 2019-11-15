module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/apis': {
                target: 'http://10.1.1.43:8080',//请求域名
                //secure: false, // 如果是https接口，需要配置这个参数
                changeOrigin: true,//如果是跨域访问，需要配置这个参数
                pathRewrite: {
                    '^/apis': '/'
                }
            }
        }
    }
};