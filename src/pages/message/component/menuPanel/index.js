import React from 'react';
import { connect } from 'dva';
import classnames from 'classnames';
import Input from '@/ant_components/BIInput';
import IconFont from '@/components/CustomIcon/IconFont';
import styles from './styles.less';
import SearchModel from '../searchModel';
import MenuList from '../menuList';

@connect(({ message }) => {
    return {
        message,
    };
})
class MenuPanel extends React.Component {
    state = {
        visible: false,
        searchStr: '',
    };

    onSelect = ({ key }) => {
        if (this.props.onChangeMessageModule) {
            this.props.onChangeMessageModule(key);
        }
    };

    setReadMessage = (messageModule) => {
        // 财务消息和评论消息,不予制成已读
        if (String(messageModule) === '5' || String(messageModule) === '2') {
            return;
        }
        // if (messageModule) {
        //     const messageCountList = this.props.messageCountList || [];
        //     const listParams = this.props.listParams || {};
        //     const messageObj = messageCountList.find((ls) => {
        //         return String(ls.messageModule) === String(listParams.messageModule);
        //     }) || {};
        //     if (messageObj && messageObj.messageCount < 1) {
        //         return;
        //     }
        // }
        this.props.dispatch({
            type: 'message/updateAllMessage',
            payload: { messageModule },
        });
    };

    checkoutMessageCount = () => {
        const { messageCountList = [] } = this.props;
        let num = 0;
        messageCountList.forEach((el) => {
            num += el.messageCount || 0;
        });
        return num || 0;
    };

    clickMenu = ({ key }) => {
        this.setReadMessage(key);
    };

    onPressEnter = (e) => {
        this.setState({ searchStr: e.target.value, visible: true });
    };

    onSearch = () => {
        this.setState({ visible: true });
    };

    onCancel = () => {
        this.setState({ visible: false, searchStr: '' });
    };

    render() {
        const messageCountList = this.props.messageCountList || [];
        const listParams = this.props.listParams || {};
        const unReadCount = this.checkoutMessageCount();
        return (
            <div className={styles.wrap} style={this.props.style}>
                <div className={styles.menuHeader}>
                    <h3>消息</h3>
                    <span
                        className={classnames(styles.setReadBtn, unReadCount > 0 ? styles.selectReadBtn : '')}
                        onClick={() => {
                            return this.setReadMessage(null);
                        }}
                    >
                        全部标为已读
                    </span>
                </div>
                <div className={styles.search}>
                    <Input
                        style={{ width: 290, height: 32 }}
                        className={styles.searchInput}
                        placeholder="请输入搜索内容"
                        onPressEnter={this.onPressEnter}
                        value={this.state.searchStr}
                        onChange={(e) => {
                            e.persist();
                            this.setState({ searchStr: e.target.value });
                        }}
                        prefix={
                            <IconFont
                                type="iconziduan-lianxiangdanxuan"
                                style={{ color: 'rgba(0,0,0,.25)' }}
                                onClick={this.onSearch}
                            />
                        }
                    />
                </div>
                <MenuList
                    selectedKeys={[listParams.messageModule]}
                    messageCountList={messageCountList}
                    onSelect={this.onSelect}
                    clickMenu={this.clickMenu}
                />
                {!this.state.visible ? null : (
                    <SearchModel
                        visible={this.state.visible}
                        searchMsgContent={this.state.searchStr}
                        messageCountList={messageCountList}
                        onCancel={this.onCancel}
                        onSelect={this.onSelect}
                    />
                )}
            </div>
        );
    }
}
export default MenuPanel;
