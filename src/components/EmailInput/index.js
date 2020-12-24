import React, {Component} from 'react';
import BIInput from '@/ant_components/BIInput';
import BISelect from '@/ant_components/BISelect';
import styles from './index.less';
import {filterEmailReg} from '@/utils/reg';

const suffix = ['@163.com', '@126.com', '@qq.com', '@gmail.com', '@sina.com'];

const formatValue = (value) => {
  if (value && filterEmailReg.test(value)) {
    let arr = value.split('@');
    return {
      inputValue: arr[0],
      suffixValue: '@' + arr[1]
    }
  } else {
    return {
      suffixValue: suffix[0]
    };
  }
}
const getValue = (input, suffix) => {
  if (input && suffix) {
    return input + suffix;
  }
  return undefined;
}

class EmailInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: undefined,
      suffixValue: suffix[0],
      inputValue: undefined
    }
  }

  componentDidMount() {
    this._formatValue(this.props.value);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this._formatValue(nextProps.value);
    }
  }

  _formatValue = (value) => {
    const {inputValue, suffixValue} = formatValue(value);
    this.setState({
      inputValue, suffixValue
    })
  }
  changeSuffix = (e) => {
    this.setState({
      suffixValue: e,
    })
    let value = getValue(this.state.inputValue, e);
    this.triggerChange(value)

  }
  changeInput = (e) => {
    const that = this;
    let value = e.target.value;
    //解决输入法连词bug
    setTimeout(() => {
      that.setState({
        inputValue: value,
      })
      let newValue = getValue(value, that.state.suffixValue);
      that.triggerChange(newValue)
    }, 0)
  }

  triggerChange = (changedValue) => {
    if (this.props.onChange) {
      this.props.onChange(changedValue)
    }
  }

  render() {
    const {inputValue, suffixValue} = this.state;
    return (
      <BIInput value={inputValue} onChange={this.changeInput} placeholder="请输入" addonAfter={
        <BISelect className={styles.suffix} value={suffixValue} onChange={this.changeSuffix}>
          {suffix.map((item) => {
            return <BISelect.Option key={item} value={item}>{item}</BISelect.Option>
          })}
        </BISelect>
      }/>
    )
  }
}

export default EmailInput
