import React from 'react';
import { InputNumber, Modal } from 'antd';
import classnames from 'classnames';
import styles from './styles.less';

/**
 *
 * @param {min,max,taxesRate}} value
 * @return boolean
 */

/**
 * @params(errorCallback)
 * @params(success)
 * rule:1 当阶梯金额的前值取上个阶梯金额的后值,当大于0时不可编辑
 */
class NumberRanger extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            tempValue: props.value || { min: undefined, max: undefined, taxesRate: undefined, type: 'oc' },
            value: props.value || { min: undefined, max: undefined, taxesRate: undefined, type: 'oc' },
            isError: false,
            inputState: false,
        };
    }

    // componentDidMount() {
    //     document.addEventListener('mousedown', this.listener)
    // }
    static getDerivedStateFromProps(props, state) {
        if (JSON.stringify(props.value) !== JSON.stringify(state.tempValue)) {
            return {
                tempValue: props.value,
                value: props.value,
            };
        }
        return null;
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.listener);
    }

    onMouseDown = () => {
        if (this.props.disabled || this.state.inputState) return;
        document.removeEventListener('mousedown', this.listener);
        this.setState({ inputState: true }, () => {
            document.addEventListener('mousedown', this.listener);
        });
    };

    listener = (event) => {
        // // 元素内点击不做任何事
        if (this.ref && this.ref.contains(event.target)) {
            return;
        }
        this.setState({ isError: false, inputState: false });
        // 数据没有发生变化不走校验
        if (JSON.stringify(this.props.value) === JSON.stringify(this.state.value)) {
            return;
        }
        const error = this.checkoutValueError(this.state.value);
        if (!error) {
            this.setState({ isError: false, inputState: true }, () => {
                this.onBlur();
            });
        } else {
            this.setState({ isError: true });
            Modal.destroyAll();
            // 点击提交时校验提示
            if (event.target.id === 'submitBtn') {
                Modal.warning({
                    title: '阶梯规则',
                    content: error.word,
                    getContainer: this.ref,
                });
                event.preventDefault();
                event.stopPropagation();
            }
        }
    };

    checkoutValueError = (value) => {
        const { maxFields, taxesRateFields, index } = this.props;
        if (!value.max || value.max <= maxFields.min || value.max > maxFields.max) {
            return { word: '最大值输入有误' };
        }
        // 第一个返点比例可以为0
        if (index === 0 && taxesRateFields.min === 0 && value.taxesRate >= 0) {
            return;
        }
        if (
            !value.taxesRate // 可以设置0
            || value.taxesRate * 100 <= taxesRateFields.min
            || value.taxesRate * 100 > taxesRateFields.max
        ) {
            return { word: '返点比例输入有误' };
        }
    };

    onChangeMin = (min) => {
        if (Number.isNaN(Number(min))) return;
        this.setState((preState) => {
            return {
                ...preState,
                value: { ...preState.value, min },
            };
        });
    };

    onChangeMax = (max) => {
        if (Number.isNaN(Number(max))) return;
        this.setState((preState) => {
            return {
                ...preState,
                value: { ...preState.value, max: max ? max * 10000 : max },
            };
        });
    };

    onChangetaxesRate = (taxesRate) => {
        if (Number.isNaN(Number(taxesRate))) return;
        this.setState((preState) => {
            return {
                ...preState,
                value: { ...preState.value, taxesRate: taxesRate ? taxesRate / 100 : taxesRate },
            };
        });
    };

    onBlur = () => {
        if (this.state.inputState) {
            document.removeEventListener('mousedown', this.listener);
        }
        this.setState({ inputState: false });
        if (this.props.onChange) {
            this.props.onChange(this.state.value);
        }
    };

    render() {
        const { value, isError, inputState } = this.state;
        return (
            <div
                className={classnames(
                    styles.checkboxGroup,
                    inputState ? styles.inputCheckboxGroup : '',
                    isError ? styles.errorBox : '',
                )}
                ref={(dom) => {
                    this.ref = dom;
                }}
                onMouseDown={this.onMouseDown}
            >
                <div className={styles.enterBox}>
                    <InputNumber
                        size="small"
                        disabled
                        className={styles.ageInput}
                        placeholder="请输入"
                        value={value.min ? value.min / 10000 : value.min}
                        onChange={this.onChangeMin}
                        precision={6}
                    />
                    <span className={styles.line} />
                    <InputNumber
                        size="small"
                        className={styles.ageInput}
                        placeholder="请输入"
                        disabled={this.props.disabled || this.props.maxFields.disabled}
                        // {...this.props.maxFields}
                        value={value.max ? value.max / 10000 : value.max}
                        onChange={this.onChangeMax}
                        precision={6}
                    />
                    <span style={{ marginLeft: '10px' }}>万元</span>
                    <div className={styles.tailNode}>
                        <span>返点比例</span>
                        <InputNumber
                            size="small"
                            className={styles.taxesRateInput}
                            // {...this.props.taxesRateFields}
                            disabled={this.props.disabled || this.props.taxesRateFields.disabled}
                            value={value.taxesRate ? value.taxesRate * 100 : value.taxesRate}
                            onChange={this.onChangetaxesRate}
                            precision={2}
                        />
                        <span className={styles.taxesRateSymbol}>%</span>
                    </div>
                </div>
            </div>
        );
    }
}
export default NumberRanger;
