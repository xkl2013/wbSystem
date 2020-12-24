import React, { Component } from 'react';
import { message } from 'antd';
import { isEmpty, sortBy } from 'lodash';
import BIModel from '@/ant_components/BIModal';
import BIButton from '@/ant_components/BIButton';
import QuickManage from '../quickManage';
import SeletedItem from '../seletedItem';
import storage from '@/utils/storage';
import styles from './styles.less';

import { getQuickGroupMenuList, getUserQuickMenu, postSaveQuickMenu } from '../../services';

// const CLOSE = require('@/assets/modal-close.png');

class QuickEntry extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            seletedList: [],
            visible: props.visible,
        };
    }

    componentDidMount() {
        this.getMenuList();
    }

    initData = () => {
        this.setState({ visible: true });
    };

    getMenuList = async () => {
        try {
            const userInfo = storage.getUserInfo();
            const uesrMenuList = await getUserQuickMenu({
                menuQuickGroupState: 1, // 快捷菜单分组状态 0:禁用 1:启用
                menuQuickState: 1, // 快捷菜单状态 0:禁用 1:启用
                roleId: userInfo.roleId, // 当前用户启用角色id
                userId: userInfo.userId,
            });
            const result = await getQuickGroupMenuList({
                menuQuickGroupState: 1, // 快捷菜单分组状态 0:禁用 1:启用
                menuQuickState: 1, // 快捷菜单状态 0:禁用 1:启用
                roleId: userInfo.roleId, // 当前用户启用角色id
            });
            const seletedList = (uesrMenuList.data || []).map((item) => {
                return {
                    ...item,
                    id: String(item.menuId),
                    key: String(item.menuId),
                    title: item.menuName,
                };
            });
            const sortGroupData = sortBy(result.data || [], (item) => {
                const group = item.menuQuickGroup || {};
                return group.sortNumber || '';
            });
            const newData = (sortGroupData || []).map((l) => {
                const sortData = sortBy(l.menuQuickList || [], ['sortNumber']);
                const quickList = sortData.map((item) => {
                    return {
                        ...item,
                        cid: item.id,
                        id: String(item.menuId),
                        key: String(item.menuId),
                        title: item.menuName,
                    };
                });
                return { menuQuickGroup: l.menuQuickGroup, menuQuickList: quickList };
            });
            this.setState({ list: newData, seletedList });
        } catch (error) {
            // console.log(error, 222);
        }
    };

    onCancel = () => {
        // this.setState({ visible: false });
        this.props.onSettingHide();
    };

    checkData = (data) => {
        this.setState({ seletedList: data });
    };

    onSave = async () => {
        const { seletedList } = this.state;
        const userInfo = storage.getUserInfo() || {};
        const saveData = seletedList.reduce((list, item, index) => {
            const saveItem = {
                menuId: item.menuId,
                roleId: userInfo.roleId,
                userId: userInfo.userId,
                sortNumber: index + 1,
            };
            list.push(saveItem);
            return list;
        }, []);
        const data = isEmpty(saveData) ? [{ roleId: userInfo.roleId, userId: userInfo.userId }] : saveData;
        const result = await postSaveQuickMenu(data);
        if (result.success) {
            // this.getMenuList();
            await this.props.fetchEnterPaths();
            this.props.onSettingHide();
        } else {
            message.warn(result.message);
        }
    };

    renderTitle = () => {
        return (
            <div className={styles.titleRow}>
                <span className={styles.title}>快捷入口设置</span>
                <div>
                    <BIButton
                        className={styles.headerButton}
                        type="primary"
                        onClick={() => {
                            this.onSave();
                        }}
                    >
                        保存
                    </BIButton>
                </div>
            </div>
        );
    };

    render() {
        return (
            <BIModel
                onCancel={this.onCancel}
                visible={this.state.visible}
                bodyStyle={{ padding: 0 }}
                style={{ top: 50 }}
                maskClosable={true}
                destroyOnClose={true}
                width={850}
                footer={false}
            >
                {this.renderTitle()}
                <SeletedItem seletedList={this.state.seletedList} checkData={this.checkData} />
                <QuickManage {...this.state} getMenuList={this.getMenuList} checkData={this.checkData} />
            </BIModel>
        );
    }
}

export default QuickEntry;
