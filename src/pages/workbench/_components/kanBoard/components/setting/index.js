import React from 'react';
import styles from './styles.less';
import PlaceFile from './PlaceFile';
import EditPanelName from './editPanelName';

/**
 *
 * @param {*} props
 */

const Setting = (props) => {
    const { panelAuthData, taskParams } = props;
    const projectId = taskParams.projectId;
    const checkAuth = (type) => {
        // 如果没有传递panelAuthData情况下就默认是授予所有操作权限
        if (!panelAuthData || !Array.isArray(panelAuthData)) return false;
        return panelAuthData.find((ls) => {
            return ls.menuPath === type;
        });
    };
    return (
        <ul className={styles.wrap}>
            <li className={styles.item}>
                {/* 归档操作 不做权限控制 */}
                <PlaceFile {...props} />
            </li>
            {/* 编辑,只有项目才可编辑panelName */}
            {projectId && projectId > 0 ? (
                <li className={styles.item}>
                    <EditPanelName {...props} disabled={!checkAuth('/workbench/project/editPanelName')} />
                </li>
            ) : null}
        </ul>
    );
};
export default Setting;
