import React, { Component } from 'react';
import { message } from 'antd';
import { pullAllBy, isEmpty, unionBy } from 'lodash';
import styles from './styles.less';
import { checkQuickMenu } from '../../services';
import storage from '@/utils/storage';

const QUICKADD = require('@/assets/quick-add.png');

class QuickManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: props.list || [],
            seletedList: props.seletedList || [],
        };
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.props.seletedList) !== JSON.stringify(nextProps.seletedList)) {
            this.setState({ seletedList: nextProps.seletedList });
        }
        if (JSON.stringify(this.props.list) !== JSON.stringify(nextProps.list)) {
            this.setState({ list: nextProps.list });
        }
    }

    checkQuickMenu = async (id, callback) => {
        const userInfo = storage.getUserInfo() || {};
        const result = await checkQuickMenu({ menuId: id, roleId: userInfo.roleId || '' });
        if (result.success) {
            callback();
        } else {
            message.warn(result.message);
            this.props.getMenuList();
        }
    };

    renderDetail = (list) => {
        return list.map((item, index) => {
            const menuQuickGroup = item.menuQuickGroup || {};
            const title = menuQuickGroup.groupName || '';
            const id = menuQuickGroup.id || index;
            const unionData = unionBy(item.menuQuickList || [], this.state.seletedList, 'menuId');
            pullAllBy(unionData, this.state.seletedList, 'menuId');
            if (isEmpty(unionData)) {
                return null;
            }
            return (
                <div key={id} style={{ marginBottom: '25px' }}>
                    <div className={styles.manageTitle}>{title}</div>
                    <ul className={styles.seletedUl}>{this.manageItem(unionData)}</ul>
                </div>
            );
        });
    };

    manageItem = (list) => {
        return list.map((item) => {
            // const img = item.isChecked ? '' : QUICKADD;
            return (
                <li key={item.key} className={styles.seletedItem} style={{ marginBottom: '10px' }}>
                    <div className={styles.seltedIcon}>
                        <img
                            style={{ width: '100%', height: '100%' }}
                            src={item.menuIcon || ''}
                            draggable="false"
                            alt=""
                        />
                        <div
                            className={styles.seletedDelte}
                            onClick={() => {
                                const seletedList = this.state.seletedList;
                                if (this.state.seletedList.length >= 8) {
                                    message.warn('最多添加8个快捷菜单！');
                                    return;
                                }
                                this.checkQuickMenu(item.menuId, () => {
                                    const mewList = seletedList.concat(item);
                                    this.props.checkData(mewList);
                                });
                            }}
                        >
                            <img style={{ width: '100%', height: '100%' }} src={QUICKADD} alt="" />
                        </div>
                    </div>
                    <div className={styles.menuName}>{item.menuName}</div>
                </li>
            );
        });
    };

    render() {
        return <div className={styles.mamageContainer}>{this.renderDetail(this.state.list)}</div>;
    }
}

export default QuickManage;
