/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import moment from 'moment';
import { Radio, message } from 'antd';
import FlexDetail from '@/components/flex-detail';
import {
    BLOGGER_TYPE, SEX_TYPE, STAR_PLATFORM, STAR_SOURCE, BLOGGER_SIGN_STATE, PARTICIPANT_TYPE,
} from '@/utils/enum';
import { getOptionName } from '@/utils/utils';
import BIButton from '@/ant_components/BIButton';
import IconFont from '@/components/CustomIcon/IconFont';
import SlefProgress from '@/components/Progress';
import AuthButton from '@/components/AuthButton';
import BITable from '@/ant_components/BITable';
import BIRadio from '@/ant_components/BIRadio';
// eslint-disable-next-line import/extensions,import/no-unresolved
import AssociationSearchFilter from '@/components/associationSearchFilter';
import BIDatePicker from '@/ant_components/BIDatePicker';
import BIInput from '@/ant_components/BIInput';
import { getProjectList } from '@/services/globalSearchApi';
import CustomerModel from '@/components/CustomerModel';
import { Watermark } from '@/components/watermark';

import { connectInfo } from '@/services/globalDetailApi';
import { DATE_FORMAT } from '@/utils/constants';
import { contractColumns } from './planTableList';
import styles from './index.less';

const columns = [
    {
        title: '账号名称',
        dataIndex: 'starAccountName',
    },
    {
        title: '平台账号ID',
        dataIndex: 'starAccountUuid',
    },
    {
        title: '平台',
        dataIndex: 'starAccountPlatform',
        render: (text) => {
            return getOptionName(STAR_PLATFORM, text);
        },
    },
    {
        title: '粉丝数',
        dataIndex: 'starFansAmount',
    },
    {
        title: '类型',
        dataIndex: 'starAccountType',
        render: (text) => {
            return getOptionName(BLOGGER_TYPE, text);
        },
    },
];
const LabelWrap1 = [
    [
        { key: 'starName', label: '姓名' },
        {
            key: 'starGender',
            label: '性别',
            render: (detail) => {
                return getOptionName(SEX_TYPE, detail.starGender);
            },
        },
        {
            key: 'starBirth',
            label: '出生日期',
            render: (detail) => {
                return moment(detail.starBirth).format('YYYY-MM-DD');
            },
        },
        { key: 'starAge', label: '年龄' },
    ],
    [
        {
            key: 'starSource',
            label: '来源',
            render: (detail) => {
                return getOptionName(STAR_SOURCE, detail.starSource);
            },
        },
        {
            key: 'starSignState',
            label: '状态',
            render: (detail) => {
                return getOptionName(BLOGGER_SIGN_STATE, detail.starSignState);
            },
        },
        { key: 'starDescription', label: '备注' },
        {},
    ],
];
const LabelWrap2 = [
    [
        { key: 'starPhone', label: '手机号码' },
        { key: 'starAddress', label: '联系地址' },
        { key: 'starWorkMail', label: '邮箱账号' },
        { key: 'starWechat', label: '微信号码' },
    ],
];
const LabelWrap3 = [
    [
        {
            key: 'starManagerName',
            label: '经理人',
        },
        {
            key: 'starDrumbeater',
            label: '宣传人',
        },
        {},
        {},
    ],
];
const LabelWrap4 = [
    [
        { key: 'starCreatedBy', label: '录入人' },
        {
            key: 'starCreatedAt',
            label: '录入时间',
            render: (detail) => {
                return moment(detail.starCreatedAt).format('YYYY-MM-DD HH:mm');
            },
        },
        { key: 'starUpdatedBy', label: '更新人' },
        {
            key: 'starUpdatedAt',
            label: '更新时间',
            render: (detail) => {
                return moment(detail.starUpdatedAt).format('YYYY-MM-DD HH:mm');
            },
        },
    ],
];
const LabelWrap5 = [
    [
        {
            key: 'starAccountList',
            render: (detail) => {
                return (
                    <BITable
                        className={styles.detailTableWrap}
                        rowKey="starAccountId"
                        bordered={true}
                        columns={columns}
                        dataSource={detail.starAccountList || []}
                        pagination={false}
                    />
                );
            },
        },
    ],
];
export const labelWrap6 = [
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
function formatData(formDataObj) {
    const formData = formDataObj || {};
    Object.keys(formData).map((key) => {
        switch (key) {
            case 'starUserList':
                formData.starManagerName = formData.starUserList
                    .reduce((prev, item) => {
                        if (item.starParticipantType === 1) {
                            prev.push(item.starParticipantName);
                        }
                        return prev;
                    }, [])
                    .join('，');
                formData.starDrumbeater = formData.starUserList
                    .reduce((prev, item) => {
                        if (item.starParticipantType === 2) {
                            prev.push(item.starParticipantName);
                        }
                        return prev;
                    }, [])
                    .join('，');
                break;
            default:
                break;
        }
    });
    return formData;
}

/* eslint-disable no-param-reassign, no-restricted-syntax, no-prototype-builtins */

@Watermark
@connect(({ talent_actor }) => {
    return {
        formData: talent_actor.formData,
        ContractStatusLists: talent_actor.ContractStatusLists,
    };
})
class Detail extends Component {
    constructor(props) {
        super(props);
        /* eslint-disable react/no-unused-state */
        this.state = {
            // detail: {},
            type: 1, // tab切换 1-基本信息 2-合同执行进度
            // isStopRequest: true, // 是否阻止发起请求
            contractProgressData: {},
            modelVisible: false,
            modelData: {},
            inputValue: '',
            contractAppointmentProgress: 0,
            connectData: [],
        };
    }

    componentDidMount() {
        this.getData();
        this.getContractProgress();
        this.changeHeader(this.props);
        // 数据交接 - 隐藏
        this.getConnectHistory();
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.props.formData) !== JSON.stringify(nextProps.formData)) {
            this.changeHeader(nextProps);
        }
    }

    changeHeader = (props) => {
        const code = (props.formData && props.formData.starCode) || '';
        this.props.dispatch({
            type: 'header/saveHeaderName',
            payload: {
                title: '艺人详情',
                subTitle: `Talent编号-${code}`,
                component: this.rightBtns(),
            },
        });
    };

    edit = () => {
        const { query } = this.props.location;
        this.props.history.push({
            pathname: '/foreEnd/business/talentManage/talent/actor/edit',
            query: {
                id: query && query.id,
            },
        });
    };

    rightBtns = () => {
        // 右侧按钮
        return (
            <div>
                <AuthButton authority="/foreEnd/business/talentManage/talent/actor/detail/edit">
                    <BIButton className={styles.headerBtn} type="primary" ghost onClick={this.edit}>
                        <IconFont type="iconxiangqingye-bianji" />
                        <span className={styles.editTitle}>编辑</span>
                    </BIButton>
                </AuthButton>
            </div>
        );
    };

    //
    getInformationModelData = (id) => {
        this.props.dispatch({
            type: 'talent_actor/getStarDetail',
            payload: {
                id,
            },
        });
    };

    getData = () => {
        /* eslint-disable prefer-destructuring */
        const { query } = this.props.location;
        let id = query ? query.id : null;
        if (this.props.informationModel) {
            id = this.props.informationInstance.id;
        }
        this.props.dispatch({
            type: 'talent_actor/getStarDetail',
            payload: {
                id,
            },
        });
    };

    reload = () => {
        this.getContractProgress();
        this.setState({
            modelVisible: false,
        });
    };

    getContractProgress = (arg) => {
        const queryData = arg || {};
        const { contractProgressData } = this.state;
        const { query } = this.props.location;
        const params = {
            pageNum: 1,
            pageSize: 100,
            talentType: 0, // 0:艺人 1:博主
        };
        const data = Object.assign(contractProgressData, params, queryData);
        this.setState({
            contractProgressData: data,
        });
        this.props.dispatch({
            type: 'talent_actor/getContractStatus',
            payload: {
                id: query && query.id,
                data,
            },
        });
    };

    /* eslint-disable react/no-unused-state */
    tabChange = (e) => {
        // tab切换
        this.setState({
            type: e.target.value,
            // isStopRequest: true,
        });
    };

    changeExecute = (data) => {
        this.setState({
            modelData: Object.assign({}, data),
            modelVisible: true,
            // contractAppointmentProgress: data.contractAppointmentProgress,
        });
    };

    /* eslint-disable react/no-unused-state */
    changeExecute = (data) => {
        this.setState({
            modelData: Object.assign({}, data),
            modelVisible: true,
            contractAppointmentProgress: data.contractAppointmentProgress,
        });
    };

    // eslint-disable-next-line react/sort-comp
    formContractLists(data) {
        const domArr = [];
        if (data.length <= 0) {
            return (
                <BITable
                    rowKey="contractId"
                    bordered={true}
                    columns={contractColumns(this)}
                    dataSource={[]}
                    pagination={false}
                />
            );
        }
        data.map((item) => {
            domArr.push(
                <dl className={styles.tableExtra} key={`${item.contractCode}-${item.contractId}`}>
                    <dt className={styles.tableHeadExtra}>
                        <div>
                            合同编号：
                            <span>{item.contractCode}</span>
                        </div>
                        <div>
                            合同名称：
                            <span>{item.contractName}</span>
                        </div>
                        <div>
                            项目名称：
                            <span>{item.projectName}</span>
                        </div>
                        <div>
                            主子合同：
                            <span>{item.contractCategory === 0 ? '主合同' : '子合同'}</span>
                        </div>
                        <div>
                            合同创建时间：
                            <span>{item.contractCreatedAt}</span>
                        </div>
                    </dt>
                    <dd>{this.contractTable(item)}</dd>
                </dl>,
            );
        });
        return domArr;
    }

    contractTable(item) {
        const cDomArr = [];
        item.contractAppointmentList.map((cItem, cIndex) => {
            cDomArr.push({
                index: cIndex + 1,
                contractAppointmentTalentName: cItem.contractAppointmentTalentName,
                contractAppointmentName: cItem.contractAppointmentName,
                contractAppointmentBrand: cItem.contractAppointmentBrand,
                contractAppointmentDescription: cItem.contractAppointmentDescription,
                contractAppointmentStart: cItem.contractAppointmentStart,
                contractAppointmentEnd: cItem.contractAppointmentEnd,
                contractAppointmentWeight: cItem.contractAppointmentWeight,
                contractAppointmentProgressType: cItem.contractAppointmentProgressType,
                contractAppointmentProgress: cItem.contractAppointmentProgress,
                contractAppointmentRemark: cItem.contractAppointmentRemark,
                contractAppointmentAttachments: cItem.contractAppointmentAttachments,
                contractAppointmentId: cItem.contractAppointmentId,
                contractId: cItem.contractId,
                contractType: item.contractType,
            });
        });
        return (
            <BITable
                rowKey="contractAppointmentId"
                bordered={true}
                columns={contractColumns(this)}
                dataSource={cDomArr}
                pagination={false}
            />
        );
    }

    search() {
        const { beforeSearch } = this.props;
        if (typeof beforeSearch === 'function') {
            beforeSearch();
        }
        this.fetch();
    }

    // 获取转交记录
    getConnectHistory = async () => {
        const {
            query: { id = '' },
        } = this.props.location;
        const res = await connectInfo(id, 2);
        if (res && res.success) {
            this.setState({
                connectData: res.data,
            });
        } else {
            message.error('数据异常');
        }
    };

    render() {
        const { formData, ContractStatusLists } = this.props;
        const { modelData, modelVisible, connectData } = this.state;
        let detail = _.assign({}, formData);
        detail = formatData(detail);
        const { type, inputValue } = this.state;
        const suffix = inputValue === '' ? (
            <img src="https://static.mttop.cn/admin/search.png" className={styles.suffixIcon} alt="" />
        ) : null;
        const componentAttr = {
            request: (val) => {
                return getProjectList({
                    pageNum: 1,
                    pageSize: 50,
                    projectName: val,
                });
            },
            fieldNames: { value: 'projectId', label: 'projectName' },
        };
        return (
            <div className={styles.detailPage}>
                <div className={styles.detailTabBtnWrap}>
                    <BIRadio defaultValue="1" buttonStyle="solid" onChange={this.tabChange}>
                        <Radio.Button className={styles.tabBtn} value="1">
                            基本信息
                        </Radio.Button>
                        <Radio.Button className={styles.tabBtn} value="2">
                            合同执行进度
                        </Radio.Button>
                    </BIRadio>
                </div>
                {Number(type) === 1 && (
                    <div>
                        <FlexDetail LabelWrap={LabelWrap1} detail={detail} title="艺人基本信息" />
                        <FlexDetail LabelWrap={LabelWrap2} detail={detail} title="联系方式" />
                        <FlexDetail LabelWrap={LabelWrap5} detail={detail} title="账号信息" />
                        <FlexDetail LabelWrap={LabelWrap3} detail={detail} title="参与人信息" />
                        <FlexDetail LabelWrap={LabelWrap4} detail={detail} title="更新信息" />
                        {Array.isArray(connectData) && connectData.length > 0 && (
                            <FlexDetail LabelWrap={[[]]} detail={{}} title="转交记录">
                                <BITable
                                    rowKey="id"
                                    dataSource={connectData}
                                    bordered
                                    pagination={false}
                                    columns={labelWrap6}
                                />
                            </FlexDetail>
                        )}
                        <AuthButton authority="/foreEnd/business/talentManage/talent/actor/detail/commen">
                            <SlefProgress
                                id={Number(this.props.location.query.id)}
                                interfaceName="1"
                                authority="/foreEnd/business/talentManage/talent/actor/detail/publishCommen"
                            />
                        </AuthButton>
                    </div>
                )}
                {Number(type) === 2 && (
                    <>
                        <CustomerModel data={modelData} visible={modelVisible} reload={this.reload} />
                        <FlexDetail LabelWrap={[[]]} detail={detail} title="合同执行进度">
                            <ul className={styles.tableTerm}>
                                <li>
                                    <BIInput
                                        className={styles.searchCol}
                                        placeholder="合同编号"
                                        suffix={suffix}
                                        onPressEnter={(event) => {
                                            this.getContractProgress({
                                                contractCode: event.target.value,
                                            });
                                        }}
                                        onChange={(event) => {
                                            this.setState({
                                                inputValue: event.target.value,
                                            });
                                            if (event.target.value === '') {
                                                this.getContractProgress({
                                                    contractCode: '',
                                                });
                                            }
                                        }}
                                        allowClear
                                    />
                                </li>
                                <li>
                                    <AssociationSearchFilter
                                        {...componentAttr}
                                        className={styles.searchCol}
                                        placeholder="项目"
                                        // onSearch={value => {
                                        //     console.log('search - ', value);
                                        // }}
                                        onChange={(value, label) => {
                                            if (value === undefined) {
                                                this.getContractProgress({
                                                    projectName: '',
                                                });
                                            } else if (
                                                value.label
                                                && value.label !== ''
                                                && JSON.stringify(label) !== '{}'
                                            ) {
                                                this.getContractProgress({
                                                    projectName: value.label,
                                                });
                                            }
                                        }}
                                    />
                                </li>
                                <li>
                                    <BIDatePicker.BIRangePicker
                                        className={styles.searchCol}
                                        onChange={(datas, dateStrings) => {
                                            this.getContractProgress({
                                                contractStartDate:
                                                    dateStrings[0] && dateStrings[0] !== ''
                                                        ? `${dateStrings[0]} 00:00:00`
                                                        : '',
                                                contractEndDate:
                                                    dateStrings[1] && dateStrings[1] !== ''
                                                        ? `${dateStrings[1]} 23:59:59`
                                                        : '',
                                            });
                                        }}
                                    />
                                </li>
                            </ul>
                            {this.formContractLists(ContractStatusLists)}
                        </FlexDetail>
                    </>
                )}
            </div>
        );
    }
}

export default Detail;
