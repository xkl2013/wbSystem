import React, { Component } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { message } from 'antd';
import BITable from '@/ant_components/BITable';
import FeeTable from '@/pages/business/project/establish/components/projectingBudgetInfo/selfTable';
import { FEE_TYPE, APPLY_FEEBEAR_PERSON } from '@/utils/enum';
import { getOptionName, thousandSeparatorFixed } from '@/utils/utils';
import AuthButton, { checkPathname } from '@/components/AuthButton';
import { DATE_FORMAT, DATETIME_FORMAT } from '@/utils/constants';
import FormTable from '@/components/FormTable';
import Information from '@/components/informationModel';
import { getFeeType } from '@/services/dictionary';
import {
    contractBudget,
    newContractExpense,
    contractSummary2,
    deleteActualFeeItem,
    saveActualFee,
    editActualFeeItem,
} from '../../services';
import styles from './index.less';

const formatSelfCols = (talentList) => {
    return [
        {
            columns: [
                [
                    {
                        label: '艺人/博主',
                        key: 'talentId',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择艺人/博主',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        type: 'select',
                        options: talentList || [],
                        getFormat: (value, form) => {
                            return form;
                        },
                        setFormat: (value) => {
                            return value;
                        },
                    },
                ],
                [
                    {
                        label: '费用类型',
                        key: 'feeType',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择费用类型',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        type: 'associationSearch',
                        componentAttr: {
                            request: (val) => {
                                return getFeeType({ value: val });
                            },
                            fieldNames: { value: 'index', label: 'value' },
                        },
                        getFormat: (value, form) => {
                            return Object.assign({}, form, { feeType: value.value, feeTypeName: value.label });
                        },
                        setFormat: (value, form) => {
                            if (value.label || value.value || value.value === 0) {
                                return value;
                            }
                            return {
                                value,
                                label: form.feeTypeName || undefined,
                            };
                        },
                    },
                ],
                [
                    {
                        label: '费用实际承担方',
                        key: 'feeActualCost',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择费用实际承担方',
                                },
                            ],
                        },
                        defaultValue: 1,
                        componentAttr: {
                            // onChange(option) {
                            //     changeProjectingName(obj, props, option);
                            //   },
                        },
                        placeholder: '请选择',
                        type: 'select',
                        options: APPLY_FEEBEAR_PERSON,
                        getFormat: (value, form) => {
                            return form;
                        },
                        setFormat: (value) => {
                            return String(value);
                        },
                    },
                ],
                [
                    {
                        label: '金额',
                        key: 'feeActualCostMoney',
                        placeholder: '请输入',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请输入金额',
                                },
                            ],
                        },
                        type: 'inputNumber',
                        componentAttr: {
                            precision: 2,
                            min: 0,
                            max: 999999999999,
                            // onChange: changeContractInvoiceMoney.bind(this, obj, props)
                        },
                    },
                ],
                [
                    {
                        label: '费用发生日期',
                        key: 'feeDate',
                        checkOption: {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择时间',
                                },
                            ],
                        },
                        placeholder: '请选择',
                        type: 'date',
                        getFormat: (value, form) => {
                            return Object.assign({}, form, { feeDate: moment(value).format(DATETIME_FORMAT) });
                        },
                        setFormat: (value) => {
                            return moment(value);
                        },
                    },
                ],
            ],
        },
    ];
};

function columnsFn(list, props) {
    return [
        {
            title: '艺人/博主',
            dataIndex: 'talentName',
            align: 'center',
            key: 'talentId',
            render: (name, item) => {
                const data = [
                    {
                        ...item,
                        id: item.talentId,
                        name: item.talentName,
                        path: '/foreEnd/business/talentManage/talent/actor/detail',
                    },
                ];
                return <Information data={data} />;
            },
        },
        {
            title: '费用类型',
            dataIndex: 'feeTypeName',
            align: 'center',
            key: 'feeType',
        },
        {
            title: '费用实际承担方',
            dataIndex: 'feeActualCost',
            align: 'center',
            key: 'feeActualCost',
            render: (detail) => {
                return getOptionName(FEE_TYPE, detail);
            },
        },
        {
            title: '金额',
            dataIndex: 'feeActualCostMoney',
            align: 'center',
            key: 'feeActualCostMoney',
            render: (d) => {
                return thousandSeparatorFixed(d);
            },
        },
        {
            title: '费用发生日期',
            dataIndex: 'feeDate',
            align: 'center',
            key: 'feeDate',
            render: (text) => {
                return text && moment(text).format(DATE_FORMAT);
            },
        },
        {
            title: '操作',
            align: 'center',
            dataIndex: 'operate',
            render: (text, record) => {
                // feeSource=5&&feeType=32平台推广费，不能操作
                if (
                    record.feeReference === 1
                    || record.feeSource === 1
                    || record.feeSource === 2
                    || (Number(record.feeSource) === 5 && Number(record.feeType) === 32)
                ) return null;
                return (
                    <div>
                        <AuthButton authority="/foreEnd/business/project/contract/detail/contractExpense/edit">
                            <span
                                className={styles.btnCls}
                                onClick={() => {
                                    return props.editTableLine(record);
                                }}
                            >
                                编辑
                            </span>
                        </AuthButton>
                        <AuthButton authority="/foreEnd/business/project/contract/detail/contractExpense/delete">
                            <span
                                className={styles.btnCls}
                                onClick={() => {
                                    return props.delTableLine(record);
                                }}
                            >
                                删除
                            </span>
                        </AuthButton>
                    </div>
                );
            },
        },
    ];
}

const columns2 = [
    {
        title: '艺人/博主',
        dataIndex: 'talentName',
        align: 'center',
        key: 'talentName',
        render: (name, item) => {
            const data = [
                {
                    ...item,
                    id: item.talentId,
                    name: item.talentName,
                    path: '/foreEnd/business/talentManage/talent/actor/detail',
                },
            ];
            return <Information data={data} />;
        },
    },
    {
        title: '费用类型',
        dataIndex: 'feeTypeName',
        align: 'center',
        key: 'feeTypeName',
    },
    {
        title: '费用实际承担方',
        dataIndex: 'feeActualCost',
        align: 'center',
        key: 'feeActualCost',
        render: (detail) => {
            return getOptionName(FEE_TYPE, detail);
        },
    },
    {
        title: '金额',
        dataIndex: 'feeActualCostMoney',
        align: 'center',
        key: 'feeActualCostMoney',
        render: (d) => {
            return thousandSeparatorFixed(d);
        },
    },
];

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contractTalentList: [],
        };
    }

    componentDidMount() {
        this.getData();
    }

    getData = async () => {
        // 获取合同费用列表
        const { formData, id } = this.props;
        if (!id) {
            return;
        }
        const result = await contractBudget({ id });
        if (result && result.success) {
            this.setState({
                contractBudgetList: result.data || [],
            });
        }

        const resultData = await newContractExpense({
            contractId: id,
            pageNum: 1,
            pageSize: 9999,
        });
        if (resultData && resultData.success) {
            this.setState({
                contractExpenseList: resultData.data.list || [],
            });
        }

        const resultData1 = await contractSummary2(id);
        if (resultData1 && resultData1.success) {
            const contractSummaryList = (resultData1.data || []).map((item, index) => {
                return { ...item, index };
            });
            this.setState({
                contractSummaryList,
            });
        }

        if (!_.isEmpty(formData.contractTalentList)) {
            const contractTalentList = formData.contractTalentList || [];
            const newList = contractTalentList.map((item) => {
                return {
                    ...item,
                    id: item.talentId,
                    name: item.talentName,
                };
            });
            this.setState({
                contractTalentList: newList,
            });
        }
    };

    del = async (e) => {
        // 删除接口
        const result = await deleteActualFeeItem(e.id);
        if (result && result.success) {
            message.success(result.message);
            this.getData();
        }
    };

    submit = (type, data, close) => {
        // 提交
        const { contractTalentList } = this.state;
        const contractId = this.props.id || '';
        const contractCode = this.props.formData.contractCode || '';
        const { talentType } = (contractTalentList || []).find((item) => {
            return item.talentId === data.talentId;
        });
        const newData = {
            ...data,
            contractId,
            contractCode,
            feeActualCost: Number(data.feeActualCost),
            talentType,
        };
        if (type === 'add') {
            this.addContractExpenseFun(newData, close);
        } else {
            this.editContractExpenseFun(data.id, newData, close);
        }
    };

    addContractExpenseFun = async (data, close) => {
        // 添加
        const result = await saveActualFee({ ...data, feeSource: 3 });
        if (result && result.success) {
            message.success(result.message);
            close();
            this.getData();
        }
    };

    editContractExpenseFun = async (id, data, close) => {
        // 编辑
        const result = await editActualFeeItem(id, data);
        if (result && result.success) {
            message.success(result.message);
            close();
            this.getData();
        }
    };

    render() {
        const { contractBudgetList, contractExpenseList, contractSummaryList, contractTalentList } = this.state;
        const { formData } = this.props;
        return (
            <div className={styles.detailPage1}>
                {Number(formData.contractProjectType) !== 4 && <div className={styles.tit}>费用预估</div>}
                {Number(formData.contractProjectType) !== 4 && (
                    <div className={styles.m20}>
                        <FeeTable value={contractBudgetList} formData={formData} />
                    </div>
                )}
                <div className={styles.tit}>实际费用明细</div>
                <div className={styles.m20}>
                    <FormTable
                        addBtnText="新增"
                        editBtnText="编辑"
                        disabled={
                            !checkPathname('/foreEnd/business/project/contract/detail/contractExpense/add')
                            || Number(formData.contractProjectType) === 4
                        }
                        tableCols={columnsFn.bind(this, contractTalentList)}
                        formCols={formatSelfCols.bind(this, contractTalentList)}
                        value={contractExpenseList}
                        delCallback={this.del}
                        // initForm={this.initForm}
                        submitCallback={this.submit}
                    />
                </div>
                <div className={styles.tit}>实际费用汇总</div>
                <div className={styles.m20}>
                    <BITable
                        rowKey="index"
                        columns={columns2}
                        dataSource={contractSummaryList}
                        bordered={true}
                        pagination={false}
                    />
                </div>
            </div>
        );
    }
}

export default Index;
