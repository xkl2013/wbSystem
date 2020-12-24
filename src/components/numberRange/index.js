import React from 'react';
import { message } from 'antd';
import BIInput from '@/ant_components/BIInput';
import styles from './styles.less';

/**
 * @params(errorCallback)
 * @params(success)
 */
export default class NumberRanger extends React.Component {
    state = {
        value: this.props.value || { min: undefined, max: undefined, type: 'numberRange' },
    };

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
            this.setState({ value: nextProps.value || {} });
        }
    }

    onChangeMin = (e) => {
        const value = e.currentTarget.value;
        /* eslint-disable */
        if (isNaN(Number(value))) return;
        const handleValue = { ...this.state.value, min: value };
        this.setState({ value: handleValue });
        if (this.props.onChange) {
            this.props.onChange(handleValue);
        }
    };

    onChangeMax = (e) => {
        const value = e.currentTarget.value;
        if (isNaN(Number(value))) return;
        const handleValue = { ...this.state.value, max: value };
        this.setState({ value: handleValue });
        if (this.props.onChange) {
            this.props.onChange(handleValue);
        }
    };

    onBlur = (e) => {
        const { value = {} } = this.state;
        const { validateFields } = this.props;
        if (validateFields) {
            const isArrow = validateFields(value);
            if (this.props.onChange && isArrow) {
                this.props.onChange(value);
            }
            return;
        }
        if (value.min && value.max && Number(value.min) > Number(value.max)) {
            message.warning('输入数据不合法');
            const value = { min: undefined, max: undefined, type: 'numberRange' };
            this.setState({ value });
            if (this.props.onChange) {
                this.props.onChange(value);
            }
        }
    };

    render() {
        const { value } = this.state;
        const { placeholders = {}, placeholder, tailNode = '', precision } = this.props;
        return (
            <div className={styles.checkboxGroup}>
                <BIInput
                    size="small"
                    className={styles.ageInput}
                    placeholder={placeholders.min || placeholder || '请输入'}
                    value={value.min}
                    onChange={this.onChangeMin}
                    onBlur={this.onBlur}
                />
                <span className={styles.line} />
                <BIInput
                    size="small"
                    className={styles.ageInput}
                    placeholder={placeholders.max || placeholder || '请输入'}
                    value={value.max}
                    onChange={this.onChangeMax}
                    onBlur={this.onBlur}
                    precision={precision}
                />
                <div className={styles.tailNode}>{tailNode}</div>
            </div>
        );
    }
}
