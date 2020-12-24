import React from 'react';
import _ from 'lodash';
import { message } from 'antd';
import moment from 'moment';
import { formatFormCols, getOptionName } from '@/utils/utils';
import { formatCols } from '../constants/constants';
import ModalCom from '@/components/CalendarForm/modal/index.jsx';
import { addSchedule } from '../../services';
import {
    getProjectsPanelsFn,
    defaultFormData,
    getMeetingList,
    formatData,
    getDefaultPanelId,
    deleteNoUse,
    renderNoticers,
    operatePerson,
    reduceScheduleMemberList,
    dateFormateStr,
} from '../../_utils';
import styles from './index.less';

export default class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            formData: { scheduleType: '0' },
            scheduleType: [],
            isEdit: 0, // 0-添加，1-修改
            id: '', // 详情ID
            meetingList: [],
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
        this.setState({
            ...proObj,
            ...param,
            visible: true,
            formData: {
                ...defaultFormData(),
                scheduleProjectDto: defaultProId,
                schedulePanelList: panelId ? Number(panelId) : defaultPanId || 5,
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
        this.setState(
            { formData: this.getNewData({ wholeDayFlag: Number(val.target.checked) }) },
            this.changeParentForm2,
        );
    };

    // 修改会议室
    // 修改会议室
    changeParentForm2 = (val) => {
        let { scheduleResource = {} } = this.state.formData;
        const form = this.formView.props.form.getFieldsValue() || {};
        const [startTime, endTime] = (Array.isArray(form.daterange) ? form.daterange : []).map((ls) => {
            return moment(ls).format(dateFormateStr);
        });
        scheduleResource = {
            ...scheduleResource,
            resourceId: val,
            resourceName: getOptionName(this.state.meetingList, val),
            resourceType: 0, // 资源类型  0会议室，1艺人
            startTime,
            endTime,
        };
        if (!val) {
            scheduleResource = null;
        }
        this.setState({ formData: this.getNewData({ meeting: val, scheduleResource }) });
    };

    // 修改时间
    changeDaterange = (e) => {
        const { resourceIndexId } = this.state;
        // 时间更改影响会议室
        if (e && e.length === 2) {
            const startTime = moment(e[0]).format('YYYY-MM-DD HH:mm:00');
            const endTime = moment(e[1]).format('YYYY-MM-DD HH:mm:00');
            getMeetingList({ startTime, endTime, resourceIndexId }).then((resData) => {
                this.setState({ ...resData });
            });
        }
        this.setState({ formData: this.getNewData({ daterange: e, meeting: '' }) }, this.changeParentForm2);
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

    // 所属项目级联所属列表
    changeScheduleProjectDto = (val) => {
        const { scheduleProjectDto } = this.state;
        const newArr = scheduleProjectDto.filter((item) => {
            return val === item.id;
        });
        this.setState({
            schedulePanelList: (newArr[0] && newArr[0].schedulePanelList) || [],
            formData: this.getNewData({
                scheduleProjectDto: val,
                schedulePanelList: newArr[0] && newArr[0].schedulePanelList[0].id,
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
        const { panelId, projectId } = this.state;
        const { getData } = this.props;
        await this.setState({ loading: true });
        const response = await addSchedule(newDataFilter, { panelId, projectId });
        if (response && response.success) {
            message.success('新增成功');
            this.setState({ visible: false });
            if (getData) getData();
        }
        await this.setState({ loading: false });
    };

    customCom = () => {
        return (
            <span
                role="presentation"
                className={styles.checkRoom}
                onClick={() => {
                    window.open(`${window.location.origin}/foreEnd/workbench/resources/meeting`);
                }}
            >
                查看会议室
            </span>
        );
    };

    handleSubmit = async (paramData) => {
        const { formData } = this.state;
        let data = { type: 0, finishFlag: 0, ...formData, ...paramData, scheduleMemberList: [] };
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
                    changeParentForm2: this.changeParentForm2,
                    changeScheduleProjectDto: this.changeScheduleProjectDto,
                    changeParentForm1: this.changeParentForm1,
                    changeDaterange: this.changeDaterange,
                    customCom: this.customCom,
                    renderNoticers,
                },
            ),
        );

        return !visible ? null : (
            <ModalCom
                formTitle="新增日程"
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
