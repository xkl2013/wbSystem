import React from 'react';
import { message } from 'antd';
import lodash from 'lodash';
import Task from './task';
import { initTask } from './task/_utils';
import { initCalendar } from './calendar/_utils';
import Calendar from './calendar';
import { taskType, calendarType } from '../../_enum';
import { getScheduleDetail, editSchedule, addSchedule } from './services';
import { submitEffects } from './_utils';

/*
 * showModal 参数
 * params( id)  主键id 用于请求日程或任务详情数据
 * callback 用于数据处理之后的回调
 * isCheckAuth bool   是否校验权限
 */

class EditModule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            dataSource: {},
            type: null, // 判断日程任务   0日程1任务
            loading: false,
            scheduleId: null,
            isEdit: false, // 判断是新增页面还是编辑页面
            isFetchView: false, // 是否刷新数据列表
            historyStore: [], // 用于存储浏览记录
        };
        this.updateSchedule = lodash.debounce(this.updateSchedule, 300);
    }

    /*
     * data 为日程或任务的原始数据,若由上游进行了传递,则不进行请求
     */
    showModal = async (params = {}) => {
        const { loading } = this.state;
        const { id } = params;
        let dataSource = {};
        if (loading || !id) return;
        await this.setState({ dataSource, scheduleId: id, loading: true });
        const res = await getScheduleDetail(id);
        if (res && res.success) {
            dataSource = res.data || {};
        } else {
            this.onCancel();
        }
        const visible = this.checkAuth(dataSource);

        await this.setState({
            dataSource,
            type: dataSource.type,
            loading: false,
            visible,
            isEdit: true,
            isFetchView: false,
            historyStore: [id],
        });
    };

    showAddModal = async (params) => {
        const { type } = params || {};
        let dataSource = {};
        if (type === taskType) {
            dataSource = { ...initTask(params), type };
        }
        if (type === calendarType) {
            dataSource = { ...initCalendar(params), type };
        }
        const { loading } = this.state;

        if (loading) return;
        await this.setState({
            dataSource,
            type,
            loading: false,
            visible: true,
            isEdit: false,
            isFetchView: false,
        });
    };

    onRefresh = async (id = this.state.scheduleId) => {
        let dataSource = {};
        if (!id || id === -1) {
            message.warn('无权限查看');
            this.onCancel();
            return;
        }
        await this.setState({ loading: true });
        const res = await getScheduleDetail(id);
        if (res && res.success) {
            dataSource = res.data || {};
        } else {
            // 返回异常直接关闭
            this.onCancel();
        }
        await this.setState({ dataSource, loading: false, scheduleId: id });
    };

    hiddenModal = () => {
        this.setState({ dataSource: {}, visible: false });
    };

    checkAuth = async (dataSource) => {
        let bol = true;
        if (!this.props.isCheckAuth) bol = true;
        if (dataSource.id === -1) bol = false;
        return bol;
    };

    // 新增子任务
    addSubSchedule = async (params) => {
        const res = await addSchedule(params);
        if (res && res.success) {
            message.success('创建成功');
            await this.onRefresh(this.state.scheduleId);
            // this.undateComment();
            this.setState({ isFetchView: true });
        }
    };

    addSchedule = async (params) => {
        const res = await addSchedule(params);
        if (res && res.success) {
            message.success('创建成功');
            this.setState({ isFetchView: true }, this.onCancel);
        }
    };

    // 删除,归档 任务回调@params
    settingCallback = () => {
        this.setState({ isFetchView: true }, this.historyGoBack);
    };

    updateSchedule = async (params) => {
        const res = await editSchedule(submitEffects(params));
        if (res && res.success) {
            message.success('编辑成功');
            this.setState({ isFetchView: true });
            this.undateComment();
            this.onRefresh();
        }
    };

    undateComment = () => {
        if (this.view && this.view.comment && this.view.comment.getDataList) {
            this.view.comment.getDataList();
        }
    };

    onCancel = () => {
        this.setState({ visible: false, loading: false });
        this.fetchView();
    };

    // 未堆栈中添加路由
    historyPush = (id) => {
        const { historyStore } = this.state;
        historyStore.push(id);
        this.onRefresh(id);
        this.setState({ historyStore });
    };

    historyGoBack = (id) => {
        const { historyStore } = this.state;
        if (!historyStore || historyStore.length <= 1) {
            this.onCancel();
            return;
        }
        let index = historyStore.findIndex((ls) => {
            return ls === id;
        });
        index = index >= 0 ? index : historyStore.length - 1;
        const newStore = historyStore.slice(0, index);
        this.setState({ historyStore: newStore }, () => {
            this.onRefresh(newStore[index - 1]);
        });
    };

    // 将堆栈清空,压入指定栈
    historyReplace = (id) => {
        this.onRefresh(id);
        this.setState({ historyStore: [id] });
    };

    fetchView = () => {
        if (this.props.fetchView && this.state.isFetchView) {
            this.props.fetchView();
        }
    };

    render() {
        const { visible, dataSource, type, isEdit } = this.state;
        if (!visible) return null;
        if (Number(type) === taskType) {
            return (
                <Task
                    ref={(dom) => {
                        this.view = dom;
                    }}
                    scheduleId={this.state.scheduleId}
                    dataSource={dataSource}
                    onRefresh={this.onRefresh}
                    updateSchedule={this.updateSchedule}
                    addSubSchedule={this.addSubSchedule}
                    addSchedule={this.addSchedule}
                    isEdit={isEdit}
                    onCancel={this.onCancel}
                    settingCallback={this.settingCallback}
                    historyPush={this.historyPush}
                    historyGoBack={this.historyGoBack}
                    historyReplace={this.historyReplace}
                />
            );
        }
        if (Number(type) === calendarType) {
            return (
                <Calendar
                    ref={(dom) => {
                        this.view = dom;
                    }}
                    scheduleId={this.state.scheduleId}
                    dataSource={dataSource}
                    onRefresh={this.onRefresh}
                    updateSchedule={this.updateSchedule}
                    addSubSchedule={this.addSubSchedule}
                    addSchedule={this.addSchedule}
                    isEdit={this.state.isEdit}
                    onCancel={this.onCancel}
                    settingCallback={this.settingCallback}
                />
            );
        }
        return null;
    }
}
export default EditModule;
