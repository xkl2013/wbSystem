import React from 'react';
import moment from 'moment';
import { getOptionName, isNumber, thousandSeparatorFixed } from '@/utils/utils';
import { DATE_FORMAT, SPECIAL_DATETIME_FORMAT } from '@/utils/constants';
import { renderTxt } from '@/utils/hoverPopover';
import {
    CONTRACT_TYPE,
    CONTRACT_PRI_TYPE,
    CONTRACT_SIGN_TYPE,
    PROJECT_INFO_TYPE,
    CONTRACT_INVOICE_ORDER,
    CONTRACT_PROGRESS_TYPE,
    CONTRACT_BRAND_TYPE,
    IS_OR_NOT,
    PROJECT_ESTABLISH_RATIO,
    PARTICIPANT_TYPE,
} from '@/utils/enum';
import Information from '@/components/informationModel';
import businessConfig from '@/config/business';

export const labelWrap1 = (props) => {
    const columns = [
        {
            key: 'contractCode',
            label: '合同编号',
            // isHide: true
        },
        {
            key: 'contractType',
            label: '合同类型',
            render: (detail) => {
                return getOptionName(CONTRACT_TYPE, detail.contractType);
            },
        },
        {
            key: 'contractProjectName',
            label: '项目名称',
            render: (detail) => {
                const data = [
                    {
                        ...detail,
                        id: detail.contractProjectId,
                        name: renderTxt(detail.contractProjectName, 15),
                        path: '/foreEnd/business/project/manage/detail',
                    },
                ];
                return <Information data={data} />;
                // return (
                //     <span style={{ cursor: 'pointer' }}>
                //         {renderTxt(detail.contractProjectName)}
                //     </span>
                // );
            },
        },
        {
            key: 'contractName',
            label: '合同名称',
        },
        {
            key: 'contractCustomerList',
            label: '客户主体',
            render: (detail) => {
                const contactList = (detail.contractCustomerList || []).reduce((list, item) => {
                    const customerItem = {
                        ...item,
                        id: item.contractCompanyId,
                        name: item.contractCompanyName,
                        path: '/foreEnd/business/customer/customer/detail',
                    };
                    list.push(customerItem);
                    return list;
                }, []);
                return <Information data={contactList} />;
            },
            isHide: Number(props.contractProjectType) === 4,
        },
        {
            key: 'contractCompanyList',
            label: '公司主体',
            render: (detail) => {
                const name = [];
                if (detail.contractCompanyList) {
                    detail.contractCompanyList.forEach((item) => {
                        name.push(item.contractCompanyName);
                    });
                }
                return <span style={{ cursor: 'pointer' }}>{renderTxt(name.join('，'), 15)}</span>;
            },
            isHide: Number(props.contractSigningType) === 3 || Number(props.contractProjectType) === 4,
        },
        {
            key: 'contractCount',
            label: '合同份数',
            render: (detail) => {
                return `${detail.contractCount}份`;
            },
            isHide: Number(props.contractProjectType) === 4,
        },
        {
            key: 'contractSigningDate',
            label: '签约日期',
            render: (detail) => {
                return detail.contractSigningDate && moment(detail.contractSigningDate).format(DATE_FORMAT);
            },
        },
    ];

    let temp = [];
    const newArr = [];
    columns.map((item) => {
        if (item.isHide) {
            return;
        }
        if (temp.length === 4) {
            newArr.push(temp);
            temp = [];
        }
        temp.push(item);
    });
    if (temp.length > 0) {
        newArr.push(temp);
    }
    return newArr;
};

export const labelWrap2 = (props) => {
    const columns = [
        {
            key: 'contractMoneyTotal',
            label: '合同总金额',
            render: (detail) => {
                return isNumber(detail.contractMoneyTotal) && `${thousandSeparatorFixed(detail.contractMoneyTotal)}元`;
            },
            isHide: Number(props.contractProjectType) === 4,
        },
        {
            key: 'contractMoneyCompanyName',
            label: '回款主体(公司)',
            isHide: Number(props.contractSigningType) === 3,
        },
        {
            key: 'contractInvoiceProject',
            label: '开票项目',
            isHide: Number(props.contractProjectType) === 4,
        },
        {
            key: 'contractStartDate',
            label: '起始日期',
            render: (detail) => {
                return detail.contractStartDate && moment(detail.contractStartDate).format(DATE_FORMAT);
            },
            isHide: Number(props.contractProjectType) === 4,
        },
        {
            key: 'contractEndDate',
            label: '终止日期',
            render: (detail) => {
                return detail.contractEndDate && moment(detail.contractEndDate).format(DATE_FORMAT);
            },
            isHide: Number(props.contractProjectType) === 4,
        },
    ];
    let temp = [];
    const newArr = [];
    columns.map((item) => {
        if (item.isHide) {
            return;
        }
        if (temp.length === 4) {
            newArr.push(temp);
            temp = [];
        }
        temp.push(item);
    });
    if (temp.length > 0) {
        newArr.push(temp);
    }
    return newArr;
};

export const labelWrap3 = (props) => {
    const columns = [
        {
            title: '序列',
            dataIndex: 'index',
            align: 'center',
            render: (...argu) => {
                return argu[2] + 1;
            },
        },
        {
            title: '艺人/博主',
            align: 'center',
            dataIndex: 'contractAppointmentTalentName',
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
            align: 'center',
            dataIndex: 'contractAppointmentName',
        },
        {
            title: '品牌',
            align: 'center',
            dataIndex: 'contractAppointmentBrand',
            render: (detail) => {
                if (Number(props.contractProjectType) === 4) {
                    return '-';
                }
                return getOptionName(CONTRACT_BRAND_TYPE, detail);
            },
        },
        {
            title: '履约义务详情说明',
            align: 'center',
            dataIndex: 'contractAppointmentDescription',
            render: (detail) => {
                if (Number(props.contractProjectType) === 4) {
                    return '-';
                }
                return detail || '-';
            },
        },
        {
            title: '起始日期',
            align: 'center',
            dataIndex: 'contractAppointmentStart',
            render: (detail) => {
                return detail && moment(detail).format(DATE_FORMAT);
            },
            isHide: Number(props.contractProjectType) === 4,
        },
        {
            title: '终止日期',
            align: 'center',
            dataIndex: 'contractAppointmentEnd',
            render: (detail) => {
                return detail && moment(detail).format(DATE_FORMAT);
            },
            isHide: Number(props.contractProjectType) === 4,
        },
        {
            title: '上线日期(预计)',
            align: 'center',
            dataIndex: 'liveTimePlan',
            render: (text) => {
                if (Number(props.contractProjectType) === 4) {
                    return text && moment(text).format(SPECIAL_DATETIME_FORMAT);
                }
                return text && moment(text).format(DATE_FORMAT);
            },
        },
        // {
        //     title: '上线日期(实际)',
        //     align: 'center',
        //     dataIndex: 'liveTime',
        //     render: (text) => {
        //         return text && moment(text).format(DATE_FORMAT);
        //     },
        // },
        {
            title: '权重',
            align: 'center',
            dataIndex: 'contractAppointmentWeight',
            render: (detail) => {
                return `${(detail * 100).toFixed(2)}%`;
            },
        },
        {
            title: '执行进度变更方式',
            align: 'center',
            dataIndex: 'contractAppointmentProgressType',
            render: (detail) => {
                return getOptionName(CONTRACT_PROGRESS_TYPE, detail);
            },
        },
        {
            title: '执行金额(最新)',
            align: 'center',
            dataIndex: 'appointmentExecuteMoney',
            render: (text) => {
                return (isNumber(text) && text) || '-';
            },
        },
        {
            title: '执行金额(累计)',
            align: 'center',
            dataIndex: 'appointmentExecuteMoneyTotal',
            render: (text) => {
                return (isNumber(text) && text) || '-';
            },
        },
    ];
    const newArr = [];
    columns.map((item) => {
        if (item.isHide) {
            return;
        }
        newArr.push(item);
    });
    return newArr;
};

export const labelWrap4 = [
    [
        {
            key: 'contractHeaderName',
            label: '项目负责人',
        },
        {
            key: 'contractHeaderDepartmentName',
            label: '负责人所属部门',
        },
        {},
        {},
    ],
];

export const labelWrap5 = [
    {
        title: '序列',
        align: 'center',
        dataIndex: 'index',
        render: (...argu) => {
            return argu[2] + 1;
        },
    },
    {
        title: '预计回款期数',
        align: 'center',
        dataIndex: 'contractReturnPeriod',
    },
    // {
    //     title: '预计回款比例',
    //     align: 'center',
    //     dataIndex: 'contractReturnRate',
    //     render: (detail) => {
    //         return `${detail * 100}%`;
    //     },
    // },
    {
        title: '预计回款金额',
        align: 'center',
        dataIndex: 'contractReturnMoney',
        render: (d) => {
            return d && `¥ ${thousandSeparatorFixed(d, 2)}`;
        },
    },
    {
        title: '预计回款时间',
        align: 'center',
        dataIndex: 'contractReturnDate',
        render: (text) => {
            return text && moment(text).format(DATE_FORMAT);
        },
    },
];
export const labelWrap7 = [
    {
        title: '角色',
        align: 'center',
        dataIndex: 'participantType',
        render: (detail) => {
            return getOptionName(PARTICIPANT_TYPE, detail);
        },
    },
    {
        title: '转交前',
        align: 'center',
        dataIndex: 'handoverUserName',
    },
    {
        title: '接收人',
        align: 'center',
        dataIndex: 'recipientUserName',
    },
    {
        title: '转交时间',
        align: 'center',
        dataIndex: 'handoverTime',
        render: (text) => {
            return text && moment(text).format(DATE_FORMAT);
        },
    },
    {
        title: '说明',
        align: 'center',
        dataIndex: 'remark',
    },
];
export const labelWrap6 = (formData) => {
    let columns = [
        {
            key: 'cooperate',
            label: '业务双记',
            render: (detail) => {
                return getOptionName(IS_OR_NOT, detail.cooperate);
            },
        },
        {
            key: 'cooperateRatio',
            label: '业绩比例',
            render: (detail) => {
                return getOptionName(PROJECT_ESTABLISH_RATIO, detail.cooperateRatio);
            },
        },
        {
            key: 'cooperateUserName',
            label: '合作人',
        },
        {
            key: 'cooperateDepartmentName',
            label: '所属部门',
        },
    ];
    if (Number(formData.cooperate) !== 1) {
        columns = [
            {
                key: 'cooperate',
                label: '业务双记',
                render: () => {
                    return '否';
                },
            },
            {},
            {},
            {},
        ];
    }
    return [columns];
};
