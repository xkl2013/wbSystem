import React, { Component } from 'react';
import { connect } from 'dva';
import FormView from '@/components/FormView';
import { formatCols } from './formatCols';

@connect(({ admin_approval_flow, loading }) => ({
  admin_approval_flow,
  loading: loading.effects[`admin_approval_flow/editFlowSetting`]
}))
class AdvancedSetting extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const { id = null } = this.props.history.location.query;
    this.props.dispatch({
      type: 'admin_approval_flow/getFlowSetting',// 获取高级配置信息
      payload: { flowId: id }
    })

  }
  handleSubmit = (values) => {
    const dataList = [], { id } = this.props.history.location.query;
    Object.keys(values).map(item => {
      dataList.push({
        dataValue: Number(values[item]),
        dataType: Number(item.substr(item.length - 1, 1)),
        flowId: Number(id)
      })
    })
    let payload = {
      data: dataList,
      flowId: Number(id),
      cb: this.handleCancel
    }
    this.props.dispatch({
      type: 'admin_approval_flow/editFlowSetting',
      payload
    })
  }
  handleCancel = () => {
    this.props.history.goBack();
  }
  render() {
    const { formData, flowOptions } = this.props.admin_approval_flow;
    let cols = formatCols(formData, flowOptions)
    return (
      <FormView
        cols={cols}
        formData={formData}
        handleSubmit={this.handleSubmit.bind(this)}
        handleCancel={this.handleCancel.bind(this)}
        btnWrapStyle={{
          marginTop: '20px'
        }}
        loading={this.props.loading}
      />
    );
  }
}

export default AdvancedSetting;
