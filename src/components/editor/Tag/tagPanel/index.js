import React from 'react';
import { Menu, Empty, Spin, Icon } from 'antd';
import { findDOMNode } from 'react-dom';
import lodash from 'lodash';
import styles from './styles.less';
import BIDropdown from '@/ant_components/BIDropDown';
import tagStyle from '../tagList.less';
import tagClose from '@/assets/tagClose.png';

/*
 * 此空间用于数据选择及输入控制,若不选择只传入输入框数据
 */

class TagPanel extends React.Component {
    inputWidth = 320;

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            loading: false,
            selected: [],
            tempSelected: undefined,
            tempVisible: false,
        };
        this.container = React.createRef();
        this.fetch = lodash.debounce(this.fetch, 400);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (JSON.stringify(nextProps.value) !== JSON.stringify(prevState.tempSelected)) {
            return {
                tempSelected: nextProps.value,
                selected: Array.isArray(nextProps.value) ? nextProps.value : [],
            };
        }
        return null;
    }

    componentDidMount() {
        setTimeout(this.getInputWidth, 10);
    }

    getInputWidth = () => {
        // eslint-disable-next-line react/no-find-dom-node
        if (this.input && findDOMNode(this.input)) {
            // eslint-disable-next-line react/no-find-dom-node
            this.width = findDOMNode(this.input).offsetWidth;
        }
    };

    fetch = async (val) => {
        const { request } = this.props;
        if (!request) return;
        await this.setState({ loading: true });
        const result = await request(val);
        if (result && result.success) {
            const data = result.data || {};
            let list = Array.isArray(data) ? data : [];
            list = this.formateData(list);
            this.setState({ list });
        }
        await this.setState({ loading: false });
    };

    formateData = (data) => {
        const { fieldNames = { label: 'name', value: 'id' } } = this.props || {};
        return data.map((item) => {
            return {
                ...item,
                _label: item[fieldNames.label],
                _value: item[fieldNames.value],
            };
        });
    };

    onResetValue = (searchStr) => {
        return { value: '', label: searchStr };
    };

    onSearch = (e) => {
        const searchStr = e.currentTarget.value;
        const selected = this.onResetValue(searchStr);
        this.setState({ searchStr, selected }, () => {
            this.fetch(searchStr);
            this.onChange(selected);
        });
    };

    onFocus = () => {
        const { searchStr } = this.state;
        this.fetch(searchStr);
    };

    onClickMenu = ({ item, key }) => {
        const { props } = item || {};
        const { selected } = this.state;
        const { title, color } = props || {};
        const index = selected.findIndex((ls) => {
            return ls.value === key;
        });
        if (index >= 0) {
            selected.splice(index, 1);
        } else {
            selected.push({ label: title, value: key, color });
        }
        this.setState({ selected });
        this.onChange(selected);
    };

    onChange = (obj) => {
        const { onChange } = this.props;
        if (typeof onChange === 'function') {
            onChange(obj);
        }
    };

    onClear = () => {
        const { tempVisible } = this.state;
        const searchStr = '';
        const selected = this.onResetValue(searchStr);
        this.setState({ searchStr, selected }, () => {
            if (tempVisible) {
                this.fetch(searchStr);
            }
            this.onChange(selected);
        });
    };

    onVisibleChange = (tempVisible) => {
        this.setState({ tempVisible });
    };

    renderTagList = () => {};

    onClose = (e, item) => {
        e.stopPropagation();
        const { selected } = this.state;
        const index = selected.findIndex((ls) => {
            return ls.value === item.value;
        });
        selected.splice(index, 1);
        this.setState({ selected });
        this.onChange(selected);
    };

    renderList = () => {
        const { list, loading, selected } = this.state;
        const { width } = this.props;
        return (
            <Menu
                style={{ width: width || this.width }}
                onClick={this.onClickMenu}
                selectedKeys={selected ? [selected.value] : []}
            >
                {list.map((item) => {
                    return (
                        // eslint-disable-next-line no-underscore-dangle
                        <Menu.Item key={item._value} title={item._label} color={item.tagColor || 'red'}>
                            {
                                // eslint-disable-next-line no-underscore-dangle
                                item._label
                            }
                        </Menu.Item>
                    );
                })}
                {loading ? (
                    <Menu.Item>
                        <span className={styles.spin}>
                            <Spin />
                        </span>
                    </Menu.Item>
                ) : null}
                {list.length === 0 ? (
                    <Menu.Item>
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </Menu.Item>
                ) : null}
            </Menu>
        );
    };

    renderSuffix = () => {
        const { searchStr } = this.state;
        const { allowClear = true, suffix } = this.props;
        if (suffix) return suffix;
        return (
            <>
                <span className={styles.searchIcon}>
                    {' '}
                    <Icon type="search" />
                </span>
                {searchStr.length > 0 && allowClear ? (
                    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                    <span className={styles.clearIcon} onClick={this.onClear}>
                        {' '}
                        <Icon
                            type="close-circle"
                            theme="filled"
                            style={{
                                fontSize: '14px',
                                color: 'rgba(0,0,0,.25)',
                            }}
                        />
                    </span>
                ) : null}
            </>
        );
    };

    forMap = (item) => {
        const { hideClose } = this.props;
        const bg = item.color || 'fafafa';
        const tagElem = (
            <div className={tagStyle.item} key={item.value}>
                <span className={tagStyle.itemBg} style={{ background: `#${bg}` }} />
                <span className={tagStyle.itemBgTxt} style={{ color: `#${item.color}` }}>
                    {item.label}
                </span>
                {!hideClose && (
                    <img
                        src={tagClose}
                        className={tagStyle.itemBgClose}
                        onClick={(e) => {
                            return this.onClose(e, item);
                        }}
                        alt=""
                    />
                )}
            </div>
        );
        return (
            <span key={item.value} style={{ display: 'inline-block' }}>
                {tagElem}
            </span>
        );
    };

    getContainer = () => {
        return this.container.current;
    };

    render() {
        const { disabled } = this.props;
        const { selected = [] } = this.state;
        return (
            <span className={styles.container} ref={this.container}>
                <BIDropdown
                    trigger={['click']}
                    overlayClassName={styles.overlayClassName}
                    onVisibleChange={this.onVisibleChange}
                    placement="bottomCenter"
                    overlay={this.renderList()}
                    getPopupContainer={this.getContainer}
                    disabled={disabled}
                    onClick={this.fetch}
                >
                    <div className={styles.selectBox}>
                        <div className={styles.tagList}>{selected.map(this.forMap)}</div>
                    </div>
                </BIDropdown>
            </span>
        );
    }
}

export default TagPanel;
