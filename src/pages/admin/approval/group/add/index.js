import React, {Component} from 'react';
import {connect} from 'dva';
import FormView from '@/components/FormView';
import {formatCols} from '../constants';

@connect(({admin_approval_group, loading}) => ({
    admin_approval_group,
    addBtnLoading: loading.effects['admin_approval_group/addGroup'],
  }))
class AddGroup extends Component {
  constructor(props) {
    super(props);
  }
  handleSubmit=(values)=>{
    let payload = {
        data: values,
        cb: this.handleCancel
      }
      this.props.dispatch({
        type: 'admin_approval_group/addGroup',
        payload
      })
  }
  handleCancel = () => {
    this.props.history.goBack();
  }
  render() {
    const {formData} = this.props;
    //添加时上级部门名称为选中的部门
    let detail = { }
    let cols = formatCols({formData: detail})
    return (
      <FormView
        cols={cols}
        formData={detail}
        handleSubmit={this.handleSubmit.bind(this)}
        handleCancel={this.handleCancel.bind(this)}
        btnWrapStyle={{
          marginTop: '20px'
        }}
        loading={this.props.addBtnLoading}
      />
    );
  }
}

export default AddGroup;
