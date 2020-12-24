import React from 'react';
import { connect } from 'dva';

import styles from './styles.less';

export const params = {
    messageModule: '',
    messageType: '',
};

@connect(({ settings, message }) => {
    return {
        settings: settings || {},
        message,
        messageCountList: message.messageCountList,
    };
})
class Message extends React.Component {
    componentDidMount() {
        // this.initData();
    }

    initData = () => {
        this.getMessageCountList();
    };

    getMessageCountList = () => {
        this.props.dispatch({
            type: 'message/getMessageCount',
        });
    };

    render() {
        return (
            <div className={styles.wrap}>
                <div className={styles.list}>{this.props.children}</div>
            </div>
        );
    }
}
export default Message;
