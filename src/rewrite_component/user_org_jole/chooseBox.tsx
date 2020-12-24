import React from 'react';
import { Icon, Avatar } from 'antd';
import styles from './styles.less';
import { Item } from './searchBox';
import { defaultConfig } from './_utils/utils';

interface Props {
    userData?: any,
    remove: Function,
}

const RenderPoint: React.SFC<Props> = (props: Props) => {
    const returnAvatar = (item: Item) => {
        return defaultConfig[item.type] ? defaultConfig[item.type].avatar : ''
    }
    const renderUserList = () => {
        const userData: any = props.userData || [];
        return userData.map((item: Item, index: number) => {
            item.avatar = item.avatar || returnAvatar(item);
            return (
                <li className={styles.userItem} key={index}>
                    <span className={styles.userAvatar}>
                        <Avatar src={item.avatar} /></span>
                    <span className={styles.userName}>{item.name}</span>
                    <span className={styles.clearUser}>
                        <Icon type="close" onClick={() => { props.remove(item) }} />
                    </span>
                </li>
            )
        })
    }
    return (
        <ul className={styles.userBox}>
            {renderUserList()}
        </ul>
    )
}

export default RenderPoint;
