import React, { forwardRef } from 'react';
import { message } from 'antd';
import Dropdown from '@/ant_components/BIDropDown';
import Menu from '@/ant_components/BIMenu';
import IconFont from '@/components/CustomIcon/IconFont';
import BIModal from '@/ant_components/BIModal';
import { deleteSchedule, returnSchedule } from '../../services';
import { fileStatus, taskType, calendarType } from '../../../../_enum';
import btnsConfig from './config';
import styles from './styles.less';

/*
 * params(btns)  所要展示的按钮列表
 *
 */

const ProjectName = (props, ref) => {
    const { settingCallback, submitParams, disabled } = props;
    const btns = Array.isArray(props.settingBtns) ? props.settingBtns : [];
    const btnPanel = btnsConfig.filter((ls) => {
        return btns.find((item) => {
            return String(item) === String(ls.type);
        });
    });
    const checkMenuAuth = (key, item) => {
        if (disabled) return disabled;
        if (props.checkMenuAuth && typeof props.checkMenuAuth === 'function') {
            return props.checkMenuAuth({ item, key });
        }
        // 默认判断 任务状态为已归档时,不可编辑
        if (Number(key) === 2 && item.fileStatus === fileStatus.already.type) {
            return true;
        }

        return false;
    };
    const onClickPanel = ({ key }) => {
        const callbackParams = {
            scheduleId: submitParams.id,
            ...(btnsConfig.find((ls) => {
                return String(ls.type) === String(key);
            }) || {}),
        };
        let dataType = '';
        if (submitParams.type === taskType) dataType = '任务';
        if (submitParams.type === calendarType) dataType = '日程';
        switch (Number(key)) {
            case 1:
                BIModal.confirm({
                    title: `确认要删除该${dataType}吗?`,
                    autoFocusButton: null,
                    onOk: async () => {
                        const response = await deleteSchedule({ scheduleId: submitParams.id });
                        if (response && response.success) {
                            message.success('删除成功');
                            if (settingCallback) {
                                await settingCallback(callbackParams);
                            }
                        }
                    },
                });
                break;
            case 2:
                BIModal.confirm({
                    title: (
                        <>
                            <p className={styles.fileTitle}>确认将任务归档么？</p>
                            <p className={styles.fileContent}>归档后可在 “更多/已归档” 查看,彻底删除在已归档里进行</p>
                        </>
                    ),
                    autoFocusButton: null,
                    onOk: async () => {
                        const response = await returnSchedule({
                            fileStatus: fileStatus.already.type,
                            scheduleIds: [submitParams.id],
                        });
                        if (response && response.success) {
                            message.success('归档成功');
                            if (settingCallback) {
                                await settingCallback(callbackParams);
                            }
                        }
                    },
                });
                break;
            default:
                break;
        }
    };

    const panelMenu = (
        <Menu onClick={onClickPanel}>
            {btnPanel.map((ls) => {
                return (
                    <Menu.Item key={ls.type} disabled={checkMenuAuth(ls.type, submitParams)}>
                        <IconFont type={ls.icon} className={styles.icon} />
                        <span className={styles.settingName}>
                            {' '}
                            {ls.name}
                        </span>
                    </Menu.Item>
                );
            })}
        </Menu>
    );
    return (
        <div className={styles.projectContainer}>
            <Dropdown
                ref={ref}
                overlay={panelMenu}
                trigger={['click']}
                overlayStyle={{ zIndex: 1000 }}
                placement="bottomCenter"
            >
                <span className={styles.dropDownCls}>
                    <IconFont type="icongengduo" className={styles.icon} />
                </span>
            </Dropdown>
        </div>
    );
};
export default forwardRef(ProjectName);
