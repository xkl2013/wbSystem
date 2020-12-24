import React from 'react';
import { Menu, Empty, Spin, Input, Dropdown } from 'antd';
import { findDOMNode } from 'react-dom';
import lodash from 'lodash';
import styles from './styles.less';

/*
 * 此空间用于数据选择及输入控制,若不选择只传入输入框数据
 */
interface Props {
    initDataType?: undefined | 'onfocus'; // 初始化请求方式
    request?: Function;
    selfCom?: any;
    dataSource?: [];
    onChange: Function;
    value?: any;
    autoFocus?: boolean;
    mode?: 'multiple' | 'tags' | undefined;
    fieldNames?: {
        value: any;
        label: string;
    };
    placeholder?: string;
    width?: number;
    disabled?: boolean;
}
interface State {
    searchStr: string;
    list: any[];
    loading: boolean;
    selected: any;
    tempSelected: any;
    tempVisible: boolean;
}
class TextSelect extends React.Component<Props, State> {
    container: any;

    input: any;

    width: number = 320;

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
        this.input = React.createRef();
        this.fetch = lodash.debounce(this.fetch, 400);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (JSON.stringify(nextProps.value) !== JSON.stringify(prevState.tempSelected)) {
            const data = nextProps.value || {};
            const searchStr = data.label || data.text;
            return {
                tempSelected: data,
                selected: data,
                searchStr,
            };
        }
        return null;
    }

    componentDidMount() {
        setTimeout(this.getInputWidth, 10);
    }

    getInputWidth = () => {
        if (this.input.current) {
            const dom = findDOMNode(this.input.current);
            if (dom) {
                // @ts-ignore
                this.width = dom.offsetWidth;
            }
        }
    };

    fetch = async (val) => {
        const { request } = this.props;
        if (!request) return;
        await this.setState({ loading: true, list: [] });
        const result = await request(val);
        if (result && result.success) {
            const data = result.data || {};
            let list = Array.isArray(data.list) ? data.list : [];
            list = this.formatData(list);
            this.setState({ list });
        }
        await this.setState({ loading: false });
    };

    formatData = (data) => {
        const { fieldNames = { label: 'name', value: 'id' } } = this.props || {};
        const { label, value } = fieldNames;
        return data.map((item) => {
            return {
                ...item,
                _label: item[label],
                _value: item[value],
            };
        });
    };

    onResetValue = (searchStr) => {
        if (!searchStr) return undefined;
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

    onVisibleChange = (tempVisible) => {
        const { onDropdownVisibleChange } = this.props;
        const { selected } = this.state;
        this.setState({ tempVisible });
        if (onDropdownVisibleChange) {
            onDropdownVisibleChange(tempVisible);
            if (!tempVisible) {
                // 清空或者为空对象时，强制置空
                if (!selected || selected.length === 0 || (!selected.label && !selected.value && !selected.key)) {
                    return this.onChange(undefined);
                }
                this.onChange(selected);
            }
        }
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
                        <Menu.Item key={item._value} title={item._label}>
                            {item._label}
                        </Menu.Item>
                    );
                })}
                {loading && (
                    <Menu.Item>
                        <span className={styles.spin}>
                            <Spin />
                        </span>
                    </Menu.Item>
                )}
                {list.length === 0 && (
                    <Menu.Item>
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </Menu.Item>
                )}
            </Menu>
        );
    };

    getContainer = () => {
        return this.container.current;
    };

    render() {
        const { placeholder, disabled, maxPopHeight } = this.props;
        const { searchStr } = this.state;
        const extra: any = {};
        if (maxPopHeight) {
            extra.overlayClassName = styles.overlayClassName;
            extra.overlayStyle = {
                maxHeight: maxPopHeight,
            };
        }
        return (
            <div className={styles.textSelectContainer} ref={this.container}>
                <Dropdown
                    trigger={['click']}
                    {...extra}
                    onVisibleChange={this.onVisibleChange}
                    placement="bottomLeft"
                    overlay={this.renderList()}
                    getPopupContainer={this.getContainer}
                    disabled={disabled}
                >
                    <Input
                        ref={this.input}
                        className={styles.input}
                        value={searchStr}
                        placeholder={placeholder}
                        onChange={this.onSearch}
                        onFocus={this.onFocus}
                        disabled={disabled}
                        allowClear={true}
                    />
                </Dropdown>
            </div>
        );
    }
}

export default TextSelect;
