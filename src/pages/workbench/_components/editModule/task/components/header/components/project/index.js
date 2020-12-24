import React, { forwardRef } from 'react';
import Dropdown from '@/ant_components/BIDropDown';
import Menu from '@/ant_components/BIMenu';
import IconFont from '@/components/CustomIcon/IconFont';
import { myProjectId, finishPanelId, taskFinishStatus } from '../../../../../../../_enum';
import styles from './styles.less';

/*
 * params(dataSource)  数据源
 * 注意  默认是普通优先级
 * 默认选择项目列表中第一个
 * 如果projectId不存在列表里,则不能编辑所属项目和所属列表
 * tag是要挂载到project上面,如果变动project需要把tag清掉的
 *
 *
 */

const ProjectName = (props, ref) => {
    const { onChange, submitParams = {}, projectList = [] } = props;
    const { projectVO = {}, panelVO = {} } = submitParams;
    const projectIndex = projectList.findIndex((ls) => {
        return Number(ls.projectId) === Number(projectVO.projectId);
    });
    const disabled = props.disabled || projectIndex < 0;
    const panelList = (projectList[projectIndex] || {}).schedulePanelList || [];
    const onClickProject = ({ key }) => {
        if (String(key) === String(projectVO.projectId)) return;
        const projectObj = projectList.find((ls) => {
            return Number(ls.projectId) === Number(key);
        }) || {};
        const panelObj = (projectObj.schedulePanelList || [])[0] || {};
        const newParams = {
            projectVO: { projectId: projectObj.projectId, projectName: projectObj.projectName },
            panelVO: { panelId: panelObj.panelId, panelName: panelObj.panelName },
            scheduleTagRelationDto: {},
        };
        if (projectObj.projectId === myProjectId) {
            newParams.finishFlag = panelObj.panelId === finishPanelId ? taskFinishStatus : 0;
        }

        onChange(newParams);
    };
    const onClickPanel = ({ key }) => {
        if (String(key) === String(panelVO.panelId)) return;
        const panelObj = panelList.find((ls) => {
            return Number(ls.panelId) === Number(key);
        }) || {};
        const newParams = {
            panelVO: { panelId: panelObj.panelId, panelName: panelObj.panelName },
        };
        if (projectVO.projectId === myProjectId) {
            newParams.finishFlag = panelObj.panelId === finishPanelId ? taskFinishStatus : 0;
        }
        onChange(newParams);
    };
    const projectMenu = (
        <Menu selectedKeys={projectVO.projectId ? [String(projectVO.projectId)] : []} onClick={onClickProject}>
            {projectList.map((ls) => {
                return <Menu.Item key={ls.projectId}>{ls.projectName}</Menu.Item>;
            })}
        </Menu>
    );
    const panelMenu = (
        <Menu selectedKeys={panelVO.panelId ? [String(panelVO.panelId)] : []} onClick={onClickPanel}>
            {panelList.map((ls) => {
                return <Menu.Item key={ls.panelId}>{ls.panelName}</Menu.Item>;
            })}
        </Menu>
    );
    return (
        <div className={styles.projectContainer}>
            <Dropdown
                ref={ref}
                overlay={projectMenu}
                trigger={['click']}
                overlayStyle={{ zIndex: 1000 }}
                placement="bottomCenter"
                disabled={disabled}
            >
                <span className={styles.projectName} style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}>
                    {projectVO.projectName || '请选择'}
                    <IconFont type="iconxiala1" style={{ marginLeft: '6px' }} />
                </span>
            </Dropdown>
            <span className={styles.line}>-</span>
            <Dropdown
                ref={ref}
                overlay={panelMenu}
                trigger={['click']}
                overlayStyle={{ zIndex: 1000 }}
                placement="bottomCenter"
                disabled={disabled}
            >
                <span className={styles.panelName} style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}>
                    {panelVO.panelName || '请选择'}
                    <IconFont type="iconxiala1" style={{ marginLeft: '6px' }} />
                </span>
            </Dropdown>
        </div>
    );
};
export default forwardRef(ProjectName);
