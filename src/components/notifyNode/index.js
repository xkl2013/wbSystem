import React, { PureComponent } from 'react';
import styles from './index.less';
import avatar from '@/assets/avatar.png';
import addIcon from '@/assets/addIcon.png';
import deleteIcon from '@/assets/closeIcon.png';
import { formModalLayout } from '../General/utils/layout';
import ModalDialog from '@/components/filterUsers/modalFiles';
import { Row, Col, Icon } from 'antd';

/**
 *
 *  审批流组件
 *  props：
 *  data // 数据源对象，包含 approvalFlowNodeDtos = [], approvalTaskLogDtos = []
 *  title1 // 审批预览title
 *  title2  // 审批记录title
 *
 **/

export default class Index extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      toolTipList: [], // tip 数据
    }
  }
  tipNode = () => { // tip节点
    let toolTipList = this.state.toolTipList || []
    if (toolTipList.legnth == 0) {
      return null
    }
    let node = toolTipList.map((item, index) => <p key={index} style={{ textAlign: 'center' }}>{item}</p>)
    return <div>{node}</div>
  }
  addUsers = () => {
    let data = this.props.data || [];
    data = data.map(item => ({ ...item, id: item.userId, name: item.userName }));
    this.modal && this.modal.onShow(data)
  }
  removeUsers = (obj) => {
    if (this.props.onChange) {
      const newData = this.props.data.filter(item => item.id !== obj.id);
      this.props.onChange(newData);
    }
  }
  renderUserName = (str = '') => {
    const words = str.replace('（', ',(').split(',');
    return words.map((item, index) => <span key={index}>
      <span className={styles.userName} >{item}</span><br />
    </span>)
  }
  renderSplitUsers = () => {
    let { title = '', } = this.props
    return (
      <>
        <Col {...formModalLayout.labelCol.sm} ><div className={styles.title}>{title}</div></Col>
        <Col {...formModalLayout.wrapperCol.sm}>
          {this.renderNoTitle()}
        </Col>
      </>
    )
  }
  renderNoTitle = () => {
    const data = this.props.data || [];
    return (
      <div className={styles.content} style={this.props.newContent}>
        <div className={styles.list}>
          {/* -1 已撤销  0 已驳回 1审批中 2已同意 3/5待审批 */}
          {data.map((item, index) => (
            <div
              key={index}
              className={`${styles.item} ${item.status == 1 ? styles.itemWait : null} ${item.status == 0 ? styles.itemReject : null}  ${item.status == 2 ? styles.itemAgree : null}  ${item.status == -1 ? styles.itemCancel : null}`}
            >
              <div className={styles.itemTop}>

                <img width='38px' className={styles.iconCls} src={item.avatar && `${item.avatar}` || avatar} />
                {
                  this.props.isShowClear ? <span className={styles.clearUsers}>
                    <img src={deleteIcon} className={styles.clearIcon} onClick={this.removeUsers.bind(this, item)}></img>
                  </span> : null
                }

              </div>
              <div className={styles.itemBottom} style={this.props.newItemBottom}>
                {this.renderUserName(item.executorName || item.name)}
              </div>
            </div>
          ))}
          {this.props.hideBtn ? null : <div className={`${styles.item}`}>
            <div className={styles.itemTop} onClick={this.addUsers}>
              <img width='38px' src={addIcon} />
            </div>
          </div>}

        </div>

      </div>
    )
  }
  render() {
    let { title = '', } = this.props
    const data = this.props.data || [];
    return (
      <div>
        <Row>
          {title ? this.renderSplitUsers() : this.renderNoTitle()}
        </Row>
        <ModalDialog
          ref={dom => this.modal = dom}
          title="添加用户"
          value={data}
          onChange={this.props.onChange}
        />
      </div>
    );
  }
}
