// 获取table列表头
export default function columnsFn() {
    const columns = [
        {
            title: '公司主体',
            dataIndex: 'applicationPayCompanyName',
            align: 'center',
        },
        {
            title: '开户行',
            dataIndex: 'applicationPayBankAddress',
            align: 'center',
        },
        {
            title: '银行帐号',
            dataIndex: 'applicationPayBankAcountNo',
            align: 'center',
        },
    ];
    return columns || [];
}
