import styles from '../../index.less';
import { getOptionName } from '@/utils/utils';
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
            title: '艺人/博主',
            dataIndex: 'applicationActorBlogerName',
        },
        {
            title: '费用类型',
            dataIndex: 'applicationFeeTypeName',
        },
        {
            title: '费用承担部门',
            dataIndex: 'applicationFeeTakerDeptName',
        },
        // {
        //     title: '费用承担主体',
        //     dataIndex: 'applicationFeeTakerMainName',
        // },
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
