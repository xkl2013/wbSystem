// 模块增加评论需要在config中配置模块名和接口名
// service下的comment写接口
// model下的model写数据层
import React, { Component } from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd';
import memoize from 'memoize-one';
import { PAGINATION } from '@/utils/constants';
import AuthButton from '@/components/AuthButton';
import { commentURL } from '@/utils/reg';
import { handleShimoURL } from '@/utils/utils';
// import { checkoutModel } from './config';
import { commentList, myCommentList } from '@/services/comment';
import styles from './index.less';
import Editor from '../editor';
import SelfPagination from '../SelfPagination';
import ListView from './components/listView';

const { TabPane } = Tabs;
// const config = { 1:艺人 2:博主 3:客户 4:线索 5:立项 6:项目 7:合同 8:审批 9：费用报销 10:费用申请}

@connect(({ admin_comment, loading }) => {
    return {
        datalist: admin_comment.datalist,
        dataMylist: admin_comment.dataMylist,
        dataSource: Array.isArray(admin_comment.datalist.list) ? admin_comment.datalist.list : [],
        dataSourceMy: Array.isArray(admin_comment.dataMylist.list) ? admin_comment.dataMylist.list : [],
        loading: loading.effects['admin_comment/commentAdd'],
    };
})
class SelfProgress extends Component {
    constructor(props) {
        super(props);
        const { datalist, dataSource, dataSourceMy } = props;
        this.state = {
            pagination: {
                pageSize: (datalist && datalist.pageSize) || PAGINATION.pageSize,
                total: (datalist && datalist.total) || PAGINATION.total,
                current: (datalist && datalist.pageNum) || PAGINATION.current,
                onChange: (nextPage) => {
                    this.fetchPage(nextPage, 1);
                },
                showPageSize: 10,
                showQuickJumper: true,
            },
            paginationMy: {
                pageSize: (datalist && datalist.pageSize) || PAGINATION.pageSize,
                total: (datalist && datalist.total) || PAGINATION.total,
                current: (datalist && datalist.pageNum) || PAGINATION.current,
                onChange: (nextPage) => {
                    this.fetchPage(nextPage, 1);
                },
                showPageSize: 10,
                showQuickJumper: true,
            },
            dataSource: this.changeData(dataSource),
            dataSourceMy: this.changeData(dataSourceMy),
            datalist: {},
            dataMylist: {},
        };
        this.changeCommonMomoize = memoize(this.changeCommon);
    }

    componentDidMount() {
        this.getDatalist({ pageSize: 10, pageNum: 1 }, 1);
        this.getDatalist({ pageSize: 10, pageNum: 1 }, 2);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.type !== 'single') {
            if (this.props.dataMylist !== nextProps.dataMylist) {
                const dataSourceMy = this.changeData(nextProps.dataSourceMy);
                this.setState({
                    dataSourceMy,
                    paginationMy: {
                        pageSize: nextProps.dataMylist && nextProps.dataMylist.pageSize,
                        total: nextProps.dataMylist && nextProps.dataMylist.total,
                        current: nextProps.dataMylist && nextProps.dataMylist.pageNum,
                        onChange: (nextPage) => {
                            this.fetchPage(nextPage, 2);
                        },
                        showPageSize: 10,
                        showQuickJumper: true,
                    },
                });
            }
            if (this.props.datalist !== nextProps.datalist) {
                const dataSource = this.changeData(nextProps.dataSource);
                this.setState({
                    dataSource,
                    pagination: {
                        pageSize: nextProps.datalist && nextProps.datalist.pageSize,
                        total: nextProps.datalist && nextProps.datalist.total,
                        current: nextProps.datalist && nextProps.datalist.pageNum,
                        onChange: (nextPage) => {
                            this.fetchPage(nextPage, 1);
                        },
                        showPageSize: 10,
                        showQuickJumper: true,
                    },
                });
            }
        } else {
            this.getDatalist({ pageSize: 10, pageNum: 1 }, 1);
            this.getDatalist({ pageSize: 10, pageNum: 1 }, 2);
        }
    }

    // 翻页功能
    fetchPage = (current, tabKey) => {
        this.state.pagination.current = current;
        this.getDatalist({ pageSize: 10, pageNum: current }, tabKey);
    };

    fetchData = (val = {}, calback) => {
        const { id, interfaceName } = this.props;
        this.props.dispatch({
            type: 'admin_comment/commentAdd',
            payload: {
                param: {
                    commentBusinessId: id,
                    commentBusinessType: Number(interfaceName),
                    ...val,
                },
                calback,
            },
        });
    };

    getDatalist = async (obj, tabKey) => {
        const param = { ...obj, sort: 2, commentType: 0 }; // 2-倒序，1-正序排列
        const { id, interfaceName, type } = this.props;
        if (tabKey && Number(tabKey) === 2) {
            if (type === 'single') {
                const res = await myCommentList({
                    commentBusinessId: id,
                    commentBusinessType: Number(interfaceName),
                    ...param,
                });
                if (res && res.data && res.data.list) {
                    this.setState({
                        dataMylist: res.data,
                        dataSourceMy: this.changeData(res.data.list),
                    });
                }
            } else {
                this.props.dispatch({
                    type: 'admin_comment/myCommentList',
                    payload: {
                        commentBusinessId: id,
                        commentBusinessType: Number(interfaceName),
                        ...param,
                    },
                });
            }
        } else if (type === 'single') {
            const res = await commentList({
                commentBusinessId: id,
                commentBusinessType: Number(interfaceName),
                ...param,
            });
            if (res && res.data && res.data.list) {
                this.setState({
                    datalist: res.data,
                    dataSource: this.changeData(res.data.list),
                });
            }
        } else {
            this.props.dispatch({
                type: 'admin_comment/commentList',
                payload: {
                    commentBusinessId: id,
                    commentBusinessType: Number(interfaceName),
                    ...param,
                },
            });
        }
    };

    tabChange = (e) => {
        // tab切换
        this.getDatalist({ pageSize: 10, pageNum: 1 }, e);
    };

    changeData = (data = []) => {
        return data.map((item) => {
            return {
                ...item,
                commentContent: this.changeCommon(item.commentContent),
            };
        });
    };

    changeCommon = (content = '') => {
        // 转换评论内容，高亮显示@人
        // .replace(commenUrlReg, "<a>$& </a>");
        return content.replace(/\u202a([^\u202a\u2005]+?)\u2005/g, '<span>$1 </span>').replace(commentURL, (url) => {
            return `<a href=${handleShimoURL(url)} target='_blank'>${url}</a>`;
        });
    };

    render() {
        const { pagination, paginationMy, dataSource, dataSourceMy } = this.state;
        return (
            <div className={styles.pageWrap}>
                <div className={styles.dividerCls} />
                <div className={styles.contentWrap}>
                    <div className={styles.titleCls}>
                        <Tabs defaultActiveKey="1" onChange={this.tabChange}>
                            <TabPane
                                tab={`全部评论 (${
                                    this.props.type === 'single'
                                        ? this.state.datalist.total
                                        : this.props.datalist.total || 0
                                })`}
                                key="1"
                            >
                                <div className={styles.contentCls}>
                                    {this.props.authority ? (
                                        <AuthButton authority={this.props.authority}>
                                            <div className={styles.inputCls}>
                                                <Editor
                                                    onClick={(val, cal) => {
                                                        return this.fetchData(val, cal);
                                                    }}
                                                />
                                            </div>
                                        </AuthButton>
                                    ) : (
                                        <div className={styles.inputCls}>
                                            <Editor
                                                onClick={(val, cal) => {
                                                    return this.fetchData(val, cal);
                                                }}
                                            />
                                        </div>
                                    )}
                                    <ListView dataSource={dataSource} />
                                </div>

                                <SelfPagination {...pagination} />
                            </TabPane>
                            <TabPane
                                tab={`我的评论 (${
                                    this.props.type === 'single'
                                        ? this.state.dataMylist.total
                                        : this.props.dataMylist.total || 0
                                })`}
                                key="2"
                            >
                                <div className={styles.contentCls}>
                                    {this.props.authority ? (
                                        <AuthButton authority={this.props.authority}>
                                            <div className={styles.inputCls}>
                                                <Editor
                                                    onClick={(val, cal) => {
                                                        return this.fetchData(val, cal);
                                                    }}
                                                />
                                            </div>
                                        </AuthButton>
                                    ) : (
                                        <div className={styles.inputCls}>
                                            <Editor
                                                onClick={(val, cal) => {
                                                    return this.fetchData(val, cal);
                                                }}
                                            />
                                        </div>
                                    )}
                                    <ListView dataSource={dataSourceMy} />
                                </div>
                                <SelfPagination {...paginationMy} />
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
            </div>
        );
    }
}

export default SelfProgress;
