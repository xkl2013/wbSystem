import React, { PureComponent } from 'react';
import styles from './approvalNode.less';
import addIcon from '@/assets/addIcon.png';
import addSelect from '@/assets/addSelect.png';
import { formModalLayout } from '../General/utils/layout';
import ModalDialog from '@/components/filterUsers/modalFiles';
import deleteIcon from '@/assets/closeIcon.png';
import { Row, Col } from 'antd';

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
  tipsEnter = async (item) => { // hover事件
    this.setState({
      toolTipList: []
    })
    let { executorId, executorType } = item || {}
    let { approvalTaskLogDtos = [] } = this.props.data || {}
    let { instanceId } = approvalTaskLogDtos[0] || {}
    let result = await this.getExecutors({
      instanceId,
      executorId,
      executorType
    })
    if (result && result.success) {
      let { list = [] } = result.data || {}
      let toolTipList = []
      if (list && list.length > 0 && list[0]) {
        toolTipList = list.map(item => item && item.userName)
      } else {
        toolTipList = ['暂无数据']
      }
      this.setState({
        toolTipList
      })
    }

  }
  addNodes = () => {
    let data = this.props.data || [];
    data = data.map(item => ({
      ...item,
      id: item.id || item.executorId,
      name: item.name,
    }))
    this.modal && this.modal.onShow(data)
  }
  removeUsers = (obj) => {
    if (this.props.onChange) {
      const newData = this.props.data.filter(item => item.id !== obj.id);
      this.props.onChange(newData);
    }
  }
  render() {
    let { title = '审批人', } = this.props
    const data = this.props.data || [];
    return (
      <div>
        <Row>
          <Col {...formModalLayout.labelCol.sm} ><div className={styles.title}>{title}</div></Col>
          <Col{...formModalLayout.wrapperCol.sm}><div className={styles.content}>
            <div className={styles.list}>
              {/* -1 已撤销  0 已驳回 1审批中 2已同意 3/5待审批 */}
              {data.map((item, index) => (
                <div
                  key={item.id}
                  className={`${styles.item} ${item.status == 1 ? styles.itemWait : null} ${item.status == 0 ? styles.itemReject : null}  ${item.status == 2 ? styles.itemAgree : null}  ${item.status == -1 ? styles.itemCancel : null}`}
                >
                  <div className={styles.itemTop}>
                    <p>{item.executorName || item.name}</p>
                    <div className={styles.itemTopIcon}></div>
                    {this.props.isShowAddBtn ? <img src={deleteIcon} className={styles.clearIcon} onClick={this.removeUsers.bind(this, item)}></img> : null}
                  </div>
                  <div className={styles.itemBottom}>
                    <div className={`${styles.itemLine} ${index == 0 ? styles.itemLineNone : null} ${item.status !== 3 || item.status !== 5 ? styles.itemLinePass : null}`}></div>
                    <div className={styles.itemIcon}></div>
                    <div className={`${styles.itemLine} ${item.status == 2 ? styles.itemLinePass : null}`}></div>
                  </div>
                </div>
              ))}
              {this.props.isShowAddBtn ? <div className={`${styles.lastItem}`}>
                <img src={addIcon} className={styles.addIcon} onClick={this.addNodes} />
              </div> : null}

            </div>
          </div>
          </Col>
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
