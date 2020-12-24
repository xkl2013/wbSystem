/**
 *@author   zhangwenshuai
 *@date     2019-06-28 17:47
 **/
import React, {Component} from 'react';
import {Spin} from 'antd';
import s from './index.less';

export default class extends Component {
  render() {
    return (
      <div className={s.warp}>
        <img className={s.loading} src="https://static.mttop.cn/loading.gif"/>
      </div>
    )
  }
}
