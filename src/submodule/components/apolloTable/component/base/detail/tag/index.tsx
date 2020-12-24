import React, { useState, useRef, useEffect } from 'react';
import { Popover } from 'antd';
import classNames from 'classnames';
import s from './index.less';

const getColor = (item: any, options: any[]) => {
    let color = '';
    // if (item.text === item.value) {
    //     return 'transparent';
    // }
    if (!item.value) {
        return 'transparent';
    }
    if (options && Array.isArray(options) && options.length > 0) {
        const obj =
            options.find((ls) => {
                return String(ls.id) === String(item.value);
            }) || {};
        color = obj.color || 'e9eef9';
    }
    if (color[0] === '#') {
        return color;
    }
    return `#${color}`;
};
export const Tags = (props: any) => {
    const { value, origin, componentAttr, columnConfig } = props;
    if (!Array.isArray(value) || value.length === 0) return null;
    if (value.length === 1 && !value[0].text && !value[0].value) {
        return null;
    }
    const { options, mode } = componentAttr || {};
    const outStyle: any = {};
    const innerStyle: any = {};
    const itemStyle: any = {};
    if (origin === 'detailForm' || origin === 'editForm') {
        outStyle.width = 'auto';
        innerStyle.flexWrap = 'wrap';
        itemStyle.marginBottom = '5px';
    }

    if (mode !== 'multiple') {
        // 单选
        return (
            <div className={s.container} style={{ overflow: 'hidden' }}>
                <span className={s.item} style={{ ...itemStyle, background: getColor(value[0], options) }}>
                    <div className={s.itemBgTxt}>{value[0].text}</div>
                </span>
            </div>
        );
    }

    const [dotVisible, setDotVisible] = useState(false);
    const outer = useRef(null);
    const inner = useRef(null);
    const detaWidth = useRef(columnConfig.width || 0);
    useEffect(() => {
        const outerTarget: any = outer.current;
        const innerTarget: any = inner.current;
        let visible = false;
        const deta = columnConfig.width - detaWidth.current;
        if (outerTarget && innerTarget && origin !== 'detailForm') {
            if (innerTarget.clientWidth > outerTarget.clientWidth + deta) {
                visible = true;
            } else {
                visible = false;
            }
        }
        if (deta !== 0) {
            detaWidth.current = columnConfig.width;
        }
        setDotVisible(visible);
    }, [value, columnConfig.width]);

    return (
        <div className={s.container}>
            <div className={s.outContainer} ref={outer} style={outStyle}>
                <div className={s.innerContainer} ref={inner} style={innerStyle}>
                    {dotVisible ? (
                        <Popover
                            placement="left"
                            overlayClassName={s.popContainer}
                            content={
                                <div className={s.popContent}>
                                    {value.map((item, index) => {
                                        return (
                                            <span
                                                className={s.popItem}
                                                key={index}
                                                style={{ background: getColor(item, options) }}
                                            >
                                                <div className={s.popItemBgTxt}>{item.text}</div>
                                            </span>
                                        );
                                    })}
                                </div>
                            }
                        >
                            <div className={s.content} style={innerStyle}>
                                {value.map((item, index) => {
                                    return (
                                        <span
                                            key={index}
                                            className={classNames(s.item, s.multi)}
                                            style={{ ...itemStyle, background: getColor(item, options) }}
                                        >
                                            <div className={s.itemBgTxt}>{item.text}</div>
                                        </span>
                                    );
                                })}
                            </div>
                        </Popover>
                    ) : (
                        <div className={s.content} style={innerStyle}>
                            {value.map((item, index) => {
                                return (
                                    <span
                                        key={index}
                                        className={classNames(s.item, s.multi)}
                                        style={{ ...itemStyle, background: getColor(item, options) }}
                                    >
                                        <div className={s.itemBgTxt}>{item.text}</div>
                                    </span>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Tags;
