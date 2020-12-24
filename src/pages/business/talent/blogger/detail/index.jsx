/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Radio, message } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import FlexDetail from '@/components/flex-detail';
import styles from './index.less';
import { STAR_PLATFORM, BLOGGER_TYPE, BLOGGER_SIGN_STATE, PARTICIPANT_TYPE } from '@/utils/enum';
import { getOptionName } from '@/utils/utils';
import BIButton from '@/ant_components/BIButton';
import AuthButton from '@/components/AuthButton';
import SlefProgress from '@/components/Progress';
import BITable from '@/ant_components/BITable';
import BIRadio from '@/ant_components/BIRadio';
import IconFont from '@/components/CustomIcon/IconFont';
import AssociationSearchFilter from '@/components/associationSearchFilter';
import BIDatePicker from '@/ant_components/BIDatePicker';
import BIInput from '@/ant_components/BIInput';
import { getProjectList } from '@/services/globalSearchApi';
import { contractColumns } from './planTableList';
import CustomerModel from '@/components/CustomerModel';
import { Watermark } from '@/components/watermark';
import { DATE_FORMAT } from '@/utils/constants';
import { connectInfo } from '@/services/globalDetailApi';
import FileDetail from '@/components/upload/detail';

const columns = [
    {
        title: '账号名称',
        dataIndex: 'bloggerAccountName',
    },
    {
        title: '平台账号ID',
        dataIndex: 'bloggerAccountUuid',
    },
    {
        title: '平台',
        dataIndex: 'bloggerAccountPlatform',
        render: (text) => {
            return getOptionName(STAR_PLATFORM, text);
        },
    },
    {
        title: '粉丝数',
        dataIndex: 'bloggerFansAmount',
    },
    {
        title: '类型',
        dataIndex: 'bloggerAccountType',
        render: (text) => {
            return getOptionName(BLOGGER_TYPE, text);
        },
    },
];
const LabelWrap1 = (props) => {
    return [
        [
            { key: 'bloggerNickName', label: '昵称' },
            {
                key: 'bloggerSignState',
                label: '状态',
                render: (d) => {
                    return d.bloggerSignState
                        ? BLOGGER_SIGN_STATE.find((item) => {
                              return Number(item.id) === d.bloggerSignState;
                          }).name
                        : '';
                },
            },
            {
                key: 'bloggerGroupId',
                label: '组别',
                render: (d) => {
                    if (d.bloggerGroupId && !_.isEmpty(props.dictionariesList)) {
                        return props.dictionariesList.find((item) => {
                            return item.id === d.bloggerGroupId;
                        }).name;
                    }
                    return '';
                },
            },
            { key: 'bloggerDescription', label: '备注', emptyTxt: '暂无' },
        ],
    ];
};
const LabelWrap2 = [
    [
        {
            key: 'bloggerUserList',
            label: '制作人',
            render: (detail) => {
                return (
                    detail.bloggerUserList &&
                    detail.bloggerUserList
                        .reduce((prev, item) => {
                            if (item.bloggerParticipantType === 3) {
                                prev.push(item.bloggerParticipantName);
                            }
                            return prev;
                        }, [])
                        .join('，')
                );
            },
        },
        {
            key: 'bloggerUserList',
            label: '新媒体运营',
            render: (detail) => {
                return (
                    detail.bloggerUserList &&
                    detail.bloggerUserList
                        .reduce((prev, item) => {
                            if (item.bloggerParticipantType === 13) {
                                prev.push(item.bloggerParticipantName);
                            }
                            return prev;
                        }, [])
                        .join('，')
                );
            },
        },
        {},
        {},
    ],
];
const LabelWrap3 = [
    [
        { key: 'bloggerCreatedBy', label: '录入人' },
        { key: 'bloggerCraetedAt', label: '录入时间' },
        { key: 'bloggerUpdatedBy', label: '更新人' },
        { key: 'bloggerUpdatedAt', label: '更新时间' },
    ],
];
const LabelWrap4 = [
    [
        {
            key: 'bloggerAccountList',
            render: (detail) => {
                return (
                    <BITable
                        className={styles.detailTableWrap}
                        rowKey="companyBankId"
                        bordered={true}
                        columns={columns}
                        dataSource={detail.bloggerAccountList || []}
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
function formatData(formData) {
    for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
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
        }
    }
    return formData;
}
//     for (const key in formData) {
//         if (formData.hasOwnProperty(key)) {
//             switch (key) {
//                 case 'starUserList':
//                     formData.starManagerName = formData.starUserList
//                         .reduce((prev, item) => {
//                             if (item.starParticipantType === 1) {
//                                 prev.push(item.starParticipantName);
//                             }
//                             return prev;
//                         }, [])
//                         .join('，');
//                     formData.starDrumbeater = formData.starUserList
//                         .reduce((prev, item) => {
//                             if (item.starParticipantType === 2) {
//                                 prev.push(item.starParticipantName);
//                             }
//                             return prev;
//                         }, [])
//                         .join('，');
//                     break;
//                 default:
//                     break;
//             }
//         }
//     }
//     return formData;
// }
@Watermark
@connect(({ talent_blogger }) => {
    return {
        formData: talent_blogger.formData,
        dictionariesList: talent_blogger.dictionariesList,
        ContractStatusLists: talent_blogger.ContractStatusLists,
    };
})
class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // detail: {},
            type: 1, // tab切换 1-基本信息 2-合同执行进度
            // isStopRequest: true, // 是否阻止发起请求
            contractProgressData: {},
            modelVisible: false,
            modelData: {},
            connectData: [],
            inputValue: '',
        };
    }

    componentDidMount() {
        this.getData();
        this.getContractProgress();
        this.changeHeader(this.props);
        this.props.dispatch({
            type: 'talent_blogger/getDictionariesList',
            payload: { parentId: 283 },
        });
        // 数据交接 - 隐藏
        this.getConnectHistory();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.formData !== nextProps.formData) {
            this.changeHeader(nextProps);
        }
    }

    changeHeader = (props) => {
        const code = (props.formData && props.formData.bloggerCode) || '';
        this.props.dispatch({
            type: 'header/saveHeaderName',
            payload: {
                title: '博主详情',
                subTitle: `Talent编号-${code}`,
                component: this.rightBtns(),
            },
        });
    };

    edit = () => {
        const { query } = this.props.location;
        this.props.history.push({
            pathname: '/foreEnd/business/talentManage/talent/blogger/edit',
            query: {
                id: query && query.id,
            },
        });
    };

    rightBtns = () => {
        // 右侧按钮
        return (
            <div>
                <AuthButton authority="/foreEnd/business/talentManage/talent/blogger/detail/edit">
                    <BIButton className={styles.headerBtn} type="primary" ghost onClick={this.edit}>
                        <IconFont type="iconxiangqingye-bianji" />
                        <span className={styles.editTitle}>编辑</span>
                    </BIButton>
                </AuthButton>
            </div>
        );
    };

    getData = () => {
        const { query } = this.props.location;
        this.props.dispatch({
            type: 'talent_blogger/getBloggerDetail',
            payload: {
                id: query && query.id,
            },
        });
    };

    reload = () => {
        this.getContractProgress();
        this.setState({
            modelVisible: false,
        });
    };

    getContractProgress = (queryDataObj) => {
        const queryData = queryDataObj || {};
        const { contractProgressData } = this.state;
        const { query } = this.props.location;
        const params = {
            pageNum: 1,
            pageSize: 100,
            talentType: 1, // 0:艺人 1:博主
        };
        const data = Object.assign(contractProgressData, params, queryData);
        this.setState({
            contractProgressData: data,
        });
        this.props.dispatch({
            type: 'talent_blogger/getContractStatus',
            payload: {
                id: query && query.id,
                data,
            },
        });
    };

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
        });
    };

    search() {
        const { beforeSearch } = this.props;
        if (typeof beforeSearch === 'function') beforeSearch();
        this.fetch();
    }

    formContractLists(data) {
        const domArr = [];
        if (data && data.length <= 0) {
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
                <dl className={styles.tableExtra} key={item.contractId}>
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
                contractId: item.contractId,
                contractAppointmentAttachments: cItem.contractAppointmentAttachments,
                contractAppointmentId: cItem.contractAppointmentId,
                contractType: item.contractType,
            });
        });
        return (
            <BITable
                rowKey="contractId"
                bordered={true}
                columns={contractColumns(this)}
                dataSource={cDomArr}
                pagination={false}
            />
        );
    }

    changeExecute = (data) => {
        this.setState({
            modelData: Object.assign({}, data),
            modelVisible: true,
        });
    };

    // 获取转交记录
    getConnectHistory = async () => {
        const {
            query: { id = '' },
        } = this.props.location;
        const res = await connectInfo(id, 3);
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
        const suffix =
            inputValue === '' ? (
                <img src="https://static.mttop.cn/admin/search.png" className={styles.suffixIcon} alt="" />
            ) : null;
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
                    <>
                        <FlexDetail LabelWrap={LabelWrap1(this.props)} detail={formData} title="博主基本信息" />
                        <FlexDetail LabelWrap={LabelWrap4} detail={formData} title="账号信息" />
                        <FlexDetail LabelWrap={LabelWrap2} detail={formData} title="参与人信息" />
                        <FlexDetail LabelWrap={LabelWrap3} detail={formData} title="更新人信息" />

                        <FlexDetail LabelWrap={[[]]} detail={formData} title="博主推荐BP">
                            {formData.bloggerAttachmentList && formData.bloggerAttachmentList.length > 0 ? (
                                <FileDetail data={formData.bloggerAttachmentList} />
                            ) : (
                                <span className={styles.noData}>暂无数据</span>
                            )}
                        </FlexDetail>
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
                        <AuthButton authority="/foreEnd/business/talentManage/talent/blogger/detail/commen">
                            <SlefProgress
                                id={Number(this.props.location.query.id)}
                                interfaceName="2"
                                authority="/foreEnd/business/talentManage/talent/blogger/detail/publishCommen"
                            />
                        </AuthButton>
                    </>
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
                                        onChange={(value, label) => {
                                            if (value === undefined) {
                                                this.getContractProgress({
                                                    projectName: '',
                                                });
                                            } else if (
                                                value.label &&
                                                value.label !== '' &&
                                                JSON.stringify(label) !== '{}'
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
