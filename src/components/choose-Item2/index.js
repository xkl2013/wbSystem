import React, { Component } from 'react';
import { Tag } from 'antd';
import styles from './styles.less';
import IconFont from '@/components/CustomIcon/IconFont';
import { checkoutType } from '@/utils/utils';

class ChooseItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowFiexd: false,
        };
    }

    closeSampleTag = (e, newObj) => {
        e.preventDefault();
        this.onChange(newObj);
    };

    closeMultiPleTags = (e, id, obj) => {
        e.preventDefault();
        const removeTag = { key: obj.key, id };
        this.onChange(removeTag);
    };

    onChange = (newObj) => {
        if (this.props.onChange) {
            this.props.onChange(newObj);
        }
    };

    renderMultipleChoice = (obj, i) => {
        return (
            <span key={i}>
                {obj.value.map((item) => {
                    return (
                        item && (
                            <span key={item.name + item.id} className={styles.tags}>
                                <Tag
                                    key={obj.key}
                                    closable={true}
                                    onClose={(e) => {
                                        return this.closeMultiPleTags(e, item.id, obj);
                                    }}
                                >
                                    {item.name}
                                </Tag>
                            </span>
                        )
                    );
                })}
            </span>
        );
    };

    componentDidMount() {
        // window.addEventListener('scroll', this.pageOnscroll);
    }

    componentWillUnmount() {
        // window.removeEventListener('scroll', this.pageOnscroll)
    }

    pageOnscroll = (e) => {
        const pageTop = document.documentElement.scrollTop;
        // const { top } = this.props;
        const top = 350;
        const { isShowFiexd } = this.state;
        // // 此处应增加防抖操作
        if (pageTop > top && !isShowFiexd) {
            this.setState({ isShowFiexd: !isShowFiexd });
        } else if (pageTop <= top && isShowFiexd) {
            this.setState({ isShowFiexd: !isShowFiexd });
        }
    };

    closeSampleTag = (e, newObj) => {
        e.preventDefault();
        this.onChange(newObj);
    };

    closeMultiPleTags = (e, id, obj) => {
        e.preventDefault();
        const removeTag = { key: obj.key, id };
        this.onChange(removeTag);
    };

    onChange = (newObj) => {
        if (this.props.onChange) {
            this.props.onChange(newObj);
        }
    };

    renderMultipleChoice = (obj, i) => {
        return (
            <span key={i}>
                {obj.value.map((item, index) => {
                    return (
                        item && (
                            <span key={index} className={styles.tags}>
                                <Tag
                                    key={obj.key}
                                    closable={true}
                                    onClose={(e) => {
                                        return this.closeMultiPleTags(e, item.id, obj);
                                    }}
                                >
                                    {item.name}
                                </Tag>
                            </span>
                        )
                    );
                })}
            </span>
        );
    };

    renderSampleTag = (obj, i) => {
        const { value } = obj;
        return !value.name ? null : (
            <span key={i} className={styles.tags}>
                <Tag
                    closable={true}
                    onClose={(e) => {
                        return this.closeSampleTag(e, {
                            ...obj,
                            value: undefined,
                        });
                    }}
                >
                    {value.name}
                </Tag>
            </span>
        );
    };

    renderValueTag = (obj, i) => {
        return !obj.value ? null : (
            <span key={i} className={styles.tags}>
                <Tag
                    closable={true}
                    onClose={(e) => {
                        return this.closeSampleTag(e, {
                            ...obj,
                            value: undefined,
                        });
                    }}
                >
                    {obj.value}
                </Tag>
            </span>
        );
    };

    checkoutTypeTage = (obj, i) => {
        const type = checkoutType(obj.value);
        switch (type) {
            case 'object':
                return this.renderSampleTag(obj, i);
            case 'array':
                return this.renderMultipleChoice(obj, i);
            case 'undefined':
                return null;
            default:
                return this.renderValueTag(obj, i);
        }
    };

    renderChooseTags = () => {
        const { params = [] } = this.props;
        let returnNode = [];
        params.forEach((item, index) => {
            const node = this.checkoutTypeTage(item, index);
            item.value && node && returnNode.push(node);
        });
        // 过滤掉复选框为空时数据为空数组的清空
        returnNode = returnNode.filter((item) => {
            return !(Array.isArray(item.props.children) && item.props.children.length === 0);
        });
        return returnNode;
    };

    renderEmptyTxt = () => {
        return <p style={{ lineHeight: '40px', fontSize: 12, color: '#bfbfbf' }}>暂无筛选条件</p>;
    };

    render() {
        const children = this.renderChooseTags();
        const { isShowFiexd } = this.state;
        const isShowBox = children && children.length > 0;
        return (
            <div className={`${styles.tagContent} ${isShowFiexd ? styles.flexGroupTags : ''}`}>
                <span className={styles.gropLabel}>已选条件:</span>
                <div className={styles.tagsCls}>
                    {isShowBox ? children : this.renderEmptyTxt()}
                    <i
                        className={styles.btnAddQuickSift}
                        onClick={() => {
                            return this.props.creatSiftTag();
                        }}
                    >
                        <IconFont type="iconpingji" className={styles.itemIcon} />
                        新建快捷筛选
                    </i>
                </div>
            </div>
        );
    }
}

export default ChooseItem;
