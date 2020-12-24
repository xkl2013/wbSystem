// 获取table列表头
export default function columnsFn() {
    const columns = [
        {
            title: '公司主体',
            dataIndex: 'reimbursePayCompanyName',
            align: 'center',
        },
        {
            title: '开户行',
            dataIndex: 'reimbursePayBankAddress',
            align: 'center',
        },
        {
            title: '银行帐号',
            dataIndex: 'reimbursePayBankAcountNo',
            align: 'center',
        },
    ];
    return columns || [];
}
