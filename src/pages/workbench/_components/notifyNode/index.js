import React, { forwardRef } from 'react';
import { Popover, Avatar, Badge } from 'antd';
import classnames from 'classnames';
import deleteIcon from '@/assets/closeIcon.png';
import AvatarIcon from '@/assets/new_avatar.png';
import IconFont from '@/components/CustomIcon/IconFont';
import NotifyNode from '@/components/notifyNode/user_org_jole';
import { setFormateUsers, getFormateUsers } from './_utils';
import styles from './styles.less';

/*
 *  用于新版本人源选择人处理
 *
 */

const Node = (props, ref) => {
    const { title, ...others } = props;
    const originData = setFormateUsers(props.value) || [];
    const onChange = (value) => {
        const newVal = Array.isArray(value) ? value : [];
        if (
            JSON.stringify(
                newVal.map((ls) => {
                    return ls.id;
                }),
            )
            === JSON.stringify(
                originData.map((ls) => {
                    return ls.id;
                }),
            )
        ) return;
        const data = getFormateUsers(newVal, props.memberType);
        if (props.onChange) props.onChange(data);
    };
    const onRemoveAll = (e) => {
        e.stopPropagation();
        onChange([]);
    };
    const renderItem = (instance) => {
        const data = instance.state.data;
        if (!data || data.length === 0) return null;
        const callback = props.disabled ? () => {} : instance.addUsers;
        switch (data.length) {
            case 1:
                const userObj = data[0] || {};
                return (
                    <span
                        className={classnames(
                            styles.userItem,
                            styles.singleUser,
                            props.disabled ? styles.disabledIcon : '',
                            props.isHideName ? styles.hideNameItem : '',
                        )}
                        onClick={() => {
                            if (callback) callback();
                        }}
                    >
                        <Avatar src={userObj.avatar || AvatarIcon} style={{ width: '26px', height: '26px' }} />
                        {props.disabled && props.length === 1 ? null : (
                            <span className={styles.clearUsers}>
                                <img src={deleteIcon} className={styles.clearIcon} onClick={onRemoveAll} alt="删除" />
                            </span>
                        )}
                        {props.isHideName ? null : <span className={styles.avatarName}>{userObj.name}</span>}
                    </span>
                );
            case 2:
                return (
                    <span
                        className={classnames(
                            styles.userItem,
                            props.disabled ? styles.disabledIcon : '',
                            props.isHideName ? styles.hideNameItem : '',
                        )}
                        style={{ width: '50px' }}
                        onClick={() => {
                            if (callback) callback();
                        }}
                    >
                        <span className={styles.avatarContainer}>
                            <span className={styles.avatarCls} style={{ left: 0 }}>
                                <Avatar src={AvatarIcon} style={{ width: '26px', height: '26px' }} />
                            </span>
                            <span className={styles.avatarCls} style={{ left: 12 }}>
                                <Avatar src={AvatarIcon} style={{ width: '26px', height: '26px' }} />
                            </span>
                        </span>
                    </span>
                );
            case 3:
                return (
                    <span
                        className={classnames(
                            styles.userItem,
                            props.disabled ? styles.disabledIcon : '',
                            props.isHideName ? styles.hideNameItem : '',
                        )}
                        style={{ width: '60px' }}
                        onClick={() => {
                            if (callback) callback();
                        }}
                    >
                        <span className={styles.avatarContainer}>
                            <span className={styles.avatarCls} style={{ left: 0 }}>
                                <Avatar src={AvatarIcon} style={{ width: '26px', height: '26px' }} />
                            </span>
                            <span className={styles.avatarCls} style={{ left: 12 }}>
                                <Avatar src={AvatarIcon} style={{ width: '26px', height: '26px' }} />
                            </span>
                            <span className={styles.avatarCls} style={{ left: 24 }}>
                                <Avatar src={AvatarIcon} style={{ width: '26px', height: '26px' }} />
                            </span>
                        </span>
                    </span>
                );
            default:
                return (
                    <span
                        className={classnames(styles.userItem, props.disabled ? styles.disabledIcon : '')}
                        style={{ width: data.length >= 10 ? '80px' : '60px' }}
                        onClick={() => {
                            if (callback) callback();
                        }}
                    >
                        <span className={styles.avatarContainer}>
                            <span className={styles.avatarCls} style={{ left: 0 }}>
                                <Avatar src={AvatarIcon} style={{ width: '26px', height: '26px' }} />
                            </span>
                            <span className={styles.avatarCls} style={{ left: 12 }}>
                                <Avatar src={AvatarIcon} style={{ width: '26px', height: '26px' }} />
                            </span>
                            <span className={styles.avatarCls} style={{ left: 24 }}>
                                <Avatar src={AvatarIcon} style={{ width: '26px', height: '26px' }} />
                            </span>
                            <span className={styles.avatarNums}>
                                <Badge
                                    style={{
                                        backgroundColor: 'rgba(255,255,255,1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid rgba(238,238,238,1)',
                                        color: '#5A6876FF',
                                    }}
                                    count={data.length}
                                />
                            </span>
                        </span>
                    </span>
                );
        }
    };
    const renderPopDom = (instance) => {
        const data = instance.state.data;
        if (!data) return null;
        if (data.length <= 1 && !props.isHideName) return renderItem(instance);
        return (
            <Popover
                trigger="hover"
                title={title}
                content={
                    <div className={styles.popPanel}>
                        {data.map((ls) => {
                            return (
                                <span key={ls.id}>
                                    {ls.name}
                                    {data.length === 1 ? '' : '、'}
                                </span>
                            );
                        })}
                    </div>
                }
            >
                {renderItem(instance)}
            </Popover>
        );
    };
    const renderAddIcon = (instance = {}) => {
        const callback = instance.addUsers;
        const { length } = props;
        const data = instance.state.data;
        if (data && data.length > 0) {
            return null;
        }
        return (
            <IconFont
                className={classnames(styles.iconCls, styles.iconClsSelf, props.disabled ? styles.disabledIcon : '')}
                type={length === 1 ? 'icondanrentianjia' : 'iconcanyuren1'}
                onClick={() => {
                    if (props.disabled) return;
                    if (callback) callback();
                }}
            />
        );
    };

    return (
        <NotifyNode
            reWriteCls
            pannelConfig={{
                user: {},
                org: { chooseType: 'user' },
            }}
            data={originData}
            ref={ref}
            renderItem={renderPopDom}
            renderAddIcon={renderAddIcon}
            wrapClassName={styles.notifyNodeStyle}
            {...others}
            onChange={onChange}
        />
    );
};
export default forwardRef(Node);
