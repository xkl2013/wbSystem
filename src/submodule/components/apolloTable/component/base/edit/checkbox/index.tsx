import React from 'react';
import { Checkbox } from 'antd';
import styles from './styles.less';
import { ApolloCheckboxProps, ApolloCheckboxGroupProps } from '../editInterface';
import { antiAssign } from '../../../../utils/utils';

const ApolloCheckbox = (props: ApolloCheckboxProps) => {
    const { onChange, label, value } = props;
    const selfProps = antiAssign(props, ['onChange', 'label', 'value']);
    const changeValue = (e) => {
        if (typeof onChange === 'function') {
            onChange(e.target.checked);
        }
    };
    return (
        <Checkbox className={styles.checkbox} {...selfProps} checked={!!value} onChange={changeValue}>
            {label}
        </Checkbox>
    );
};
const ApolloCheckboxGroup = (props: ApolloCheckboxGroupProps) => {
    const { onChange } = props;
    const selfProps = antiAssign(props, ['onChange']);

    const changeValue = (value) => {
        if (typeof onChange === 'function') {
            onChange(value);
        }
    };

    return <Checkbox.Group className={styles.checkboxGroup} {...selfProps} onChange={changeValue} />;
};
export const ApolloCheck = (props) => {
    const { isMultiple } = props;

    if (isMultiple) {
        const groupProps = antiAssign(props, ['columnConfig', 'isMultiple']);
        return ApolloCheckboxGroup(groupProps);
    }
    const selfProps = antiAssign(props, ['columnConfig', 'isMultiple', 'options']);
    return ApolloCheckbox(selfProps);
};
