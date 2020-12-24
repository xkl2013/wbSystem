import React, { Component } from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import PageDataView from '@/components/DataView';
import { columnsFn } from './_selfColumn';
import styles from './index.less';
import BIModal from '@/ant_components/BIModal';
import DetailModal from '../detailModal';
import { delCustomization } from '../../services';

@connect(({ admin_data }) => {
    return {
        customizationList: admin_data.customizationList,
        dataTree: admin_data.dataTree,
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

    fetchData = (beforeFetch) => {
        const data = beforeFetch();
        this.props.dispatch({
            type: 'admin_data/getCustomizationList',
            payload: data,
        });
    };

    getDataTree = (cb) => {
        // 获取数据树
        this.props.dispatch({
            type: 'admin_data/getDataTree',
            payload: {
                cb,
            },
        });
    };

    addFn = () => {
        // 新增
        this.getDataTree(() => {
            if (this.detailModal) {
                this.detailModal.showModal(1);
            }
        });
    };

    checkData = (id) => {
        // 查看
        this.getDataTree(() => {
            if (this.detailModal) {
                this.detailModal.showModal(2, id);
            }
        });
    };

    editData = (id) => {
        // 编辑
        this.getDataTree(() => {
            if (this.detailModal) {
                this.detailModal.showModal(3, id);
            }
        });
    };

    delData = (id) => {
        // 删除
        BIModal.confirm({
            title: '删除',
            content: '确认要删除这条数据吗？',
            autoFocusButton: null,
            onOk: () => {
                return this.delCustomizationFun(id);
            },
        });
    };

    delCustomizationFun = async (id) => {
        // 删除方法
        const res = await delCustomization(id);
        if (res && res.success) {
            message.success('删除成功');
            this.fetch();
        }
    };

    updateList = () => {
        // 更新列表
        this.fetch();
    };

    render() {
        const data = this.props.customizationList;
        const columns = columnsFn(this);
        return (
            <div className={styles.wrap}>
                <PageDataView
                    ref={(dom) => {
                        this.pageDataView = dom;
                    }}
                    rowKey="id"
                    searchCols={[[{ key: 'businessSpecialName', placeholder: '姓名/角色/组织' }]]}
                    btns={[{ label: '添加定制盘', onClick: this.addFn, authority: '/admin/orgStructure/data' }]}
                    fetch={this.fetchData}
                    cols={columns}
                    pageData={data}
                />
                <DetailModal
                    ref={(dom) => {
                        this.detailModal = dom;
                    }}
                    dataTree={this.props.dataTree}
                    updateList={this.updateList}
                />
            </div>
        );
    }
}

export default ComList;
