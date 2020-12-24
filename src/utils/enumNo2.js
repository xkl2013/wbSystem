// 发票类型
export const reimburseInvoiceType = [
    { id: 'FPLX001', name: '专票' },
    { id: 'FPLX002', name: '普票' },
    { id: 'FPLX003', name: '滴滴' },
    { id: 'FPLX004', name: '机票+燃油费' },
    { id: 'FPLX005', name: '铁路客票' },
    { id: 'FPLX006', name: '公路客票' },
    { id: 'FPLX007', name: '水路客票' },
    { id: 'FPLX008', name: '其他客票' },
];
// 发票率
export const reimburseTaxRate = [{ id: 'SL1', name: '3%' }, { id: 'SL2', name: '6%' }, { id: 'SL3', name: '9%' }];
// 回款状态

export const contractMoneyStatus = [
    { id: 1, name: '未回款' },
    { id: 2, name: '部分回款' },
    { id: 3, name: '全部回款' },
];
// 合同进展
export const contractProgressStatus = [
    { id: 1, name: '未执行' },
    { id: 2, name: '执行中' },
    { id: 3, name: '执行完毕' },
];
export const contractCategory = [{ id: 0, name: '主合同' }, { id: 1, name: '子合同' }];
const enumData = {
    reimburseInvoiceType,
    reimburseTaxRate,
};
enumData.formateEnum = (type, id) => {
    const originData = enumData[type] || [];
    const obj = originData.find((item) => {
        return String(item.id) === String(id);
    }) || {};
    return obj.name || '';
};
export default enumData;
