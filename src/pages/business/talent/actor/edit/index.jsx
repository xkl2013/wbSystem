import React, {Component} from 'react';
import {connect} from 'dva';
import FormView from '@/components/FormView';
import {formatCols} from '../constants';
import _ from 'lodash';
import {formatFormCols} from '@/utils/utils';
import { Watermark } from '@/components/watermark';

@Watermark
@connect(({talent_actor, loading}) => ({
  formData: talent_actor.formData,
  editBtnLoading: loading.effects['talent_actor/editStar']
}))
class EditStar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: props.formData || {}
    };
  }

  componentDidMount() {
    this.getData();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.formData != nextProps.formData) {
      this.setState({
        formData: nextProps.formData
      })
    }
  }

  getData = () => {
    const {query} = this.props.location;
    this.props.dispatch({
      type: 'talent_actor/getStarDetail',
      payload: {
        id: query && query.id
      }
    })
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
    const {formData} = this.state;
    //TODO 编辑时带回艺人编号
    if (formData.starCode) {
      values.starCode = formData.starCode;
    }
    newData.star = values;
    const {query} = this.props.location;
    let payload = {
      data: newData,
      id: query && query.id,
      cb: this.props.history.goBack
    }
    this.props.dispatch({
      type: 'talent_actor/editStar',
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
  //初始化弹框（可以将需要数据带过去）
  initForm = (form) => {
    return _.assign({}, this.state.formData, form)
  }

  //修改父表单数据
  changeParentForm = (key, value) => {
    const form = this.formView.props.form.getFieldsValue();
    let newData = _.assign({}, this.state.formData, form, {starAccountList: value});
    this.setState({
      formData: newData
    })
  }

  render() {
    const {formData} = this.state;
    const {editBtnLoading} = this.props;
    let detail = _.assign({}, formData);
    if (!detail.starManagerId && detail.starUserList) {
      detail.starManagerId = detail.starUserList.filter(item => item.starParticipantType === 1);
    }
    if (!detail.starDrumbeaterId && detail.starUserList) {
      detail.starDrumbeaterId = detail.starUserList.filter(item => item.starParticipantType === 2);
    }
    const cols = formatFormCols(formatCols({
      changeRisk: this.changeRisk,
      formData: detail,
      initForm: this.initForm,
      changeParentForm: this.changeParentForm
    }));
    return (
      <FormView
        wrappedComponentRef={(fv) => this.formView = fv}
        cols={cols}
        formData={detail}
        handleSubmit={this.handleSubmit}
        handleCancel={this.handleCancel}
        btnWrapStyle={{
          marginTop: '20px'
        }}
        loading={editBtnLoading}
      />
    );
  }
}

export default EditStar;
