import React from 'react';
import styles from './index.less';
import { renderTxt } from '@/utils/hoverPopover';
import businessConfig from '@/config/business';
import IconFont from '@/components/CustomIcon/IconFont';
import Information from '@/components/informationModel';
import { isNumber } from '@/utils/utils';

export default function TagList(props) {
    const {
        value, options, displayTarget, moduleType, tabIndex, showDetailFlag,
    } = props;
    let { maxTagCount = 2, maxTagTextLength = 8 } = props;
    if (!Array.isArray(value) || value.length === 0) return null;
    const style = {};
    const itemStyle = {};
    if (displayTarget === 'detail') {
        maxTagTextLength = 100;
        maxTagCount = 100;
        style.flexFlow = 'wrap';
        itemStyle.overflow = 'auto';
        itemStyle.whiteSpace = 'normal';
        itemStyle.marginBottom = '5px';
    }
    // const newArr = value.slice(0, maxTagCount).filter((item) => {
    //     return item.value;
    // });
    const newArr = value.slice(0, maxTagCount);

    const renderInner = (item) => {
        let innerStyle = {
            color: '#5A6876',
        };
        if (moduleType) {
            innerStyle = {
                color: '#5C99FF',
            };
        }
        const showText = item.text;
        let itemText = (
            <span className={styles.itemBgTxt} style={innerStyle}>
                {renderTxt(showText, maxTagTextLength)}
            </span>
        );
        // 只有一个选项时默认一行展示，超出esp
        if (value.length === 1) {
            itemText = (
                <span className={styles.itemBgTxt} style={innerStyle}>
                    {showText}
                </span>
            );
        }
        // 需要跳转业务详情module
        if (moduleType && showDetailFlag !== false) {
            if (item && item.value) {
                let id = item.value;
                let type = moduleType;
                // 艺人博主特殊处理
                if (Number(type) === 1 || Number(type) === 2) {
                    const arr = item.value.split('_');
                    const [talentId, talentType] = arr;
                    if (Number(talentType) === 0) {
                        type = 1;
                    } else {
                        type = 2;
                    }
                    id = talentId;
                }
                if (!isNumber(id) || Number(id) <= 0) {
                    return itemText;
                }

                const module = businessConfig[type];
                if (module) {
                    const data = {
                        id,
                        name: item.text,
                        path: module.pathname,
                    };
                    if (Number(type) === 3 && Number(tabIndex) === 2) {
                        data.tabIndex = 2;
                    }
                    return (
                        <Information
                            eventType="doubleClick"
                            data={[data]}
                            render={() => {
                                return (
                                    <>
                                        <IconFont
                                            type="iconlink"
                                            style={{ marginRight: '5px', verticalAlign: 'middle', color: '#5C99FF' }}
                                        />
                                        {itemText}
                                    </>
                                );
                            }}
                        />
                    );
                }
            }
        }
        return itemText;
    };

    const renderItem = (item, index, color) => {
        // 标签默认样式
        let itemStyleExt = {
            background: 'rgba(4,180,173,0.2)',
            borderRadius: '12px',
            color: '#5A6876',
        };
        // 引用类型样式
        if (moduleType) {
            itemStyleExt = {
                background: 'rgba(92,153,255,0.2)',
                borderRadius: '4px',
                color: '#5C99FF',
            };
        }
        // 配置了颜色的样式
        if (color) {
            itemStyleExt.background = `#${color}`;
        }
        return (
            <div className={styles.item} style={{ ...itemStyle, ...itemStyleExt }} key={item.value + index}>
                {renderInner(item)}
            </div>
        );
    };

    return (
        <div className={styles.tagList} style={style}>
            {newArr.map((item, index) => {
                let color = '';
                if (Array.isArray(options) && options.length > 0) {
                    const obj = options.find((ls) => {
                        return ls.id === item.value;
                    });
                    color = (obj && obj.color) || '';
                }
                return renderItem(item, index, color);
            })}
            {value.length > newArr.length ? (
                <span className={styles.moreBtn}>{`+${value.length - newArr.length}`}</span>
            ) : null}
        </div>
    );
}
