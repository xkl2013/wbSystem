import React, { forwardRef } from 'react';
import classnamse from 'classnames';
import ProjectList from './components/project';
import Priority from './components/schedulePriority';
import Setting from '../../../_component/setting';
import Private from '../../../_component/private';
import styles from './styles.less';

/*
 * params(dataSource)  数据源
 * submitParams 用于数据处理提交的数据源
 *
 */

const Header = (props, ref) => {
    const { dataSource, submitParams, projectList, onChange, isEdit } = props;
    const { parentScheduleId, parentScheduleName, totalLayer, currentLayer } = dataSource || {};
    const { schedulePriority } = submitParams;
    const isRootTask = parentScheduleId === 0; // 判断是否是主任务
    const onRefresh = (id) => {
        if (props.historyReplace) {
            props.historyReplace(id);
        }
    };
    return (
        <div ref={ref} className={styles.headerStyle}>
            {/* 新增下只展示项目 */}
            {isEdit ? null : (
                <div className={styles.projectName}>
                    <ProjectList submitParams={submitParams} projectList={projectList} onChange={onChange} />
                </div>
            )}
            {!isRootTask ? null : (
                <div className={styles.projectName}>
                    <ProjectList submitParams={submitParams} projectList={projectList} onChange={onChange} />
                </div>
            )}
            {isRootTask || !isEdit ? null : (
                <div className={styles.taskName}>
                    <span className={styles.checkParentBtn} onClick={onRefresh.bind(this, parentScheduleId)}>
                        查看父级
                    </span>
                    <span className={styles.parentTaskName}>
/
                        {parentScheduleName}
                    </span>
                    <span style={{ marginLeft: '5px' }}>/</span>
                </div>
            )}

            <div className={styles.btnsWrap}>
                {isEdit ? (
                    <span className={classnamse(styles.btn, styles.currentPageNum)}>
                        当前:
                        {' '}
                        {currentLayer}
/
                        {totalLayer}
                    </span>
                ) : null}

                <span className={classnamse(styles.btn, styles.priorityLevel)}>
                    <Priority value={schedulePriority} onChange={onChange} />
                </span>
                {/* <span className={classnamse(styles.btn, styles.uploadBtn)}>
                    <IconFont type="iconziduan-fujian" />
                </span> */}
                <span className={classnamse(styles.btn, styles.private)}>
                    <Private submitParams={submitParams} onChange={onChange} />
                </span>
                {isEdit ? (
                    <span className={classnamse(styles.btn, styles.setting)}>
                        <Setting {...props} settingBtns={[1, 2]} />
                    </span>
                ) : null}
            </div>
        </div>
    );
};
export default forwardRef(Header);
