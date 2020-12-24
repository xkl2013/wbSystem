import React, {Component} from 'react';
import {connect} from 'dva';
import FormView from '@/components/FormView';
import {formatCols} from '../constants';
import _ from "lodash";
import {formatFormCols} from '@/utils/utils';

@connect(({talent_actor, loading}) => ({
  talent_actor,
  addBtnLoading: loading.effects['talent_actor/addStar']
}))
class CreateUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {}
    };
  }

  handleSubmit = values => {
    this.setState({
      formData: values
    })
    let newData = {};
    if (values.starAccountList) {
      newData.starAccountList = values.starAccountList;
      delete values.starAccountList;
    } else {
      newData.starAccountList = [];
    }
    let starUserList = [];
    if (values.starManagerId) {
      starUserList = starUserList.concat(values.starManagerId);
      delete values.starManagerId;
    }
    if (values.starDrumbeaterId) {
      starUserList = starUserList.concat(values.starDrumbeaterId);
      delete values.starDrumbeaterId;
    }
    newData.starUserList = starUserList;
    newData.star = values;
    let payload = {
      data: newData,
      cb: this.handleCancel
    }
    this.props.dispatch({
      type: 'talent_actor/addStar',
      payload
    })
  };
  handleCancel = () => {
    this.props.history.goBack();
  }
  changeRisk = (values) => {
    const formData = this.formView.props.form.getFieldsValue();
    let newData = _.assign({}, formData, {starRisk: values});
    this.setState({
      formData: newData
    })
  }

  //修改父表单数据
  changeParentForm = (key, value) => {
    const form = this.formView.props.form.getFieldsValue();
    let newData = _.assign({}, this.state.formData, form, {bloggerAccountList: value});
    this.setState({
      formData: newData
    })
  }

  render() {
    const {formData} = this.state;
    const {addBtnLoading} = this.props;
    const cols = formatFormCols(formatCols({
      changeRisk: this.changeRisk,
      formData,
      changeParentForm: this.changeParentForm
    }));
    return (
      <FormView
        wrappedComponentRef={(fv) => this.formView = fv}
        cols={cols}
        formData={formData}
        handleSubmit={this.handleSubmit}
        handleCancel={this.handleCancel}
        btnWrapStyle={{
          marginTop: '20px'
        }}
        loading={addBtnLoading}
      />
    );
  }
}

export default CreateUser;
