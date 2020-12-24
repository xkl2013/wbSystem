import React from 'react';
import { renderTxt } from '@/utils/hoverPopover';
import FileAccessory from '@/components/FileAccessory';
import styles from './index.less';

// 获取table列表头
// eslint-disable-next-line
export function contractColumns(props) {
    const columns = [
        {
            title: '序列',
            dataIndex: 'index',
            align: 'center',
        },
        {
            title: '艺人',
            dataIndex: 'contractAppointmentTalentName',
            align: 'center',
        },
        {
            title: '履约义务',
            dataIndex: 'contractAppointmentName',
            align: 'center',
            render: (text) => {
                return <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>{renderTxt(text, 6)}</span>;
            },
        },
        {
            title: '品牌',
            dataIndex: 'contractAppointmentBrand',
            align: 'center',
            render: (text, record) => {
                if (Number(record.contractType) === 4) {
                    return '-';
                }
                switch (text) {
                    case 0:
                        return '国内品牌';
                    case 1:
                        return '国际品牌';
                    default:
                        return null;
                }
            },
        },
        {
            title: '预履约义务详情说明',
            dataIndex: 'contractAppointmentDescription',
            align: 'center',
            render: (text, record) => {
                if (Number(record.contractType) === 4) {
                    return '-';
                }
                return <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>{renderTxt(text, 6)}</span>;
            },
        },
        {
            title: '起始日期',
            dataIndex: 'contractAppointmentStart',
            align: 'center',
            render: (text, record) => {
                if (Number(record.contractType) === 4) {
                    return '-';
                }
                return text && String(text).slice(0, 10);
            },
        },
        {
            title: '终止日期',
            dataIndex: 'contractAppointmentEnd',
            align: 'center',
            render: (text, record) => {
                if (Number(record.contractType) === 4) {
                    return '-';
                }
                return text && String(text).slice(0, 10);
            },
        },
        {
            title: '权重',
            dataIndex: 'contractAppointmentWeight',
            align: 'center',
            render: (text) => {
                return `${(Number(text) * 100).toFixed(2)}%`;
            },
        },
        {
            title: '执行进度变更方式',
            dataIndex: 'contractAppointmentProgressType',
            align: 'center',
            render: (text) => {
                return text === 0 ? '自动按月均摊' : '手动输入';
            },
        },
        {
            title: '执行进度',
            dataIndex: 'contractAppointmentProgress',
            align: 'center',
            render: (text) => {
                return `${(text * 100).toFixed(2)}%`;
            },
        },
        {
            title: '进度依据',
            dataIndex: 'll',
            align: 'center',
            render: (detail, item) => {
                return <FileAccessory dataSource={item} />;
            },
        },
        {
            title: '备注',
            dataIndex: 'contractAppointmentRemark',
            align: 'center',
            render: (text) => {
                return <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>{renderTxt(text, 5)}</span>;
            },
        },
        {
            title: '操作',
            // dataIndex: '13',
            align: 'center',
            render: (detail, item) => {
                return (
                    <div>
                        {item.contractAppointmentProgressType === 0 || item.contractAppointmentProgress >= 1 ? null : (
                            <span
                                className={styles.btnCls}
                                onClick={() => {
                                    return props.changeExecute(item);
                                }}
                            >
                                执行进度变更
                            </span>
                        )}
                    </div>
                );
            },
        },
    ];
    return columns || [];
}
