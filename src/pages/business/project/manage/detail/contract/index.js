import React, {Component} from 'react';
import {connect} from 'dva';
import PageDataView from '@/components/DataView';
import {columnsFn} from './_selfColumn';

@connect(({business_project_manage, loading}) => ({
  business_project_manage,
  contractListPage: business_project_manage.contractListPage,
  loading: loading.effects['business_project_manage/getContractList'],
}))
class Establish extends Component {
  constructor(props) {
    super(props)
    this.state = {};
  }

  componentDidMount() {
    this.fetch();
  }

  fetch = () => {
    const {pageDataView} = this.refs;
    if (pageDataView != null) {
      pageDataView.fetch();
    }
  }
  _fetch = (beforeFetch) => {
    let data = beforeFetch();
    this.props.dispatch({
      type: 'business_project_manage/getContractList',
      payload: {...data, id: this.props.location.query.id}
    });
  }
  checkData = (val) => { // 查看详情
    this.props.history.push({
      pathname: '/foreEnd/business/project/contract/detail',
      query: {
        id: val
      }
    });
  }

  render() {
    const {contractListPage} = this.props;
    const columns = columnsFn(this);
    return (
      <PageDataView
        ref="pageDataView"
        rowKey="contractId"
        loading={this.props.loading}
        fetch={this._fetch}
        cols={columns}
        hideForm
        pageData={contractListPage}
      />
    )
  }
}

export default Establish;
