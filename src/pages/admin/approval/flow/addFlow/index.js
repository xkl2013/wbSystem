import React from 'react';
import styles from './index.less';
import BITabs from '@/ant_components/BITabs';

export default class AddFlow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  componentDidMount() {

  }
  renderForm=(a)=>{
    return <div>{a}</div>
  }
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.leftWrap}>
          <p className={styles.title}>控件库</p>
        </div>
        <div className={styles.centerWrap}></div>
        <div className={styles.rightWrap}>
          <BITabs type="card" onChange={this.handleModeChange} style={{ marginBottom: 8 }}>
            <BITabs.TabPane tab="表单属性" key='0'>{this.renderForm(1)}</BITabs.TabPane>
            <BITabs.TabPane tab="控件属性" key='1'>{this.renderForm(2)} </BITabs.TabPane>
          </BITabs>
        </div>
      </div>
    )
  }
}