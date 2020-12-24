export interface Pagination {    // 分页数据
    pageSize?: number,
    pageNum?: number,
    total?: number,
}
interface State {
    loading: boolean,
    searchForm?: {      // 表单数据 

    },
    pagination: Pagination,
    siftDataArr: [], // 快捷筛选数据列表
    currentSiftNum: number,

}
export const initState: State = {
    loading: false,
    pagination: {
        pageSize: 20,
        pageNum: 1,
    },
    searchForm: undefined,
    siftDataArr: [],
    currentSiftNum: 0,

};
export const reducer = (state: any, action: any) => {
    switch (action.type) {
        case 'onChangePageNum':
            return {
                ...state,
                pagination: {
                    ...state.pagination,
                    pageNum: action.payload.pageNum
                }
            }
        case 'saveFormFiled':
            return {
                ...state,
                searchForm: {
                    ...state.searchForm,
                    ...action.payload.searchForm
                }
            }
        case 'saveState':
            return {
                ...state,
                ...(action.payload || {}),
            }
        case 'onResert':
            return {
                ...initState,
                pagination: { ...initState.pagination, total: action.payload.pagination.total },
                dataSource: action.payload.dataSource,
            }
        default:
            return state;
    }
}
export const effect = (reduceArr: any, registerFun: { fetch: Function }) => {
    const [state, dispatch] = reduceArr;
    const customDispatch = async ({ type, payload = {} }: { type: string; payload?: any }) => {
        let newParams = {};
        switch (type) {
            case 'initData':
                newParams = await registerFun.fetch();
                break;
            case 'onChangePageNum':
                newParams = await registerFun.fetch({ pagination: { ...state.pagination, pageNum: payload.pageNum } })
                break
            case 'onSearch':
                newParams = await registerFun.fetch({ searchForm: { ...state.searchForm, ...(payload.searchForm || {}) }, pagination: initState.pagination })
                break
            case 'onResert':
                newParams = await registerFun.fetch({ searchForm: null, pagination: initState.pagination })
                dispatch({
                    type: 'onResert',
                    payload: {
                        ...newParams
                    }
                })
                return
            default:
                throw new Error();
        }
        dispatch({
            type: 'saveState',
            payload: newParams
        })
    };
    return [state, dispatch, customDispatch];
}
