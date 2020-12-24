import React from 'react';
import KanBoard from './KanBoard'; // 看板视图
// import Filter from './Filter'; // 筛选
// import Sort from './Sort'; // 排序
import Search from './Search'; // 搜索
import Setting from './Setting'; // 设置
// import Notify from './Notify'; // 知会人
import Left from './layout/left';
import Right from './layout/right';
import styles from './index.less';
import { config } from './config';

class HeaderCom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: {},
            tempVaule: {},
            visible: false,
        };
    }

    componentDidMount() {}

    static getDerivedStateFromProps(nextProps, prevState) {
        if (JSON.stringify(nextProps.value) !== JSON.stringify(prevState.tempVaule)) {
            return {
                tempVaule: nextProps.value || {},
                value: nextProps.value || {},
            };
        }
        return null;
    }

    willFetch = (callback) => {
        let params = this.props.willFetch ? this.props.willFetch() : {};
        if (typeof params !== 'object') {
            console.warn('willFetch返回值应为object');
            params = {};
        }
        let childrenParams = callback ? callback() : {};
        if (typeof childrenParams !== 'object') {
            console.warn('willFetch返回值应为object');
            childrenParams = {};
        }
        return Object.assign({}, params, childrenParams);
    };

    hideModal = () => {
        this.setState({ visible: false });
    };

    onChange = (val, key) => {
        if (val === '1' && key === 'Setting') {
            this.setState({ visible: true });
        } else {
            this.setState({ visible: false });
        }
        if (this.props.onChange) this.props.onChange(val, key);
    };

    renderLeftItem = () => {
        const { left } = this.props;
        if (!left || left.length === 0) return null;
        return <div className={styles.leftBtnCls}>{this.renderItem(left)}</div>;
    };

    renderRightItem = () => {
        const { right } = this.props;
        if (!right || right.length === 0) return null;
        return <div className={styles.rightBtnCls}>{this.renderItem(right)}</div>;
    };

    renderCustomCom = (item) => {
        const { render } = item;
        if (render && typeof render === 'function') return <div className={styles.btnCls}>{render(item)}</div>;
    };

    renderItem = (nodes) => {
        const { value, visible } = this.state;

        return nodes.map((ls, i) => {
            if (ls.type === 'custom') return this.renderCustomCom(ls);
            const obj = config[ls.type] || {};
            const Com = obj.component;
            const attr = { ...(obj.attr || {}), ...(ls.attr || {}) };
            const willFetch = ls.willFetch;
            return Com ? (
                <Com
                    {...this.props}
                    {...attr}
                    key={i}
                    fetchView={this.props.fetchView}
                    authButtons={this.props.authButtons}
                    visible={visible}
                    hideModal={this.hideModal}
                    willFetch={this.willFetch.bind(this, willFetch)}
                    onChange={(arg) => {
                        return this.onChange(arg, ls.key);
                    }}
                    value={value[ls.key]}
                />
            ) : null;
        });
    };

    // 改变操作栏配置
    render() {
        return (
            <div className={styles.headerWrap}>
                {this.renderLeftItem()}
                {this.renderRightItem()}
                {this.props.children}
            </div>
        );
    }
}
HeaderCom.Left = Left;
HeaderCom.Right = Right;
HeaderCom.KanBoard = KanBoard;
HeaderCom.Search = Search;
HeaderCom.Setting = Setting;

export default HeaderCom;
