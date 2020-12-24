import React, { Component } from 'react';
import { Tabs, Tooltip, message } from 'antd';
import BIModal from '@/ant_components/BIModal';
import IconFont from '@/components/CustomIcon/IconFont';
import styles from './index.less';
import { renderTxt } from '@/utils/hoverPopover';
import { formateKanbanData } from '@/pages/workbench/mine/components/view/_utils';
import { getScheduleFile, delScheduleFile, recoveryScheduleFile } from '../../../mine/services';
import { delAllTask } from './_utils';

const { TabPane } = Tabs;
const btnList = [
    { id: '1', value: '恢复内容', icon: 'iconhuifu' },
    { id: '2', value: '彻底删除', icon: 'iconshanchu' },
];

class File extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: props.visible,
            taskData: [], // 任务数据
        };
    }

    componentWillReceiveProps(next) {
        if (next.visible) {
            this.initData();
        }
    }

    initData = () => {
        // 初始化数据
        this.setState(
            {
                visible: true,
                taskData: [],
            },
            () => {
                this.getTaskData();
            },
        );
    };

    hideForm = () => {
        this.props.hideModal();
        this.setState({
            visible: false,
        });
    };

    handleSubmit = () => {
        console.log(333);
    };

    tabChange = (e) => {
        // tab切换
        console.log(e);
    };

    recoveryBtn = (type, item) => {
        // 恢复内容
        if (type === 1) {
            this.recoveryTask(item.id);
        }
    };

    delBtn = (type, item) => {
        // 彻底删除
        if (type === 1) {
            delAllTask({
                currentId: item.id,
                callBack: () => {
                    this.delTask(item.id);
                },
            });
            // BIModal.confirm({
            //     title: `${type === 1 ? '该任务将被彻底删除,确认删除？' : '该列表及列表中的任务将被彻底删除,确认删除？'}`,
            //     autoFocusButton: null,
            //     onOk: () => {
            //         this.delTask(item.id);
            //     },
            // });
        } else if (type === 2) {
            console.log('彻底删除列表');
        } else {
            console.log('请传参数', item);
        }
    };

    getTaskData = async () => {
        // 获取已归档任务数据
        const { projectId = undefined } = (this.props.willFetch && this.props.willFetch()) || {};
        const queryType = projectId ? 2 : 1;
        const res = await getScheduleFile({
            queryType,
            projectId,
        });
        if (res && res.success) {
            const taskData = formateKanbanData(res.data, [{}]);
            this.setState({
                taskData,
                // queryType,
            });
            if (this.props.fetchView) {
                this.props.fetchView(); // 页面刷新
            }
        }
    };

    delTask = async (scheduleId) => {
        // 彻底删除任务
        const res = await delScheduleFile(scheduleId);
        if (res && res.success) {
            message.success('删除成功');
            this.getTaskData();
        }
    };

    recoveryTask = async (scheduleId) => {
        // 恢复任务
        const res = await recoveryScheduleFile({ scheduleIds: [scheduleId], fileStatus: 1 });
        if (res && res.success) {
            message.success('恢复成功');
            this.getTaskData();
        }
    };

    getAuthority = (id) => {
        const { recoveryAuth, deleteTask } = this.props;
        switch (id) {
            case '1':
                return recoveryAuth;
            case '2':
                return deleteTask;
            default:
                break;
        }
    };

    renderIcon = (data, type, item) => {
        return (
            <IconFont
                onClick={() => {
                    return data.id === '1' ? this.recoveryBtn(type, item) : this.delBtn(type, item);
                }}
                type={data.icon}
                className={styles.iconCls}
            />
        );
    };

    renderBtnItem = (data, type, item) => {
        const authority = this.getAuthority(data.id);
        return (
            <Tooltip key={data.id} placement="bottom" title={data.value} className={styles.operateBtn}>
                {authority === false ? null : this.renderIcon(data, type, item)}
            </Tooltip>
        );
    };

    renderOperateBtn = (type, item) => {
        // 操作按钮
        return (
            <div className={styles.popCls}>
                {btnList.map((item1) => {
                    return this.renderBtnItem(item1, type, item);
                })}
            </div>
        );
    };

    renderEmpty = () => {
        return <div className={styles.empytCls}>暂无内容</div>;
    };

    render() {
        const { visible, taskData } = this.state;
        const taskDataList = (taskData && taskData[0] && taskData[0].cards) || [];
        return (
            <BIModal
                {...this.props}
                title={null}
                footer={null}
                visible={visible}
                onOk={this.handleSubmit}
                onCancel={this.hideForm}
                maskClosable={false}
                className={styles.fileCls2}
            >
                <div className={styles.modalWrap}>
                    <Tabs defaultActiveKey="1" onChange={this.tabChange}>
                        <TabPane tab="已归档任务" key="1">
                            {taskDataList && taskDataList.length
                                ? taskDataList.map((item) => {
                                    return (
                                        <div className={styles.listTaskCls} key={item.id}>
                                            {renderTxt(item.scheduleName, 30)}
                                            {this.renderOperateBtn(1, item)}
                                        </div>
                                    );
                                })
                                : this.renderEmpty()}
                        </TabPane>
                        {/* <TabPane
              tab={`已归档列表`}
              key="2"
            >
              {list2.map(item => {
                return (
                  <div className={styles.listTaskCls} key={item}>
                    <p>{item}</p>
                    {this.renderOperateBtn(2, item)}
                  </div>
                )
              })}
            </TabPane> */}
                    </Tabs>
                </div>
            </BIModal>
        );
    }
}
export default File;
