import React, { useState, useRef, useEffect } from 'react';
import { Popover } from 'antd';
import classNames from 'classnames';
import s from './index.less';
import extendIcon from '../../../../assets/extend.png';

export const ApolloLinkDetail = (props: any) => {
    const { value, origin } = props;
    if (!Array.isArray(value) || value.length === 0) return null;
    const [dotVisible, setDotVisible] = useState(false);
    const outer = useRef(null);
    const inner = useRef(null);
    useEffect(() => {
        const outerTarget: any = outer.current;
        const innerTarget: any = inner.current;
        if (outerTarget && innerTarget && origin !== 'detailForm') {
            if (innerTarget.clientWidth > outerTarget.clientWidth) {
                setDotVisible(true);
            } else {
                setDotVisible(false);
            }
        }
    }, [value]);

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
                    {value.map((item, i) => {
                        return (
                            <a
                                key={i}
                                target="_blank"
                                href={item.value}
                                className={s.item}
                                style={itemStyle}
                                rel="noopener noreferrer"
                            >
                                {item.text || item.value}
                            </a>
                        );
                    })}
                </div>
            </div>
            {dotVisible && (
                <Popover
                    trigger="click"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    placement="left"
                    overlayClassName={s.popContainer}
                    content={
                        <div
                            className={s.popContent}
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            {value.map((item, i) => {
                                return (
                                    <a
                                        key={i}
                                        target="_blank"
                                        href={item.value}
                                        className={s.popItem}
                                        style={itemStyle}
                                        rel="noopener noreferrer"
                                    >
                                        <div className={s.popItemBgTxt}>{item.text || item.value}</div>
                                    </a>
                                );
                            })}
                        </div>
                    }
                >
                    <div className={s.moreBtn}>
                        <img alt="" className={s.extend} src={extendIcon} />
                    </div>
                </Popover>
            )}
        </div>
    );
};
