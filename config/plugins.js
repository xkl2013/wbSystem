export const plugins = [
    [
        'umi-plugin-react',
        {
            antd: true,
            dva: true,
            dynamicImport: {
                webpackChunkName: true,
                loadingComponent: '../src/ant_components/BISpin/index.js',
            },
            title: 'admin',
            chunks: ['vendors', 'umi'],
            dll: true,
            routes: {
                exclude: [/models\//, /services\//, /model\.(t|j)sx?$/, /service\.(t|j)sx?$/, /components\//],
            },
        },
    ],
    ['umi-plugin-polyfill'],
];
