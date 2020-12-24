import styles from '../../index.less';
import { getOptionName } from '@/utils/utils';
import { REIMBURSE_INVOICE_TYPE, REIMBURSE_TAX_RATE } from '@/utils/enum';
import { accAdd, accDiv, accMul, accSub } from '@/utils/calculate';
import { renderTxt } from '@/utils/hoverPopover';

function changePayApply(obj, props, item) {
    const { formData } = props.state;
    let reimbursePayApply = item.reimburseFeeApply;
    if (obj.formData.reimburseSource == 2) {
        let total = obj.formData.reimburseFeePushDown;
        let flag = total > 0 ? true : false;
        let index = obj.formData.reimburseNormals.findIndex(item => item.key == formData.key);
        obj.formData.reimburseNormals.map((item, i) => {
            if (!item.index) {
                if (flag) {
                    total = accSub(total, item.reimburseFeeApply);
                    if (total <= 0) {
                        flag = false;
                    }
                    item.reimbursePayApply = total >= 0 ? 0 : -total;
                    if (index === i) {
                        reimbursePayApply = item.reimbursePayApply;
                    }
                } else {
                    item.reimbursePayApply = item.reimburseFeeApply;
                }
            }
            return item;
        });
        if (flag) {
            total = accSub(total, reimbursePayApply);
            if (total <= 0) {
                flag = false;
            }
            reimbursePayApply = total >= 0 ? 0 : -total;
        }
        let reimbursePayApplyPro = 0;
        obj.formData.reimburseProjects.map(item => {
            if (!item.index) {
                if (flag) {
                    total = accSub(total, item.reimburseFeeApply);
                    if (total <= 0) {
                        flag = false;
                    }
                    item.reimbursePayApply = total >= 0 ? 0 : -total;
                } else {
                    item.reimbursePayApply = item.reimburseFeeApply;
                }
                reimbursePayApplyPro = accAdd(reimbursePayApplyPro, item.reimbursePayApply);
            }
            return item;
        });
        //修改日常费用时，项目明细总计需单独更改
        if (obj.formData.reimburseProjects.length > 0) {
            obj.formData.reimburseProjects[
                obj.formData.reimburseProjects.length - 1
            ].reimbursePayApply = reimbursePayApplyPro;
        }
    }

    item.reimbursePayApply = reimbursePayApply;
    // if (item.reimburseTaxRate) {
    //     item.reimburseTax = accDiv(
    //         accMul(item.reimburseIncludeTaxFee, item.reimburseTaxRate),
    //         accAdd(1, item.reimburseTaxRate),
    //     ).toFixed(2);
    //     item.reimburseNoTaxFee = accSub(item.reimburseIncludeTaxFee, item.reimburseTax).toFixed(2);
    // }
    return item;
}

// 获取table列表头
export function columnsFn(obj, props) {
    const columns = [
        {
            title: '序列',
            dataIndex: 'index',
            align: 'center',
            render: (text, record) => {
                return text || record.key + 1;
            },
        },
        {
            title: '项目',
            dataIndex: 'reimburseProjectName',
            render: text => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
        },
        {
            title: '艺人/博主',
            dataIndex: 'reimburseActorBlogerName',
        },
        {
            title: '费用类型',
            dataIndex: 'reimburseFeeTypeName',
        },
        {
            title: '实际发生时间',
            dataIndex: 'reimburseFeeActualTime',
            render: text => (text ? text.slice(0, 10) : null),
        },
        {
            title: '申请报销金额',
            dataIndex: 'reimburseFeeApply',
            render: text => {
                return text && `¥ ${text}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
        },
        {
            title: '申请付款金额',
            dataIndex: 'reimbursePayApply',
            render: text => {
                return text && `¥ ${text}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
        },
        {
            title: '费用承担部门',
            dataIndex: 'reimburseFeeTakerDeptName',
        },
        // {
        //   title: '发票主体',
        //   dataIndex: 'reimburseInvoiceCompanyName',
        // },
        {
            title: '发票类型',
            dataIndex: 'reimburseInvoiceType',
            render: text => {
                return getOptionName(REIMBURSE_INVOICE_TYPE, text);
            },
        },
        {
            title: '含税金额',
            dataIndex: 'reimburseIncludeTaxFee',
            render: text => {
                return text && `¥ ${text}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
        },
        {
            title: '税率',
            dataIndex: 'reimburseTaxRate',
            render: text => {
                return getOptionName(REIMBURSE_TAX_RATE, text);
            },
        },
        {
            title: '未税金额',
            dataIndex: 'reimburseNoTaxFee',
            render: text => {
                return (text && `¥ ${text}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')) || 0;
            },
        },
        {
            title: '税额',
            dataIndex: 'reimburseTax',
            render: text => {
                return (text && `¥ ${text}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')) || 0;
            },
        },
        {
            title: '关联',
            dataIndex: 'outOfficeName',
            render: text => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
        },
        {
            title: '备注',
            dataIndex: 'reimburseFeeRemark',
            render: text => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
        },
        {
            title: '操作',
            dataIndex: 'operate',
            render: (text, record) => {
                if (record.index) {
                    return null;
                }
                return (
                    <div>
                        {
                            //!(obj && obj.formData.reimburseSource == 2) &&
                            <span
                                className={styles.btnCls}
                                onClick={() =>
                                    props.copyTableLine(
                                        record,
                                        changePayApply.bind(this, obj, props),
                                    )
                                }
                            >
                                {' '}
                                复制行
                            </span>
                        }
                        <span className={styles.btnCls} onClick={() => props.editTableLine(record)}>
                            {' '}
                            编辑
                        </span>
                        {
                            //!(obj && obj.formData.reimburseSource == 2) &&
                            <span
                                className={styles.btnCls}
                                onClick={() => props.delTableLine(record)}
                            >
                                {' '}
                                删除
                            </span>
                        }
                    </div>
                );
            },
        },
    ];
    return columns || [];
}
