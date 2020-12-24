import {message} from 'antd';
import { routerRedux } from 'dva/router';
import {
    addReimburse,editAddReimburse
} from './services';
import {msgF} from '@/utils/utils';

export default {
  namespace: 'fee_manage',

  state: {
   
  },

  effects: {
      *addReimburse({payload}, {call, put}){
          const response=yield call(addReimburse,{...payload});

      }
  },

  reducers: {
    save(state, {payload}) {
      return {...state, ...payload};
    },
  },

  subscriptions: {},
};
