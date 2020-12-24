import React from 'react';
import emptyIcon from './emptyIcon.png';
import s from './index.less';

export default function (style, text) {
    if (typeof style === 'string') {
        style = null;
    }
    return (
        <div className={s.wrap}>
            <img alt="" className={s.logo} style={style} src={emptyIcon}/>
            <p className={s.text}>{text || '暂无数据'}</p>
        </div>
    )
};
