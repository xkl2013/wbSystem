import React from 'react';
import { Spin } from 'antd';
import styles from './styles.less';
import RenderEmpty from '@/components/RenderEmpty';
import InfiniteScroll from 'react-infinite-scroller';
import approvalIcon from '@/assets/approvalIcon.png';


import moment from 'moment';
const formatTime = 'HH:mm';

function handleDateTime(dateTime) {
    return moment(dateTime).format(formatTime)
}

function checkoutShowText(key, item = []) {
  const obj = item.find(ls => ls) || {};
  if (key >= -2) {
      return { '0': '今天', '-1': '昨天', '-2': '前天' }[key];
  } else if (key >= -30 && key < -2) {
      return moment(obj.messageDatetime || '').format('MM/DD')
  } else {
      return moment(obj.messageDatetime || '').format('YYYY/MM/DD')
  }
}

function renderItem(dataSource, checkDetail) {
  const child = [];
  if (!dataSource || dataSource.size === 0)
      return RenderEmpty({ marginTop: '200px' }, '暂无消息');
  for (let [key, value] of dataSource) {
      child.push(renderListItem(key, value, checkDetail));
  }
  return child;
}

function renderSplitLine(key, item) {
  return (
      <li className={styles.splitLine}>
          <span className={styles.splitLeft}></span>
          <span className={styles.splitText}>{checkoutShowText(key, item)}</span>
          <span className={styles.splitRight}></span>
      </li>
  );
};

function renderListItem(key, item, checkDetail) {
  const children = Array.isArray(item) ? item : [];
  if (children.length === 0) return null;
  return (
      <ul key={key} className={styles.listItems}>
        {renderSplitLine(key, item)}
        {item.map(ls => (
          <li key={ls.messageId} className={styles.listItem}>
            <div className={styles.itemMeta}>
              {renderAvatar(ls)}
              {renderListContent(ls, checkDetail)}
            </div>
          </li>
      ))}
    </ul>
  );
};

function renderAvatar(item) {
  return (
    <div className={styles.itemMetaAvatar}>
      <span className={styles.avatarCrrcle}>
        <img src={item.messageIcon || approvalIcon} alt=''/>
      </span>
    </div>
  );
};

function renderListContent(item, checkDetail) {
  return (
    <div className={styles.metaContent} onClick={() => checkDetail(item)}>
      <h4 className={styles.metaTitle}>
        {item.messageTitle}
        {renderTime(item)}
      </h4>
    <div className={styles.metaDescription}>{item.messageContent}</div>
      {item.messageStatus === 0 ? <span className={styles.point} /> : null}
    </div>
  );
};

function renderTime(item) {
  return <span className={styles.dateTime}>{handleDateTime(item.messageDatetime)}</span>;
};


export default function FlatList(props) {
  const { dataSource, loading, hasMore, checkDetail } = props;
  const clientHeight = document.body.clientHeight - 148;
  return (
    <ul className={styles.wrapUl} style={{height:clientHeight}}>
      <InfiniteScroll
        initialLoad={false}
        pageStart={0}
        loadMore={props.loadMore}
        hasMore={!loading && hasMore}
        useWindow={false}
      >
        {renderItem(dataSource, checkDetail)}
        {loading && hasMore && <div className={styles.loading}><Spin /></div>}
      </InfiniteScroll>
    </ul>
  )
}
