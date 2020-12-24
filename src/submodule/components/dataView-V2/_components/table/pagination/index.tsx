import React from 'react';
import { Pagination } from 'antd';
import './style.less';

/*
* Pagination 组件
*
* 基于原 ant Pagination
* 只扩展自定义样式
* */

const BIPagination = (props: any) => {
    const current = props.current || props.pageNum;
    return (
        <div style={{ textAlign: 'right', paddingTop: '16px' }}>
            <Pagination {...props} current={current} />
        </div>

    );
}

export default BIPagination;