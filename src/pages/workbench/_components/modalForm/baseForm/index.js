import React from 'react';
import _ from 'lodash';
import { message } from 'antd';
import moment from 'moment';
import { formatFormCols, getOptionName } from '@/utils/utils';
import BIModal from '@/ant_components/BIModal';
import { renderTxt } from '@/utils/hoverPopover';
import { formatCols as calendarCols } from '../calendar/constants/constants';
import { formatDetailCols as calendarDetailCols } from '../calendar/constants/detailConstants';
import { formatCols as taskCols } from '../task/constants/constants';
import { formatDetailCols as taskDetailCols } from '../task/constants/detailConstants';
import ModalCom from '@/components/CalendarForm/modal/index.jsx';
import DelBtn from '../calendar/edit/customBtn/delBtn';
import { fetchFinishflagStatus } from '../task/components/subTask/_utils';
import ReturnFileBtn from '../task/edit/customBtn/returnFile';
import { editSchedule } from '../services';
import {
    getScheduleDetailFn,
    getMeetingList,
    formatData,
    deleteNoUse,
    renderNoticers,
    renderModalTitle,
    operatePerson,
    reduceScheduleMemberList,
    dateFormateStr,
    handleTaskFinishStatus,
} from '../_utils';
import styles from './index.less';

export default class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            taskData: {}, // 任务原始数据
            formData: {},
            scheduleType: [],
            type: 0, // 0-日程，1-任务
            isEdit: 1, // 0-添加，1-修改
            id: '', // 详情ID
            meetingList: [],
            detailType: 'detailPage', // detailPage:详情页面,
            resourceIndexId: undefined, // 会议室资源 索引ID
            scheduleProjectDto: [], // 所属项目
            schedulePanelList: [], // 所属列表
        };
    }

    showModal = async (id) => {
        // 此方法需传递instanceId ,用于非此实例模块调用
        const resData = await getScheduleDetailFn(id);
        this.setState({ ...resData, detailType: 'detailPage', isEdit: 1, id });
    };

    showInstanceModal = async (param = {}) => {
        // 详情数据回显
        const { limit, id } = param;
        if (limit) {
            message.error('你暂无权限查看');
            return;
        }
        const resData = await getScheduleDetailFn(id);
        this.setState({ ...resData, ...param });
    };

    getNewData = (obj) => {
        const { formData } = this.state;
        const form = this.formView.props.form.getFieldsValue();
        return _.assign({}, formData, form, obj);
    };

    // 修改全天
    changeParentForm1 = (val) => {
        // 修改全天需清除
        this.setState(
            { formData: this.getNewData({ wholeDayFlag: Number(val.target.checked) }) },
            this.changeParentForm2,
        );
    };

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
        // 重置会议室
        // this.changeParentForm2('');
        this.setState({ formData: this.getNewData({ daterange: e }) }, this.changeParentForm2);
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
        const projectObj = scheduleProjectDto.find((item) => {
            return val === item.id;
        }) || {};
        const schedulePanelList = Array.isArray(projectObj.schedulePanelList) ? projectObj.schedulePanelList : [];
        this.setState({
            schedulePanelList,
            formData: this.getNewData({
                scheduleProjectDto: val,
                schedulePanelList: (schedulePanelList[0] || {}).id,
            }),
        });
    };

    // 隐藏弹框
    hideForm = (onlyClose) => {
        const { getData, onClose } = this.props;
        this.setState({ visible: false, detailType: 'detailPage' });
        if (!onlyClose) {
            getData();
            this.refreshScheduleList();
        }
        if (onClose) {
            onClose();
        }
    };

    // 打开子任务详情
    goChildModal = (id) => {
        const { onClose } = this.props;
        this.showModal(Number(id));
        this.setState({ detailType: 'detailPage' });
        if (onClose) {
            onClose();
        }
    };

    // 点击进入编辑组件
    goEdit = async (detailType) => {
        const { id } = this.state;
        const resData = await getScheduleDetailFn(id);
        this.setState({ ...resData, detailType });
    };

    fetch = async (newDataFilter, getData, id) => {
        await this.setState({ loading: true });
        const response = await editSchedule(newDataFilter);
        if (response && response.success) {
            message.success('编辑成功');
            const resData = await getScheduleDetailFn(id);
            this.setState({ ...resData, detailType: 'detailPage' });
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
        let newDataFilter = deleteNoUse(data);
        // 任务数据---上传时判断如果是我的日历时任务的完成状态使用所属项目列表控制
        newDataFilter = Number(type) === 1 ? handleTaskFinishStatus(newDataFilter) : newDataFilter;
        // 任务状态是已完成则先判断子任务是否有未完成的，没有直接请求编辑接口，有的话需要先弹提示框
        if (Number(newDataFilter.finishFlag) === 1) {
            const params = {
                currentId: Number(id),
                status: 1,
                callBack: () => {
                    this.fetch(newDataFilter, getData, id);
                },
            };
            await fetchFinishflagStatus(params); // 1:已完成
        } else {
            // 请求编辑接口
            this.fetch(newDataFilter, getData, id);
        }
    };

    // 自定义弹框操作按钮
    renderCustomBtn = () => {
        const { type, id } = this.state;
        const { getData, authority } = this.props;
        const selfProp = { id, getData, authority, isShowModalFn: this.hideForm };
        if (Number(type) === 1) {
            return <ReturnFileBtn {...selfProp} />;
        }
        return <DelBtn {...selfProp} />;
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

    // 当前层级
    renderLayerDom = (data) => {
        return (
            <div className={styles.layerCls}>
                当前：
                <span className={styles.currentLayer}>{data.currentLayer}</span>
-
                <span>{data.totalLayer}</span>
            </div>
        );
    };

    // 有子任务的任务标题
    renderTaskName = (data) => {
        const { detailType } = this.state;
        return (
            <div>
                <span
                    className={styles.checkParentBtn}
                    onClick={() => {
                        if (data.parentScheduleId !== -1) {
                            // 父级id是-1说明父级是隐私任务，且当前登陆人不可查看父级
                            if (detailType === 'editPage') {
                                BIModal.confirm({
                                    title: '是否放弃当前任务编辑信息？',
                                    autoFocusButton: null,
                                    onOk: () => {
                                        this.showModal(Number(data.parentScheduleId));
                                    },
                                });
                            } else {
                                this.showModal(Number(data.parentScheduleId));
                            }
                        }
                    }}
                >
                    查看父级
                </span>
                <span>
/
                    {data.parentScheduleId === -1 ? '隐私任务' : renderTxt(data.parentScheduleName, 14)}
                    {' '}
/
                </span>
            </div>
        );
    };

    renderCuntomTitle = (data) => {
        const { type, isEdit, detailType } = this.state;
        return (
            <div className={styles.titleCls}>
                {data.currentLayer === 1
                    ? renderModalTitle(`${type}_${isEdit}`, detailType)
                    : this.renderTaskName(data)}

                {this.renderLayerDom(data)}
            </div>
        );
    };

    render() {
        const {
            visible, formData, type, isEdit, id, detailType, loading,
        } = this.state;
        const { maskClosable, editAuthority, getData } = this.props;
        const objFn = {
            changeNotifyNode: this.changeNotifyNode,
            changeParentForm2: this.changeParentForm2,
            changeScheduleProjectDto: this.changeScheduleProjectDto,
            changeParentForm1: this.changeParentForm1,
            changeDaterange: this.changeDaterange,
            renderNoticers,
        };
        const cols = formatFormCols(
            !type
                ? calendarCols({ ...this.state }, { ...objFn, customCom: this.customCom })
                : taskCols(
                    { ...this.state },
                    {
                        ...objFn,
                        getData,
                        getDetailData: this.showInstanceModal,
                        goChildModal: this.goChildModal,
                    },
                ),
        );
        const detailCol = type
            ? taskDetailCols(
                { ...this.state, renderNoticers, goChildModal: this.goChildModal },
                {
                    getData,
                    getDetailData: this.showInstanceModal,
                },
            )
            : calendarDetailCols({ ...this.state, renderNoticers });
        return !visible ? null : (
            <ModalCom
                operateBtnauthority={editAuthority}
                commentId={id} // 评论id
                commentSort={1} // 动态排序1:正序，2:倒序
                customBtn={this.renderCustomBtn()}
                cols={detailType === 'editPage' ? cols : detailCol}
                detailType={detailType}
                formData={formData}
                customTitle={type ? this.renderCuntomTitle(formData) : undefined}
                formTitle={renderModalTitle(`${type}_${isEdit}`, detailType)}
                goEdit={this.goEdit}
                visible={visible}
                onCancel={() => {
                    return this.hideForm(1);
                }}
                wrappedComponentRef={(fv) => {
                    this.formView = fv;
                }}
                handleCancel={() => {
                    return this.hideForm(1);
                }}
                handleSubmit={this.handleSubmit}
                isShowDelBtn={true} // 展示删除按钮
                loading={loading}
                rowData={formData}
                maskClosable={maskClosable || false}
                interfaceName="13" // 动态消息的配置id
                className="editFormModal"
                width={920}
                title={null}
                footer={null}
            />
        );
    }
}
