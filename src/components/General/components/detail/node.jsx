import React from 'react';
import { formConfig } from '../../config';

const Node = (props) => {
    const {
        data: { type },
    } = props || {};
    const itemObj = formConfig[type];
    if (!itemObj) return null;
    return <itemObj.detail data={props.data} />;
};
export default Node;
