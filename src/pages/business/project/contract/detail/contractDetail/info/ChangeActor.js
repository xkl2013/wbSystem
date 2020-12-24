import React, { Component } from 'react';
import { message } from 'antd';
import modalfy from '@/components/modalfy';
import { getTalentList } from '@/services/globalSearchApi';
import BITable from '@/ant_components/BITable';
import AuthButton from '@/components/AuthButton';
import BIInputNumber from '@/ant_components/BIInputNumber';
import FlexDetail from '@/components/flex-detail';
// eslint-disable-next-line import/no-unresolved
import AssociationSearch from '@/components/associationSearch';
import storage from '@/utils/storage';
import { thousandSeparatorFixed } from '@/utils/utils';
import { ROLE_CAIWU, ROLE_CAIWUHETONG } from '@/utils/constants';
import Information from '@/components/informationModel';
import { changeTalent } from '../../services';

const styles = {
    style1: {
        display: 'flex',
        alignItem: 'center',
        justifyContent: 'center',
    },
    style2: {
        fontSize: '13px',
        fontWeight: '400',
        color: 'rgba(132,143,155,1)',
        padding: '0 10px',
    },
};

@modalfy
class Modal extends Component {
    render() {
        const { contractTalentList = [] } = this.props.selectList;
        const labelWrap = [
            {
                title: '艺人/博主',
                dataIndex: 'talentName',
                align: 'center',
                render: () => {
                    return (
                        <AssociationSearch
                            value={this.props.talentVal}
                            dataSource={contractTalentList}
                            onChange={this.props.handleSelChange}
                            style={{ width: '150px' }}
                            fieldNames={{
                                value: (item) => {
                                    return `${item.talentType}-${item.talentId}`;
                                },
                                label: 'talentName',
                            }}
                        />
                    );
                },
            },
            {
                title: '艺人博主拆帐比例',
                align: 'center',
                dataIndex: 'divideAmountRate',
                render: () => {
                    return `${(this.props.divideAmountRate * 100).toFixed(2)}%`;
                },
            },
            {
                title: '艺人博主拆帐金额',
                dataIndex: 'divideAmount',
                align: 'center',
                render: () => {
                    return this.props.divideAmount;
                },
            },
            {
                title: '分成比例(艺人:公司)',
                dataIndex: 'address',
                align: 'center',
                render: () => {
                    return (
                        <div style={styles.style1}>
                            <BIInputNumber
                                min={0}
                                max={100}
                                precision={0}
                                onChange={this.props.handleInputChange1}
                                value={this.props.inputValue1}
                                onBlur={this.props.handleInputBlur1}
                            />
                            <span style={styles.style2}>:</span>
                            <BIInputNumber
                                min={0}
                                max={100}
                                precision={0}
                                onChange={this.props.handleInputChange2}
                                value={this.props.inputValue2}
                                onBlur={this.props.handleInputBlur2}
                            />
                        </div>
                    );
                },
            },
        ];

        return <BITable rowKey="talentId" dataSource={[{}]} bordered pagination={false} columns={labelWrap} />;
    }
}

// 表格

class ChangeActor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            // name:1,
            inputValue1: 1,
            inputValue2: 1,
        };
    }

    componentDidMount() {
        this.getData();
    }

    getData = async () => {
        const dataSource = await getTalentList({ talentName: '', pageSize: 100, pageNum: 1 });
        if (dataSource && dataSource.success) {
            this.setState({
                // eslint-disable-next-line
                selectList: dataSource.data.list || [],
            });
        }
    };

    handleClick = (e) => {
        // 变更艺人
        // message.warning('艺人已经发生费用或对应履约任务已经产生执行进度，不允许变更。');
        this.setState({
            visible: true,
            talentVal: { ...e, value: `${e.talentType}-${e.talentId}`, label: e.talentName },
            inputValue1: (e.divideRateTalent * 100).toFixed(0),
            inputValue2: (e.divideRateCompany * 100).toFixed(0),
            divideAmountRate: e.divideAmountRate,
            divideAmount: e.divideAmount,
            allVal: e,
        });
    };

    handleSelChange = (e) => {
        // 选择
        this.setState({
            talentVal: e,
        });
    };

    handleInputChange1 = (e) => {
        // input1
        this.setState({
            inputValue1: e,
        });
    };

    handleInputBlur1 = (e) => {
        const v = (e && e.target && e.target.value) || 0;
        this.setState({
            inputValue2: 100 - Number(v),
        });
    };

    handleInputChange2 = (e) => {
        // input2
        this.setState({
            inputValue2: e,
        });
    };

    handleInputBlur2 = (e) => {
        const v = (e && e.target && e.target.value) || 0;
        this.setState({
            inputValue1: 100 - Number(v),
        });
    };

    onCancel = () => {
        this.setState({
            visible: false,
        });
    };

    onOk = async () => {
        const { allVal, talentVal, inputValue1, inputValue2 } = this.state;
        const result = await changeTalent(
            {
                divideRateCompany: (inputValue2 / 100).toFixed(2),
                divideRateTalent: (inputValue1 / 100).toFixed(2),
                id: allVal.id,
                pageNum: 1,
                pageSize: 100,
                originTalentId: allVal.talentId,
                originTalentType: allVal.talentType,
                talentName: talentVal.talentName,
                talentId: talentVal.talentId,
                talentType: talentVal.talentType,
            },
            allVal.contractId,
        );
        if (result && result.success) {
            this.props.updateData();
            this.onCancel();
            message.success('变更成功');
        }
    };

    render() {
        const labelWrap = () => {
            return [
                {
                    title: '序列',
                    dataIndex: 'index',
                    align: 'center',
                    render: (...argu) => {
                        return argu[2] + 1;
                    },
                },
                {
                    title: '艺人博主',
                    dataIndex: 'talentName',
                    align: 'center',
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
                    title: '艺人博主拆帐比例',
                    align: 'center',
                    dataIndex: 'divideAmountRate',
                    render: (detail) => {
                        return `${(Number(detail) * 100).toFixed(4)}%`;
                    },
                },
                {
                    title: '艺人博主拆帐金额',
                    dataIndex: 'divideAmount',
                    align: 'center',
                    render: (d) => {
                        return thousandSeparatorFixed(d);
                    },
                },
                {
                    title: '分成比例(艺人:公司)',
                    dataIndex: 'divideRateCompany',
                    align: 'center',
                    render: (text, detail) => {
                        return `${(detail.divideRateTalent * 100).toFixed(0)}:${(text * 100).toFixed(0)}`;
                    },
                },
                {
                    title: '操作',
                    dataIndex: 'talentId',
                    align: 'center',
                    render: (text, detail) => {
                        const data = this.props.dataSource;
                        const newArr = [];
                        let isFee = 0;
                        data.contractAppointmentList.forEach((el) => {
                            const result = newArr.findIndex((ol) => {
                                return (
                                    el.contractAppointmentTalentId === ol.contractAppointmentTalentId
                                    && el.contractAppointmentTalentType === ol.contractAppointmentTalentType
                                );
                            });
                            if (result !== -1) {
                                newArr[result].contractAppointmentProgress += el.contractAppointmentProgress;
                            } else {
                                newArr.push(el);
                            }
                        });

                        newArr.forEach((item) => {
                            if (
                                item.contractAppointmentTalentId === text
                                && item.contractAppointmentTalentType === detail.talentType
                            ) {
                                // eslint-disable-next-line
                                detail.contractAppointmentProgress = item.contractAppointmentProgress;
                            }
                        });

                        if (detail.talentActualExpense) {
                            detail.talentActualExpense.forEach((item) => {
                                // eslint-disable-next-line
                                item.reimbursePayApply && (isFee += item.reimbursePayApply);
                            });
                        }
                        if (
                            Number(data.contractIsVirtual) !== 1
                            && data.contractApprovalStatus === 3
                            && (Number(data.contractCreatedId) === Number(data.userId)
                                || storage.getUserInfo().roleId === ROLE_CAIWU
                                || storage.getUserInfo().roleId === ROLE_CAIWUHETONG)
                            && detail.contractAppointmentProgress === 0
                            && isFee === 0
                        ) {
                            return (
                                // eslint-disable-next-line
                                <AuthButton authority="/foreEnd/business/project/contract/detail/signInfo/changeActor">
                                    <span
                                        style={{
                                            color: '#AEB4BA',
                                            pointerEvents: 'none',
                                        }}
                                        onClick={() => {
                                            return this.handleClick(detail);
                                        }}
                                    >
                                        变更艺人
                                    </span>
                                </AuthButton>
                            );
                        }
                        return null;
                    },
                },
            ];
        };
        return (
            <div>
                <FlexDetail LabelWrap={[[]]} detail={{}} title="艺人博主分成">
                    <BITable
                        rowKey="id"
                        dataSource={this.props.dataSource.contractTalentDivideList}
                        bordered
                        pagination={false}
                        columns={labelWrap(this.props.dataSource)}
                    />
                </FlexDetail>
                <Modal
                    talentVal={this.state.talentVal}
                    inputValue1={this.state.inputValue1}
                    inputValue2={this.state.inputValue2}
                    divideAmount={this.state.divideAmount}
                    divideAmountRate={this.state.divideAmountRate}
                    handleSelChange={this.handleSelChange}
                    handleInputChange1={this.handleInputChange1}
                    handleInputChange2={this.handleInputChange2}
                    handleInputBlur1={this.handleInputBlur1}
                    handleInputBlur2={this.handleInputBlur2}
                    width="800px"
                    bodyStyle={{
                        width: '800px',
                    }}
                    visible={this.state.visible}
                    searchValue={this.state.searchValue}
                    type={this.state.type}
                    modalDataChange={this.modalDataChange}
                    title="变更艺人/博主"
                    onCancel={this.onCancel}
                    onOk={this.onOk}
                    selectList={this.props.dataSource}
                />
            </div>
        );
    }
}
export default ChangeActor;
