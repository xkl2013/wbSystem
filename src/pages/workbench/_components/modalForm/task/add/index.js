/* eslint-disable */
import React from 'react';
import _ from 'lodash';
import { message } from 'antd';
import { formatFormCols } from '@/utils/utils';
import { formatCols } from '../constants/constants';
import ModalCom from '@/components/CalendarForm/modal/index.jsx';
import { addSchedule } from '../../services';
import {
    getProjectsPanelsFn,
    defaultFormData,
    formatData,
    getDefaultPanelId,
    deleteNoUse,
    renderNoticers,
    operatePerson,
    reduceScheduleMemberList,
} from '../../_utils';

export default class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            formData: {},
            scheduleType: [],
            isEdit: 0, // 0-添加，1-修改
            id: '', // 详情ID
            resourceIndexId: undefined, // 会议室资源 索引ID
            panelId: '', // 看板id
            projectId: '', // 项目id
            scheduleProjectDto: [], // 所属项目
            schedulePanelList: [], // 所属列表
        };
    }

    showInstanceModal = async (param) => {
        // 新增
        const { limit, panelId, projectId } = param;
        const { scheduleProjectDto } = this.state;
        const firRes = this.props.projectId ? Number(this.props.projectId) : -1;
        const defaultProId = projectId ? Number(projectId) : firRes;
        if (limit) {
            message.error('你暂无权限查看');
            return;
        }
        const proObj = await getProjectsPanelsFn(defaultProId);
        const defaultPanId = getDefaultPanelId(scheduleProjectDto, projectId, this.props.projectId);
        const { schedulePanelList } = proObj || {};
        const tempPanelId =
            Array.isArray(schedulePanelList) && schedulePanelList.length ? (schedulePanelList[0] || {}).id : null;
        this.setState({
            ...proObj,
            ...param,
            visible: true,
            formData: {
                type: 1,
                finishFlag: 0, // 任务状态默认是未完成
                schedulePriority: 1, // 优先级默认是普通
                ...defaultFormData(),
                scheduleProjectDto: defaultProId,
                schedulePanelList: panelId ? Number(panelId) : defaultPanId || tempPanelId || 2, // 2-默认是待执行
            },
        });
    };

    getNewData = (obj) => {
        const { formData } = this.state;
        const form = this.formView.props.form.getFieldsValue();
        return _.assign({}, formData, form, obj);
    };

    // 修改全天
    changeParentForm1 = (val) => {
        this.setState({ formData: this.getNewData({ wholeDayFlag: Number(val.target.checked) }) });
    };

    // 修改时间
    changeDaterange = (e) => {
        this.setState({ formData: this.getNewData({ daterange: e }) });
    };

    // 修改自定义表单数据
    changeNotifyNode = (value, type) => {
        const { id, formData } = this.state;
        const memberType = value.map((item) => {
            return {
                scheduleId: id,
                memberType: type,
                avatar: item.avatar,
                userId: Number(item.id),
                userName: item.name,
            };
        });
        const form = this.formView.props.form.getFieldsValue();
        const newData = _.assign({}, formData, form, operatePerson(type, memberType));
        this.setState({ formData: newData });
    };

    // 修改所属项目级联所属列表
    changeScheduleProjectDto = (val) => {
        const { scheduleProjectDto } = this.state;
        const newArr = scheduleProjectDto.filter((item) => {
            return val === item.id;
        });
        this.setState({
            schedulePanelList: (newArr[0] && newArr[0].schedulePanelList) || [],
            formData: this.getNewData({
                scheduleProjectDto: val,
                schedulePanelList: newArr[0] && newArr[0].schedulePanelList[0] && newArr[0].schedulePanelList[0].id,
            }),
        });
    };

    hideForm = (onlyClose) => {
        const { getData, onClose } = this.props;
        // 隐藏弹框
        this.setState({ visible: false });
        if (!onlyClose) {
            getData();
            this.refreshScheduleList();
        }
        if (onClose) {
            onClose();
        }
    };

    fetch = async (newDataFilter) => {
        let newParams = { ...newDataFilter };
        const { panelId, projectId } = this.state;
        const { getData } = this.props;
        await this.setState({ loading: true });
        const panelIdUnderPosition = panelId;
        const projectIdUnderPosition = projectId;
        if (panelIdUnderPosition && projectIdUnderPosition) {
            newParams = { ...newParams, panelIdUnderPosition, projectIdUnderPosition };
        }
        const response = await addSchedule(newParams, { panelId, projectId });
        if (response && response.success) {
            message.success('新增成功');
            this.setState({ visible: false });
            if (getData) getData();
        }
        await this.setState({ loading: false });
    };

    // 新增默认值：type：1任务，finishFlag：0未完成，schedulePriority：’1‘优先级
    handleSubmit = async (paramData) => {
        const { formData } = this.state;
        let data = { ...formData, ...paramData, scheduleMemberList: [] };
        data = { ...data, ...formatData(data, { ...this.state }) };
        data.scheduleMemberList = reduceScheduleMemberList(data.scheduleMemberList);
        // 格式化上传字段
        const newDataFilter = deleteNoUse(data);
        // 请求添加接口
        this.fetch(newDataFilter);
    };

    render() {
        const { visible, formData, loading } = this.state;
        const { maskClosable } = this.props;
        const cols = formatFormCols(
            formatCols(
                { ...this.state },
                {
                    changeNotifyNode: this.changeNotifyNode,
                    changeScheduleProjectDto: this.changeScheduleProjectDto,
                    changeParentForm1: this.changeParentForm1,
                    changeDaterange: this.changeDaterange,
                    hideForm: this.hideForm,
                    renderNoticers,
                },
            ),
        );

        return !visible ? null : (
            <ModalCom
                formTitle="新增任务"
                visible={visible}
                className="editFormModal"
                width={580}
                title={null}
                footer={null}
                onCancel={() => {
                    return this.hideForm(1);
                }}
                wrappedComponentRef={(fv) => {
                    this.formView = fv;
                }}
                cols={cols}
                formData={formData}
                handleCancel={() => {
                    return this.hideForm(1);
                }}
                handleSubmit={this.handleSubmit}
                loading={loading}
                maskClosable={maskClosable || false}
            />
        );
    }
}
