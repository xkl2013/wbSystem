import React from 'react';
import Tag from '../tag';

export default function Detail(props) {
    const { value, displayTarget } = props;
    let { componentAttr } = props;
    if (!value) return null;

    componentAttr = componentAttr || {};
    const { moduleType, isMultiple, options = [] } = componentAttr;
    if (typeof value === 'object') {
        const tagObj = isMultiple ? { maxTagTextLength: 10, maxTagCount: 2 } : { maxTagTextLength: 10 };
        return (
            <Tag options={options} value={value} {...tagObj} displayTarget={displayTarget} moduleType={moduleType} />
        );
    }
    return null;
}
