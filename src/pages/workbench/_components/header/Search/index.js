import React from 'react';
import { Spin, Empty } from 'antd';
import _ from 'lodash';
import InfiniteScroll from 'react-infinite-scroller';
import BIInput from '@/ant_components/BIInput';
import BIDropDown from '@/ant_components/BIDropDown';
import BIMenu from '@/ant_components/BIMenu';
import { returnCards } from '@/pages/workbench/mine/components/view/_utils';
import { getMyPageInfo } from '@/pages/workbench/_components/calendar/services';
import Card from '@/pages/workbench/mine/components/card';
import styles from './index.less';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            params: {
                pageNum: 1,
                pageSize: 10,
                scheduleName: '',
            },
            loading: true,
            list: [], // 数据
            total: 0,
            visible: false,
        };
        this.canupdate = false;
        this.getData = _.debounce(this.getData, 400);
    }

    componentDidMount() {
        this.initData();
    }

    componentWillUnmount() {
        this.canupdate = false;
        window.removeEventListener('click', this.onResetData);
    }

    initData = () => {
        this.canupdate = true;
        window.addEventListener('click', this.onResetData);
    };

    getData = async (params = this.state.params) => {
        if (!this.canupdate) return;
        this.setState({ loading: true });
        const originList = Array.isArray(this.state.list) ? this.state.list : [];
        const propsParams = this.props.willFetch ? this.props.willFetch() : {};
        const newParams = { ...params, ...propsParams };
        const res = await getMyPageInfo(newParams);
        let { list = [] } = (res && res.success && res.data) || {};
        const { total } = (res && res.success && res.data) || {};
        list = originList.concat(list);
        this.setState({
            params,
            total,
            list,
            loading: false,
        });
    };

    onSearch = (e) => {
        const scheduleName = e.target.value;
        const { params } = this.state;
        const newParams = { ...params, pageNum: 1, scheduleName };
        this.setState({ list: [], params: newParams }, () => {
            this.getData(newParams);
        });
    };

    changePage = () => {
        const { params, list, total, loading } = this.state;
        if (list.length >= total || loading) {
            return;
        }
        const newParams = { ...params, pageNum: params.pageNum + 1 };
        this.getData(newParams);
    };

    onResetList = async (id) => {
        // 待优化,手动更改数据状态
        const { list } = this.state;
        list.forEach((ls) => {
            if (ls.id === id) {
                const rowData = Array.isArray(ls.rowData) ? ls.rowData : [];
                ls.rowData = rowData.map((item) => {
                    const newItem = item;
                    if (newItem.colName === 'finishFlag') {
                        newItem.cellValueList = Array.isArray(item.cellValueList) ? item.cellValueList : [];
                        const firstValue = item.cellValueList[0] || {};
                        firstValue.value = String((Number(firstValue.value) + 1) % 2);
                        firstValue.text = String((Number(firstValue.text) + 1) % 2);
                        newItem.cellValueList = [firstValue];
                    }
                    return {
                        ...newItem,
                    };
                });
            }
        });
        this.setState({ list });
    };

    onFocus = () => {
        const { params, visible } = this.state;
        if (visible) return;
        const newParams = { ...params, pageNum: 1, scheduleName: '' };
        this.setState({ params: newParams, total: 0, visible: true }, this.getData);
    };

    onResetData = () => {
        const { params } = this.state;
        const newParams = { ...params, pageNum: 1, scheduleName: '' };
        this.setState({ params: newParams, total: 0, visible: false });
    };

    renderMenu = () => {
        const { list = [], loading, total } = this.state;
        const hasMore = total > list.length;
        return (
            <BIMenu>
                <BIMenu.Item className={styles.item}>
                    {!list.length && !hasMore && !loading ? (
                        <Empty className={styles.noData} />
                    ) : (
                        <div className={styles.wrapUl}>
                            <InfiniteScroll
                                className={styles.scroll}
                                initialLoad={false}
                                pageStart={0}
                                loadMore={this.changePage}
                                hasMore={!loading && hasMore}
                                useWindow={false}
                            >
                                {returnCards(list, []).map((item, index) => {
                                    return (
                                        <div style={{ marginBottom: '10px' }} key={index}>
                                            <Card
                                                data={{ card: item }}
                                                goDetail={this.props.showDetailPanel}
                                                getData={this.onResetList}
                                            />
                                        </div>
                                    );
                                })}
                                {loading && (
                                    <div className={styles.loading}>
                                        <Spin />
                                    </div>
                                )}
                            </InfiniteScroll>
                        </div>
                    )}
                </BIMenu.Item>
            </BIMenu>
        );
    };

    render() {
        const { params, visible } = this.state;
        return (
            <div
                className={styles.inputCls}
                onClick={(e) => {
                    e.persist();
                    e.preventDefault();
                    e.stopPropagation();
                }}
            >
                <BIDropDown
                    // onVisibleChange={this.onVisibleChange}
                    overlay={this.renderMenu}
                    // trigger={['click']}
                    visible={visible}
                >
                    <BIInput
                        value={params.scheduleName}
                        maxLength={20}
                        onChange={this.onSearch}
                        onFocus={this.onFocus}
                        placeholder="搜索"
                        className={styles.searchCls}
                        suffix={<img width={12} alt="" src="https://static.mttop.cn/admin/search.png" />}
                    />
                </BIDropDown>
            </div>
        );
    }
}
export default Search;
