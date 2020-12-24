// 处理umi对应的webpack配置
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
import theme from './theme';
import host from '../src/config/host';

// 根据API_ENV环境不同分为debugger开发代理(api),development为使用dev的api,production为使用线上api
function getIp() {
    const interfaces = require('os').networkInterfaces(); // 在开发环境中获取局域网中的本机iP地址
    let IPAdress = '';
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                IPAdress = alias.address;
            }
        }
    }
    return IPAdress;
}

export const proxyHost = {
    localhost: 'http://192.168.16.252:8093', //链接本地调试
    development: host.development,
    feature: 'http://192.168.8.108:8096',
    production: host.production,
    mock: `http://${getIp()}:8000`,
};

const proxy_env = proxyHost[process.env.PROXY_ENV];

export const webpack = {
    publicPath: '/',
    define: {
        'process.env.ENV': process.env.ENV, // 开发环境
        'process.env.BUILD_ENV': process.env.BUILD_ENV, // 构建环境
        'process.env.LOGIN_TYPE': process.env.LOGIN_TYPE, // 登录环境
        'process.env.PROXY_ENV': process.env.PROXY_ENV, // 代理环境
        CDN_PATH: 'https://static.mttop.cn/admin',
        CDN_HOST: 'https://static.mttop.cn',
    },
    alias: {
        '@': require('path').resolve(__dirname, 'src'),
    },
    theme: theme,
    uglifyJSOptions: (opts) => {
        opts.uglifyOptions.mangle.safari10 = true;
        return opts;
    },
    proxy: {
        '/nodeApi': {
            target: `${proxy_env}${process.env.PROXY_ENV !== 'localhost' ? '/nodeApi' : ''}`,
            changeOrigin: true,
            pathRewrite: { '^/nodeApi': '' },
        },
        '/ws': {
            target: `${host[process.env.BUILD_ENV]}/cms`,
            changeOrigin: true,
            pathRewrite: { '^/ws': '' },
            ws: true,
        },
        '/adminApi': {
            target: `${proxy_env}${process.env.PROXY_ENV !== 'localhost' ? '/adminApi' : ''}`,
            changeOrigin: true,
            pathRewrite: { '^/adminApi': '' },
        },
        '/loginApi': {
            target: `${proxy_env}${process.env.PROXY_ENV !== 'localhost' ? '/loginApi' : ''}`,
            changeOrigin: true,
            pathRewrite: { '^/loginApi': '' },
        },
        '/crmApi': {
            target: `${proxy_env}${process.env.PROXY_ENV !== 'localhost' ? '/crmApi' : ''}`,
            changeOrigin: true,
            pathRewrite: { '^/crmApi': '' },
        },
        '/approvalApi': {
            target: `${proxy_env}${process.env.PROXY_ENV !== 'localhost' ? '/approvalApi' : ''}`,
            changeOrigin: true,
            pathRewrite: { '^/approvalApi': '' },
        },
    },
};
if (process.env.ENV !== 'development') {
    webpack.externals = {
        react: 'window.React',
        'react-dom': 'window.ReactDOM',
        lodash: 'window._',
        moment: 'window.moment',
    };
    webpack.chainWebpack = function(config, { webpack }) {
        const optimization = {
            minimize: true,
            splitChunks: {
                chunks: 'async',
                minSize: 30000,
                minChunks: 1,
                automaticNameDelimiter: '.',
                cacheGroups: {
                    vendor: {
                        name: 'vendors',
                        test: /^.*node_modules[\\/].*$/,
                        chunks: 'all',
                        priority: 10,
                    },
                    // vendor: {
                    //     name: 'vendors',
                    //     test: /^.*node_modules[\\/](?!antd|rc-.*).*$/,
                    //     chunks: 'all',
                    //     priority: 10,
                    // },
                    // antd: {
                    //     name: 'antd',
                    //     test: /[\\/]node_modules[\\/]antd[\\/]/,
                    //     chunks: 'all',
                    //     priority: 9,
                    //     minChunks: 1,
                    // },
                    // rc: {
                    //     name: 'rc-com',
                    //     test: /[\\/]node_modules[\\/]rc-.*/,
                    //     chunks: 'all',
                    //     priority: 10,
                    // },
                },
            },
        };
        config.merge(
            process.env.NODE_ENV === 'production'
                ? {
                      optimization,
                  }
                : {},
        );
    };
}
