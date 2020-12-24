import React from 'react';
import { Badge, Menu, Avatar } from 'antd';
import { showFormateDate } from '../../_utils/utils';
import styles from './styles.less';

export default function MenuList(props) {
    const renderLinkItem = (ls) => {
        if (props.renderLinkItem) return props.renderLinkItem(ls);
        return (
            <>
                <span className={styles.avatar}>
                    <Badge count={ls.messageCount || 0}>
                        <Avatar src={ls.messageIcon} />
                    </Badge>
                </span>
                <div className={styles.metaContent}>
                    <div className={styles.metaContentTitle}>
                        {ls.messageModuleName}
                        <span className={styles.time}>{showFormateDate(ls.messageLatest)}</span>
                    </div>
                    <div className={styles.metaContentDes}>{ls.messageTitle}</div>
                </div>
            </>
        );
    };
    const onClick = (val) => {
        if (props.clickMenu) {
            props.clickMenu(val);
        }
    };
    const onSelect = (val) => {
        if (props.onSelect) {
            props.onSelect(val);
        }
    };
    return (
        <div className={styles.menuList}>
            <Menu
                mode="inline"
                inlineIndent={16}
                selectedKeys={props.selectedKeys}
                onSelect={onSelect}
                onClick={onClick}
            >
                {props.messageCountList.map((ls) => {
                    return (
                        <Menu.Item className={styles.menuItem} key={ls.messageModule}>
                            {renderLinkItem(ls)}
                        </Menu.Item>
                    );
                })}
            </Menu>
        </div>
    );
}
