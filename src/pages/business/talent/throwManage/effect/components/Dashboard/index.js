import React, {Component} from 'react';
import styles from './index.less'

export default class DashboardWrap extends Component {

  render() {
      const {title='1',tipTxt='2',val=0,footName='',footVal=0}=this.props;
    return (
      <div className={styles.wrap}>
        <div className={styles.titleWrap}>
          <span className={styles.titleTxtCls}>{title}</span>
        </div>
        <div className={styles.contentWrap}>
          {this.props.children}
        </div>
        <div className={styles.footWrap}>
          <span className={styles.footTxtCls}>{footName}</span> 
          <span>{footVal}</span> 
        </div>
      </div>

    )
  }
}
