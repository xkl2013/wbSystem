import styles from '../../index.less';
import { getOptionName, getLeafOptions, getOptionPath } from '@/utils/utils';
import { FEE_TYPE, CONTRACT_OBLIGATION_TYPE } from '@/utils/enum';
import { renderTxt } from '@/utils/hoverPopover';

// 获取table列表头
export function columnsFn(props) {
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
            dataIndex: 'applicationProjectName',
            render: text => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
        },
        {
            title: '合同',
            dataIndex: 'applicationContractName',
        },
        {
            title: '艺人/博主',
            dataIndex: 'applicationActorBlogerName',
        },
        {
            title: '费用类型',
            dataIndex: 'applicationFeeTypeName',
        },
        {
            title: '履约义务',
            dataIndex: 'applicationDuty',
            render: (text, record) => {
                if (record.index) {
                    return null;
                }
                return getOptionPath(getLeafOptions(CONTRACT_OBLIGATION_TYPE), text) || '-';
            },
        },
        {
            title: '约定费用承担方',
            dataIndex: 'applicationFeeAggreeTakerId',
            render: text => {
                return getOptionName(FEE_TYPE, text);
            },
        },
        {
            title: '费用实际承担方',
            dataIndex: 'applicationFeeTrulyTakerId',
            render: text => {
                return getOptionName(FEE_TYPE, text);
            },
        },
        {
            title: '费用承担部门',
            dataIndex: 'applicationFeeTakerDeptName',
        },
        {
            title: '申请金额',
            dataIndex: 'applicationFeeApply',
            render: text => {
                return text && `¥ ${text}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            },
        },
        {
            title: '备注',
            dataIndex: 'applicationFeeRemark',
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
                        <span className={styles.btnCls} onClick={() => props.copyTableLine(record)}>
                            {' '}
                            复制行
                        </span>
                        <span className={styles.btnCls} onClick={() => props.editTableLine(record)}>
                            {' '}
                            编辑
                        </span>
                        <span className={styles.btnCls} onClick={() => props.delTableLine(record)}>
                            {' '}
                            删除
                        </span>
                    </div>
                );
            },
        },
    ];
    return columns || [];
}
