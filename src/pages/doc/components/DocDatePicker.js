import React, { Component } from 'react';
import {Divider,Input} from 'antd';

import Box from '../Box';
import Left from '../Left';
import Right from '../Right';

import BIDatePicker from '@/ant_components/BIDatePicker';
const  { BIRangePicker, BIMonthPicker, BIWeekPicker } = BIDatePicker;
const { TextArea } = Input;


class DocDatePicker extends Component {

  onChange = (date, dateString) => {
    console.log(date, dateString);
  };

  render() {
    const btn =
`import BIDatePicker from '@/ant_components/BIDatePicker';
const  { BIRangePicker, BIMonthPicker, BIWeekPicker } = BIDatePicker;
<BIDatePicker onChange={this.onChange} /> 
<BIRangePicker onChange={this.onChange} /> 
<BIMonthPicker onChange={this.onChange} /> 
<BIWeekPicker onChange={this.onChange} />`

    return (
      <Box title="BIDatePicker 日期选择框">
        <Left>
          <BIDatePicker onChange={this.onChange} />

          <BIRangePicker onChange={this.onChange} />

          <BIMonthPicker onChange={this.onChange} />

          <BIWeekPicker onChange={this.onChange} />

          <Divider orientation="left"> 组件说明 </Divider>
          <div>
            API 同 <a href="https://ant.design/components/date-picker-cn/" target="view_window">Ant DatePicker</a>
          </div>
        </Left>
        <Right>
          <TextArea rows={5} defaultValue={btn} />
        </Right>
      </Box>
    )
  }
}


export default DocDatePicker;

