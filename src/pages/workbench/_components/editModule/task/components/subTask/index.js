import React from 'react';
import lodash from 'lodash';
import { Tooltip } from 'antd';
import IconFont from '@/components/CustomIcon/IconFont';
import { taskFinishStatus, noAuthId } from '../../../../../_enum';
import { initTask } from '../../_utils';
import AddPanel from './components/add';
import EditPanel from './components/edit';
import Btns from './components/btnWrap';
import styles from './styles.less';

// 子任务默认展示3层
// addFlag   自定义参数,用于判断是否是新增数据()短持久 true为新增数据
const layerBgStyle = {
    1: '#fff',
    2: '#FCFCFC',
    3: 'F9F9F9',
};
// 递归插入制定初始化数据
const deepChange = (deepData = [], parentId, taskParams) => {
    if (!deepData || deepData.length === 0) return;
    deepData.forEach((el) => {
        if (el.id === parentId) {
            el.scheduleWriteVoList = Array.isArray(el.scheduleWriteVoList) ? el.scheduleWriteVoList : [];
            el.scheduleWriteVoList.unshift({ ...taskParams, parentScheduleId: el.id });
            return;
        }
        if (el.scheduleWriteVoList && el.scheduleWriteVoList.length) {
            el.scheduleWriteVoList = deepChange(el.scheduleWriteVoList, parentId, taskParams);
        }
    });
    return deepData;
};
// 递归删除已有新增编辑框
const deepDelAddPanelData = (deepData = []) => {
    let newArr = deepData;
    if (!deepData || deepData.length === 0) return [];
    newArr = deepData.filter((el) => {
        if (el.scheduleWriteVoList && el.scheduleWriteVoList.length) {
            el.scheduleWriteVoList = deepDelAddPanelData(el.scheduleWriteVoList);
        }
        return !el.addFlag;
    });
    return newArr;
};

// 递归遍历所有id
const initActiveKey = (deepData = []) => {
    let arr = [];
    if (!deepData || deepData.length === 0) return arr;
    deepData.forEach((el) => {
        arr.push(el.id);
        if (el.scheduleWriteVoList && el.scheduleWriteVoList.length) {
            arr = arr.concat([], initActiveKey(el.scheduleWriteVoList));
        }
    });
    return arr;
};
class SubTask extends React.Component {
    constructor(props) {
        super(props);
        const subTaskData = lodash.cloneDeep(props.subTaskData || []);
        this.state = {
            activeKey: initActiveKey(subTaskData),
            tempSubTaskData: lodash.cloneDeep(props.subTaskData || []), // 临时存储,保证指针不同
            subTaskData: subTaskData || [],
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (JSON.stringify(nextProps.subTaskData) !== JSON.stringify(prevState.tempSubTaskData)) {
            return {
                subTaskData: lodash.cloneDeep(nextProps.subTaskData || []),
                tempSubTaskData: lodash.cloneDeep(nextProps.subTaskData || []), // 临时存储,保证指针不同
                // activeKey: initActiveKey(subTaskData)
            };
        }
        return null;
    }

    addInitTask = (panelData = {}) => {
        let { subTaskData } = this.state;
        const { submitParams = {} } = this.props;
        // 若父任务已完成则无法创建子任务
        if (panelData.finishFlag === taskFinishStatus) return;
        // 若包含正在编辑的添加控件时,禁止创建,因为第一层未使用subTaskData数据,所以校验是选取因为第一层未使用subTaskData数据第一层,减少递归校验
        const scheduleWriteVoList = panelData.id === submitParams.id ? subTaskData : panelData.scheduleWriteVoList;
        if (
            Array.isArray(scheduleWriteVoList)
            && scheduleWriteVoList.some((ls) => {
                return ls.addFlag;
            })
        ) return;
        //
        const parentId = panelData.id;
        // 自定义id,用于更新优化
        const { id, rootScheduleId } = submitParams;
        const taskParams = {
            ...initTask(),
            addFlag: true,
            id: new Date().valueOf(),
            parentScheduleId: parentId,
            rootScheduleId,
        };
        subTaskData = deepDelAddPanelData(subTaskData);
        // 添加最外层子任务
        if (Number(id) === Number(parentId)) {
            subTaskData.unshift(taskParams);
        } else {
            subTaskData = deepChange(subTaskData, parentId, taskParams);
        }
        this.setState({ subTaskData });
        this.onExpand({ id: parentId, isExpand: true });
    };

    // 需要过滤掉异常数据
    updateSchedule = (panelData = {}) => {
        const newData = { ...panelData, scheduleWriteVoList: deepDelAddPanelData(panelData.scheduleWriteVoList) };
        this.props.updateSchedule(newData);
    };

    onChangeTaskFinish = (e, panelData = {}) => {
        const finishFlag = e.target.checked ? 1 : 0;
        if (this.props.checkoutUnFinishSubTask) {
            this.props.checkoutUnFinishSubTask({ panelData, finishFlag }, () => {
                this.updateSchedule({ ...panelData, finishFlag });
            });
        }
    };

    onChangeTaskData = (params = {}) => {
        this.updateSchedule(params);
    };

    onExpand = ({ id, isExpand }) => {
        const { activeKey } = this.state;
        const index = activeKey.findIndex((ls) => {
            return ls === id;
        });
        if (isExpand && index < 0) {
            activeKey.push(id);
        }
        if (!isExpand && index >= 0) {
            activeKey.splice(index, 1);
        }
        this.setState({ activeKey });
    };

    renderAddPanel = (panelData, { style }) => {
        return (
            <AddPanel
                panelData={panelData}
                addSubSchedule={this.props.addSubSchedule}
                addInitTask={this.addInitTask}
                style={style}
            />
        );
    };

    renderDataDetail = (panelData, { style, isExpand }) => {
        // 当父任务为已完成时,子任务不可从已完成改成未完成
        // 若任务id为-1是出去disabled状态
        const { scheduleWriteVoList } = panelData || {};
        const isHasChildren = scheduleWriteVoList && scheduleWriteVoList.length > 0;
        return (
            <EditPanel
                panelData={panelData}
                onChangeTaskFinish={this.onChangeTaskFinish}
                isHasChildren={isHasChildren}
                style={style}
                onExpand={this.onExpand}
                updateSubTask={this.updateSchedule}
                isExpand={isExpand}
                renderAddBtn={this.renderAddBtn}
                onRefresh={this.props.onRefresh}
                disabled={panelData.id === noAuthId}
                historyPush={this.props.historyPush}
            />
        );
    };

    renderPanelData = (panelData, layerNum = 1) => {
        const { scheduleWriteVoList = [], addFlag, id } = panelData || {};
        const style = { background: layerNum <= 3 ? layerBgStyle[layerNum] : '' };
        const { activeKey } = this.state;
        const isExpand = !!activeKey.find((ls) => {
            return ls === id;
        });
        return (
            <div className={styles.panelWrap} key={panelData.id}>
                {addFlag ? this.renderAddPanel(panelData, { style }) : null}
                {!addFlag ? this.renderDataDetail(panelData, { style, isExpand }) : null}
                {scheduleWriteVoList.length > 0 && isExpand ? (
                    <div className={styles.menuData}>
                        {scheduleWriteVoList.map((ls) => {
                            return this.renderPanelData(ls, layerNum + 1);
                        })}
                    </div>
                ) : null}
            </div>
        );
    };

    renderBtns = (panelData) => {
        return (
            <Btns
                panelData={panelData}
                addInitTask={this.addInitTask}
                onChange={(val) => {
                    return this.onChangeTaskData({ ...panelData, ...val });
                }}
            />
        );
    };

    renderAddBtn = (panelData = {}) => {
        const { finishFlag } = panelData;
        const addClick = (e) => {
            e.stopPropagation();
            this.addInitTask(panelData);
        };
        if (panelData.id === noAuthId) return null;
        if (finishFlag === taskFinishStatus) {
            return (
                <Tooltip placement="topLeft" title="任务已完成不可创建子任务">
                    <IconFont
                        type="icontianjiabiaoqian"
                        style={{ cursor: 'not-allowed' }}
                        className={styles.addnewTask}
                        onClick={addClick}
                    />
                </Tooltip>
            );
        }
        return <IconFont type="icontianjiabiaoqian" className={styles.addnewTask} onClick={addClick} />;
    };

    render() {
        const { subTaskData } = this.state;
        const { submitParams = {} } = this.props;
        const { subTaskTotal, subTaskUnFinished } = submitParams;
        return (
            <div className={styles.rootPanel}>
                <div className={styles.item}>
                    <span className={styles.labelIcon}>
                        <IconFont type="iconzirenwu" />
                        <span className={styles.subTaskNum}>
                            子任务
                            {subTaskTotal && subTaskTotal > 0 ? `${subTaskUnFinished} / ${subTaskTotal}` : ''}
                            {' '}
                        </span>
                    </span>
                    {this.renderAddBtn(submitParams)}
                </div>
                <div className={styles.panelCls}>
                    {subTaskData.map((ls) => {
                        return this.renderPanelData(ls);
                    })}
                </div>
            </div>
        );
    }
}
export default SubTask;
