// import {message} from 'antd';
import {
  getApprovalMessage, getMessageCount, getMessageDetail,
  updateMessage, updateAllMessage,
  getApprovalMyTask,
  getMessageCountType,
} from '../services/news';
import { message } from 'antd';
import _ from 'lodash'
// import {msgF} from '@/utils/utils';

export default {
  namespace: 'admin_news',
  state: {
    approvalMessageList: [],   //审批列表
    approvalMessagePage: {},
    params: {
      messageStatus: 0,     // 消息状态
      messageType: 2,        // 消息类型
      messageModule: undefined       //消息模块
    },

    approvalCount: {},   // 审批数量
    messageCount: [],
    messageCountTypeList: [],   // 系统助手消息类型数量
    messagecommentTypeList: [],  // 评论助手消息数据
  },
  effects: {
    *updateMessage({ payload }, { call, put, select }) {
      const { messageType, ...others } = payload;
      const response = yield call(updateMessage, others);
      if (response.success) {
        yield put({
          type: 'getMessageCount'
        });
        yield put({
          type: 'updataMessageList',
          payload: { messageType, messageIds: others.messageIds }
        })
      }
    },
    *updateAllMessage({ payload }, { call, put, select }) {
      const { messageIds, messageType, callback, ...others } = payload
      const response = yield call(updateAllMessage, { messageType, ...others })
      if (response.success) {
        yield put({
          type: 'getMessageCount'
        });
        yield put({
          type: 'updataMessageList',
          payload: { messageType, messageIds: messageIds }
        })
        message.success(response.message);
        callback && callback.call();
      }
    },
    *getApprovalMyTask(_, { call, put }) {   // 获取审批数量
      const response = yield call(getApprovalMyTask);
      if (response && response.success) {
        const approvalCount = response.data || {};
        yield put({
          type: 'save',
          payload: { approvalCount }
        })
      }
    },
    *getMessageCount(_, { call, put, select }) {
      const response = yield call(getMessageCount);
      if (response.success) {
        const data = response.data || [];
        const messageCount = Array.isArray(data) ? data : [];
        yield put({ type: 'save', payload: { messageCount } });
      }
    },
    *getApprovalMessage({ payload }, { call, put, select }) {
      const response = yield call(getApprovalMessage, payload);
      if (response.success) {
        const data = response.data || {};
        const list = Array.isArray(data.list) ? data.list : [];
        const approvalMessagePage = {
          total: data.total,
          pageNum: data.pageNum,
          size: data.size,
        }
        let originData = yield select(state => state.admin_news.approvalMessageList);
        originData = payload.pageNum > 1 ? originData : [];
        yield put({
          type: 'save',
          payload: { approvalMessageList: [...originData, ...list], approvalMessagePage, params: payload }
        })
      }
    },
    *getMessageDetail({ payload }, { call, put, select }) {   // messageModule为1时是系统助手,2时评论助手,如果为1时且为全部时,不用拦截消息类型
      let params = yield select(state => state.admin_news.params);
      if (params.messageStatus !== 0) return;                                               //当前为未读放行
      if (payload.messageModule !== params.messageModule) return;
      if (params.messageType && params.messageType !== payload.messageType) return;    // // 系统消息,全部类型,未读tab,进行放行
      const response = yield call(getMessageDetail, payload.id);
      if (response.success) {
        const data = response.data;
        if (data) {
          let approvalMessageList = yield select(state => state.admin_news.approvalMessageList);
          let approvalMessagePage = yield select(state => state.admin_news.approvalMessagePage);
          //判断当前messageType是否是当前页面,消息类型是否一致,新增消息,默认是未读消息
          //防重复
          const obj = approvalMessageList.find(item => item.messageId === data.messageId) || {};
          if (obj.messageId !== void 0) {
            approvalMessageList = approvalMessageList.filter(item => item.messageId !== obj.messageId)
          }
          approvalMessageList = [data, ...approvalMessageList];
          approvalMessagePage = { ...approvalMessagePage, total: obj.messageId !== void 0 ? approvalMessagePage.total : approvalMessagePage.total + 1 }

          yield put({
            type: 'save',
            payload: { approvalMessageList, approvalMessagePage }
          })
        }
      }
    },
    *getMessageCountType({ payload }, { call, put, select }) {
      let messageCountTypeList = yield select(state => state.admin_news.messageCountTypeList);
      let messagecommentTypeList = yield select(state => state.admin_news.messagecommentTypeList);
      const response = yield call(getMessageCountType, payload);
      if (response && response.success) {
        let data = Array.isArray(response.data) ? response.data : [];
        messageCountTypeList = payload.messageModule === 1 ? data : messageCountTypeList;
        messagecommentTypeList = payload.messageModule === 2 ? data : messagecommentTypeList;
        yield put({ type: 'save', payload: { messageCountTypeList, messagecommentTypeList } });
      }
    }
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    clearMessageList(state, { payload }) {
      return { ...state, approvalMessageList: null, approvalMessagePage: {}, };
    },
    updataMessageList(state, { payload }) {
      const { messageIds, messageType } = payload;
      let approvalMessageList = state.approvalMessageList || [];
      // switch (messageType) {
      //   case 2:
      approvalMessageList = approvalMessageList.map(item => ({
        ...item,
        messageStatus: handleMessageStatue(item, messageIds),
      }))
      // }
      return { ...state, ...payload, approvalMessageList };
    }
  }
};
function handleMessageStatue(item, ids = []) {
  if (item.messageStatus === 1) return item.messageStatus;
  return ids.includes(item.messageId) ? item.messageStatus + 1 : item.messageStatus
}