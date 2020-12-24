import React from 'react';
import { Spin, Tooltip, Divider } from 'antd';
import lodash from 'lodash';
import { getStrLeng } from '@/utils/utils';
import BISelect from '@/ant_components/BISelect';
import s from './index.less';

interface Props {
    initDataType?: undefined | 'onfocus'; // 初始化请求方式
    updateId?: any;
    request?: Function;
    selfCom?: any;
    dataSource?: [];
    onChange: Function;
    onSelect?: Function;
    value?: any;
    autoFocus?: boolean;
    fieldNames?: {
        value: any;
        label: string;
        key: any;
    };
    dropdownStatus?: boolean;
    mode?: string;
    extraOption?: any;
    customName?: Function;
    style?: any
    placeholder?: string;
}
enum Loaded {
    Init = 'init',
    Has = 'has',
    Empty = 'empty',
}

class AssociationSearch extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
        this.fetchData = lodash.debounce(this.fetchData, 400);
    }

    state = {
        value: undefined,
        data: [],
        fetching: false,
        // eslint-disable-next-line react/destructuring-assignment
        fieldNames: this.props.fieldNames || { label: 'label', value: 'value' },
        initData: [],
        searchStr: '',
        canFocus: true,
        selectedOption: undefined,
        loaded: Loaded.Init,
    };

    componentDidMount() {
        const { value, initDataType } = this.props;
        const formatValue = this.formaterValue(value);
        this.setState({ value: formatValue || undefined, selectedOption: formatValue || undefined });
        if (!initDataType) {
            this.fetchData('', true);
        }
    }

    componentWillReceiveProps = (nextProps: any) => {
        const { value, updateId } = this.props;
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
            this.setState({ value: this.formaterValue(vas), selectedOption: this.formaterValue(vas), data: newData });
            this.addValueOptions(vas, newData);
        }
        if (nextProps.updateId !== undefined && JSON.stringify(nextProps.updateId) !== JSON.stringify(updateId)) {
            this.fetchData('', false, nextProps.updateId);
        }
    };

    fetchData = async (val: string, isDefault = false, id = undefined) => {
        let data = [];
        const { request, dataSource } = this.props;
        if (request) {
            await this.setState({ fetching: true });
            const response = await request(val, id);
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
            data = this.formaterData(data);
        }
        this.setState({ data, loaded: data.length > 0 ? Loaded.Has : Loaded.Empty, fetching: false });
    };

    onSearch = (val: string) => {
        const { initData } = this.state;
        this.setState({ searchStr: val });
        if (getStrLeng(val) >= 1) {
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

    onBlur = () => {
        this.setState({ searchStr: '', canFocus: true });
        const { dropdownStatus, mode } = this.props;
        if (mode === 'multiple' && dropdownStatus) {
            this.fetchData('', true);
        }
    };

    formaterData = (data: any) => {
        const { fieldNames } = this.props;
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
        const { fieldNames } = this.props;
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

    addValueOptions = (values: any, data: any[]) => {
        if (values === undefined) return values;
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

    handleChange = (item: any) => {
        const { onChange, mode } = this.props;
        const { data } = this.state;
        if (mode !== 'multiple') {
            this.setState({
                selectedOption: item,
            });
        }
        if (onChange) {
            if (Array.isArray(item)) {
                const itemData = item.map((temp: any) => {
                    return {
                        ...temp,
                        value: temp.key,
                        ...(data.find((ls: any) => {
                            return ls.value === temp.key;
                        }) || {}),
                    };
                });
                onChange(itemData);
            } else if (item) {
                onChange({
                    ...item,
                    value: item.key,
                    ...(data.find((ls: any) => {
                        return ls.value === item.key;
                    }) || {}),
                });
            } else {
                // 集成清空操作
                onChange(item);
            }
        }
    };

    onSelect = (option: any) => {
        const { selectedOption } = this.state;
        const { onSelect, mode } = this.props;
        if (mode !== 'multiple' && selectedOption) {
            let selected: any = selectedOption;
            if (Array.isArray(selectedOption)) {
                selected = selectedOption[0];
            }
            const { key, label } = selected || {};
            if (key === option.key && label !== option.label) {
                this.handleChange(option);
            }
        }
        if (typeof onSelect === 'function') {
            onSelect(option);
        }
    };
    customName = (label: string, option: any) => {
        const { customName } = this.props;
        if (customName && typeof customName === 'function') {
            return customName(option)
        }
        return label;

    }

    notFoundContent = () => {
        const { fetching, loaded } = this.state;
        if (fetching) {
            return <Spin size="small" />;
        }
        if (loaded === Loaded.Empty) {
            return <span style={{ fontSize: '12px' }}>对不起,您查询的数据不存在或已被删除</span>;
        }
        return null;
    };

    render() {
        const { data, fetching, value } = this.state;
        const { selfCom, autoFocus, onChange, extraOption, dropdownRender, ...resert } = this.props;
        return (
            <>
                <BISelect
                    filterOption={false}
                    suffixIcon={<img alt="" className={s.suffixIcon} src="https://static.mttop.cn/admin/search.png" />}
                    {...resert}
                    value={value}
                    showSearch={true}
                    labelInValue={true}
                    notFoundContent={this.notFoundContent()}
                    onSearch={this.onSearch}
                    onChange={this.handleChange}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    onSelect={this.onSelect}
                    optionLabelProp="label"
                    dropdownRender={dropdownRender ? dropdownRender : (menu: any) => {
                        return (
                            <div>
                                {menu}
                                {extraOption && <Divider style={{ margin: '4px 0' }} />}
                                {extraOption}
                            </div>
                        );
                    }}
                >
                    {data.map((d: any) => {
                        // 特殊选项配置（选项显示文案fieldShowName>label，业务可能希望在选项中看的更多信息）
                        let showName = d.fieldShowName || d.label;
                        // 过滤掉没有id的选项（业务变更，将文本类型改为选择类型，后端可能没有处理数据）
                        // 特殊化处理字段显示
                        showName = this.customName(showName, d);
                        return (
                            <BISelect.Option key={d.value} value={d.value} label={d.label}>
                                {showName && showName.length > 20 ? (
                                    <Tooltip placement="topLeft" title={showName}>
                                        {showName}
                                    </Tooltip>
                                ) : (
                                        showName
                                    )}
                            </BISelect.Option>
                        );
                    })}
                </BISelect>
                {selfCom || null}
            </>
        );
    }
}

export default AssociationSearch;
