import React, { Component } from 'react';
import { connect } from 'dva';
import Content from './components/ContentWrap/content';
import EchartCom from '@/components/Echart';
import { option } from './components/EchartBarOption/barOptions';
import TableCom from './components/Table';
import BISpin from '@/ant_components/BISpin';
import {  thousandSeparator } from '@/utils/utils';

import styles from './index.less'

@connect(({ throw_manage, loading }) => ({
  throw_manage,
  trendList: throw_manage.trendList,
  loading: loading.effects['throw_manage/getPopularizeTrend']
}))
class Trend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trendList: {}
    };
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.trendList !== nextProps.trendList) {
      let dataAll = { data1: [], data2: [], data3: [], data4: [], data5: [], data6: [] }
      nextProps.trendList.forEach(item => {
        dataAll.data1.push(item.day);
        dataAll.data2.push(item.upFansCount);
        dataAll.data3.push(item.fansUnitPrice<0?0:item.fansUnitPrice);
        dataAll.data4.push(item.fansCount);
        dataAll.data5.push(item.upFansPutCount);
        dataAll.data6.push(item.putAmount);
      })
      this.setState({
        trendList: dataAll
      })
    }
  }
  getData = async (params) => {
    this.props.dispatch({
      type: 'throw_manage/getPopularizeTrend',
      payload: { ...params }
    })
  }
  render() {
    const { data1 = [] } = this.state.trendList;
    return (
      <div className={styles.wrap}>
        <Content title='投放趋势' getParam={this.getData}>
          <BISpin spinning={this.props.loading}>
            {

              data1.length && <EchartCom
                style={{ width: '100%', height: '450px' }}
                options={option(this.state.trendList)} />
            }
          </BISpin>
        </Content>
        <TableCom></TableCom>
      </div>

    )
  }
}

export default Trend;
