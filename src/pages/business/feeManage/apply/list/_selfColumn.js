import styles from '../index.less';
import { PAY_STATUS, FEE_APPLY_TYPE_LIST, WRITE_OFF_STATUS } from '@/utils/enum';
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
            title: '申请单号',
            dataIndex: 'applicationCode',
        },
        {
            title: '申请日期',
            dataIndex: 'applicationCreateTime',
            render: text => {
                return text && moment(text).format(DATE_FORMAT);
            },
        },
        {
            title: '申请人姓名',
            dataIndex: 'applicationUserName',
        },

        {
            title: '申请人所属部门',
            dataIndex: 'applicationApplyDeptNameParent',
            render: text => {
                text = text && text.replace(/,/g, '、');
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
        },
        {
            title: '申请人所属公司',
            dataIndex: 'applicationApplyCompanyName',
        },
        {
            title: '费用承担主体',
            dataIndex: 'applicationFeeTakerMainName',
        },
        {
            title: '申请总金额',
            dataIndex: 'applicationApplyTotalFee',
            render: text => {
                return thousandSeparatorFixed(text);
            },
        },
        {
            title: '审批状态',
            dataIndex: 'applicationApproveStatus',
            render: (text, data) => {
                return getOptionName(FEE_APPLY_TYPE_LIST, text);
            },
        },
        {
            title: '付款状态',
            dataIndex: 'applicationPayStatus',
            render: text => {
                return getOptionName(PAY_STATUS, text);
            },
        },
        {
            title: '冲销状态',
            dataIndex: 'applicationChargeAgainstSatus',
            render: text => {
                return getOptionName(WRITE_OFF_STATUS, text);
            },
        },
        {
            title: '操作',
            dataIndex: 'operate',
            render: (text, record) => {
                return (
                    <div>
                        <AuthButton authority="/foreEnd/business/feeManage/reimbursement/detail">
                            <span
                                className={styles.btnCls}
                                onClick={() => props.checkData(record.applicationId)}
                            >
                                {' '}
                                查看
                            </span>
                        </AuthButton>
                        {/* <AuthButton authority="/foreEnd/business/feeManage/reimbursement/edit">
              <span className={styles.btnCls}
                    onClick={() => props.editData(record.applicationId)}> 编辑</span>
            </AuthButton> */}
                    </div>
                );
            },
        },
    ];
    return columns || [];
}

// 获取table列表头
export function columnsChildFn(e) {
    e.applicationProjectVoList.map((item, i) => {
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
            key: 'applicationProjectName',
            title: '项目',
            dataIndex: 'applicationProjectName',
            render: text => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
        },
        {
            key: 'applicationActorBlogerName',
            title: '艺人/博主',
            dataIndex: 'applicationActorBlogerName',
        },
        {
            key: 'applicationFeeTypeName',
            title: '费用类型',
            dataIndex: 'applicationFeeTypeName',
        },
        {
            key: 'applicationFeeApply',
            title: '申请金额',
            dataIndex: 'applicationFeeApply',
            render: text => {
                return thousandSeparatorFixed(text);
            },
        },
        {},
    ];

    return <BITable rowKey="applicationReid" columns={columns} dataSource={e.applicationProjectVoList} pagination={false} />;
}
