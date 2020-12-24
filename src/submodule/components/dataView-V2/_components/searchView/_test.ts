export const columns = [
    {
        label: '序列',
        key: '1',
        span: 24,
        type: 'input',
        placeholder: "请输入标题名称"
    },
    {
        label: '发布时间',
        key: '2',
        type: 'date',
        span: 8,
        placeholder: "发布时间"
    },
    {
        label: '上次更新时间',
        key: '3',
        type: 'date',
        span: 8,
        placeholder: "发布时间"
    },
    {
        label: '发布状态',
        key: '4',
        type: 'checkbox',
        width: 110,
        span: 24,
        options: [{ id: 1, name: '已发布' }, { id: 2, name: '未发布' }]
    },
    {
        label: '分类',
        key: '5',
        type: 'checkbox',
        width: 110,
        span: 24,
        options: [{ id: 1, name: '专栏' }, { id: 2, name: '新闻' }, { id: 3, name: '通知' }]
    },
];