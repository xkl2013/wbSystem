import React, {Component} from 'react';
import FormView from '@/components/FormView';
import {formatCols} from '../constants';
import {connect} from "dva";
import {formatFormCols} from "@/utils/utils";
import _ from 'lodash';

@connect(({admin_company, loading}) => ({
  formData: admin_company.formData,
  editBtnLoading: loading.effects['admin_company/editCompany']
}))
class EditCompany extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: props.formData || {}
    }
  }

  componentDidMount() {
    this.getData();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.formData !== nextProps.formData) {
      this.setState({
        formData: nextProps.formData
      })
    }
  }

  getData = async () => {
    const {query} = this.props.location;
    this.props.dispatch({
      type: 'admin_company/getCompanyDetail',
      payload: {
        id: query && query.id
      }
    })
  }
  handleSubmit = values => {
    const {query} = this.props.location;
    let newData = {
      companyBankDTOList: values.companyBankList
    }
    delete values.companyBankList;
    newData.companyDTO = values;
    let payload = {
      id: query && query.id,
      data: newData,
      cb: this.handleCancel
    }
    this.props.dispatch({
      type: 'admin_company/editCompany',
      payload
    })
  };
  handleCancel = () => {
    this.props.history.goBack();
  }
  //初始化弹框（可以将需要数据带过去）
  initForm = (form) => {
    let formData = this.formView.props.form.getFieldsValue();
    return _.assign({}, this.state.formData, form, {companyName: formData.companyName})
  }
  //修改帐号为报销专号
  setSpecial = (record) => {
    const form = this.formView.props.form.getFieldsValue();
    const {companyBankList} = form;
    let newData = companyBankList || [];
    newData.map(item => {
      if (item.key === record.key) {
        item.companyBankIsReimbursement = 1;
      } else {
        item.companyBankIsReimbursement = 0;
      }
    })
    this.setState({
      formData: _.assign({}, this.state.formData, form, {companyBankList: newData})
    })
  }
  //修改父表单数据
  changeParentForm = (key, value) => {
    const form = this.formView.props.form.getFieldsValue();
    let newData = _.assign({}, this.state.formData, form, {companyBankList: value});
    this.setState({
      formData: newData
    })
  }

  render() {
    const {formData} = this.state;
    const {editBtnLoading} = this.props;
    const cols = formatFormCols(formatCols({
      formData,
      initForm: this.initForm,
      setSpecial: this.setSpecial,
      changeParentForm: this.changeParentForm,
    }));
    return (
      <FormView
        wrappedComponentRef={(fv) => this.formView = fv}
        formData={formData}
        cols={cols}
        handleSubmit={this.handleSubmit}
        handleCancel={this.handleCancel}
        loading={editBtnLoading}
      />
    );
  }
}

export default EditCompany;
