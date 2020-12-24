import React, { Component } from 'react';
import { connect } from 'dva';
import PageDataView from '@/components/DataView';
import { TAX_TYPE } from '@/utils/enum';
import BIModal from '@/ant_components/BIModal';
import { str2intArr } from '@/utils/utils';
import { columnsFn } from './_selfColumn';
import styles from './index.less';
import { getCompanyList } from '../services';

@connect(({ admin_company }) => {
    return {
        companyListPage: admin_company.companyListPage,
    };
})
class ComList extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.fetch();
    }

    fetch = () => {
        if (this.pageDataView != null) {
            this.pageDataView.fetch();
        }
    };

    fetchFn = (beforeFetch) => {
        const data = beforeFetch();
        if (data.companyName) {
            data.companyName = data.companyName.label;
        }
        if (data.companyTaxTypeList) {
            data.companyTaxTypeList = str2intArr(data.companyTaxTypeList);
        }
        this.props.dispatch({
            type: 'admin_company/getCompanyListPage',
            payload: data,
        });
    };

    addFn = () => {
        this.props.history.push({
            pathname: './company/add',
        });
    };

    checkData = (val) => {
        this.props.history.push({
            pathname: './company/detail',
            query: {
                id: val,
            },
        });
    };

    editData = (val) => {
        this.props.history.push({
            pathname: './company/edit',
            query: {
                id: val,
            },
        });
    };

    delData = async (record) => {
        const that = this;
        BIModal.confirm({
            title: '删除公司',
            content: `确认要删除名为${record.companyName}的公司吗？`,
            autoFocusButton: null,
            onOk: () => {
                this.props.dispatch({
                    type: 'admin_company/delCompany',
                    payload: {
                        id: record.companyId,
                        cb: that.fetch,
                    },
                });
            },
        });
    };

    render() {
        const data = this.props.companyListPage;
        const columns = columnsFn(this);
        return (
            <div className={styles.wrap}>
                <PageDataView
                    ref={(e) => {
                        this.pageDataView = e;
                    }}
                    // ref="pageDataView"
                    rowKey="companyId"
                    searchCols={[
                        [
                            {
                                key: 'companyName',
                                type: 'associationSearchFilter',
                                placeholder: '请输入公司名称',
                                className: styles.searchCls,
                                componentAttr: {
                                    request: (val) => {
                                        return getCompanyList({ pageNum: 1, pageSize: 50, companyName: val });
                                    },
                                    initDataType: 'onfocus',
                                    fieldNames: { value: 'companyId', label: 'companyName' },
                                },
                            },
                            {
                                key: 'companyTaxpayerNumber',
                                placeholder: '请输入纳税人识别号',
                                className: styles.searchCls,
                            },
                            {},
                        ],
                        [
                            {
                                key: 'companyTaxTypeList',
                                type: 'checkbox',
                                label: '税务资质',
                                options: TAX_TYPE,
                            },
                        ],
                    ]}
                    btns={[{ label: '新增', onClick: this.addFn, authority: '/admin/orgStructure/company/add' }]}
                    fetch={this.fetchFn}
                    cols={columns}
                    pageData={data}
                />
            </div>
        );
    }
}

export default ComList;
