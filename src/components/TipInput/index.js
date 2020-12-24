/**
 *@author   zhangwenshuai
 *@date     2019-06-24 11:07
 **/
import React from 'react';
import BIInput from '@/ant_components/BIInput';
import antiAssign from '@/utils/anti-assign';
import './index.less';

class TipInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || undefined
    }
  }

  onChange = (e) => {
    const {onChange} = this.props;
    onChange(e)
  }

  render() {
    const {value} = this.props;
    return (
      <>
        <BIInput {...antiAssign(this.props, 'selfCom')} onChange={this.onChange} value={value}/>
        {this.props.selfCom ? this.props.selfCom : null}
      </>
    );
  }
}

export default TipInput;
