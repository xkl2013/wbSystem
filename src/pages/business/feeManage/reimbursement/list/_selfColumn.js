import styles from '../index.less';
import { PAY_STATUS, FEE_APPLY_TYPE_LIST, REIMBURSE_SOURCE } from '@/utils/enum';
import { getOptionName, thousandSeparatorFixed } from '@/utils/utils';
import { renderTxt } from '@/utils/hoverPopover';
import moment from 'moment';
import BITable from '@/ant_components/BITable';
import AuthButton from '@/components/AuthButton';
import { DATE_FORMAT } from '@/utils/constants';

// 获取table列表头
export function columnsFn(props) {
    const columns = [
        {
            title: '费用报销编号',
            key: 'reimburseCode',
            dataIndex: 'reimburseCode',
        },
        {
            title: '申请日期',
            key: 'reimburseApplyTime',
            dataIndex: 'reimburseApplyTime',
            render: text => {
                return text && moment(text).format(DATE_FORMAT);
            },
        },
        {
            title: '实际报销人',
            key: 'reimburseReimbureUserName',
            dataIndex: 'reimburseReimbureUserName',
        },
        {
            title: '实际报销人所属部门',
            key: 'reimburseReimbureUserDeptNameParent',
            dataIndex: 'reimburseReimbureUserDeptNameParent',
            render: text => {
                text = text && text.replace(/,/g, '、');
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
        },
        {
            title: '报销人所属公司',
            key: 'reimburseReimbureUserCompanyName',
            dataIndex: 'reimburseReimbureUserCompanyName',
        },
        {
            title: '费用承担主体',
            key: 'reimburseFeeTakerMainName',
            dataIndex: 'reimburseFeeTakerMainName',
        },
        // {
        //   title: '项目名称',
        //   dataIndex: 'starManagerName', render: (text) => {
        //   text = text && text.replace(/,/g, '、');
        //   return <span style={{cursor: 'pointer'}}>{renderTxt(text)}</span>
        //   }
        // },
        // {
        //   title: '相关艺人',
        //   dataIndex: 'starManagerName', render: (text) => {
        //   text = text && text.replace(/,/g, '、');
        //   return <span style={{cursor: 'pointer'}}>{renderTxt(text)}</span>
        //   }
        // },
        {
            title: '收款对象名称',
            key: 'reimburseChequesName',
            dataIndex: 'reimburseChequesName',
            render: text => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
        },
        {
            title: '报销总金额',
            key: 'reimburseTotalFee',
            dataIndex: 'reimburseTotalFee',
            render: text => {
                return thousandSeparatorFixed(text);
            },
        },
        {
            title: '审批状态',
            key: 'reimburseApproveStatus',
            dataIndex: 'reimburseApproveStatus',
            render: text => {
                return getOptionName(FEE_APPLY_TYPE_LIST, text);
            },
        },
        {
            title: '付款状态',
            key: 'reimbursePayStatus',
            dataIndex: 'reimbursePayStatus',
            render: text => {
                return getOptionName(PAY_STATUS, text);
            },
        },
        {
            title: '费用报销来源',
            key: 'reimburseSource',
            dataIndex: 'reimburseSource',
            render: text => {
                return getOptionName(REIMBURSE_SOURCE, text);
            },
        },
        {
            title: '操作',
            key: 'operate',
            dataIndex: 'operate',
            width: 100,
            render: (text, record) => {
                return (
                    <div>
                        {/*1手工2下推*/}
                        {record.reimburseSource == 2 && !record.reimburseApproveStatus && (
                            <AuthButton authority="/foreEnd/business/feeManage/reimbursement/edit">
                                <span
                                    className={styles.btnCls}
                                    onClick={() => props.editData(record.reimburseId)}
                                >
                                    {' '}
                                    编辑
                                </span>
                            </AuthButton>
                        )}
                        {!!record.reimburseApproveStatus && (
                            <AuthButton authority="/foreEnd/business/feeManage/reimbursement/detail">
                                <span
                                    className={styles.btnCls}
                                    onClick={() => props.checkData(record.reimburseId)}
                                >
                                    {' '}
                                    查看
                                </span>
                            </AuthButton>
                        )}
                    </div>
                );
            },
        },
    ];
    return columns || [];
}

// 获取table列表头
export function columnsChildFn(e) {
    e.reimburseProjects.map((item, i) => {
        item.index = i + 1;
        return item;
    });
    const columns = [
        {},
        {
            key: 0,
            title: '序列',
            dataIndex: 'index',
        },
        {
            key: 'reimburseProjectName',
            title: '项目',
            dataIndex: 'reimburseProjectName',
            render: text => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
        },
        {
            key: 'reimburseActorBlogerName',
            title: '艺人/博主',
            dataIndex: 'reimburseActorBlogerName',
        },
        {
            key: 'reimburseFeeTypeName',
            title: '费用类型',
            dataIndex: 'reimburseFeeTypeName',
        },
        {
            key: 'reimburseFeeApply',
            title: '申请报销金额',
            dataIndex: 'reimburseFeeApply',
            render: text => {
                return thousandSeparatorFixed(text);
            },
        },
        {},
    ];
    return (
        <BITable
            rowKey="reimburseReId"
            columns={columns}
            dataSource={e.reimburseProjects}
            pagination={false}
        />
    );
}
