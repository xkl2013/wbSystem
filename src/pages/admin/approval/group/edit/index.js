import React, {Component} from 'react';
import {connect} from 'dva';
import FormView from '@/components/FormView';
import {formatCols} from '../constants';

@connect(({admin_approval_group, loading}) => ({
    admin_approval_group,
    flowsDetail:admin_approval_group.flowsDetail,
    editBtnLoading: loading.effects['admin_approval_group/editGroup'],
  }))
class EditGroup extends Component {
  constructor(props) {
    super(props);
    this.state={
      flowsDetail:props.flowsDetail||{}
    }
  }
  componentDidMount(){
    // 获取分组详情
    const {id}=this.props.history.location.query;
    this.props.dispatch({
      type: 'admin_approval_group/getFlowsDetail',
      payload:id
    })
  }
  componentWillReceiveProps(nextProps){
    if(this.props.flowsDetail!==nextProps.flowsDetail){
      this.setState({flowsDetail:nextProps.flowsDetail})
    }
  }
  handleSubmit=(values)=>{
    let payload = {
        data: {...values,id:Number(this.props.location.query.id)},
        cb: this.handleCancel
      }
      this.props.dispatch({
        type: 'admin_approval_group/editGroup',
        payload
      })
  }
  handleCancel = () => {
    this.props.history.goBack();
  }
  render() {
    const {flowsDetail} = this.state;
    //添加时上级部门名称为选中的部门
    let cols = formatCols({formData: flowsDetail})
    return (
      <FormView
        cols={cols}
        formData={flowsDetail}
        handleSubmit={this.handleSubmit.bind(this)}
        handleCancel={this.handleCancel.bind(this)}
        btnWrapStyle={{
          marginTop: '20px'
        }}
        loading={this.props.editBtnLoading}
      />
    );
  }
}

export default EditGroup;
