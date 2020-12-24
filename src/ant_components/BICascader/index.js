import React, { forwardRef } from 'react';
import { Cascader } from 'antd';
import './style.less';

/*
 * Cascader 组件
 *
 * 基于原 ant Cascader
 * 只扩展自定义样式
 * */

function BICascader(props, ref) {
    return (
        <span className="BICascader">
            <Cascader {...props} ref={ref} />
        </span>
    );
}

export default forwardRef(BICascader);
