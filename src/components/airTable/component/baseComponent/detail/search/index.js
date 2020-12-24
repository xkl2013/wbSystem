import React from 'react';
import Tag from '../tag';

export default function Detail(props) {
    const { value, displayTarget, columnConfig } = props;
    let { componentAttr } = props;
    if (!value) return null;

    componentAttr = componentAttr || {};
    const { moduleType, isMultiple, tabIndex } = componentAttr;
    const { dynamicCellConfigDTO } = columnConfig;
    const { showDetailFlag } = dynamicCellConfigDTO || {};
    if (typeof value === 'object') {
        let tagObj = { maxTagTextLength: 10, maxTagCount: 1 }; // 设置tag最长显示以及显示个数
        if (isMultiple) {
            tagObj = { maxTagTextLength: 10, maxTagCount: 2 };
        }
        return (
            <Tag
                value={value}
                showDetailFlag={showDetailFlag}
                tabIndex={tabIndex}
                {...tagObj}
                displayTarget={displayTarget}
                moduleType={moduleType}
            />
        );
    }
    return null;
}
