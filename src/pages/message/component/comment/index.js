import React from 'react';
import { message } from 'antd';
import Editor from '../../../../components/editor';
import styles from './styles.less';
import { commentAdd } from '@/services/comment';

// 请求添加评论
const addComment = async (params = {}, callback) => {
    const response = await commentAdd(params);
    if (response && response.success) {
        message.success('回复成功');
        if (callback && typeof callback === 'function') {
            callback();
        }
    }
};
export default class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            userList: [],
        };
    }

    componentDidMount() {
        this.initDefaultValue();
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.commentItem) !== JSON.stringify(this.props.commentItem)) {
            this.initDefaultValue(nextProps.commentItem);
        }
    }

    initDefaultValue = (commentItem = this.props.commentItem) => {
        const messageFrom = commentItem.messageFrom || {};
        if (!messageFrom.id) return;
        const userList = [
            {
                id: messageFrom.id,
                name: messageFrom.name,
                avatar: messageFrom.icon,
                type: messageFrom.type,
            },
        ];
        const value = Editor.formateUserName(messageFrom.name);
        this.setState({
            value,
            userList,
        });
    };

    handleComment = (val) => {
        const commentItem = this.props.commentItem || {};
        const extraMsgObj = commentItem.extraMsgObj || {};
        if (!extraMsgObj.moduleId) {
            message.warn('数据异常');
            return;
        }
        const messageFrom = commentItem.messageFrom || {};
        const params = {
            commentBusinessId: extraMsgObj.moduleId,
            commentBusinessType: Number(extraMsgObj.moduleType),
            ...val,
        };
        if (messageFrom.id) {
            const hasUser = (params.atList || []).find((ls) => {
                return ls.id === messageFrom.id;
            });
            if (!hasUser) {
                params.atList.push({
                    id: messageFrom.id,
                    name: messageFrom.name,
                    avatar: messageFrom.icon,
                    type: messageFrom.type,
                });
            }
        }
        addComment(params, this.props.callback);
    };

    render() {
        return (
            <div className={styles.commentBox}>
                <div className={styles.title}>
                    评论
                    {this.props.commentItem.messageContent}
                </div>
                <Editor
                    maxLength={500}
                    value={this.state.value}
                    userList={this.state.userList}
                    onCancel={this.props.onCancel}
                    slots={['1', '10']}
                    inModal={true}
                    placement="bottom"
                    onClick={this.handleComment}
                />
            </div>
        );
    }
}
