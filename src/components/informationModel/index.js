import React from 'react';
import { message } from 'antd';
import _ from 'lodash';
import { checkPathname } from '../AuthButton';
import BIModel from '@/ant_components/BIModal';
import styles from './styles.less';
import { renderTxt } from '@/utils/hoverPopover';
import checkoutAuth from '@/services/globalAuthApi';
import Modals from '@/pages/message/component/detail/modals';
import businessConfig from '@/config/business';

/**
 * @informationModel 弹窗模式
 *
 * data @params {id,name,path}[]
 * @id    信息主键
 * @name  信息名称
 * @path  弹框组件对应业务path
 *
 * @moduleConfig @params {moduleType,moduleOrigin}
 * @moduleType      弹框组件对应业务类型
 * @moduleOrigin    弹框组件对应来源（默认'detail'，'history'）
 *
 * @render  自定义渲染
 */

export default class Information extends React.Component {
    constructor(props) {
        super(props);
        this.DetailDom = null;
        this.handleClick = _.debounce(this.onClickItem, 800);
        this.state = {
            visible: false,
            informationInstance: null,
        };
    }

    /* eslint-disable no-underscore-dangle */
    getMenuData = (path) => {
        const menuObj = window.g_app._store.getState().menu || {};
        const breadcrumbNameMap = menuObj.breadcrumbNameMap || {};
        return breadcrumbNameMap[path] || {};
    };

    getAuth = async (item) => {
        const result = await checkoutAuth(item);
        if (typeof result === 'string') {
            message.warn(result);
            return;
        }
        if (!checkPathname(item.path) || !item.id || !result) {
            message.warn('无权限查看此模块!');
            return;
        }
        const { moduleConfig, informationModel } = this.props;
        if (moduleConfig) {
            const { moduleType, moduleOrigin } = moduleConfig;
            const obj = businessConfig[moduleType] || {};
            if (obj.pageType && obj.pageType === 'modal') {
                if (Modals) {
                    Modals.showModal(obj, { moduleType, moduleId: item.id, moduleOrigin });
                }
            }
        } else if (informationModel) {
            const routerData = this.getMenuData(item.path) || {};
            this.DetailDom = routerData.component || null;
            this.setState({ visible: true, informationInstance: item });
        } else {
            let path = `${item.path}?id=${result}`;
            if (item.tabIndex) {
                path += `&tabIndex=${item.tabIndex}`;
            }
            window.open(path, '_blank');
        }
    };

    doubleClick = (item) => {
        this.getAuth(item);
    };

    onClickItem = (item) => {
        if (this.props.eventType === 'doubleClick') return;
        this.getAuth(item);
    };

    onCancel = () => {
        this.setState({ visible: false });
    };

    renderItem = () => {
        const { data = [], hoverPopover, render } = this.props;
        return data.map((ls) => {
            let dom = ls.name;
            if (typeof render === 'function') {
                dom = render(ls.name);
            } else if (hoverPopover) {
                dom = <span style={{ cursor: 'pointer' }}>{renderTxt(ls.name)}</span>;
            }
            return (
                <span
                    className={styles.item}
                    key={ls.id}
                    onClick={() => {
                        return this.handleClick(ls);
                    }}
                    onDoubleClick={() => {
                        return this.doubleClick(ls);
                    }}
                >
                    {dom}
                </span>
            );
        });
    };

    renderDetail = () => {
        const { informationInstance } = this.state;
        return this.DetailDom ? <this.DetailDom informationModel informationInstance={informationInstance} /> : null;
    };

    render() {
        const { visible } = this.state;
        return (
            <>
                {this.renderItem()}
                {!visible ? null : (
                    <BIModel onCancel={this.onCancel} footer={null} width={1000} visible={visible} maskClosable={true}>
                        {this.renderDetail()}
                    </BIModel>
                )}
            </>
        );
    }
}
