import React from 'react';
import { Spin, Select } from 'antd';
import lodash from 'lodash';
import { Consumer } from '../../../context';

interface Props {
    initDataType?: undefined | 'onfocus'; // 初始化请求方式
    request?: Function;
    selfCom?: any;
    dataSource?: [];
    onChange: Function;
    onBlur?: Function;
    value?: any;
    autoFocus?: boolean;
    mode?: 'multiple' | 'tags' | undefined;
    fieldNames?: {
        value: any;
        label: string;
    };
}

enum Loaded {
    Init = 'init',
    Has = 'has',
    Empty = 'empty',
}

interface State {
    value: any;
    data: any[];
    fetching: boolean;
    fieldNames: any;
    initData: any[];
    searchStr: string;
    canFocus: boolean;
    loaded: Loaded;
}

class AssociationSearch extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.fetchData = lodash.debounce(this.fetchData, 400);
        this.state = {
            value: undefined,
            data: [],
            fetching: false,
            fieldNames: props.fieldNames || { label: 'label', value: 'value' },
            initData: [],
            searchStr: '',
            canFocus: true,
            loaded: Loaded.Init,
        };
    }

    componentDidMount() {
        const { value, initDataType } = this.props;
        const formatValue = this.formaterValue(value);
        this.setState({ value: formatValue || undefined });
        if (!initDataType) {
            this.fetchData('', true);
        }
    }

    UNSAFE_componentWillReceiveProps = (nextProps: any) => {
        const { value } = this.props;
        const { data, initData } = this.state;
        if (JSON.stringify(nextProps.value) !== JSON.stringify(value)) {
            const vas = nextProps.value || undefined;
            let newData = data.slice();
            if (vas === undefined || vas === null) {
                newData = initData.slice();
            } else if (typeof vas === 'object') {
                if (!vas.label || !vas.label.length) {
                    newData = initData.slice();
                }
            }
            this.setState({ value: this.formaterValue(vas), data: newData });
            this.addValueOptions(vas);
        }
    };

    fetchData = async (val: string, isDefault = false) => {
        let data: any[] = [];
        const { request, dataSource } = this.props;
        if (request) {
            this.setState({ fetching: true });
            const response = await request(val);
            if (response && response.data && response.success) {
                const resData = Array.isArray(response.data) ? response.data : response.data.list;
                data = Array.isArray(resData) ? resData : [];
                data = this.formaterData(data);
                if (isDefault) {
                    this.setState({ initData: data.slice() });
                }
            }
        } else {
            data = Array.isArray(dataSource) ? dataSource : [];
        }
        this.setState({ data, loaded: data.length > 0 ? Loaded.Has : Loaded.Empty, fetching: false });
    };

    onSearch = (val: string) => {
        const { initData } = this.state;
        this.setState({ searchStr: val });
        if (val) {
            this.fetchData(val);
        } else {
            this.setState({
                data: initData.slice(),
            });
        }
    };

    onFocus = () => {
        const { initDataType } = this.props;
        const { searchStr, canFocus, fetching } = this.state;
        if (initDataType === 'onfocus' && canFocus && !fetching) {
            this.setState({ data: [], canFocus: false });
            this.fetchData(searchStr, true);
        }
    };

    formaterData = (data: any) => {
        const { fieldNames } = this.state;
        if (fieldNames) {
            const { value, label } = fieldNames;
            return data.map((item: any) => {
                return {
                    ...item,
                    value: typeof value === 'function' ? value(item) : item[value],
                    label: item[label],
                };
            });
        }
        return data;
    };

    formaterValue = (item: any) => {
        const { fieldNames } = this.state;
        if (!item) return item;
        if (fieldNames && item) {
            const { value, label } = fieldNames;
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

    addValueOptions = (values: any) => {
        if (values === undefined) return values;
        const { data } = this.state;
        if (typeof values === 'object') {
            const newData: any[] = [];
            const valueArr = Array.isArray(values) ? values : [values];
            // 显示旧数据->显示新数据
            [...data, ...valueArr].forEach((item: any) => {
                const index = newData.findIndex((ls: any) => {
                    return ls.value === item.value;
                });
                if (index < 0) {
                    newData.push(item);
                }
            });
            this.setState({ data: newData });
        }
    };

    handleChange = (value: any) => {
        const { onChange } = this.props;
        if (onChange) {
            onChange(this.formatValue(value));
        }
    };

    onBlur = (value: any) => {
        const { onBlur } = this.props;
        this.setState({ searchStr: '', canFocus: true });
        if (typeof onBlur === 'function') {
            onBlur(this.formatValue(value));
        }
    };

    formatValue = (value: any) => {
        const { data } = this.state;
        if (Array.isArray(value)) {
            return value.map((temp: any) => {
                return {
                    ...temp,
                    value: temp.key,
                    ...(data.find((ls: any) => {
                        return ls.value === temp.key;
                    }) || {}),
                };
            });
        } else if (value) {
            return {
                ...value,
                value: value.key,
                ...(data.find((ls: any) => {
                    return ls.value === value.key;
                }) || {}),
            };
        }
        // 集成清空操作
        return value;
    };

    notFoundContent = (locale: any) => {
        const { fetching, loaded } = this.state;
        if (fetching) {
            return <Spin size="small" />;
        }
        if (loaded === Loaded.Empty) {
            return <span style={{ fontSize: '12px' }}>{locale.notFoundContent}</span>;
        }
        return null;
    };

    render() {
        const { data, value } = this.state;
        const { selfCom, autoFocus, onChange, ...rest } = this.props;
        return (
            <Consumer>
                {({ locale }: any) => {
                    return (
                        <Select
                            filterOption={false}
                            {...rest}
                            value={value}
                            showSearch={true}
                            labelInValue={true}
                            notFoundContent={this.notFoundContent(locale)}
                            onSearch={this.onSearch}
                            onChange={this.handleChange}
                            onFocus={this.onFocus}
                            onBlur={this.onBlur}
                        >
                            {data.map((d: any) => {
                                return (
                                    <Select.Option key={d.value} value={d.value}>
                                        {d.label}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    );
                }}
            </Consumer>
        );
    }
}

export default AssociationSearch;
