import React, { Component } from 'react';
import { connect } from 'dva';
import PageDataView from '@/components/DataView';
import BIModal from '@/ant_components/BIModal';
import { str2intArr } from '@/utils/utils';
import { columnsFn } from './_selfColumn';
import styles from './index.less';

@connect(({ admin_approval_group }) => {
    return {
        flowsListPage: admin_approval_group.flowsListPage,
    };
})
class Group extends Component {
    constructor(props) {
        super(props);
        this.pageDataView = React.createRef();
        this.state = {
            pageNum: 1,
        };
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

    fetchFn = (beforeFetch) => {
        const data = beforeFetch();
        this.setState({ pageNum: data.pageNum });
        if (data.companyName) {
            data.companyName = data.companyName.label;
        }
        if (data.companyTaxTypeList) {
            data.companyTaxTypeList = str2intArr(data.companyTaxTypeList);
        }
        this.props.dispatch({
            type: 'admin_approval_group/getFlowsList',
            payload: data,
        });
    };

    addFn = () => {
        this.props.history.push({
            pathname: './group/add',
        });
    };

    // 上下移动
    moveFlowGroup = (val, type) => {
        this.props.dispatch({
            type: 'admin_approval_group/flowGroupSort',
            payload: {
                data: {
                    id: val.id,
                    type,
                },
                pageNum: this.state.pageNum,
            },
        });
    };

    editData = (val) => {
        this.props.history.push({
            pathname: './group/edit',
            query: {
                id: val,
            },
        });
    };

    // 删除分组接口
    delFeatch = (id) => {
        const that = this;
        this.props.dispatch({
            type: 'admin_approval_group/delGroup',
            payload: {
                id,
                cb: that.fetch,
            },
        });
    };

    delData = async (record) => {
        if (record.approvalFlows.length) {
            BIModal.confirm({
                title: '删除分组',
                content: '该审批分组下有审批流，请移动到其他分组后，才可删除该审批分组。',
                autoFocusButton: null,
                onOk: () => {},
            });
        } else this.delFeatch(record.id);
    };

    render() {
        const data = this.props.flowsListPage;
        const columns = columnsFn(this);
        return (
            <div className={styles.wrap}>
                <PageDataView
                    ref={this.pageDataView}
                    rowKey="id"
                    hideForm={true}
                    btns={[{ label: '新增分组', onClick: this.addFn, authority: '/admin/orgStructure/company/add' }]}
                    fetch={this.fetchFn}
                    cols={columns}
                    pageData={data}
                />
            </div>
        );
    }
}

export default Group;
