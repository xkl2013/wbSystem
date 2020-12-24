import React from 'react';
import { renderTxt } from '@/utils/hoverPopover';
import styles from './index.less';
import BINumber from '@/ant_components/BINumber';
import BIInput from '@/ant_components/BIInput';
import Upload from '@/components/upload';

// eslint-disable-next-line
export function talentActor() {
    return [
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
                return <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>{renderTxt(text, 4)}</span>;
            },
        },
        {
            title: '品牌',
            dataIndex: 'contractAppointmentBrand',
            align: 'center',
            render: (text) => {
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
            title: '履约义务详情说明',
            dataIndex: 'contractAppointmentDescription',
            align: 'center',
            render: (text) => {
                return <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>{renderTxt(text, 4)}</span>;
            },
        },
        {
            title: '起始日期',
            dataIndex: 'contractAppointmentStart',
            align: 'center',
            render: (text) => {
                return <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>{renderTxt(text, 5)}</span>;
            },
        },
        {
            title: '终止日期',
            dataIndex: 'contractAppointmentEnd',
            align: 'center',
            render: (text) => {
                return <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>{renderTxt(text, 5)}</span>;
            },
        },
        {
            title: '权重',
            dataIndex: 'contractAppointmentWeight',
            align: 'center',
            render: (text) => {
                return `${(Number(text) * 100).toFixed(0)}%`;
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
            render: (number) => {
                const contractAppointmentProgress = this.state.contractAppointmentProgress || 0;
                return (
                    <BINumber
                        placeholder="请输入"
                        value={Number(number).toFixed(2)}
                        max={100}
                        min={(contractAppointmentProgress * 100).toFixed(2)}
                        formatter={(value) => {
                            return `${value}%`;
                        }}
                        parser={(value) => {
                            return value.replace('%', '');
                        }}
                        onChange={this.inputChange}
                    />
                );
            },
        },
        {
            title: '操作',
            dataIndex: 'set',
            align: 'center',
            className: styles.maxTD,
            render: (detail, item) => {
                const contractAppointmentAttachments = item.contractAppointmentAttachments || [];
                const values = contractAppointmentAttachments.map((ls) => {
                    return {
                        domain: ls.contractAppointmentAttachmentDomain,
                        value: ls.contractAppointmentAttachmentUrl,
                        name: ls.contractAppointmentAttachmentName,
                    };
                });
                return (
                    <Upload
                        value={values}
                        listType="text"
                        btnText="添加附件"
                        onChange={this.changeFile}
                        renderButton={<span className={styles.btnCls}>添加附件</span>}
                    />
                );
            },
        },
        {
            title: '备注',
            dataIndex: 'contractAppointmentRemark',
            align: 'center',
            render: (detail) => {
                return (
                    <BIInput.TextArea
                        autoSize={{ minRows: 3 }}
                        maxLength={140}
                        placeholder="请输入"
                        value={detail}
                        onChange={this.changeDesc}
                    />
                );
            },
        },
    ];
}
// export const talentActor =
// [
//     {
//         title: '序列',
//         dataIndex: 'index',
//         align: 'center',
//     },
//     {
//         title: '艺人',
//         dataIndex: 'contractAppointmentTalentName',
//         align: 'center',
//     },
//     {
//         title: '履约义务',
//         dataIndex: 'contractAppointmentName',
//         align: 'center',
//         render: text => {
//             return (
//                 <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
//                     {renderTxt(text, 6)}
//                 </span>
//             );
//         },
//     },
//     {
//         title: '品牌',
//         dataIndex: 'contractAppointmentBrand',
//         align: 'center',
//     },
//     {
//         title: '履约义务详情说明',
//         dataIndex: 'contractAppointmentDescription',
//         align: 'center',
//         render: text => {
//             return (
//                 <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
//                     {renderTxt(text, 6)}
//                 </span>
//             );
//         },
//     },
//     {
//         title: '起始日期',
//         dataIndex: 'contractAppointmentStart',
//         align: 'center',
//         render: text => {
//             return (
//                 <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
//                     {renderTxt(text)}
//                 </span>
//             );
//         },
//     },
//     {
//         title: '终止日期',
//         dataIndex: 'contractAppointmentEnd',
//         align: 'center',
//         render: text => {
//             return (
//                 <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
//                     {renderTxt(text)}
//                 </span>
//             );
//         },
//     },
//     {
//         title: '权重',
//         dataIndex: 'contractAppointmentWeight',
//         align: 'center',
//     },
//     {
//         title: '执行进度变更方式',
//         dataIndex: 'contractAppointmentProgressType',
//         align: 'center',
//     },
//     {
//         title: '执行进度',
//         dataIndex: 'contractAppointmentProgress',
//         align: 'center',
//         render: (number, item) => {
//             const contractAppointmentProgress = item.contractAppointmentProgress || 0;
//             return (
//               <BINumber
//                 placeholder='请输入'
//                 value={Number(number).toFixed(2)}
//                 max={100}
//                 min={Number((contractAppointmentProgress * 100).toFixed(2))}
//                 formatter={value => `${value}%`}
//                 parser={value => value.replace('%', '')}
//                 onChange={this.inputChange}
//               />
//             )
//           }
//     },
//     {
//         title: '操作',
//         dataIndex: '11',
//         align: 'center',
//         render: (detail, item) => {
//             return (
//                 <div>
//                     <AuthButton authority="/foreEnd/business/talent/actor/edit">
//                         <span
//                             className={styles.btnCls}
//                             onClick={() => {}}
//                         >
//                             添加附件
//                         </span>
//                     </AuthButton>
//                 </div>
//             );
//         },
//     },
//     {
//         title: '备注',
//         dataIndex: 'contractAppointmentRemark',
//         align: 'center',
//         render: text => {
//             return (
//                 <span style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
//                     {renderTxt(text, 5)}
//                 </span>
//             );
//         },
//     },
// ];
