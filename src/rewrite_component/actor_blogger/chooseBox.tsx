import React, { useState, useEffect } from 'react';
import { Icon, Avatar, Popover, Tooltip, Select, Spin } from 'antd';
import IconFont from '@/components/CustomIcon/IconFont';
import classnames from 'classnames';
import lodash from 'lodash';
import deleteIcon from '@/assets/closeIcon.png';
import Search from '@/components/associationSearch'
import AvatarIcon from '@/assets/new_avatar.png';
import { List } from 'kanban-pannel';
import { getUserListV2 } from '@/services/globalSearchApi';
import styles from './styles.less';
import { Item } from './searchBox';
import { lang } from 'moment';

interface Props {
    userData?: any;
    remove: Function;
    onSortList: Function;
    onChange: Function;
}

const RenderPoint: React.SFC<Props> = (props: Props) => {
    const [useList, saveUserList] = useState([]);
    const [userData, setUserData] = useState([]);
    const [fetching, setFetching] = useState(false);
    useEffect(() => {
        const newList = props.userData.map((ls: any) => {
            return { ...ls, key: ls.id }
        });
        saveUserList(newList)
    }, [props.userData])
    const checkData = (list: any) => {
        if (props.onSortList) {
            props.onSortList(list)
        }
    }
    const onMountUser = (users: any, item: any) => {
        const newList = useList.map((ls: any) => {
            if (ls.id === item.id) {
                return {
                    ...ls,
                    businessLiveTalentUserList: Array.isArray(users) ? users.map(ls => ({
                        userId: String(ls.key),
                        userChsName: ls.label,
                    })) : undefined

                }
            }
            return ls
        })
        saveUserList(newList);
        if (props.onChange) {
            props.onChange(newList)
        }
    }

    const request = lodash.debounce(async (userChsName: string) => {
        await setFetching(true);
        const res = await getUserListV2({ userChsName })
        await setFetching(false)
        let list = [];
        if (res && res.success) {
            const data = res.data || {};
            list = Array.isArray(data.list) ? data.list : []
        }
        setUserData(list);
    }, 400);
    const selectUser = (item) => {
        const newVal = Array.isArray(item.businessLiveTalentUserList) ? item.businessLiveTalentUserList.map((ls: any) => ({ key: String(ls.userId), label: ls.userChsName })) : undefined;
        const options = userData.map(d => <Select.Option key={d.userId}>{d.userChsName}</Select.Option>);
        return (
            <Select
                showSearch
                // request={request}
                style={{ width: '100%' }}
                placeholder="请选择"
                notFoundContent={fetching ? <Spin size="small" /> : <span style={{ fontSize: '12px' }}>对不起,您查询的数据不存在或已被删除</span>}
                filterOption={false}
                onSearch={(val) => request(val)}
                onFocus={(e) => request('')}
                mode="multiple"
                onChange={(val: any) => onMountUser(val, item)}
                value={newVal}
                allowClear
                labelInValue
            >{options}</Select>
        )
    };
    const renderAddIcon = (item: any) => {
        const businessLiveTalentUserList = Array.isArray(item.businessLiveTalentUserList) ? item.businessLiveTalentUserList : [];
        return (
            <Popover
                content={selectUser(item)}
                title="关联主播账户"
                trigger="click"
                overlayClassName={styles.overlayClassName}
            >
                {businessLiveTalentUserList.length > 0 ? (
                    <Tooltip
                        placement="top"
                        title={businessLiveTalentUserList.map(ls => ls.userChsName).join(',')}
                        overlayStyle={{ minWidth: '80px', textAlign: 'center' }}>
                        <Avatar src={AvatarIcon}
                            style={{ width: '22px', height: '22px', marginRight: '10px' }} className={styles.iconCls} />
                    </Tooltip>) : (
                        <IconFont
                            className={styles.iconCls}
                            type="icondanrentianjia"
                        />
                    )}
            </Popover>

        );
    };
    const renderCard = (item: Item) => {
        const { panelConfig } = props;
        const { defaultAvatar } = panelConfig;
        return (
            <li className={styles.userItem} key={item.id}>
                <Avatar className={styles.avatar} src={defaultAvatar} />
                <span className={styles.userName}>{item.talentName}</span>
                {renderAddIcon(item)}
                <span className={styles.clearUser}>
                    <Icon
                        type="close"
                        onClick={() => {
                            props.remove(item);
                        }}
                    />
                </span>
            </li>
        )
    }
    const renderUserList = () => {
        const { panelConfig } = props;
        const { defaultAvatar } = panelConfig;
        return (
            <List
                dataSource={useList}
                renderItem={renderCard}
                endDrug={(a: any, b: any, c: any) => {
                    if (checkData) {
                        checkData(c);
                    }
                }}
            />
        )
    };
    return <ul className={styles.userBox}>
        {renderUserList()}
    </ul>;
};

export default RenderPoint;
