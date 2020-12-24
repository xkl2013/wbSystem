import React, { useState, useRef, useEffect } from 'react';
import { Popover } from 'antd';
import classNames from 'classnames';
import s from './index.less';
import IconFont from '@/submodule/components/IconFont';

export const ApolloTextLinkDetail = (props: any) => {
    const { value, origin, formatter, changeEdit, columnConfig, componentAttr } = props;
    const { disabled } = componentAttr;
    const newValue = formatter ? formatter(value) : value;
    if (!newValue) return null;
    // 以逗号分隔
    const arr = newValue.replace(/，/g, ',').split(',');
    const [dotVisible, setDotVisible] = useState(false);
    const outer = useRef(null);
    const inner = useRef(null);
    const detaWidth = useRef(columnConfig.width || 0);
    useEffect(() => {
        const outerTarget: any = outer.current;
        const innerTarget: any = inner.current;
        const deta = columnConfig.width - detaWidth.current;
        if (outerTarget && innerTarget && origin !== 'detailForm') {
            if (innerTarget.clientWidth > outerTarget.clientWidth + deta) {
                setDotVisible(true);
            } else {
                setDotVisible(false);
            }
        }
        if (deta !== 0) {
            detaWidth.current = columnConfig.width;
        }
    }, [value, columnConfig.width]);

    const outStyle: any = {};
    const innerStyle: any = {};
    const itemStyle: any = {};
    if (origin === 'detailForm') {
        outStyle.width = 'auto';
        innerStyle.flexWrap = 'wrap';
        itemStyle.marginBottom = '5px';
        itemStyle.wordBreak = 'break-all';
    }
    return (
        <div className={s.container}>
            <div className={s.outContainer} ref={outer} style={outStyle}>
                <div className={s.innerContainer} ref={inner} style={innerStyle}>
                    {dotVisible ? (
                        <Popover
                            placement="left"
                            overlayClassName={s.popContainer}
                            content={
                                <div
                                    className={s.popContent}
                                    onClick={(e: any) => {
                                        e.stopPropagation();
                                        e.nativeEvent.stopImmediatePropagation();
                                    }}
                                >
                                    {arr.map((item: any, i: number) => {
                                        return (
                                            <a
                                                key={i}
                                                target="_blank"
                                                href={item}
                                                className={s.popItem}
                                                style={itemStyle}
                                                rel="noopener noreferrer"
                                            >
                                                <div className={s.popItemBgTxt}>{item}</div>
                                            </a>
                                        );
                                    })}
                                </div>
                            }
                        >
                            <div
                                className={s.content}
                                style={innerStyle}
                                onClick={(e: any) => {
                                    e.stopPropagation();
                                    e.nativeEvent.stopImmediatePropagation();
                                }}
                            >
                                {arr.map((item: any, i: number) => {
                                    return (
                                        <a
                                            key={i}
                                            target="_blank"
                                            href={item}
                                            className={s.item}
                                            style={itemStyle}
                                            rel="noopener noreferrer"
                                        >
                                            {item}
                                        </a>
                                    );
                                })}
                            </div>
                        </Popover>
                    ) : (
                        <div
                            className={s.content}
                            style={innerStyle}
                            onClick={(e: any) => {
                                e.stopPropagation();
                                e.nativeEvent.stopImmediatePropagation();
                            }}
                        >
                            {arr.map((item: any, i: number) => {
                                return (
                                    <a
                                        key={i}
                                        target="_blank"
                                        href={item}
                                        className={s.item}
                                        style={itemStyle}
                                        rel="noopener noreferrer"
                                    >
                                        {item}
                                    </a>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            {origin !== 'detailForm' && !disabled && (
                <div
                    className={s.moreBtn}
                    onClick={() => {
                        changeEdit();
                    }}
                >
                    <IconFont type="iconzhankai11" />
                </div>
            )}
        </div>
    );
};
