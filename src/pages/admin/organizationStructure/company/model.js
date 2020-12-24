import {
    getCompanyList, addCompany, editCompany, getCompanyDetail, delCompany
} from './services';

export default {
    namespace: 'admin_company',

    state: {
        companyListPage: {page: {}, list: []}, // 保存组织原始结构
        formData: {}
    },

    effects: {
        * getCompanyListPage({payload}, {call, put}) {
            const result = yield call(getCompanyList, payload);
            let companyListPage = {
                list: [],
                page: {}
            };
            if (result.success === true && result.data) {
                const {list, pageNum, pageSize, total} = result.data;
                companyListPage = {
                    list: list,
                    page: {
                        pageSize: pageSize,
                        pageNum,
                        total
                    }
                };
            }
            yield put({type: 'save', payload: {companyListPage}});
        },
        * addCompany({payload}, {call, put}) {
            const result = yield call(addCompany, payload.data);
            if (result.success === true) {
                yield typeof payload.cb == 'function' && payload.cb();
            }
        },
        * getCompanyDetail({payload}, {call, put}) {
            yield put({type: 'save', payload: {formData:{}}});
            const result = yield call(getCompanyDetail, payload.id);
            let formData = {};
            if (result.success === true && result.data) {
                let {company, companyBankList} = result.data;
                company = company || {};
                companyBankList = companyBankList || [];
                companyBankList.map(item => {
                    item.companyName = company.companyName;
                })
                formData = {...company, companyBankList};
            }
            yield put({type: 'save', payload: {formData}});
        },
        * editCompany({payload}, {call, put}) {
            const result = yield call(editCompany, payload.id, payload.data);
            if (result.success === true) {
                yield typeof payload.cb == 'function' && payload.cb();
            }
        },
        * delCompany({payload}, {call, put}) {
            const result = yield call(delCompany, payload.id);
            if (result.success === true) {
                yield typeof payload.cb == 'function' && payload.cb();
            }
        },
    },

    reducers: {
        save(state, {payload}) {
            return {...state, ...payload};
        },
    },

    subscriptions: {},
};
