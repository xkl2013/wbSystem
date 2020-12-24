import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { message } from 'antd';
import FlexDetail from '@/components/flex-detail';
import { accDiv } from '@/utils/calculate';
import { DATE_FORMAT } from '@/utils/constants';
import { connectInfo } from '@/services/globalDetailApi';
import Dymic from '@/components/dynamicMsg';
import BITable from '@/ant_components/BITable';
import s from '@/components/modalfy/index.less';
import {
    getGeneralCols,
    getCompanyCols,
    getClauseCols,
    getHeaderCols,
    getParticipateCols,
    getStatusCols,
    getCreatorCols,
    getVarietyCols,
    getMovieCols,
    getExecutorCols,
    getCooperateCols,
    getDividesCols,
    getBudgetInfoCols,
    getObligationCols,
} from '@/pages/business/project/common/components/detail/basic';
import {
    checkEditAuthorizedAuthority,
    checkEditReturnAuthority,
} from '@/pages/business/project/manage/config/authority';
import { isNumber, getOptionName } from '@/utils/utils';
import { PARTICIPANT_TYPE } from '@/utils/enum';
import { initProjectingDetail } from '@/pages/business/project/establish/utils/initOptions';
import ReturnTable from './components/returnTable';
import AuthorizedTable from './components/authorizedTable';

const LabelWrap11 = [
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

@connect(({ business_project_manage }) => {
    return {
        formData: business_project_manage.formData,
    };
})
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            platformData: [],
            connectData: [],
            projectType: [],
            visible: false,
        };
    }

    componentDidMount() {
        // 数据交接 - 隐藏
        this.getConnectHistory();
        this.initProjecting();
    }

    modalCal = (id) => {
        this.setState({ visible: true, commentId: id });
    };

    hideModal = () => {
        this.setState({ visible: false });
    };

    initProjecting = async () => {
        initProjectingDetail((data) => {
            this.setState(data);
        });
    };

    // 更改履约义务
    editAppoint = (type, data, cb) => {
        const {
            query: { id = '' },
        } = this.props.location;
        const { formData } = this.props;
        const itemData = data;
        if (Number(formData.trailPlatformOrder) !== 0) {
            itemData.projectAppointmentProgress = isNumber(itemData.projectAppointmentProgress)
                ? accDiv(itemData.projectAppointmentProgress, 100).toFixed(2)
                : itemData.projectAppointmentProgress;
            itemData.divideAmountRate = isNumber(itemData.divideAmountRate)
                ? accDiv(itemData.divideAmountRate, 100).toFixed(4)
                : itemData.divideAmountRate;
            itemData.divideRateTalent = isNumber(itemData.divideRateTalent)
                ? accDiv(itemData.divideRateTalent, 100).toFixed(2)
                : itemData.divideRateTalent;
            itemData.divideRateCompany = isNumber(itemData.divideRateCompany)
                ? accDiv(itemData.divideRateCompany, 100).toFixed(2)
                : itemData.divideRateCompany;
        } else {
            delete itemData.projectAppointmentProgress;
        }
        if (type === 'add') {
            this.props.dispatch({
                type: 'business_project_manage/addAppoint',
                payload: {
                    projectId: id,
                    data: itemData,
                    cb: () => {
                        cb();
                        this.getInfo();
                    },
                },
            });
        } else if (type === 'edit') {
            this.props.dispatch({
                type: 'business_project_manage/editAppoint',
                payload: {
                    projectId: id,
                    id: data.projectAppointmentId,
                    data: itemData,
                    cb: () => {
                        cb();
                        this.getInfo();
                    },
                },
            });
        }
    };

    // 删除履约义务
    delAppoint = (data) => {
        const {
            query: { id = '' },
        } = this.props.location;
        this.props.dispatch({
            type: 'business_project_manage/delAppoint',
            payload: {
                projectId: id,
                id: data.projectAppointmentId,
                cb: this.getInfo,
            },
        });
    };

    // 更改回款计划
    editReturn = (type, data, cb) => {
        const itemData = data;
        if (type === 'add') {
            this.props.dispatch({
                type: 'business_project_manage/addReturn',
                payload: {
                    data: itemData,
                    cb: () => {
                        cb();
                        this.getInfo();
                    },
                },
            });
        } else if (type === 'edit') {
            this.props.dispatch({
                type: 'business_project_manage/editReturn',
                payload: {
                    data: itemData,
                    cb: () => {
                        cb();
                        this.getInfo();
                    },
                },
            });
        }
    };

    // 删除回款计划
    delReturn = (data) => {
        this.props.dispatch({
            type: 'business_project_manage/delReturn',
            payload: {
                id: data.id,
                cb: this.getInfo,
            },
        });
    };

    // 更改授权公司
    editAuthorized = (type, data, cb) => {
        const itemData = data;
        if (type === 'add') {
            this.props.dispatch({
                type: 'business_project_manage/addAuthorized',
                payload: {
                    data: itemData,
                    cb: () => {
                        cb();
                        this.getInfo();
                    },
                },
            });
        } else if (type === 'edit') {
            this.props.dispatch({
                type: 'business_project_manage/editAuthorized',
                payload: {
                    data: itemData,
                    cb: () => {
                        cb();
                        this.getInfo();
                    },
                },
            });
        }
    };

    // 删除授权公司
    delAuthorized = (data) => {
        this.props.dispatch({
            type: 'business_project_manage/delAuthorized',
            payload: {
                id: data.id,
                cb: this.getInfo,
            },
        });
    };

    // 同步详情数据
    getInfo = () => {
        const {
            query: { id = '' },
        } = this.props.location;
        this.props.dispatch({
            type: 'business_project_manage/getProjectDetail',
            payload: {
                id,
            },
        });
    };

    // 获取转交记录
    getConnectHistory = async () => {
        const {
            query: { id = '' },
        } = this.props.location;
        const res = await connectInfo(id, 6);
        if (res && res.success) {
            this.setState({
                connectData: res.data,
            });
        } else {
            message.error('数据异常');
        }
    };

    render() {
        const { formData } = this.props;
        const { platformData, connectData, projectType, visible, commentId } = this.state;
        const newFormData = {
            ...formData,
            projectType,
            platformData,
        };
        return (
            <>
                <FlexDetail LabelWrap={getGeneralCols(newFormData)} detail={newFormData} title="项目基本信息" />
                {Number(formData.projectingType) !== 4 && (
                    <FlexDetail LabelWrap={getCompanyCols(formData)} detail={formData} title="企业信息" />
                )}
                {Number(formData.projectingType) === 2 && (
                    <FlexDetail LabelWrap={getVarietyCols} detail={formData} title="综艺信息" />
                )}
                {Number(formData.projectingType) === 3 && (
                    <FlexDetail LabelWrap={getMovieCols} detail={formData} title="影视信息" />
                )}
                {Number(formData.projectingType) !== 4 && (
                    <FlexDetail LabelWrap={getClauseCols(formData)} detail={formData} title="项目条款信息" />
                )}
                {Number(formData.projectingType) !== 4
                    && (Number(formData.trailPlatformOrder) === 0 || Number(formData.trailPlatformOrder) === 1) && (
                    <FlexDetail LabelWrap={[[]]} detail={{}} title="艺人博主分成">
                        {getDividesCols(formData, 'manage')}
                    </FlexDetail>
                )}
                <FlexDetail LabelWrap={[[]]} detail={formData} title="履约义务明细">
                    {getObligationCols(formData, 'manage', this.modalCal)}
                    <Dymic
                        visible={visible}
                        width={720}
                        interfaceName="46"
                        commentId={commentId}
                        footer={null}
                        onCancel={this.hideModal}
                        className={s.modalDymic}
                    />
                </FlexDetail>
                {Number(formData.projectingType) !== 4 && (
                    <FlexDetail LabelWrap={[[]]} detail={formData} title="项目预算信息">
                        {getBudgetInfoCols(formData)}
                    </FlexDetail>
                )}
                {Number(formData.trailPlatformOrder) === 2 && (
                    <FlexDetail LabelWrap={[[]]} detail={formData} title="回款计划">
                        <ReturnTable
                            value={formData.projectReturnList || []}
                            disabled={!checkEditReturnAuthority(formData)}
                            editReturn={this.editReturn}
                            delReturn={this.delReturn}
                            formData={formData}
                        />
                    </FlexDetail>
                )}
                {Number(formData.projectingType) !== 4 && Number(formData.trailPlatformOrder) === 1 && (
                    <FlexDetail LabelWrap={[[]]} detail={formData} title="授权项目信息">
                        <AuthorizedTable
                            value={formData.projectAuthorizationInfoList || []}
                            disabled={!checkEditAuthorizedAuthority(formData)}
                            editAuthorized={this.editAuthorized}
                            delAuthorized={this.delAuthorized}
                            formData={formData}
                        />
                    </FlexDetail>
                )}
                <FlexDetail LabelWrap={getHeaderCols} detail={formData} title="负责人信息" />
                {Number(formData.projectingType) !== 4 && (
                    <FlexDetail LabelWrap={getCooperateCols(formData)} detail={formData} title="合作人信息" />
                )}
                {Number(formData.projectingType) !== 4 && (
                    <FlexDetail LabelWrap={getExecutorCols} detail={formData} title="执行人信息" />
                )}
                {Number(formData.projectingType) !== 4 && (
                    <FlexDetail LabelWrap={getParticipateCols} detail={formData} title="参与人信息" />
                )}
                <FlexDetail LabelWrap={getStatusCols(formData, 'manage')} detail={formData} title="进展状态信息" />
                <FlexDetail LabelWrap={getCreatorCols} detail={formData} title="更新信息" />
                {Array.isArray(connectData) && connectData.length > 0 && (
                    <FlexDetail LabelWrap={[[]]} detail={{}} title="转交记录">
                        <BITable
                            rowKey="id"
                            dataSource={connectData}
                            bordered
                            pagination={false}
                            columns={LabelWrap11}
                        />
                    </FlexDetail>
                )}
            </>
        );
    }
}

export default Index;
