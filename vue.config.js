const webpack = require('webpack')
module.exports = {
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery'
            })
            ],
        resolve: {
            alias: {
                'assets': '@/assets',
                'common': '@/common',
                'components': '@/components',
                'network': '@/network',
                'views': '@/views',
                'plugins': '@/plugins',
            }
        }
    },
    devServer: {
        proxy: {
            '/api': {
                target: 'http://www.codeman.ink:3000',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
}