import React, { Component } from 'react';

import styles from './index.less';
import Detail from '../../components/detail';

import { connect } from "dva";
import BIButton from "@/ant_components/BIButton";
import BIRadio from "@/ant_components/BIRadio";
import { getApprlvalDetail } from '../../services'
import { detailConfig } from '../../components/detail/config'




@connect(() => ({

}))
class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      apprlvalDetail: {}, // 审批详情概况
    }

  }
  componentDidMount() {
    this.getApprlvalDetailFun()
  }
  getApprlvalDetailFun = async () => { // 获取审批详情概况
    let { query: { id = '' } } = this.props.location || {}
    let result = await getApprlvalDetail({ id })
    if (result && result.success) {
      this.setState({
        apprlvalDetail: result.data
      }, this.hancleCallback)
    }
  }


  // 数据成功回调
  hancleCallback = (data = {}) => {
    let { formData = {}, instanceData = {} } = data
    let { approvalFlow: { flowMark = '' }, instanceCode = "", name = "" } = this.state.apprlvalDetail || {} // type
    let typeName = flowMark && detailConfig[flowMark] && detailConfig[flowMark].name || '' // type name
    this.props.dispatch({
      type: 'header/saveHeaderName',
      payload: {
        title: flowMark == 'common' || flowMark === 'travel' ? `${name}详情` : `${typeName}详情`,
        subTitle: flowMark == 'common' || flowMark === 'travel' ? `编号${instanceCode}` : `${typeName}编号${formData[flowMark + 'Code'] || ''}`,
      }
    })
  }

  render() {
    let { apprlvalDetail } = this.state;
    return (
      <Detail
        apprlvalDetail={apprlvalDetail}
        handleCallback={this.hancleCallback}
        ref='parentDetail'
      />
    )
  }
}

export default Index
