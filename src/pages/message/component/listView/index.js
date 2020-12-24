import React from 'react';
import approvalIcon from '@/assets/approvalIcon.png';
import RenderEmpty from '@/components/RenderEmpty';
import IconFont from '@/components/CustomIcon/IconFont';
import TagList from '@/components/editor/Tag/tagList';
import { handleDateTime, setDateGroup, checkoutShowText } from '../../_utils/utils';
import styles from './styles.less';
import toDetail from '../detail';
import DescCustomization from './descCustomization/index.tsx';

class ListView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
        };
    }

    componentDidMount() {
        this.formateData(this.props.messageList);
    }

    componentWillReceiveProps(next) {
        if (JSON.stringify(next.messageList) !== JSON.stringify(this.props.messageList)) {
            this.formateData(next.messageList);
        }
    }

    formateData = (data) => {
        if (!Array.isArray(data)) return;
        this.setState({ dataSource: setDateGroup(data) });
    };

    renderTime = (item) => {
        return <span className={styles.dateTime}>{handleDateTime(item.messageDatetime)}</span>;
    };

    renderReadSymbol = (item) => {
        // 定制化开发,当财务消息和评论消息时,显示消息状态
        if (item.messageModule === 5 || item.messageModule === 2) {
            return item.messageStatus > 0 ? null : <span className={styles.statusPoint} />;
        }
        return null;
    };

    checkDetail = (messageObj) => {
        // 今日待办
        if (messageObj.messageModule === 1) {
            return;
        }
        if (this.props.setMessageStatus && messageObj.messageStatus === 0) {
            // 定制化需求,当评论消息和财务消息时生效
            if (messageObj.messageModule === 5 || messageObj.messageModule === 2) {
                this.props.setMessageStatus(messageObj);
            }
        }
        toDetail({
            messageObj,
            history: this.props.history,
        });
    };

    checkReply = (message) => {
        const { isHideReplyIcon } = this.props;
        return !isHideReplyIcon && message.messageModule === 2;
    };

    renderAvatar = (item) => {
        return (
            <div className={styles.itemMetaAvatar}>
                <span className={styles.avatarCrrcle}>
                    <img src={item.messageIcon || approvalIcon} alt="" />
                </span>
            </div>
        );
    };

    renderListContent = (item) => {
        const messageContent = this.props.messageContent ? this.props.messageContent(item) : item.messageContent;
        const commentTags = Array.isArray(item.messageTags) ? item.messageTags : [];

        // 不需要点击小手
        const noNeedCursor = item.messageModule === 1;
        return (
            <div
                className={styles.metaContent}
                onClick={() => {
                    return this.checkDetail(item);
                }}
                style={{ cursor: noNeedCursor ? 'default' : 'pointer' }}
            >
                <h4 className={styles.metaTitle}>
                    {item.messageTitle}
                    {this.renderTime(item)}
                    {this.renderReadSymbol(item)}
                </h4>
                <div className={styles.metaDescription}>
                    {/* {messageContent} */}
                    <DescCustomization item={item} defaultContent={messageContent} />
                </div>
                {this.checkReply(item) ? (
                    <span
                        className={styles.point}
                        onClick={(e) => {
                            e.stopPropagation();
                            this.props.onReply(item);
                        }}
                    >
                        <IconFont type="iconxiaoxiguanlix1" style={{ fontSize: '18px', color: '#D9DDE1' }} />
                    </span>
                ) : null}

                <TagList tagList={commentTags} />
            </div>
        );
    };

    renderSplitLine = (key, item) => {
        return (
            <li className={styles.splitLine}>
                <span className={styles.splitLeft} />
                <span className={styles.splitText}>{checkoutShowText(key, item)}</span>
                <span className={styles.splitRight} />
            </li>
        );
    };

    renderList = () => {
        const dataSource = this.state.dataSource;
        const child = [];
        if (!dataSource || dataSource.size === 0) return RenderEmpty({ marginTop: '200px' }, '暂无消息');
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of dataSource) {
            child.push(this.renderListItem(key, value));
        }
        return child;
    };

    renderListItem = (key, item) => {
        const children = Array.isArray(item) ? item : [];
        if (children.length === 0) return null;
        return (
            <ul key={key} className={styles.listItems}>
                {this.renderSplitLine(key, item)}
                {item.map((ls) => {
                    return (
                        <li key={ls.messageId} className={styles.listItem}>
                            <div className={styles.itemMeta}>
                                {this.renderAvatar(ls)}
                                {this.renderListContent(ls)}
                            </div>
                        </li>
                    );
                })}
            </ul>
        );
    };

    render() {
        return <div className={styles.listView}>{this.renderList()}</div>;
    }
}
export default ListView;
