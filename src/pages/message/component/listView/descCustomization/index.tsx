import React from 'react';
import TodayTask from './TodayTask';

// 内容区域 定制化开发
const Index = (props) => {
    const item = props.item;
    if (item.messageModule === 1) {
        return (<TodayTask item={item} />);
    }
    return props.defaultContent;
};


export default Index;
