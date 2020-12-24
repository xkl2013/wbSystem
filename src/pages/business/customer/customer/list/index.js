import React, { Component } from 'react';
import { connect } from 'dva';
import PageDataView from '@/submodule/components/DataView';
import { COMPANY_PROERTY, DEALSTATUS, COMPANY_TYPE, COMPANY_RANK } from '@/utils/enum';
import {
    getCustomerBusiness,
    getCustomerList as getTrailsCusAgenList,
    getUserList as getAllUsers,
} from '@/services/globalSearchApi';
import { columnsFn } from './_selfColumn';
import styles from './index.less';

@connect(({ customer_customer, loading }) => {
    return {
        customerListPage: customer_customer.customerListPage,
        industryList: customer_customer.industryList,
        customer_customer,
        loading: loading.effects[('customer_customer/getCustomerControlList', 'customer_customer/getIndustryList')],
    };
})
class Thread extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.fetch();
        this.getINdustry();
    }

    fetch = () => {
        if (this.pageDataView != null) {
            this.pageDataView.fetch();
        }
    };

    fetchData = (beforeFetch) => {
        let data = beforeFetch();
        data = this.formateParams(data);
        this.getData(data);
    };

    formateParams = (params = {}) => {
        const returnObj = {};
        Object.keys(params).forEach((item) => {
            const obj = params[item];
            switch (item) {
                case 'id':
                    returnObj.id = (obj && obj.value) || undefined;
                    returnObj.customerName = (obj && obj.label) || undefined;
                    break;
                case 'businessId':
                    returnObj.businessId = (obj && obj.value) || undefined;
                    returnObj.businessName = (obj && obj.label) || undefined;
                    break;
                case 'customerChargerId':
                    returnObj.customerChargerId = (obj && obj.value) || undefined;
                    returnObj.customerChargerName = (obj && obj.value) || undefined;
                    break;
                case 'customerTypeIdList':
                    returnObj[item] = obj
                        ? obj.map((ls) => {
                            return Number(ls);
                        })
                        : undefined;
                    break;
                case 'customerPropIdList':
                    returnObj[item] = obj
                        ? obj.map((ls) => {
                            return Number(ls);
                        })
                        : undefined;
                    break;
                case 'customerGradeIdList':
                    returnObj[item] = obj
                        ? obj.map((ls) => {
                            return Number(ls);
                        })
                        : undefined;
                    break;
                case 'customerIndustryIdList':
                    returnObj[item] = obj
                        ? obj.map((ls) => {
                            return Number(ls);
                        })
                        : undefined;
                    break;
                case 'customerDealStatusList':
                    returnObj[item] = obj
                        ? obj.map((ls) => {
                            return Number(ls);
                        })
                        : undefined;
                    break;
                default:
                    returnObj[item] = obj;
                    break;
            }
        });
        return returnObj;
    };

    getData = (data) => {
        this.props.dispatch({
            type: 'customer_customer/getCustomerControlList',
            payload: data,
        });
    };

    getINdustry = () => {
        // 获取主营行业复选框选项
        this.props.dispatch({
            type: 'customer_customer/getIndustryList',
        });
    };

    addFn = () => {
        this.props.history.push({
            pathname: './customer/add',
        });
    };

    checkData = (val) => {
        this.props.history.push({
            pathname: './customer/detail',
            query: {
                id: val,
            },
        });
    };

    editData = (val) => {
        this.props.history.push({
            pathname: './customer/edit',
            query: {
                id: val,
            },
        });
    };

    render() {
        const { customerListPage, industryList } = this.props;
        const industryListData = [];
        industryList.map((item) => {
            industryListData.push({
                id: item.id,
                name: item.desc,
            });
        });
        const columns = columnsFn(this);
        return (
            <PageDataView
                ref={(dom) => {
                    this.pageDataView = dom;
                }}
                rowKey="id"
                loading={this.props.loading}
                searchCols={[
                    [
                        {
                            key: 'id',
                            type: 'associationSearchFilter',
                            placeholder: '请输入公司名称',
                            className: styles.searchCls,
                            componentAttr: {
                                request: (val) => {
                                    return getTrailsCusAgenList({
                                        customerName: val || '',
                                    });
                                },
                                initDataType: 'onfocus',
                                fieldNames: { value: 'id', label: 'customerName' },
                            },
                        },
                        {
                            key: 'businessId',
                            type: 'associationSearchFilter',
                            placeholder: '请输入品牌名称',
                            className: styles.searchCls,
                            componentAttr: {
                                request: (val) => {
                                    return getCustomerBusiness({
                                        businessName: val || '',
                                        pageSize: 100,
                                        pageNum: 1,
                                    });
                                },
                                initDataType: 'onfocus',
                                fieldNames: {
                                    value: 'id',
                                    label: (data) => {
                                        return `${data.businessName}-${data.customerIndustryName}`;
                                    },
                                },
                            },
                        },
                        {
                            key: 'customerChargerId',
                            type: 'associationSearchFilter',
                            placeholder: '请输入负责人',
                            className: styles.searchCls,
                            componentAttr: {
                                request: (val) => {
                                    return getAllUsers({ userChsName: val, pageSize: 100, pageNum: 1 });
                                },
                                initDataType: 'onfocus',
                                fieldNames: { value: 'userId', label: 'userChsName' },
                            },
                        },
                    ],
                ]}
                advancedSearchCols={[
                    [
                        {
                            key: 'customerTypeIdList',
                            type: 'checkbox',
                            label: '公司类型',
                            options: COMPANY_TYPE,
                            renderFormat: (value) => {
                                const result = [];
                                value.map((tax) => {
                                    result.push({
                                        id: tax,
                                        name: COMPANY_TYPE.find((item) => {
                                            return String(item.id) === String(tax);
                                        }).name,
                                    });
                                });
                                return result;
                            },
                            setFormat: (value) => {
                                const result = [];
                                value.map((tax) => {
                                    result.push(tax.id);
                                });
                                return result;
                            },
                            getFormat: (value) => {
                                return value.join(',');
                            },
                        },
                    ],
                    [
                        {
                            key: 'customerPropIdList',
                            type: 'checkbox',
                            label: '公司性质',
                            options: COMPANY_PROERTY,
                            renderFormat: (value) => {
                                const result = [];
                                value.map((tax) => {
                                    result.push({
                                        id: tax,
                                        name: COMPANY_PROERTY.find((item) => {
                                            return String(item.id) === String(tax);
                                        }).name,
                                    });
                                });
                                return result;
                            },
                            setFormat: (value) => {
                                const result = [];
                                value.map((tax) => {
                                    result.push(tax.id);
                                });
                                return result;
                            },
                            getFormat: (value) => {
                                return value.join(',');
                            },
                        },
                    ],
                    [
                        {
                            key: 'customerIndustryIdList',
                            type: 'checkbox',
                            label: '主营行业',
                            options: industryListData,
                            renderFormat: (value) => {
                                const result = [];
                                value.map((tax) => {
                                    result.push({
                                        id: tax,
                                        name: industryListData.find((item) => {
                                            return String(item.id) === String(tax);
                                        }).name,
                                    });
                                });
                                return result;
                            },
                            setFormat: (value) => {
                                const result = [];
                                value.map((tax) => {
                                    result.push(tax.id);
                                });
                                return result;
                            },
                            getFormat: (value) => {
                                return value.join(',');
                            },
                        },
                    ],
                    [
                        {
                            key: 'customerGradeIdList',
                            type: 'checkbox',
                            label: '公司级别',
                            options: COMPANY_RANK,
                            renderFormat: (value) => {
                                const result = [];
                                value.map((tax) => {
                                    result.push({
                                        id: tax,
                                        name: COMPANY_RANK.find((item) => {
                                            return String(item.id) === String(tax);
                                        }).name,
                                    });
                                });
                                return result;
                            },
                            setFormat: (value) => {
                                const result = [];
                                value.map((tax) => {
                                    result.push(tax.id);
                                });
                                return result;
                            },
                            getFormat: (value) => {
                                return value.join(',');
                            },
                        },
                    ],
                    [
                        {
                            key: 'customerDealStatusList',
                            type: 'checkbox',
                            label: '成交状态',
                            options: DEALSTATUS,
                            renderFormat: (value) => {
                                const result = [];
                                value.map((tax) => {
                                    result.push({
                                        id: tax,
                                        name: DEALSTATUS.find((item) => {
                                            return String(item.id) === String(tax);
                                        }).name,
                                    });
                                });
                                return result;
                            },
                            setFormat: (value) => {
                                const result = [];
                                value.map((tax) => {
                                    result.push(tax.id);
                                });
                                return result;
                            },
                            getFormat: (value) => {
                                return value.join(',');
                            },
                        },
                    ],
                ]}
                btns={[
                    {
                        label: '新增',
                        onClick: this.addFn,
                        authority: '/foreEnd/business/customer/customer/add',
                    },
                ]}
                fetch={this.fetchData}
                cols={columns}
                pageData={customerListPage}
            />
        );
    }
}

export default Thread;
