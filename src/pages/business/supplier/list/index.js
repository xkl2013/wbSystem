import React, { Component } from 'react';
import { connect } from 'dva';
import PageDataView from '@/submodule/components/DataView';
import downRow from '@/assets/downRow.png';
import rightRow from '@/assets/rightRow.png';
import { getSupplierNameList } from '../service';
import { columnsFn, columnsChildFn } from './columnsFn';
import styles from './index.less';

@connect(({ live_supplier, loading }) => {
    return {
        supplierListPage: live_supplier.supplierListPage,
        loading: loading.effects['live_supplier/getSupplierList'],
    };
})
class List extends Component {
    constructor(props) {
        super(props);
        this.pageDataView = React.createRef();
        this.state = {};
    }

    componentDidMount() {
        this.fetch();
    }

    fetch = () => {
        const pageDataView = this.pageDataView.current;
        if (pageDataView) {
            pageDataView.fetch();
        }
    };

    fetchFn = async (beforeFetch) => {
        const data = beforeFetch();
        const { supplierId } = data;
        const newData = {
            ...data,
            supplierName: supplierId ? supplierId.label : undefined,
            supplierId: supplierId ? supplierId.value : undefined,
        };

        this.props.dispatch({
            type: 'live_supplier/getSupplierList',
            payload: { ...newData },
        });
    };

    addFn = () => {
        this.props.history.push({
            pathname: './supplier/add',
        });
    };

    checkData = (val) => {
        this.props.history.push({
            pathname: './supplier/detail',
            query: {
                id: val,
            },
        });
    };

    editData = (val) => {
        this.props.history.push({
            pathname: './supplier/edit',
            query: {
                id: val,
            },
        });
    };

    // 自定义展开icon
    customExpandIcon = (props) => {
        let text;
        if (props.expanded) {
            text = <img width="14px" height="8px" src={downRow} alt="" />;
        } else {
            text = <img width="8px" height="14px" src={rightRow} alt="" />;
        }
        return (
            <div
                onClick={async (e) => {
                    return props.onExpand(props.record, e);
                }}
                style={{ cursor: 'pointer' }}
            >
                {text}
            </div>
        );
    };

    render() {
        const { supplierListPage } = this.props;
        const columns = columnsFn(this);

        return (
            <PageDataView
                ref={this.pageDataView}
                rowKey="supplierId"
                loading={this.props.loading}
                searchCols={[
                    [
                        {
                            key: 'supplierId',
                            placeholder: '请输入供应商名称',
                            className: styles.searchCol,
                            componentAttr: {
                                request: (val) => {
                                    return getSupplierNameList({ supplierName: val });
                                },
                                initDataType: 'onfocus',
                                fieldNames: { value: 'supplierId', label: 'supplierName' },
                            },
                            type: 'associationSearchFilter',
                        },
                        {
                            key: 'supplierBankNo',
                            placeholder: '请输入银行账号',
                            className: styles.searchCol,
                        },
                        {},
                    ],
                ]}
                btns={[
                    {
                        label: '新增',
                        onClick: this.addFn,
                        authority: '/foreEnd/business/supplier/add',
                    },
                ]}
                fetch={this.fetchFn}
                cols={columns}
                pageData={supplierListPage}
                expandIcon={this.customExpandIcon}
                expandedRowRender={(e) => {
                    return columnsChildFn(e);
                }}
            />
        );
    }
}

export default List;
