import React from 'react';
import { Spin, TreeSelect } from 'antd';
import lodash from 'lodash';
import { getStrLeng } from '@/utils/utils';
import s from './index.less';

interface Props {
    initDataType?: undefined | 'onfocus'; // 初始化请求方式
    request?: Function;
    dataSource?: object[];
    onChange: Function;
    value?: any;
    fieldNames?: {
        value: any;
        label: any;
        title: any;
        key: any;
    };
    placeholder: any;
    showSearch?: boolean,
}

class SearchCom extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
        this.fetchData = lodash.debounce(this.fetchData, 400);
    }

    state = {
        value: undefined,
        data: [],
        initData: [],
        fetching: false,
        canFocus: true,
    };

    componentDidMount() {
        const { value, initDataType } = this.props;
        const formatValue = this.formaterValue(value);
        this.setState({ value: formatValue });
        if (!initDataType) {
            this.fetchData('', true);
        }
    }

    componentWillReceiveProps(nextProps: any) {
        if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
            let data = this.state.data;
            if (nextProps.value === undefined || !nextProps.value.label || !nextProps.value.label.length) {
                data = this.state.initData;
            }
            this.setState({ value: nextProps.value, data });
        }
    }

    onChange = (value: any) => {
        if (this.props.onChange) {
            let ops = {};
            if (value) {
                ops =
                    this.state.data.find((item: any) => {
                        return item.value === value.value;
                    }) || {};
            }
            this.props.onChange(value, ops);
        }
        this.setState({ value });
    };

    fetchData = async (val: string, isDefault = false) => {
        let data = [];
        if (this.props.request) {
            this.setState({ fetching: true });
            const response = await this.props.request(val);
            if (response && response.data && response.success) {
                data = Array.isArray(response.data.list) ? response.data.list : [];
                data = this.formaterData(data);
                if (isDefault) {
                    this.setState({ initData: data.slice() });
                }
            }
        } else {
            data = Array.isArray(this.props.dataSource) ? this.props.dataSource : [];
            data = this.formaterData(data);
        }
        this.setState({ data, fetching: false });
    };

    formaterData = (data: any) => {
        if (this.props.fieldNames) {
            const { value, label } = this.props.fieldNames;
            return data.map((item: any) => {
                return {
                    ...item,
                    value: typeof value === 'function' ? value(item) : item[value],
                    label: typeof label === 'function' ? label(item) : item[label],
                };
            });
        }
        return data;
    };

    formaterValue = (item: any) => {
        if (!item) return item;
        if (this.props.fieldNames && item) {
            const { value, label } = this.props.fieldNames;
            if (Array.isArray(item)) {
                return item.map((ls: any) => {
                    return {
                        value: ls.value || ls.value === 0 ? ls.value : ls[value],
                        key: ls.value || ls.value === 0 ? ls.value : ls[value],
                        label: ls.label || ls[label],
                    };
                });
            }
            return {
                value: item.value || item.value === 0 ? item.value : item[value],
                key: item.value || item.value === 0 ? item.value : item[value],
                label: item.label || item[label],
            };
        }
    };

    onSearch = (val: string) => {
        let value: any = { label: val, value: null };
        if (!val) {
            value = undefined;
        }
        this.onChange(value);
        if (getStrLeng(val) >= 1) {
            this.fetchData(val);
        } else {
            this.setState({
                data: this.state.initData,
            });
        }
    };

    onFocus = () => {
        const { initDataType } = this.props;
        const { canFocus, fetching, value } = this.state;
        if (initDataType === 'onfocus' && canFocus && !fetching) {
            this.setState({ data: [], canFocus: false });
            this.fetchData(value ? value.label : '', true);
        }
    };

    onBlur = () => {
        this.setState({ canFocus: true });
    };

    render() {
        const { data, fetching, value } = this.state;
        const { placeholder, showSearch } = this.props;
        return (
            <TreeSelect
                dropdownClassName={s.treeSelect}
                labelInValue={true}
                {...this.props}
                searchPlaceholder={placeholder}
                showSearch={showSearch === undefined ? true : showSearch}
                suffixIcon={<img className={s.suffixIcon} alt="" src="https://static.mttop.cn/admin/search.png" />}
                treeData={data}
                treeNodeFilterProp="title"
                value={value}
                searchValue={(value && value.label) || ''}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                allowClear={true}
                treeDefaultExpandAll={true}
                onChange={this.onChange}
                onSearch={this.onSearch}
                dropdownMatchSelectWidth={true}
                filterTreeNode={false}
                notFoundContent={
                    fetching ? (
                        <Spin size="small" />
                    ) : (
                            <span style={{ fontSize: '12px' }}>对不起,您查询的数据不存在或已被删除</span>
                        )
                }
                onFocus={this.onFocus}
                onBlur={this.onBlur}
            />
        );
    }
}

export default SearchCom;
