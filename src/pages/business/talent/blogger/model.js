import { message } from 'antd';
import {
    getBloggerList,
    getBloggerList2,
    addBlogger,
    editBlogger,
    getBloggerDetail,
    getContractStatus,
    getDictionariesList,
} from './services';

export default {
    namespace: 'talent_blogger',

    state: {
        bloggerList: [], // 保存艺人列表原始结构
        bloggerListPage: { page: {}, list: [] },
        formData: {},
        ContractStatusLists: [],
        dictionariesList: [],
    },

    effects: {
        * getContractStatus({ payload }, { call, put }) {
            const result = yield call(getContractStatus, payload.id, payload.data);
            let ContractStatusLists = [];
            if (result.success === true && result.data) {
                const { list } = result.data;
                ContractStatusLists = list;
            }
            yield put({ type: 'save', payload: { ContractStatusLists } });
        },
        * getBloggerList({ payload }, { call, put }) {
            const result = yield call(getBloggerList, payload);
            let bloggerListPage = { page: {}, list: [] };
            let bloggerList = [];
            if (result && result.success === true && result.data) {
                const { list, pageNum, pageSize, total } = result.data;
                bloggerList = list;
                bloggerListPage = {
                    list,
                    page: {
                        pageSize,
                        pageNum,
                        total,
                    },
                };
            }
            yield put({ type: 'save', payload: { bloggerListPage, bloggerList } });
        },
        * getBloggerList2({ payload }, { call, put }) {
            const result = yield call(getBloggerList2, payload);
            let bloggerListPage = { page: {}, list: [] };
            let bloggerList = [];
            if (result && result.success === true && result.data) {
                const { list, pageNum, pageSize, total } = result.data;
                bloggerList = list.reduce((lists, item) => {
                    lists.push({
                        ...item.blogger,
                        bloggerAccountList: item.bloggerAccountList,
                        bloggerUserList: item.bloggerUserList,
                        bloggerRecommendList: item.bloggerRecommendList,
                    });
                    return lists;
                }, []);
                bloggerListPage = {
                    list: bloggerList,
                    page: {
                        pageSize,
                        pageNum,
                        total,
                    },
                };
            }
            yield put({ type: 'save', payload: { bloggerListPage, bloggerList } });
        },
        * addBlogger({ payload }, { call }) {
            const result = yield call(addBlogger, payload.data);
            if (result.success === true) {
                message.success('添加成功');
                yield payload.cb();
            }
        },
        * editBlogger({ payload }, { call }) {
            const result = yield call(editBlogger, payload.id, payload.data);
            if (result.success === true) {
                message.success('修改成功');
                yield payload.cb();
            }
        },
        * getBloggerDetail({ payload }, { call, put }) {
            yield put({ type: 'save', payload: { formData: {} } });
            const result = yield call(getBloggerDetail, payload.id);
            let formData = {};
            if (result.success === true) {
                if (result.data) {
                    let { blogger, bloggerUserList, bloggerAccountList, bloggerAttachmentList = [] } = result.data;
                    blogger = blogger || {};
                    bloggerAccountList = bloggerAccountList || [];
                    bloggerUserList = bloggerUserList || [];
                    bloggerAttachmentList = bloggerAttachmentList.map((item) => {
                        return {
                            domain: item.bloggerAttachmentDomain,
                            name: item.bloggerAttachmentName,
                            value: item.bloggerAttachmentUrl,
                        };
                    });
                    formData = { ...blogger, bloggerUserList, bloggerAccountList, bloggerAttachmentList };
                }
            }
            yield put({ type: 'save', payload: { formData } });
        },
        * getDictionariesList({ payload }, { call, put }) {
            // 获取talent账号列表
            try {
                const result = yield call(getDictionariesList, payload);
                let dictionariesList = [];
                if (result && result.success && result.data) {
                    const list = result.data.list || [];
                    dictionariesList = list.reduce((lists, item) => {
                        const listItem = { id: item.index, name: item.value };
                        lists.push(listItem);
                        return lists;
                    }, []);
                }
                yield put({ type: 'save', payload: { dictionariesList } });
            } catch (error) {
                message.error(error.message);
            }
        },
    },

    reducers: {
        save(state, { payload }) {
            return { ...state, ...payload };
        },
    },

    subscriptions: {},
};
