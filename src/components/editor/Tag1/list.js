
import React from 'react';
import styles from './index.less';
import { Icon, message } from 'antd';

import Add from './add'

class TagList extends React.Component {
  onEdit = (item) => {
    this.props.changeTab(2, { ...item, modelType: 'edit' });
  }
  onAdd = (e) => {
    e.nativeEvent.stopImmediatePropagation();
    if (this.props.data && this.props.data.length >= 20) {
      message.warn('最多仅支持20个标签');
      return
    }
    this.props.changeTab(2);
  }
  onChoose = (item) => {
    const chooseData = this.props.chooseData || [];
    const index = chooseData.findIndex(ls => ls.tagId === item.tagId);
    if (index >= 0) {
      chooseData.splice(index, 1);
    } else {
      chooseData.push(item);
    }
    this.props.onChoose && this.props.onChoose(chooseData);
  }

  listRender = () => { // 列表渲染
    const { data, chooseData = [] } = this.props;
    return (
      <div className={styles.tag}>
        <div className={styles.tagTit}>
          <div className={styles.title}>标签</div>
          <div className={styles.add} onClick={this.onAdd}>
            <span className={styles.s1}>+</span>
            <span>新增</span>
          </div>
        </div>
        <ul>
          {data.map(item => (
            <li key={item.tagId}>
              <div className={styles.con} onClick={this.onChoose.bind(this, item)}>
                <div className={styles.conBackground} style={{ backgroundColor: `#${item.tagColor}` }}></div>
                <div className={styles.conLeft}>
                  <Icon type="tag" theme="filled" rotate={270} className={styles.conIcon} style={{ color: `#${item.tagColor}` }} />
                  <span style={{ color: `#${item.tagColor}` }}>{item.tagName}</span>
                </div>
                <div className={`${chooseData.findIndex(ls => ls.tagId === item.tagId) >= 0 ? styles.conSelActive : styles.conSel}`}></div>
              </div>
              <div className={styles.editIcon} onClick={(e) => { e.nativeEvent.stopImmediatePropagation(); this.onEdit(item) }}></div>
            </li>
          ))}

        </ul>
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.listRender()}
      </div>
    );
  }
}

export default TagList;
