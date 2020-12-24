import React from 'react';
import { Divider } from 'antd';
import classnames from 'classnames';
import IconFont from '@/components/CustomIcon/IconFont';
import BIModal from '@/ant_components/BIModal';
import Modal from '../_component/modal';
import styles from './styles.less';
import Header from './components/header';
import { formateTaskData, submitFormate } from './_utils';
import { getProjectsPanels } from '../services';
import BICheckbox from '@/ant_components/BICheckbox';
import { myProjectId, finishPanelId, taskFinishStatus } from '../../../_enum';
import ScheduName from '../_component/scheduName';
import Member from '../_component/member';
import DatePacker from '../_component/dateRange';
import NoticeSetting from '../_component/scheduleNotice';
import TagList from '../_component/tag';
import Description from '../_component/description';
import Upload from '../_component/upload';
import SubTask from './components/subTask';

/*
 * @props onRefresh   刷新数据
 * isEdit 用于判断是否是编辑页面
 *
 */
export default class Task extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: props.dataSource || {},
            submitParams: formateTaskData(props.dataSource || {}),
            scheduleWriteVoList: (props.dataSource || {}).scheduleWriteVoList || [], // 子任务存放
            projectList: [],
            // editType: 1, // 1只读,2禁用,3读写
        };
    }

    componentDidMount() {
        this.getProjectList();
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (JSON.stringify(nextProps.dataSource) !== JSON.stringify(prevState.dataSource)) {
            return {
                dataSource: nextProps.dataSource,
                submitParams: formateTaskData(nextProps.dataSource),
                scheduleWriteVoList: nextProps.dataSource.scheduleWriteVoList || [],
            };
        }
        return null;
    }

    getProjectList = async () => {
        const res = await getProjectsPanels();
        const { submitParams } = this.state;
        let { projectVO, panelVO } = submitParams || {};
        if (res && res.success) {
            const projectList = Array.isArray(res.data) ? res.data : [];
            // 新增任务panelId为空时先默认第一个
            const projectObj = projectList.find((ls) => {
                return Number(ls.projectId) === Number(projectVO.projectId);
            })
                || projectVO
                || {};
            projectVO = { projectId: projectObj.projectId, projectName: projectObj.projectName };
            const schedulePanelList = projectObj.schedulePanelList || [];
            panelVO = schedulePanelList.find((ls) => {
                return Number(ls.panelId) === Number(panelVO.panelId);
            })
                || schedulePanelList[0]
                || panelVO
                || {};
            this.setState({ projectList, submitParams: { ...submitParams, projectVO, panelVO } });
        }
    };

    onRefresh = (id) => {
        if (this.props.onRefresh) {
            this.props.onRefresh(id);
        }
    };

    onChange = (val = {}) => {
        let { submitParams } = this.state;
        submitParams = { ...submitParams, ...val };
        this.setState({ submitParams }, this.updateDate);
    };

    addSchedule = () => {
        const { submitParams } = this.state;
        if (this.props.addSchedule) {
            this.props.addSchedule(submitFormate(submitParams));
        }
    };

    updateDate = () => {
        // 编辑页面进行实时保存
        if (this.props.isEdit && this.props.updateSchedule) {
            const { submitParams } = this.state;
            this.props.updateSchedule(submitFormate(submitParams));
        }
    };

    /*
     *   如果所属项目是我的日历,在更换完成状态时,从已完成改成未完成,则把所属列表从已完成改到待执行
     *   若改任务下有子任务应当进行提示是否完成所有子任务
     *   若父任务已完成则不可编辑
     */
    onChangeTaskFinish = (e) => {
        const { projectList, submitParams = {} } = this.state;
        const { projectVO, parentScheduleFinishFlag } = submitParams;
        let { panelVO } = submitParams;
        const checked = e.target.checked;
        if (parentScheduleFinishFlag === taskFinishStatus) return;
        if (projectVO.projectId === myProjectId) {
            const projectObj = projectList.find((ls) => {
                return Number(ls.projectId) === Number(projectVO.projectId);
            });
            const schedulePanelList = projectObj.schedulePanelList || [];
            if (checked && panelVO.panelId !== finishPanelId) {
                panelVO = schedulePanelList.find((ls) => {
                    return Number(ls.panelId) === Number(finishPanelId);
                }) || {};
            } else if (!checked && panelVO.panelId === finishPanelId) {
                panelVO = schedulePanelList[0] || {};
            }
        }
        const finishFlag = checked ? 1 : 0;
        this.checkoutUnFinishSubTask({ panelData: submitParams, finishFlag }, () => {
            this.onChange({ panelVO, finishFlag });
        });
    };

    checkoutUnFinishSubTask = ({ panelData, finishFlag }, callback = () => {}) => {
        const { subTaskTotal, subTaskUnFinished } = panelData;
        if (subTaskTotal > 0 && subTaskUnFinished > 0 && finishFlag) {
            const confirm = BIModal.confirm({
                title: '',
                content: '完成该任务，该任务下的所有子任务也会变更为完成状态，是否确认完成？',
                onOk: callback,
                onCancel: () => {
                    confirm.destroy();
                },
            });
        } else {
            callback();
        }
    };

    render() {
        const { dataSource, submitParams = {}, projectList } = this.state;
        const { isEdit, scheduleId, disabled } = this.props;
        const { finishFlag, parentScheduleFinishFlag } = submitParams;
        return (
            <Modal
                ref={(dom) => {
                    this.comment = dom;
                }}
                scheduleId={scheduleId} // 使用原始scheduleId,减少评论组件渲染
                onCancel={this.props.onCancel}
                isEdit={isEdit}
                onOk={this.addSchedule}
                visible={true}
            >
                <div className={styles.wrap}>
                    <Header
                        isEdit={isEdit}
                        dataSource={dataSource}
                        onRefresh={this.onRefresh}
                        submitParams={submitParams}
                        onChange={this.onChange}
                        projectList={projectList}
                        settingCallback={this.props.settingCallback}
                        historyReplace={this.props.historyReplace}
                    />
                    <Divider style={{ margin: 0 }} />
                    <div className={styles.body}>
                        <div className={classnames(styles.item, styles.centerItem)}>
                            {isEdit ? (
                                <span className={styles.labelIcon}>
                                    <BICheckbox.Checkbox
                                        disabled={disabled || parentScheduleFinishFlag === taskFinishStatus}
                                        className={styles.taskStatues}
                                        checked={finishFlag === taskFinishStatus}
                                        onChange={this.onChangeTaskFinish}
                                    />
                                </span>
                            ) : null}

                            <span className={styles.itemWrap}>
                                {/* 设置任务名称,任务状态 */}
                                <ScheduName submitParams={submitParams} onChange={this.onChange} isEdit={isEdit} />
                            </span>
                        </div>
                        {/* 设置负责人,参与人,只会人 */}
                        <div className={classnames(styles.item, styles.centerItem)}>
                            <span className={styles.labelIcon}>
                                <IconFont type="iconziduan-ren" />
                            </span>
                            <span className={styles.itemWrap}>
                                <Member submitParams={submitParams} onChange={this.onChange} />
                            </span>
                        </div>
                        {/* 设置时间,全天,闹铃提示 */}
                        <div className={styles.item}>
                            <span className={styles.labelIcon}>
                                <IconFont type="iconziduan-riqi" />
                            </span>
                            <span className={styles.itemWrap}>
                                <DatePacker submitParams={submitParams} onChange={this.onChange} />
                                <NoticeSetting
                                    submitParams={submitParams}
                                    onChange={this.onChange}
                                    style={{ marginLeft: '20px' }}
                                />
                            </span>
                        </div>
                        {/* 设置tag */}
                        <div className={styles.item}>
                            <span className={styles.labelIcon}>
                                <IconFont type="iconbiaoqian" />
                            </span>
                            <span className={styles.itemWrap}>
                                <TagList submitParams={submitParams} onChange={this.onChange} />
                            </span>
                        </div>
                        {/* 设置描述 */}
                        <div className={styles.item}>
                            <span className={styles.labelIcon}>
                                <IconFont type="iconziduan-duohangwenben" />
                            </span>
                            <span className={styles.itemWrap}>
                                <Description submitParams={submitParams} onChange={this.onChange} />
                            </span>
                        </div>

                        {/* 设置附件 */}
                        <div className={styles.item}>
                            <span className={styles.labelIcon}>
                                <IconFont type="iconziduan-fujian" />
                            </span>
                            <span className={styles.itemWrap}>
                                {/* 设置任务名称,任务状态 */}
                                <Upload submitParams={submitParams} onChange={this.onChange} />
                            </span>
                        </div>
                        {/* 设置子任务 */}
                        {isEdit ? (
                            <div className={styles.item}>
                                <SubTask
                                    submitParams={submitParams}
                                    subTaskData={this.state.scheduleWriteVoList}
                                    onChange={this.onChange}
                                    addSubSchedule={this.props.addSubSchedule}
                                    updateSchedule={this.props.updateSchedule}
                                    checkoutUnFinishSubTask={this.checkoutUnFinishSubTask}
                                    onRefresh={this.props.onRefresh}
                                    historyPush={this.props.historyPush}
                                />
                            </div>
                        ) : null}
                    </div>
                </div>
            </Modal>
        );
    }
}
