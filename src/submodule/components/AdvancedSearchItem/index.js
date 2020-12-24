/* eslint-disable */
/*
 * @Author: CaiChuanming
 * @Date: 2020-01-14 11:28:09
 * @LastEditTime : 2020-01-16 15:39:18
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /admin_web/src/components/AdvancedSearchItem/index.js
 */
import React from 'react';
import styles from './index.less';
import BISelect from '@/ant_components/BISelect';
import BIInput from '@/ant_components/BIInput';
import { switchCase } from '@babel/types';
import BIDatePicker from '@/ant_components/BIDatePicker';

// 测试数据
const searchEnum = [
    {
        value: '1',
        label: 'input',
        advancedType: 'input',
    },
    {
        value: '2',
        label: '模糊搜索',
        advancedType: 'search',
    },
    {
        value: '3',
        label: '复选框',
        advancedType: 'checkbox',
    },
    {
        value: '4',
        label: '单选框',
        advancedType: 'radio',
    },
    {
        value: '5',
        label: '时间',
        advancedType: 'data',
    },
];

class AdvancedSearchItem extends React.Component {
    constructor(props) {
        super(props);
    }

    // 删除筛选条件
    removeTerm = (index) => {
        const { onChangeTermFn, advancedForm } = this.props;
        if (advancedForm.length < 2) {
            return;
        }
        advancedForm.splice(index, 1);
        onChangeTermFn(advancedForm);
    };

    // 切换筛选条件
    onChangeTerm = (values = {}, all = {}, index) => {
        const { onChangeTermFn, advancedForm } = this.props;
        let result = null;
        if (Object.keys(values).length !== 0) {
            const typeIndex = searchEnum.findIndex((item) => values.key === item.value);
            result = Object.assign({}, all, { type: values, advancedType: searchEnum[typeIndex].advancedType });
        } else {
            result = Object.assign({}, all, { type: [] });
        }
        advancedForm.splice(index, 1, result);
        onChangeTermFn(advancedForm);
    };

    // 根据类型展示搜索字段
    advancedItem = (advancedType) => {
        switch (advancedType) {
            case 'input':
                return <BIInput className={styles.termBody} placeholder="请填写搜索条件" />;
            case 'search':
                return 'search';
            case 'checkbox':
                return 'checkbox';
            case 'radio':
                return 'radio';
            case 'data':
                return <BIDatePicker placeholder="请选择时间" showTime />;
            default:
                return null;
        }
    };

    advancedRender = () => {
        const { advancedForm } = this.props;
        return advancedForm.map((item, index) => (
            <div className={styles.termContext} key={index}>
                {/* 搜索条件 */}
                <BISelect
                    showSearch
                    className={styles.termHead}
                    placeholder="请选择搜索字段"
                    onChange={this.onChange}
                    onSearch={this.onSearch}
                    labelInValue={true}
                    value={item.type}
                    allowClear={true}
                    onChange={(values) => {
                        this.onChangeTerm(values, item, index);
                    }}
                >
                    {searchEnum.map((cItem) => {
                        return <BISelect.Option value={cItem.value}>{cItem.label}</BISelect.Option>;
                    })}
                </BISelect>
                {this.advancedItem(item.advancedType)}
                {/* 删除 */}
                {advancedForm.length > 1 && (
                    <div
                        onClick={() => {
                            return this.removeTerm(index);
                        }}
                        className={styles.termDelete}
                    />
                )}
            </div>
        ));
    };

    render() {
        return <div>{this.advancedRender()}</div>;
    }
}
export default AdvancedSearchItem;
