import React, { useContext } from 'react';
import SearchView from '../searchView';
import { DataViewContext } from '../../context';

export type searchCols = {
    key: string,
    type: string
}
interface Props {
    searchCols?: searchCols[];
    advancedSearchCols?: searchCols[];
    searchForm?: any;
}
const SearchForm = (props: Props) => {
    const [propsState, dispatch, effectDispatch] = useContext(DataViewContext);
    const { searchCols, advancedSearchCols, searchForm } = props;
    const search = () => {

    }
    // 更改查询条件
    const _changeSearchForm = (changedValues: any, allValues: any) => {
        dispatch({
            type: 'saveFormFiled',
            payload: { searchForm: allValues }
        })
    }
    const onResert = () => {
        effectDispatch({
            type: 'onResert'
        });
    }
    const onSubmit = () => {
        effectDispatch({
            type: 'onSearch'
        });
    }
    return (
        <SearchView
            onResert={onResert}
            onSubmit={onSubmit}
            searchForm={searchForm}
            searchCols={searchCols}
            advancedSearchCols={advancedSearchCols}
            search={search}
            onChangeParams={_changeSearchForm}
        />
    )
}
export default SearchForm