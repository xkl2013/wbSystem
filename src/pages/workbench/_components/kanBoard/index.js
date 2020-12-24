import React from 'react';
import { Tooltip, Popover } from 'antd';
import classnames from 'classnames';
// import KanBan from '../../../../../../../taiyang_component/kanboard/src';
import KanBan from 'kanban-pannel';
import IconFont from '@/components/CustomIcon/IconFont';
import { renderTxt } from '@/utils/hoverPopover';
import { returnValue } from '../../mine/components/view/_utils';
import styles from './index.less';
import Setting from './components/setting';
import { taskType, calendarType } from '../../_enum';

/*
 *  taskParams  object  获取传递的参数
 *
 */

class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    addData = (key, type = 1) => {
        if (this.props.addFn) {
            const { dataSource = [] } = this.props;
            const panelObj = dataSource.find((ls) => {
                return String(ls.key) === String(key);
            }) || {};
            this.props.addFn({ panelId: panelObj.key, panelName: panelObj.title, type });
        }
    };

    handleSchedule = (key) => {
        return (
            <ul>
                <li
                    className={styles.liStyle}
                    onClick={() => {
                        return this.addData(key, calendarType);
                    }}
                >
                    新建日程
                </li>
                <li
                    className={styles.liStyle}
                    onClick={() => {
                        return this.addData(key, taskType);
                    }}
                >
                    新建任务
                </li>
            </ul>
        );
    };

    onRefresh = (panelId) => {
        if (this.props.onRefresh) {
            this.props.onRefresh(panelId);
        }
    };

    renderHeader = (data = {}) => {
        const { showNoFinishTask, listConfig = {}, taskParams } = this.props; // 是否展示未完成数
        const { canListSetting, renderListSettingIcon } = listConfig;
        const description = data.description;
        let panelTasks = 0;
        let panelNotFinishedTasks = 0;
        if (Array.isArray(data.rowData)) {
            data.rowData.forEach((item) => {
                // 看板未完成任务数
                if (item.colName === 'panelNotFinishedTasks') {
                    panelNotFinishedTasks = returnValue(item.cellValueList).value;
                }
                // 看板所有任务数
                if (item.colName === 'panelTasks') {
                    panelTasks = returnValue(item.cellValueList).value;
                }
            });
        }
        const renderListSetting = () => {
            if (!canListSetting) return;
            if (renderListSettingIcon && typeof renderListSettingIcon === 'function') {
                return <span className={styles.setting}>{renderListSettingIcon(data)}</span>;
            }
            return (
                <span className={styles.setting}>
                    <Popover
                        placement="leftTop"
                        title="列表菜单"
                        zIndex={100}
                        content={
                            <Setting
                                data={data}
                                taskParams={taskParams}
                                onRefresh={this.onRefresh}
                                panelAuthData={this.props.panelAuthData}
                            />
                        }
                    >
                        <IconFont type="icongengduo" />
                    </Popover>
                </span>
            );
        };
        return (
            <div className={styles.cardHeader}>
                <div className={styles.cardHeaderTitle}>
                    <span className={styles.title}>{renderTxt(data.title, 10)}</span>
                    <span className={styles.perCls}>
                        {showNoFinishTask ? `${panelNotFinishedTasks}/` : ''}
                        {panelTasks}
                    </span>
                    {description ? (
                        <Tooltip placement="rightTop" trigger="click" title={description}>
                            <IconFont className={styles.description} type="iconyiwen" />
                        </Tooltip>
                    ) : null}
                </div>

                {renderListSetting()}
            </div>
        );
    };

    renderAddBtn = (key) => {
        return (
            <Tooltip placement="right" title={this.handleSchedule(key)}>
                <span className={styles.addBtnCls}>
                    <IconFont type="iconxinzeng" />
                    {' '}
新增
                </span>
            </Tooltip>
        );
    };

    render() {
        const {
            dataSource = [],
            listConfig = {},
            cardConfig = {},
            canAddList,
            addFn,
            className,
            taskParams,
            onRefresh,
            ...others
        } = this.props;
        return (
            <div className={classnames(styles.wrap, className)}>
                <KanBan
                    {...others}
                    offsetTop={150}
                    dataSource={dataSource}
                    canAddList={canAddList || false}
                    listConfig={{
                        width: 288,
                        canDragList: true,
                        canDropList: true,
                        renderHeader: this.renderHeader,
                        renderAddBtn: addFn ? this.renderAddBtn : undefined,
                        addCard: this.addData,
                        ...listConfig,
                    }}
                    cardConfig={cardConfig}
                />
            </div>
        );
    }
}
export default Mine;
