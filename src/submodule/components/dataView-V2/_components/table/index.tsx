import React, { useContext } from 'react';
import RenderEmpty from '@/submodule/components/RenderEmpty';
import SelfPagination from './pagination';
import { ConfigProvider, Table } from 'antd';
import { TableProps } from 'antd/es/table/index';
import { DataViewContext } from '../../context';



export interface CustomTableProps extends TableProps {
    dataSource?: any[]
    paginationCof?: any
    fetch?: Function

}


const CustomTable = (props: CustomTableProps) => {
    const { fetch, ...others } = props;
    const [propsState, dispatch, effectDispatch] = useContext<any>(DataViewContext);
    const { pagination } = propsState;
    const onChangePage = async (nextPage: number) => {
        await effectDispatch({
            type: 'onChangePageNum',
            payload: { pageNum: nextPage }
        });
    }
    const paginationCof = {
        showTotal: (total: number) => {
            return `共 ${total} 条`;
        },
        showQuickJumper: false,
        showSizeChanger: false,
        onChange: onChangePage,
        ...(props.paginationCof || {})
    }
    let dataSource = Array.isArray(propsState.dataSource) ? propsState.dataSource : [];

    return (
        <ConfigProvider renderEmpty={RenderEmpty}>
            <Table {...others} dataSource={dataSource} pagination={false} />

            {pagination.total > 20 ? <SelfPagination {...paginationCof} {...pagination} /> : null}
        </ConfigProvider>

    )
}
export default CustomTable