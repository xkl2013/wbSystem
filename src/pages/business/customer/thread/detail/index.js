import React, { Component } from 'react';
import { connect } from 'dva';
import { Radio, message } from 'antd';
import moment from 'moment';
import FlexDetail from '@/components/flex-detail';
import BIRadio from '@/ant_components/BIRadio';
import BIButton from '@/ant_components/BIButton';
import BIModal from '@/ant_components/BIModal';
import {
    IS_OR_NOT,
    THREAD_TYPE,
    THREAD_LEVEL,
    TRAIL_PROGRESS,
    THREAD_STATUS,
    COMPANY_TYPE,
    COOPERATION_TYPE,
    FILM_TYPE,
} from '@/utils/enum';
import styles from './index.less';
import SelfProgress from '@/components/Progress';
import Information from '@/components/informationModel';
import {
    getOptionName,
    arr2str,
    msgF,
    getOptionLabel,
    dataMask4Number,
    getOptionKeyByRelatedKey,
    isNumber,
} from '@/utils/utils';
import { cancelTrail } from '../services';
import AuthButton from '@/components/AuthButton';
import { renderTxt } from '@/utils/hoverPopover';
import { DATE_FORMAT } from '@/utils/constants';
import { Watermark } from '@/components/watermark';
import { initTrailDetail } from '../utils/initOptions';

const getPerson = (arr) => {
    // 获取推荐、目标艺人或博主
    if (arr && arr.length > 0) {
        const newArr2 = arr.map((item) => {
            return item.trailTalentName;
        });
        return arr2str(newArr2);
    }
    return '';
};
const LabelWrap1 = (formData) => {
    const cols = [
        [
            {
                key: 'trailType',
                label: '线索类型',
                render: (detail) => {
                    const PROJECT_TYPE = detail.projectType;
                    let str = getOptionKeyByRelatedKey(PROJECT_TYPE, 'index', detail.trailType, 'value');
                    if (str && Number(detail.trailType) === 1) {
                        str += `/${getOptionKeyByRelatedKey(
                            PROJECT_TYPE[0].children,
                            'index',
                            detail.trailPlatformOrder,
                            'value',
                        )}`;
                    }
                    return str;
                },
            },
            {
                key: 'trailName',
                label: '线索名称',
                render: (detail) => {
                    return renderTxt(detail.trailName);
                },
            },
            {
                key: 'trailSource',
                label: '线索来源',
                render: (detail) => {
                    const arr = THREAD_TYPE.filter((item) => {
                        return String(item.id) === String(detail.trailType);
                    });
                    if (arr && arr.length > 0) {
                        return detail.trailSource && getOptionName(arr[0].child, detail.trailSource);
                    }
                    return '';
                },
            },
            { key: 'trailRecommender', label: '推荐人' },
        ],
        [
            {
                key: 'trailLevel',
                label: '线索级别',
                render: (detail) => {
                    return detail.trailLevel && getOptionName(THREAD_LEVEL, detail.trailLevel);
                },
            },
            {
                key: 'trailProgress',
                label: '线索进展',
                render: (detail) => {
                    return detail.trailProgress && getOptionName(TRAIL_PROGRESS, detail.trailProgress);
                },
            },
            {
                key: 'trailStatus',
                label: '线索状态',
                render: (detail) => {
                    return detail.trailStatus && getOptionName(THREAD_STATUS, detail.trailStatus);
                },
            },
            {
                key: 'trailInitiativeSell',
                label: '主动销售',
                render: (detail) => {
                    return getOptionName(IS_OR_NOT, detail.trailInitiativeSell);
                },
            },
        ],
        [{ key: 'trailDescription', label: '备注' }, { key: 'trailOrderPlatformName', label: '下单平台' }, {}, {}],
    ];
    if (Number(formData.trailSource) !== 5) {
        cols[0][3] = {};
    }
    if (Number(formData.trailPlatformOrder) !== 1) {
        cols[2][1] = {};
    }
    return cols;
};
const LabelWrap2 = (formData) => {
    const { trailCustomerType } = formData;
    const customerType = {
        key: 'trailCustomerType',
        label: '公司类型',
        render: (detail) => {
            return getOptionName(COMPANY_TYPE, detail.trailCustomerType);
        },
    };
    const customerName = {
        key: 'trailCustomerName',
        label: '直客公司名称',
    };
    const companyName = {
        key: 'trailCompanyName',
        label: '代理公司名称',
    };
    const signingCols = [
        {
            key: 'trailSigningCompanyName',
            label: '签约公司',
            render: (d) => {
                if (!d.trailSigningCompanyId) {
                    return null;
                }
                const data = [
                    {
                        ...d,
                        id: d.trailSigningCompanyId,
                        name: d.trailSigningCompanyName,
                        path: '/foreEnd/business/customer/customer/detail',
                    },
                ];
                return <Information data={data} />;
            },
        },
        {},
        {},
        {},
    ];
    if (Number(trailCustomerType) === 0) {
        return [[customerType, customerName, {}, {}], signingCols];
    }
    if (Number(trailCustomerType) === 1) {
        return [[customerType, companyName, customerName, {}], signingCols];
    }
    return [[]];
};
const LabelWrap3 = (detail) => {
    const { trailPlatformOrder } = detail;
    const cols = [
        [
            {
                key: 'trailCooperationDate',
                label: '预计合作日期',
                render: (d) => {
                    return d.trailCooperationDate && moment(d.trailCooperationDate).format(DATE_FORMAT);
                },
            },
            {
                key: 'trailCooperationBudget',
                label: '预估签单额',
                render: (obj) => {
                    return isNumber(obj.trailCooperationBudget)
                        ? `${dataMask4Number(obj.trailCooperationBudget)}元`
                        : obj.trailCooperationBudget;
                },
            },
            {},
            {},
        ],
    ];
    if (Number(trailPlatformOrder) === 2) {
        // 长期项目只有这两个字段
        return cols;
    }
    cols[0][2] = {
        key: 'trailTalentList',
        label: '目标艺人或博主',
        render: (obj) => {
            let data = Array.isArray(obj.trailTalentList) ? obj.trailTalentList : [];
            data = data.map((ls) => {
                const targetPath = ls.trailTalentType === 1 ? 'blogger' : 'actor';
                return {
                    ...ls,
                    id: ls.trailTalentId,
                    name: ls.trailTalentName,
                    path: `/foreEnd/business/talentManage/talent/${targetPath}/detail`,
                };
            });
            return <Information data={data} />;
        },
    };
    cols[0][3] = {
        key: 'trailRecommendTalentList',
        label: '推荐艺人或博主',
        render: (obj) => {
            return getPerson(obj.trailRecommendTalentList);
        },
    };
    let extra = [];
    extra.push({
        key: 'trailCooperationType',
        label: '合作类型',
        render: (obj) => {
            const options = obj.trailCooperationType1
                && COOPERATION_TYPE.find((item) => {
                    return String(item.value) === String(obj.trailCooperationType1);
                });
            const first = getOptionLabel(COOPERATION_TYPE, obj.trailCooperationType1) || '';
            if (first) {
                if (options && obj.trailCooperationType2 !== undefined) {
                    const second = getOptionLabel(options.children || [], obj.trailCooperationType2) || '';
                    if (second) {
                        return `${first}/${second}`;
                    }
                }
                return first;
            }
            return '';
        },
    });
    // 商务 trailType=1
    if (Number(detail.trailType) === 1) {
        extra = extra.concat([
            { key: 'trailCooperateProductDesc', label: '合作产品' },
            { key: 'trailCooperateIndustryDesc', label: '合作行业' },
            {},
        ]);
    } else {
        extra = extra.concat([{}, {}, {}]);
    }
    cols.push(extra);
    return cols;
};

const LabelWrap4 = [
    [
        { key: 'trailHeaderName', label: '负责人' },
        {
            key: 'trailHeaderdepartment',
            label: '所属部门',
            render: (d) => {
                if (d.trailHeaderdepartment && d.trailHeaderdepartment.indexOf('null -') > -1) {
                    return d.trailHeaderdepartment.split('-')[1];
                }
                return d.trailHeaderdepartment;
            },
        },
        {},
        {},
    ],
];
const LabelWrap5 = [
    [
        {
            key: 'participantNameList',
            label: '参与人',
            render: (detail) => {
                const result = [];
                /* eslint-disable no-unused-expressions */
                detail.trailUserList
                    && detail.trailUserList.map((item) => {
                        if (Number(item.trailParticipantType) === 1 || Number(item.trailParticipantType) === 3) {
                            result.push(item.trailParticipantName);
                        }
                    });
                return result.join('，');
            },
        },
    ],
];
const LabelWrap6 = [
    [
        { key: 'trailCreatedBy', label: '录入人' },
        { key: 'trailCreatedAt', label: '录入时间' },
        { key: 'trailUpdatedBy', label: '更新人' },
        { key: 'trailUpdatedAt', label: '更新时间' },
    ],
];

const LabelWrap7 = [
    [
        {
            key: 'trailFilmType',
            label: '影视类型',
            render: (detail) => {
                return detail.trailFilmType && getOptionName(FILM_TYPE, detail.trailFilmType);
            },
        },
        { key: 'trailFilmScore', label: '剧本评分' },
        {},
        {},
    ],
];
const LabelWrap8 = [
    [
        {
            key: 'trailUserList',
            label: '执行人',
            render: (detail) => {
                const result = [];
                detail.trailUserList
                    && detail.trailUserList.map((item) => {
                        if (Number(item.trailParticipantType) === 10) {
                            result.push(item.trailParticipantName);
                        }
                    });
                return result.join('，');
            },
        },
    ],
];

@Watermark
@connect(({ admin_thread }) => {
    return {
        trailDetailData: admin_thread.trailDetailData,
    };
})
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 1, // tab切换 1-概况 2-联系人
            // eslint-disable-next-line
            value: [], // 联系人ID集合
            projectType: [], // 项目类型
        };
    }

    componentDidMount() {
        this.initProjecting();
        this.getData();
    }

    componentWillReceiveProps(next) {
        let btn = null;
        if (Number(next.trailDetailData.trailStatus) === 1) {
            btn = this.rightBtns();
        }
        this.props.dispatch({
            type: 'header/saveHeaderName',
            payload: {
                subTitle: next.trailDetailData.trailCode,
                component: btn,
            },
        });
    }

    initProjecting = () => {
        initTrailDetail((data) => {
            this.setState(data);
        });
    };

    rightBtns = () => {
        // 右侧按钮
        return (
            <div>
                <AuthButton authority="/foreEnd/business/customer/thread/detail/cancel">
                    <BIButton type="primary" ghost className={styles.headerBtn} onClick={this.revocation}>
                        撤销
                    </BIButton>
                </AuthButton>
                <AuthButton authority="/foreEnd/business/customer/thread/detail/become">
                    <BIButton type="primary" className={styles.headerBtn} onClick={this.newProject}>
                        立项
                    </BIButton>
                </AuthButton>
            </div>
        );
    };

    revocation = () => {
        // 撤销
        BIModal.confirm({
            title: '操作撤销后，对应的线索状态将会变为已撤销，确认操作吗？',
            okText: '确定',
            cancelText: '取消',
            autoFocusButton: null,
            onOk: async () => {
                const { query } = this.props.location;
                const id = query && query.id;
                const result = await cancelTrail(id);
                if (result && result.success) {
                    message.success(msgF(result.message));
                    this.getData();
                } else {
                    message.error(msgF(result.message));
                }
            },
            onCancel() {},
        });
    };

    newProject = () => {
        // 立项
        const id = this.props.location.query.id || '';
        this.props.history.push(`/foreEnd/business/project/establish/add?id=${id}`);
    };

    getData = () => {
        // 获取详情
        const { query } = this.props.location;
        this.props.dispatch({
            type: 'admin_thread/getTrailsDetail',
            payload: {
                id: query && query.id,
            },
        });
    };

    tabChange = (e) => {
        // tab切换
        this.setState({
            type: e.target.value,
        });
    };

    edit = () => {
        // 编辑
        const { query } = this.props.location;
        this.props.history.push({
            pathname: './edit',
            query: {
                id: query && query.id,
            },
        });
    };

    render() {
        const { trailDetailData } = this.props;
        const { type, projectType } = this.state;
        trailDetailData.projectType = projectType;

        return (
            <div className={styles.detailPage}>
                <div className={styles.detailTabBtnWrap}>
                    <BIRadio defaultValue="1" buttonStyle="solid" onChange={this.tabChange}>
                        <AuthButton authority="/foreEnd/business/customer/thread/detail/info">
                            <Radio.Button className={styles.tabBtn} value="1">
                                概况
                            </Radio.Button>
                        </AuthButton>
                    </BIRadio>
                    {Number(type) === 1 && Number(trailDetailData.trailStatus) === 1 && (
                        <AuthButton authority="/foreEnd/business/customer/thread/detail/edit">
                            <BIButton icon="form" type="primary" ghost className={styles.editBtn} onClick={this.edit}>
                                编辑
                            </BIButton>
                        </AuthButton>
                    )}
                </div>
                {Number(type) === 1 && (
                    <div>
                        <FlexDetail
                            LabelWrap={LabelWrap1(trailDetailData)}
                            detail={trailDetailData}
                            title="线索基本信息"
                        />
                        <FlexDetail LabelWrap={LabelWrap2(trailDetailData)} detail={trailDetailData} title="企业信息" />
                        {Number(trailDetailData.trailType) === 3 && (
                            <FlexDetail LabelWrap={LabelWrap7} detail={trailDetailData} title="影剧信息" />
                        )}
                        <FlexDetail LabelWrap={LabelWrap3(trailDetailData)} detail={trailDetailData} title="合作信息" />
                        <FlexDetail LabelWrap={LabelWrap4} detail={trailDetailData} title="负责人信息" />
                        <FlexDetail LabelWrap={LabelWrap8} detail={trailDetailData} title="执行人信息" />
                        {// 长期项目没有目标艺人，即没有参与人
                            Number(trailDetailData.trailPlatformOrder) !== 2 && (
                                <FlexDetail LabelWrap={LabelWrap5} detail={trailDetailData} title="参与人信息" />
                            )}
                        <FlexDetail LabelWrap={LabelWrap6} detail={trailDetailData} title="更新信息" />
                    </div>
                )}
                <AuthButton authority="/foreEnd/business/customer/thread/detail/commen">
                    <SelfProgress
                        // eslint-disable-next-line
                        id={Number(this.props.location.query.id)}
                        interfaceName="4"
                        authority="/foreEnd/business/customer/thread/detail/publishCommen"
                    />
                </AuthButton>
            </div>
        );
    }
}

export default Index;
