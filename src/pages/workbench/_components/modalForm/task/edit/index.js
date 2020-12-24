import React from 'react';
import _ from 'lodash';
import { message } from 'antd';
import moment from 'moment';
import ModalCom from '@/components/CalendarForm/modal/index.jsx';
import { formatFormCols } from '@/utils/utils';
import ReturnFileBtn from './customBtn/returnFile';
import { formatCols } from '../constants/constants';
import { editSchedule } from '../../services';
import {
    getScheduleDetailFn,
    getMeetingList,
    formatData,
    deleteNoUse,
    renderNoticers,
    renderModalTitle,
    operatePerson,
    reduceScheduleMemberList,
} from '../../_utils';

export default class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: true,
            formData: { scheduleType: '0' },
            scheduleType: [],
            isShow: false,
            type: 0, // 0-日程，1-任务
            isEdit: 1, // 0-添加，1-修改
            id: '', // 详情ID
            meetingList: [],
            detailType: 'editPage', // detailPage:详情页面,
            resourceIndexId: undefined, // 会议室资源 索引ID
            scheduleProjectDto: [], // 所属项目
            schedulePanelList: [], // 所属列表
        };
    }

    showInstanceModal = async (param) => {
        // 编辑
        const { id, limit } = param;
        if (limit) {
            message.error('你暂无权限查看');
            return;
        }
        const resData = await getScheduleDetailFn(id);
        if (resData) {
            this.setState({ ...resData, id, visible: true });
        }
    };

    getNewData = (obj) => {
        const { formData } = this.state;
        const form = this.formView.props.form.getFieldsValue();
        return _.assign({}, formData, form, obj);
    };

    // 修改表单数据
    changeParentForm = (val) => {
        this.setState({
            formData: this.getNewData({ privateFlag: String(val) }),
            isShow: Number(val) === 2,
        });
    };

    changeParentForm1 = (val) => {
        this.setState({ formData: this.getNewData({ allDay: val }) });
    };

    changeParentForm2 = (val) => {
        this.setState({ formData: this.getNewData({ meeting: val }) });
    };

    changeDaterange = (e) => {
        const { resourceIndexId } = this.state;
        // 时间更改
        if (e && e.length === 2) {
            const startTime = moment(e[0]).format('YYYY-MM-DD HH:mm:00');
            const endTime = moment(e[1]).format('YYYY-MM-DD HH:mm:00');
            getMeetingList({ startTime, endTime, resourceIndexId }).then((resData) => {
                this.setState({ ...resData });
            });
        }
        this.setState({ formData: this.getNewData({ daterange: e, meeting: '' }) });
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

    fetch = async (newDataFilter, getData, id) => {
        await this.setState({ loading: true });
        const response = await editSchedule(newDataFilter);
        if (response && response.success) {
            message.success('编辑成功');
            const resData = await getScheduleDetailFn(id);
            this.setState({ ...resData, visible: false });
            if (getData) getData();
        }
        await this.setState({ loading: false });
    };

    handleSubmit = async (paramData) => {
        const { id, type, formData } = this.state;
        const { getData } = this.props;
        let data = { type, ...formData, ...paramData, scheduleMemberList: [] };
        data = { ...data, ...formatData(data, { ...this.state }) };
        data.scheduleMemberList = reduceScheduleMemberList(data.scheduleMemberList);

        // 默认把创建人传给后台
        data.memberType0.forEach((item, i) => {
            const newItem = { ...item };
            newItem.scheduleId = id;
            data.memberType0[i] = newItem;
        });
        data.scheduleMemberList = data.scheduleMemberList.concat(data.memberType0);

        // 格式化上传字段
        const newDataFilter = deleteNoUse(data);

        // 请求编辑接口
        this.fetch(newDataFilter, getData, id);
    };

    // 自定义弹框操作按钮
    renderCustomBtn = () => {
        const { id } = this.state;
        const { getData, authority } = this.props;
        const selfProp = { id, getData, authority, isShowModalFn: this.hideForm };
        return <ReturnFileBtn {...selfProp} />;
    };

    render() {
        const {
            visible, formData, type, isEdit, id, detailType, loading,
        } = this.state;
        const { maskClosable } = this.props;

        const cols = formatFormCols(
            formatCols(
                { ...this.state },
                {
                    changeNotifyNode: this.changeNotifyNode,
                    changeParentForm2: this.changeParentForm2,
                    changeScheduleProjectDto: this.changeScheduleProjectDto,
                    changeParentForm: this.changeParentForm,
                    changeParentForm1: this.changeParentForm1,
                    changeDaterange: this.changeDaterange,
                    renderNoticers,
                },
            ),
        );
        return !visible ? null : (
            <ModalCom
                formTitle={renderModalTitle(`${type}_${isEdit}`, detailType)}
                visible={visible}
                className="editFormModal"
                width={920}
                title={null}
                footer={null}
                onCancel={() => {
                    return this.hideForm(1);
                }}
                wrappedComponentRef={(fv) => {
                    this.formView = fv;
                }}
                cols={cols}
                detailType={detailType}
                formData={formData}
                handleCancel={() => {
                    return this.hideForm(1);
                }}
                handleSubmit={this.handleSubmit}
                commentId={id} // 评论id
                isShowDelBtn={true} // 展示删除按钮
                customBtn={this.renderCustomBtn()}
                loading={loading}
                rowData={formData}
                maskClosable={maskClosable || false}
                interfaceName="13" // 动态消息的配置id
                commentSort={1} // 动态排序1:正序，2:倒序
            />
        );
    }
}
