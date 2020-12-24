import React from 'react';
import BIInput from '@/ant_components/BIInput';
import {message} from 'antd';
import styles from './styles.less';
import BIInputNumer from "@/ant_components/BIInputNumber";

export default class NumberRanger extends React.Component {
  state = {
    value: this.props.value || {min: undefined, max: undefined, type: 'numberRange'}
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
      this.setState({value: nextProps.value || {}})
    }
  }

  onChangeMin = (val) => {
    const value=val||0;
    if (isNaN(Number(value))) return;
    const handleValue = {min: value, max: 100 - value};
    this.setState({value: handleValue});
    if (this.props.onChange) {
      this.props.onChange(handleValue)
    }
  }
  onChangeMax = (value) => {
    const newValue=value||0;
    if (isNaN(Number(newValue))) return;
    const handleValue = {min: 100 - newValue, max: newValue};
    this.setState({value: handleValue});
    if (this.props.onChange) {
      this.props.onChange(handleValue);
    }
  }


  render() {
    const {value} = this.state;
    const {placeholders = {}, placeholder,minAttr={},maxAttr={}} = this.props;
    return (
      <div className={styles.checkboxGroup}>
        <BIInputNumer size="small"
                      className={styles.ageInput}
                      placeholder={placeholders.min || placeholder || '请输入'}
                      value={value.min}
                      min={0}
                      max={100}
                      step={1}
                      {...minAttr}
                      onChange={this.onChangeMin}
        />
        <span className={styles.line}>:</span>
        <BIInputNumer size="small" className={styles.ageInput}
                      min={0}
                      max={100}
                      step={1}
                      placeholder={placeholders.max || placeholder || '请输入'} value={value.max}
                      {...maxAttr}
                      onChange={this.onChangeMax}
        />
      </div>
    )
  }
}
