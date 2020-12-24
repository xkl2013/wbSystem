import React, { PureComponent } from 'react';
import { Row, Col, Popover } from 'antd';
import classnames from 'classnames';
import addIcon from '@/assets/addIcon.png';
import deleteIcon from '@/assets/closeIcon.png';
import styles from './index.less';
import { formModalLayout } from '../General/utils/layout';
import ModalDialog from '../../rewrite_component/user_org_jole/modalFiles';
import { defaultConfig } from '../../rewrite_component/user_org_jole/_utils/utils';
// import { renderTxt } from '@/utils/hoverPopover';

/**
 *
 *  审批流组件
 *  props：
 *  data // 数据源对象，包含 approvalFlowNodeDtos = [], approvalTaskLogDtos = []
 * disabled   //不可编辑
 *  title1 // 审批预览title
 *  title2  // 审批记录title
 *  showDefaultData 是否需要初始化数据
 *  renderAddIcon   自定义新增按钮
 *  renderItem      自定义渲染数据
 *
 * */
export default class Index extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            toolTipList: [], // tip 数据
            data: [],
            visible: props.visible || false,
        };
    }

    componentDidMount = () => {
        this.initData(this.props.data);
    };

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data)) {
            this.initData(nextProps.data);
        }
        if (nextProps.visible !== this.props.visible) {
            this.setState({ visible: nextProps.visible });
        }
    }

    initData = (data) => {
        this.setState({ data });
    };

    tipNode = () => {
        // tip节点
        const toolTipList = this.state.toolTipList || [];
        if (toolTipList.legnth === 0) {
            return null;
        }
        const node = toolTipList.map((item, index) => {
            return (
                <p key={index} style={{ textAlign: 'center' }}>
                    {item}
                </p>
            );
        });
        return <div>{node}</div>;
    };

    addUsers = () => {
        this.setState({ visible: true });
    };

    removeUsers = (obj) => {
        const newData = this.props.data.filter((item) => {
            return item.id !== obj.id;
        });
        if (this.onChange) {
            this.onChange(newData, 'remove');
        }
    };

    onChange = (data, changeType = 'add') => {
        const { showDefaultData = true } = this.props;
        if (showDefaultData) {
            this.setState({ data });
        }
        if (this.props.onChange) {
            this.props.onChange(data, changeType);
        }
    };

    handleOk = (value) => {
        this.onChange(value);
        this.setState({ visible: false });
    };

    onCancel = () => {
        this.setState({ visible: false });
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    onClickAvatar = () => {
        if (this.props.disabled) return;
        this.setState({ visible: true });
    };

    renderUserName = (val = '') => {
        const str = val || '';
        const words = str.replace('（', ',(').split(',');
        const result = [];
        words.map((item, index) => {
            if (item.length > 3) {
                result.push(
                    <Popover key={index} overlayStyle={{ wordBreak: 'break-all' }} content={item} placement="bottom">
                        <span style={{ whiteSpace: 'nowrap', cursor: 'pointer' }}>{`${item.slice(0, 3)}...`}</span>
                    </Popover>,
                );
            } else {
                result.push(
                    <span key={index}>
                        <span className={styles.userName} onClick={this.onClickAvatar}>
                            {item}
                        </span>
                    </span>,
                );
            }
        });
        return result;
    };

    renderSplitUsers = () => {
        const { title = '' } = this.props;
        const Layout = this.props.layout || formModalLayout;
        return (
            <>
                <Col {...Layout.labelCol.sm}>
                    <div className={styles.title}>{title}</div>
                </Col>
                <Col {...Layout.wrapperCol.sm}>{this.renderNoTitle()}</Col>
            </>
        );
    };

    renderAddIcon = () => {
        const { renderAddIcon, reWriteCls } = this.props;
        if (renderAddIcon && typeof renderAddIcon === 'function') return renderAddIcon(this);
        if (this.props.hideBtn || this.props.disabled) return;
        return (
            <div className={`${styles.item}`}>
                <div role="presentation" className={styles.itemTop} onClick={this.addUsers}>
                    <img className={`${reWriteCls ? styles.hideAddBtn : styles.iconCls}`} src={addIcon} alt="" />
                </div>
            </div>
        );
    };

    renderItems = (data) => {
        const { renderItem } = this.props;
        if (renderItem && typeof renderItem === 'function') {
            return renderItem(this);
        }

        // -1 已撤销  0 已驳回 1审批中 2已同意 3/5待审批
        return data.map((item, index) => {
            const avatar = item.avatar || defaultConfig.get(item.type).avatar;
            return (
                <div
                    key={index}
                    className={`${styles.item} ${Number(item.status) === 1 ? styles.itemWait : null} ${
                        Number(item.status) === 0 ? styles.itemReject : null
                    }  ${Number(item.status) === 2 ? styles.itemAgree : null}  ${
                        Number(item.status) === -1 ? styles.itemCancel : null
                    }`}
                >
                    <div className={styles.itemTop}>
                        <img className={styles.iconCls} src={avatar} alt="" onClick={this.onClickAvatar} />
                        {this.props.isShowClear && !item.hideClear ? (
                            <span className={styles.clearUsers}>
                                <img
                                    src={deleteIcon}
                                    className={styles.clearIcon}
                                    onClick={this.removeUsers.bind(this, item)}
                                    alt="删除"
                                />
                            </span>
                        ) : null}
                    </div>
                    <div className={styles.itemBottom} style={this.props.newItemBottom}>
                        {this.renderUserName(item.executorName || item.name)}
                    </div>
                </div>
            );
        });
    };

    renderNoTitle = () => {
        const data = this.state.data || [];
        const { newContent, reWriteCls, wrapClassName } = this.props;

        return (
            <div
                className={classnames(reWriteCls ? styles.newContent : styles.content, wrapClassName)}
                style={newContent}
            >
                <div className={styles.list}>
                    {this.renderItems(data)}
                    {this.renderAddIcon()}
                </div>
            </div>
        );
    };

    render() {
        const { title = '', showDefaultData = true, newData = [] } = this.props;
        const data = this.state.data || [];
        return (
            <div className={styles.wrap}>
                <Row className={styles.wrapRow}>{title ? this.renderSplitUsers() : this.renderNoTitle()}</Row>
                {this.state.visible ? (
                    <ModalDialog
                        {...this.props}
                        zIndex={10000}
                        visible={this.state.visible}
                        ref={(dom) => {
                            this.modal = dom;
                        }}
                        title="添加用户"
                        value={showDefaultData ? data : newData}
                        onChange={this.onChange}
                        handleOk={this.handleOk}
                        onCancel={this.onCancel}
                    />
                ) : null}
            </div>
        );
    }
}
