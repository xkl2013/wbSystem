import React, { forwardRef } from 'react';
import { Icon } from 'antd';
import Dropdown from '@/ant_components/BIDropDown';
import Menu from '@/ant_components/BIMenu';
import IconFont from '@/components/CustomIcon/IconFont';
import { meetingResourceType } from '../../../../../_enum';
import styles from './styles.less';

const Meeting = (props, ref) => {
    const { submitParams = {}, meetingList = [], disabled } = props;
    const { beginTime, endTime } = submitParams;
    const scheduleResource = submitParams.scheduleResource || {};
    const onClick = ({ key, item }) => {
        if (props.onChange) {
            props.onChange({
                scheduleResource: {
                    resourceId: key,
                    resourceName: item.props.children,
                    startTime: beginTime,
                    resourceType: meetingResourceType,
                    endTime,
                },
            });
        }
    };
    const onRemove = (e) => {
        e.stopPropagation();
        if (props.onChange) {
            props.onChange({
                scheduleResource: null,
            });
        }
    };
    const menu = (
        <Menu selectedKeys={scheduleResource.esourceId ? [String(scheduleResource.esourceId)] : []} onClick={onClick}>
            {meetingList.map((ls) => {
                return (
                    <Menu.Item key={ls.id} disabled={ls.disabled}>
                        {ls.name}
                    </Menu.Item>
                );
            })}
        </Menu>
    );
    return (
        <>
            <Dropdown
                ref={ref}
                overlay={menu}
                trigger={['click']}
                overlayStyle={{ zIndex: 1000, maxHeight: '400px', overflow: 'auto' }}
                onClick={props.getMeetingList}
                placement="bottomLeft"
                disabled={disabled || !endTime}
            >
                <div className={styles.metting}>
                    <span className={styles.meetingName}>{scheduleResource.resourceName || '请选择'}</span>
                    {scheduleResource.resourceName ? (
                        <Icon type="close-circle" className={styles.clearIcon} onClick={onRemove} />
                    ) : null}
                    <IconFont type="iconxiala1" className={styles.downIcon} />
                </div>
            </Dropdown>
            <a
                href={`${window.location.origin}/foreEnd/workbench/resources/meeting`}
                target="_blank"
                className={styles.meetingPage}
                rel="noopener noreferrer"
            >
                <IconFont type="iconchakan" />
            </a>
        </>
    );
};
export default forwardRef(Meeting);
