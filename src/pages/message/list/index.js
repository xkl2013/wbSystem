import React from 'react';
import { connect } from 'dva';
import InfiniteScroll from 'react-infinite-scroller';
import BISpin from '@/ant_components/BISpin';
import { getParams, setParams } from '../_utils/handleParams';
import MenuList from '../component/menuPanel';
import Header from '../component/header';
import styles from './styles.less';
import ListView from '../component/listView';
import { getMessageList, getMessageDetail } from '../../../services/news';
import CommentBox from '../component/comment';

@connect(({ settings, message }) => {
    return {
        settings: settings || {},
        message,
        messageCountList: message.messageCountList,
        messageTypeList: message.messageTypeList,
        pushMessage: message.pushMessage,
    };
})
class Message extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            commentItem: null,
            commentVisible: false,
            listParams: {
                messageModule: '',
                messageType: '',
            },
            pages: {
                pageSize: 15,
                pageNum: 1,
            },
            total: null,
            messageList: [],
            loading: false,
        };
    }

    componentDidMount() {
        this.initData();
        window.addEventListener('click', this.handleCommentBox);
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.pushMessage) !== JSON.stringify(this.props.pushMessage)) {
            this.handlePushMessage(nextProps.pushMessage);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.handleCommentBox);
    }

    initData = () => {
        let { listParams } = this.state;
        const { pages } = this.state;
        listParams = getParams(listParams, this.props);
        listParams.messageModule = 1;
        this.setState({ listParams }, () => {
            this.getMessageList(listParams, pages);
            this.getMessageType(listParams);
        });
    };

    handleCommentBox = () => {
        this.setState({ commentVisible: false });
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
            const newList = [];
            list.forEach((el) => {
                if (
                    !messageList.find((ls) => {
                        return ls.messageId === el.messageId;
                    })
                ) {
                    newList.push(el);
                }
            });
            this.setState({ total: data.total, messageList: [...messageList, ...newList] });
        }
        this.setState({ loading: false });
    };

    getMessageType = (listParams = {}) => {
        if (!listParams.messageModule) return;
        this.props.dispatch({
            type: 'message/getMessageTypeList',
            payload: {
                messageModule: listParams.messageModule,
            },
        });
    };

    handlePushMessage = async (pushMessage) => {
        const { messageId, messageModule, messageType } = pushMessage || {};
        const { listParams } = this.state;
        if (String(messageModule) === String(listParams.messageModule)) {
            if (
                !listParams.messageType
                || Number(listParams.messageType) === 0
                || String(messageType) === String(listParams.messageType)
            ) {
                await this.getMessageDetail(messageId);
            }
        }
    };

    getMessageDetail = async (messageId) => {
        const response = await getMessageDetail(messageId);
        if (response && response.success) {
            const data = response.data || {};
            // this.setState({ messageList: [data, ...this.state.messageList] });
            this.setState((preState) => {
                const messageList = preState.messageList;
                return { messageList: [data, ...messageList] };
            });
        }
    };

    saveParams = (listParams) => {
        const pages = { pageSize: 10, pageNum: 1 };
        this.setState({ listParams, pages, total: null, messageList: [] });
        setParams(listParams, this.props);
        this.getMessageList(listParams, pages);
    };

    changeMessageType = (messageType) => {
        const listParams = { ...this.state.listParams, messageType };
        this.saveParams(listParams);
    };

    onChangeMessageModule = (messageModule) => {
        let messageType = this.state.listParams.messageType;
        if (messageModule !== this.state.listParams.messageModule) {
            messageType = '';
            this.getMessageType({ messageType, messageModule });
        }
        const listParams = { messageType, messageModule };
        this.saveParams(listParams);
    };

    scrollToData = () => {
        let { pages } = this.state;
        const { listParams } = this.state;
        pages = { ...pages, pageNum: pages.pageNum + 1 };
        this.setState({ pages }, () => {
            this.getMessageList(listParams, pages);
        });
    };

    onReply = (commentItem) => {
        this.setState({
            commentItem,
            commentVisible: true,
        });
    };

    setMessageStatus = (messageItem) => {
        const { messageList } = this.state;
        const newList = messageList.map((ls) => {
            if (ls.messageId === messageItem.messageId) {
                ls.messageStatus = 1;
            }
            return ls;
        });
        /* eslint-disable react/no-access-state-in-setstate */
        this.setState({ messageList: newList });
        this.props.dispatch({
            type: 'message/updateMessageStatus',
            payload: {
                messageModule: messageItem.messageModule,
                messageStatus: 1,
                messageIds: [messageItem.messageId],
            },
        });
    };

    onComment = () => {
        this.setState({
            commentItem: null,
            commentVisible: false,
        });
    };

    render() {
        let messageCountList = this.props.messageCountList || [];
        // 
        messageCountList = messageCountList.filter(ls => ls.messageModule !== 2 && ls.messageModule !== 3 && ls.messageModule !== 4 && ls.messageModule !== 5)
        console.log(messageCountList)
        const {
            total, messageList, loading, listParams, commentVisible, commentItem,
        } = this.state;
        return (
            <div className={styles.wrap}>
                <MenuList
                    listParams={listParams}
                    onChangeMessageModule={this.onChangeMessageModule}
                    history={this.props.history}
                    style={{ marginLeft: this.props.settings.siderWidth }}
                    messageCountList={messageCountList}
                />
                <div className={styles.list}>
                    <div className={styles.listWrap}>
                        <Header
                            messageTypeList={this.props.messageTypeList}
                            settings={this.props.settings}
                            listParams={listParams}
                            messageCountList={messageCountList}
                            changeMessageType={this.changeMessageType}
                        />
                        <div className={styles.split} style={{ height: this.props.settings.headerHeight }} />
                        <div
                            className={styles.listView}
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            <div className={styles.listViewContainer}>
                                <InfiniteScroll
                                    initialLoad={false}
                                    pageStart={1}
                                    loadMore={this.scrollToData}
                                    hasMore={!loading && total > messageList.length}
                                    useWindow={false}
                                >
                                    <ListView
                                        messageList={messageList}
                                        onReply={this.onReply}
                                        setMessageStatus={this.setMessageStatus}
                                    />
                                </InfiniteScroll>
                            </div>
                            {commentVisible ? (
                                <CommentBox
                                    onCancel={() => {
                                        return this.setState({ commentVisible: false });
                                    }}
                                    callback={this.onComment}
                                    commentItem={commentItem}
                                />
                            ) : null}
                        </div>

                        {loading ? (
                            <div className={styles.spin}>
                                <BISpin />
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        );
    }
}
export default Message;
