import styles from './index.less';
import Enum from '@/utils/enum';
import { renderTxt } from '@/utils/hoverPopover';
import AuthButton from '@/components/AuthButton';

// 获取table列表头
export function columnsFn(props) {
    const columns = [
        {
            title: '公司名称',
            dataIndex: 'customerName',
            render: (text, record) => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
        },
        {
            title: '公司类型',
            dataIndex: 'customerTypeName',
        },
        {
            title: '公司级别',
            dataIndex: 'customerGradeName',
        },
        {
            title: '公司性质',
            dataIndex: 'customerPropName',
        },
        {
            title: '主营行业',
            dataIndex: 'customerIndustryName',
        },
        {
            title: '负责人',
            dataIndex: 'customerChargerName',
            render: (text, record) => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
        },
        {
            title: '更新时间',
            dataIndex: 'modifyTime',
        },
        {
            title: '操作',
            dataIndex: 'operate',
            render: (text, record) => {
                return (
                    <div>
                        <AuthButton authority="/foreEnd/business/customer/customer/edit">
                            <span
                                className={styles.btnCls}
                                onClick={() => props.editData(record.id)}
                            >
                                {' '}
                                编辑
                            </span>
                        </AuthButton>
                        <AuthButton authority="/foreEnd/business/customer/customer/detail">
                            <span
                                className={styles.btnCls}
                                onClick={() => props.checkData(record.id)}
                            >
                                {' '}
                                查看
                            </span>
                        </AuthButton>
                    </div>
                );
            },
        },
    ];
    return columns || [];
}
