import React from 'react';
import { Cascader, message } from 'antd';
import classNames from 'classnames';
import { getCooperationBrand, addBrand2Diction } from '@/services/dictionary';
import BIInput from '@/ant_components/BIInput';
import BIModal from '@/ant_components/BIModal';
import s from './style.less';
/*
 * Cascader 组件
 *
 * 基于原 ant Cascader
 * 只扩展自定义样式
 * */

class BICascader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: undefined,
            options: [],
            parentNode: null, // 一级品牌节点备份
            brandName: '',
            visible: false,
            filtering: false, // 筛选中标记，用来区分筛选和普通状态下的样式
        };
    }

    componentDidMount() {
        this.handleValue(this.props.value);
        this.getCooperationBrand();
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
            this.handleValue(nextProps.value);
        }
    }

    // 获取合作品牌列表
    getCooperationBrand = async () => {
        let cooperationBrand = [];
        const addBrand = { code: 'addBrand', value: '+添加品牌' };
        const addChildBrand = { code: 'addChildBrand', value: '+添加子品牌' };
        const response = await getCooperationBrand();
        if (response && response.success && response.data) {
            cooperationBrand = response.data;
            // 二级品牌下增加子品牌选项
            cooperationBrand.map((item) => {
                if (!item.children || item.children.length === 0) {
                    item.children = [addChildBrand];
                } else if (item.children[item.children.length - 1].code !== 'addChildBrand') {
                    item.children.push(addChildBrand);
                }
            });
            // 一级品牌下增加品牌选项
            if (cooperationBrand[cooperationBrand.length - 1].code !== 'addBrand') {
                cooperationBrand.push(addBrand);
            }
        }
        this.setState({
            options: cooperationBrand,
        });
    };

    onChange = (val, ops) => {
        const { filtering } = this.state;
        // 选择选项后重置筛选样式
        if (filtering) {
            this.setState({
                filtering: false,
            });
        }
        // 点击增加品牌时
        if (val[0] === 'addBrand') {
            this.setState({
                visible: true,
            });
            return;
        }
        // 点击增加子品牌时
        if (val[1] === 'addChildBrand') {
            this.setState({
                visible: true,
                parentNode: ops[0],
            });
            return;
        }
        this.changeValue(val, ops);
    };

    changeValue = (val, ops) => {
        const { label, value } = this.returnFieldNames();
        const newValue = ops
            ? ops.map((item) => {
                return {
                    value: item[value],
                    name: item[label],
                    ...item,
                };
            })
            : ops;
        this.onSaveValue(val);
        if (this.props.onChange) {
            this.props.onChange(val, newValue);
        }
    };

    handleValue = (values) => {
        const { value } = this.returnFieldNames();
        const newValue = Array.isArray(values)
            ? values.map((item) => {
                return item[value] ? item[value] : item;
            })
            : values;
        this.onSaveValue(newValue);
    };

    onSaveValue = (value) => {
        this.setState({
            value,
        });
    };

    returnFieldNames = () => {
        const initFieldNames = { label: 'label', value: 'value', children: 'children' };
        const { fieldNames = initFieldNames } = this.props;
        return fieldNames;
    };

    onChangeBrandName = (e) => {
        this.setState({
            brandName: e.target.value,
        });
    };

    onCancel = () => {
        this.setState({
            visible: false,
            brandName: '',
            parentNode: null,
        });
    };

    onAddBrand = async () => {
        const { brandName, parentNode } = this.state;
        if (!brandName) {
            message.error('请输入品牌名称');
            return;
        }
        const data = { value: brandName };
        if (parentNode) {
            data.parentId = parentNode.id;
        }
        const res = await addBrand2Diction(data);
        if (res && res.success && res.data) {
            message.success('新增成功');
            // 新增成功后将品牌回填到表单
            if (parentNode) {
                this.changeValue([parentNode.code, res.data.code], [parentNode, res.data]);
            } else {
                this.changeValue([res.data.code], [res.data]);
            }
            // 新增品牌后重新拉取最新品牌列表
            this.getCooperationBrand();
            this.onCancel();
        }
    };

    filter = (inputValue, path) => {
        const { filtering } = this.state;
        if (inputValue && !filtering) {
            this.setState({
                filtering: true,
            });
        }
        // 过滤掉自己添加的增加子品牌选项
        if (path[path.length - 1].code === 'addChildBrand') {
            return false;
        }
        return path.some((option) => {
            // 过滤掉自己添加的增加品牌选项
            if (option.code === 'addBrand') {
                return false;
            }
            return option.value.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
        });
    };

    render() {
        const {
            value, options, brandName, visible, parentNode, filtering,
        } = this.state;
        return (
            <>
                <Cascader
                    popupClassName={filtering ? classNames(s.casContainer, s.filtering) : s.casContainer}
                    {...this.props}
                    onChange={this.onChange}
                    value={value}
                    options={options}
                    showSearch={{ filter: this.filter }}
                />
                <BIModal
                    visible={visible}
                    title={parentNode ? '添加子品牌' : '添加品牌'}
                    onCancel={this.onCancel}
                    onOk={this.onAddBrand}
                    maskClosable={false}
                    destroyOnClose={true}
                >
                    <BIInput
                        value={brandName}
                        onChange={this.onChangeBrandName}
                        placeholder={parentNode ? '请输入子品牌名称' : '请输入品牌名称'}
                        autoFocus={true}
                    />
                </BIModal>
            </>
        );
    }
}

export default BICascader;
