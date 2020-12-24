import React from 'react';
import { Menu, Empty, Spin, Icon } from 'antd';
import lodash from 'lodash';
import styles from './styles.less';
import BIInput from '@/ant_components/BIInput';
import BIDropdown from '@/ant_components/BIDropDown';

/*
 * 此空间用于数据选择及输入控制,若不选择只传入输入框数据
 */

class TextSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchStr: '',
            list: [],
            loading: false,
            selected: undefined,
            tempSelected: undefined,
            tempVisible: false,
        };
        this.container = React.createRef();
        this.fetch = lodash.debounce(this.fetch, 400);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (JSON.stringify(nextProps.value) !== JSON.stringify(prevState.tempSelected)) {
            let value = Array.isArray(nextProps.value) ? nextProps.value : [];
            if (Object.prototype.toString.call(nextProps.value) === '[object Object]') {
                value = [nextProps.value];
            }
            const [first] = value || [];
            const searchStr = first ? first.label || first.text : '';
            return {
                tempSelected: nextProps.value || [],
                selected: nextProps.value,
                searchStr,
            };
        }
        return null;
    }

    fetch = async (val) => {
        const { request } = this.props;
        if (!request) return;
        await this.setState({ loading: true, list: [] });
        const result = await request(val);
        if (result && result.success) {
            const data = result.data || {};
            let list = Array.isArray(data.list) ? data.list : [];
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
        if (key === 'spin' || key === 'empty') return;
        const { props } = item || {};
        const { title } = props || {};
        const selected = { label: title, value: key };
        this.setState({ selected, searchStr: title });
        this.onVisibleChange(false);
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

    renderList = () => {
        const { list, loading, selected } = this.state;
        return (
            <Menu onClick={this.onClickMenu} selectedKeys={selected ? [selected.value] : []}>
                {list.map((item) => {
                    return (
                        // eslint-disable-next-line no-underscore-dangle
                        <Menu.Item key={item._value} title={item._label}>
                            {/* eslint-disable-next-line no-underscore-dangle */}
                            {item._label}
                        </Menu.Item>
                    );
                })}
                {loading ? (
                    <Menu.Item key="spin">
                        <span className={styles.spin}>
                            <Spin />
                        </span>
                    </Menu.Item>
                ) : null}
                {list.length === 0 ? (
                    <Menu.Item key="empty">
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

    getContainer = () => {
        return this.container.current;
    };

    render() {
        const { placeholder, disabled, width } = this.props;
        const { searchStr } = this.state;
        const style = { width: width || '100%' };
        return (
            <span className={styles.container} ref={this.container}>
                <BIDropdown
                    trigger={['click']}
                    overlayClassName={styles.overlayClassName}
                    overlayStyle={style}
                    onVisibleChange={this.onVisibleChange}
                    placement="bottomCenter"
                    overlay={this.renderList()}
                    getPopupContainer={this.getContainer}
                    disabled={disabled}
                >
                    <BIInput
                        ref={(dom) => {
                            this.input = dom;
                        }}
                        className={styles.input}
                        value={searchStr}
                        placeholder={placeholder}
                        onChange={this.onSearch}
                        onFocus={this.onFocus}
                        disabled={disabled}
                        style={style}
                        // suffix={this.renderSuffix()}
                    />
                </BIDropdown>
            </span>
        );
    }
}

export default TextSelect;
