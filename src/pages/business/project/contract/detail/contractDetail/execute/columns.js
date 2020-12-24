import React from 'react';
import moment from 'moment';
import BINumber from '@/ant_components/BINumber';
import BIInput from '@/ant_components/BIInput';
import Upload from '@/components/upload';
import AuthButton from '@/components/AuthButton';
import { DATE_FORMAT, ROLE_CAIWU, ROLE_CAIWUHETONG } from '@/utils/constants';
import storage from '@/utils/storage';
import { renderTxt } from '@/utils/hoverPopover';
import Information from '@/components/informationModel';
import { isNumber } from '@/utils/utils';
import businessConfig from '@/config/business';
import styles from './index.less';
import FileList from './fileList';

const baseColumn = (props) => {
    const cols = [
        {
            title: '序列',
            dataIndex: 'talentName',
            align: 'center',
            render: (...argu) => {
                return argu[2] + 1;
            },
        },
        {
            title: '艺人/博主',
            dataIndex: 'contractAppointmentTalentName',
            align: 'center',
            render: (name, item) => {
                const actorConfig = businessConfig[1];
                const bloggerConfig = businessConfig[2];
                let path = actorConfig.pathname;
                if (Number(item.contractAppointmentTalentType) === 1) {
                    path = bloggerConfig.pathname;
                }
                const data = {
                    id: item.contractAppointmentTalentId,
                    name: item.contractAppointmentTalentName,
                    path,
                };
                return (
                    <span style={{ textAlign: 'center' }}>
                        <Information data={[data]} />
                    </span>
                );
            },
        },
        {
            title: '履约义务',
            dataIndex: 'contractAppointmentName',
            align: 'center',
        },
        {
            title: '品牌',
            dataIndex: 'contractAppointmentBrand',
            align: 'center',
            render: (detail) => {
                if (Number(props.contractProjectType) === 4) {
                    return '-';
                }
                return { 0: '国内品牌', 1: '国际品牌' }[detail];
            },
        },
        {
            title: '履约义务详细说明',
            dataIndex: 'contractAppointmentDescription',
            align: 'center',
            // width:250,
            render: (detail) => {
                if (Number(props.contractProjectType) === 4) {
                    return '-';
                }
                return detail || '-';
            },
        },
        {
            title: '起始日期',
            dataIndex: 'contractAppointmentStart',
            align: 'center',
            render: (d) => {
                return d && moment(d).format(DATE_FORMAT);
            },
        },
        {
            title: '终止日期',
            dataIndex: 'contractAppointmentEnd',
            align: 'center',
            render: (d) => {
                return d && moment(d).format(DATE_FORMAT);
            },
        },
        {
            title: '权重',
            dataIndex: 'contractAppointmentWeight',
            align: 'center',
            render: (detail) => {
                return `${(detail * 100).toFixed(2)}%`;
            },
        },
        {
            title: '执行进度变更方式',
            dataIndex: 'contractAppointmentProgressType',
            align: 'center',
            render: (detail) => {
                return { 0: '自动按月均摊', 1: '手动输入' }[detail];
            },
        },
    ];
    if (Number(props.contractProjectType) === 4) {
        cols.splice(5, 2);
    }
    return cols;
};

export function columns1(formData) {
    return [
        ...baseColumn(formData),
        {
            title: '执行进度',
            dataIndex: 'contractAppointmentProgress',
            align: 'center',
            render: (text) => {
                return isNumber(text) && `${(text * 100).toFixed(2)}%`;
            },
        },
        {
            title: '进度依据',
            dataIndex: 'handle1',
            align: 'center',
            render: (detail, item) => {
                return <FileList dataSource={item} />;
            },
        },
        {
            title: '备注',
            dataIndex: 'contractAppointmentRemark',
            align: 'center',
            render: (text) => {
                return <span style={{ cursor: 'pointer' }}>{renderTxt(text)}</span>;
            },
        },
        {
            title: '操作',
            dataIndex: 'handle2',
            align: 'center',
            key: 'tripCwo1st',
            render: (detail, item) => {
                const { contractAppointmentProgressType, contractAppointmentProgress } = item;
                return (
                    <AuthButton authority="/foreEnd/business/project/contract/detail/corry/change">
                        {String(contractAppointmentProgressType) === '1'
                        && Number(contractAppointmentProgress) < 1
                        && (formData.contract && Number(formData.contract.contractIsVirtual) !== 1)
                        && (formData.contract.contractCreatedId === storage.getUserInfo().userId
                            || storage.getUserInfo().roleId === ROLE_CAIWU
                            || storage.getUserInfo().roleId === ROLE_CAIWUHETONG) ? (
                                <span className={styles.btn} onClick={this.changeExecute.bind(this, item)}>
                                    执行进度变更
                                </span>
                            ) : null}
                    </AuthButton>
                );
            },
        },
    ];
}

export function modelCulumon(formData) {
    return [
        ...baseColumn(formData),
        {
            title: '进度执行',
            dataIndex: 'contractAppointmentProgress',
            align: 'center',
            render: (number) => {
                const contractAppointmentProgress = this.state.contractAppointmentProgress || 0;
                return (
                    <BINumber
                        placeholder="请输入"
                        value={Number(number).toFixed(2)}
                        max={100}
                        min={Number((contractAppointmentProgress * 100).toFixed(2))}
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
        {
            title: '操作',
            dataIndex: 'handle12',
            align: 'center',
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
                        renderButton={<span className={styles.btn}>添加附件</span>}
                    />
                );
            },
        },
    ];
}

export const columns2 = [
    {
        title: '序号',
        dataIndex: 'talentName',
        align: 'center',
        render: (...argu) => {
            return argu[2] + 1;
        },
    },
    {
        title: '合同总进度',
        dataIndex: 'contractProgressTotal',
        align: 'center',
        render: (text) => {
            return isNumber(text) && `${(text * 100).toFixed(2)}%`;
        },
    },
    {
        title: '进度差',
        dataIndex: 'contractProgressDiff',
        align: 'center',
        render: (text) => {
            return isNumber(text) && `${(text * 100).toFixed(2)}%`;
        },
    },
    {
        title: '更新人',
        dataIndex: 'contractProgressUpdatedName',
        align: 'center',
    },
    {
        title: '进度更新时间',
        dataIndex: 'contractProgressUpdatedAt',
        align: 'center',
    },
];
