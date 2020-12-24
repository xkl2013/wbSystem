import React from 'react';
import styles from './styles.less';
import Tag from '../tag';

export default function Detail(props) {
    const { value, componentAttr = {}, displayTarget } = props;
    const tagObj = componentAttr.isMultiple
        ? { maxTagTextLength: 10, maxTagCount: 2 }
        : { maxTagTextLength: 10, maxTagCount: 1 }; // 设置tag最长显示以及显示个数
    if (!value) return null;
    const style = {};
    if (displayTarget === 'detail') {
        style.overflow = 'auto';
        style.whiteSpace = 'normal';
    }
    if (typeof value === 'object') {
        const newVal = Array.isArray(value) ? value : [];
        const tagsVal = newVal.filter((ls) => {
            return ls.value;
        });
        const textVal = newVal.filter((ls) => {
            return !ls.value;
        });
        return (
            <>
                {' '}
                {tagsVal.length > 0 ? <Tag value={tagsVal} {...tagObj} displayTarget={displayTarget} /> : null}
                {textVal.length > 0 ? (
                    <div className={styles.text} style={style}>
                        {textVal[0].text}
                    </div>
                ) : null}
            </>
        );
    }
}
