import React from 'react';
import { Icon, Avatar } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import lodash from 'lodash';
import Model from '@/ant_components/BIModal';
import Input from '@/ant_components/BIInput';
import { getMessageList, getSearchMessageCount } from '@/services/news';
import BISpin from '@/ant_components/BISpin';
import { highlight } from '../../_utils/utils';
import MenuList from '../menuList';
import ListView from '../listView';

import styles from './styles.less';

export default class SearchModel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listParams: {
                messageModule: '',
                messageType: '',
                searchMsgContent: props.searchMsgContent || '',
            },
            pages: {
                pageSize: 10,
                pageNum: 1,
            },
            total: null,
            messageList: [],
            searchMessageCountList: [],
            loading: false,
        };
        this.onSearch = lodash.debounce(this.onSearch, 200);
    }

    componentDidMount() {
        this.initData();
    }

    initData = () => {
        const listParams = { ...this.state.listParams };
        this.saveParams(listParams);
        this.getSearchMessagesCount(listParams.searchMsgContent);
    };

    saveParams = (listParams) => {
        const pages = { pageSize: 10, pageNum: 1 };
        this.setState({ listParams, pages, total: null, messageList: [] }, () => {
            this.getMessageList(listParams, pages);
        });
    };

    getSearchMessagesCount = async (searchMsgContent) => {
        let searchMessageCountList = [];
        const response = await getSearchMessageCount({ searchMsgContent });
        if (response && response.success) {
            searchMessageCountList = Array.isArray(response.data) ? response.data : [];
        }
        this.setState({ searchMessageCountList });
    };

    getMessageList = async (listParams = this.state.listParams, pages = this.state.pages) => {
        this.setState({ loading: true });
        const messageType = Number(listParams.messageType) || null;
        const messageModule = Number(listParams.messageModule) || null;
        const response = await getMessageList({ ...listParams, messageType, messageModule, ...pages });
        const { messageList } = this.state;
        if (response && response.success) {
            const data = response.data || {};
            const list = Array.isArray(data.list) ? data.list : [];
            this.setState({ total: data.total, messageList: [...messageList, ...list] });
        }
        this.setState({ loading: false });
    };

    onChangeMessageModule = ({ key }) => {
        const messageModule = key;
        if (messageModule === this.state.listParams.messageModule) return;
        const listParams = { ...this.state.listParams, messageModule };
        this.saveParams(listParams);
    };

    onSearch = (e) => {
        const val = e.target.value;
        const listParams = { ...this.state.listParams, searchMsgContent: val };
        this.saveParams(listParams);
        this.getSearchMessagesCount(val);
    };

    scrollToData = () => {
        this.setState((prevState) => {
            const pages = { ...prevState.pages, pageNum: prevState.pages.pageNum + 1 };
            this.getMessageList(prevState.listParams, pages);
            return { pages };
        });
    };

    onCancel = () => {
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    };

    renderMessageContent = (item) => {
        const messageContent = item.messageContent || '';
        const searchMsgContent = this.state.listParams.searchMsgContent;
        if (!searchMsgContent) return item.messageContent;
        return (
            <span
                dangerouslySetInnerHTML={{
                    __html: highlight(messageContent, searchMsgContent, 'span', styles.highlight),
                }}
            />
        );
    };

    renderLinkItem = (ls) => {
        return (
            <>
                <span className={styles.avatar}>
                    <Avatar src={ls.messageIcon} />
                </span>
                <div className={styles.metaContent}>
                    <div className={styles.metaContentTitle}>{ls.messageModuleName}</div>
                    <div className={styles.metaContentDes}>
                        {ls.messageCount || 0}
                        条相关消息
                    </div>
                </div>
            </>
        );
    };

    render() {
        const { searchMessageCountList, loading, total, messageList, listParams } = this.state;
        return (
            <div className={styles.wrap}>
                <Model
                    width={1278}
                    // visible={true}
                    visible={this.props.visible}
                    onCancel={this.onCancel}
                    footer={null}
                    bodyStyle={{ padding: 0 }}
                >
                    <div className={styles.content}>
                        <div className={styles.header}>
                            <Input
                                // value={this.state.searchMsgContent}
                                defaultValue={listParams.searchMsgContent}
                                className={styles.input}
                                onChange={(e) => {
                                    e.persist();
                                    this.onSearch(e);
                                }}
                                prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            />
                        </div>
                        <div className={styles.panelBox}>
                            <div className={styles.menuList}>
                                <MenuList
                                    renderLinkItem={this.renderLinkItem}
                                    selectedKeys={[listParams.messageModule]}
                                    messageCountList={searchMessageCountList}
                                    onSelect={this.onChangeMessageModule}
                                />
                            </div>
                            <div className={styles.listView}>
                                <div className={styles.listViewContainer}>
                                    <InfiniteScroll
                                        initialLoad={false}
                                        pageStart={1}
                                        loadMore={this.scrollToData}
                                        hasMore={!loading && total > messageList.length}
                                        useWindow={false}
                                    >
                                        <ListView
                                            messageContent={this.renderMessageContent}
                                            messageList={this.state.messageList}
                                            isHideReplyIcon={true}
                                        />
                                    </InfiniteScroll>
                                </div>
                            </div>
                            {loading ? (
                                <div className={styles.spin}>
                                    <BISpin />
                                </div>
                            ) : null}
                        </div>
                    </div>
                </Model>
            </div>
        );
    }
}
