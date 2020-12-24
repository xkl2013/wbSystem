import React from 'react';
import { Cascader,Icon } from 'antd';
import {citys} from '@/utils/city.json'
import s from './index.less';

interface Props {
    onChange: Function,
    value?: any,
    fieldNames?: {
      value: any,
      label: string,
      key: any,
    },
  }

class SearchCom extends React.Component<Props>{
  state = {
    value:this.props.value||undefined,
  };
  componentWillReceiveProps(nextProps:any){
    if(JSON.stringify(nextProps.value)!==JSON.stringify(this.props.value)){
      this.setState({value:nextProps.value});
    }
  }
  onChange = (val:any,ops:any) => {
    const cityNames=ops.map((item:any)=>item.label).filter((item:any)=>item);
    const cityValues=ops.map((item:any)=>item.value).filter((item:any)=>item);
    const value={
      label:cityNames.join('/'),
      value:cityValues.join('/'),
    }
      if(this.props.onChange){
        this.props.onChange(value);
      }
    this.setState({ value });
  };
  formaterValue=(value:any)=>{
if(!value)return value;
if(Array.isArray(value)) return value;
if(typeof value==='string')return value.split('/').map((item:any)=>Number(item));
if(typeof value==='object'&&value.value){
  return value.value.split('/').map((item:any)=>Number(item));
}
  }
 

  render() {
    const {value} = this.state;
    console.log(s)
    return (
      <Cascader
          popupClassName={s.view}
      {...this.props}
      options={citys}
      value={this.formaterValue(value)}
        showSearch={true}
        suffixIcon={<Icon type="search"  style={{ fontSize: '16px' }} />}
        allowClear={true}
        onChange={this.onChange}
      />
    );
  }
}
export default SearchCom;
