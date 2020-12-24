import React from 'react';
import { Icon, Avatar } from 'antd';
import styles from './styles.less';
import { defaultConfig } from './_utils/utils';
const RenderPoint = (props) => {
    const returnAvatar = (item) => {
        return defaultConfig[item.type] ? defaultConfig[item.type].avatar : '';
    };
    const renderUserList = () => {
        const userData = props.userData || [];
        return userData.map((item, index) => {
            item.avatar = item.avatar || returnAvatar(item);
            return (React.createElement("li", { className: styles.userItem, key: index },
                React.createElement("span", { className: styles.userAvatar },
                    React.createElement(Avatar, { src: item.avatar })),
                React.createElement("span", { className: styles.userName }, item.name),
                React.createElement("span", { className: styles.clearUser },
                    React.createElement(Icon, { type: "close", onClick: () => { props.remove(item); } }))));
        });
    };
    return (React.createElement("ul", { className: styles.userBox }, renderUserList()));
};
export default RenderPoint;
