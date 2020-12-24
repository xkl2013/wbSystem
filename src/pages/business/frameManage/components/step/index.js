import React, { useState, useEffect, forwardRef } from 'react';
import IconFont from '@/components/CustomIcon/IconFont';
import NumberArea from '../numberArea';
import styles from './styles.less';
import { getFormate, setFormate } from './_utils';

/**
 *
 * @param {rowData} "executeAmount" 执行金额
 */

/* eslint-disable no-useless-escape */
const initItem = (preItem) => {
    if (!preItem) {
        // 新增第一条数据
        return { min: 0, max: undefined, type: 'oc', taxesRate: undefined, initType: 'add' };
    }
    return { min: preItem.max, max: undefined, type: 'co', taxesRate: undefined, initType: 'add' };
};
const toFixed = (num) => {
    return num.toFixed(2);
};
function Step(props, ref) {
    const { columnConfig = {} } = props;
    const { disabled } = columnConfig.columnAttrObj || {};
    const [executeAmountVal, setExecuteAmountVal] = useState(0);
    const [value, setValue] = useState(setFormate(props.value));
    const getExecuteAmount = (rowData = []) => {
        // 获取执行金额
        const obj = rowData.find((ls) => {
            return ls.colName === 'executeAmount';
        }) || {};
        const executeAmountArr = Array.isArray(obj.cellValueList) ? obj.cellValueList : [];
        let executeAmountVal = (executeAmountArr[0] || {}).value;
        executeAmountVal = executeAmountVal ? Number(executeAmountVal) : executeAmountVal;
        return executeAmountVal;
    };
    useEffect(() => {
        setValue(setFormate(props.value));
    }, [props.value]);
    useEffect(() => {
        const executeAmountVal = getExecuteAmount(props.rowData);
        setExecuteAmountVal(executeAmountVal || 0);
    }, [props.rowData]);
    const onPropsChange = (val) => {
        const { changeParams } = props;
        const formateVal = !val || val.length === 0 ? undefined : getFormate(val);
        if (props.onChange) {
            props.onChange(formateVal);
        }
        if (changeParams) {
            // 同步form使用,后期会封装到组件里面
            changeParams(formateVal);
        }
    };
    const addItem = (preItem) => {
        const row = initItem(preItem);
        setValue([...value, row]);
    };
    const deleteItem = (index) => {
        const newValue = value.slice();
        const preItem = value[index - 1];
        const nextItem = value[index + 1];
        if (!preItem && index < value.length - 1) {
            // 删除集合中第一个且不是最后一个
            newValue[index + 1] = { ...nextItem, min: 0, type: 'oc' };
        } else if (preItem && index < value.length - 1) {
            newValue[index + 1] = { ...nextItem, min: preItem.max, type: 'co' };
        }
        newValue.splice(index, 1);
        setValue(newValue);
        onPropsChange(newValue);
    };
    const renderAddBtn = (index) => {
        if (disabled) return null; // 禁用下
        if (index === undefined) {
            return (
                <IconFont
                    className={styles.addTagIcon}
                    type="icontianjiabiaoqian"
                    onClick={addItem.bind(null, undefined)}
                />
            );
        }
        if (index !== value.length - 1) return null; // 只在最后一条下加新增按钮
        if (index > 0 && (value[index - 1] || {}).taxesRate === 1) return null; // 金额比例100%之后不在添加
        const currentVal = value[index] || {};
        if (!currentVal.max || (!currentVal.taxesRate && currentVal.taxesRate !== 0)) return null; // 只有填写完整才能填写下一个
        return (
            <IconFont
                className={styles.addTagIcon}
                type="icontianjiabiaoqian"
                onClick={addItem.bind(null, value[index])}
            />
        );
    };
    const renderDelBtn = (index) => {
        if (disabled) return null; // 禁用下
        return <IconFont className={styles.delTagIcon} type="iconshanchu" onClick={deleteItem.bind(null, index)} />;
    };
    const onChange = (val, index) => {
        const newVal = value.slice();
        if (index < value.length - 1) {
            newVal[index] = val || {};
            newVal[index + 1] = { ...newVal[index + 1], min: val.max };
        } else {
            newVal[index] = val || {};
        }
        setValue(newVal);
        onPropsChange(newVal);
    };
    const returnMaxFields = ({ currentItem, nextItem, executeAmountVal }) => {
        // 当前输入值一定小于执行金额
        return {
            // disabled,
            disabled: disabled || currentItem.initType !== 'add' ? currentItem.max <= executeAmountVal : false,
            min: executeAmountVal > (currentItem.min || 0) ? executeAmountVal : currentItem.min || 0,
            max: nextItem.max,
        };
    };
    const returnTaxesRateFields = ({ preItem, currentItem, nextItem }) => {
        // 当前输入值一定小于执行金额
        return {
            // disabled,
            disabled: disabled || currentItem.initType !== 'add' ? currentItem.max <= executeAmountVal : false,
            min: preItem.taxesRate ? Number(toFixed(preItem.taxesRate * 100)) : 0,
            max: nextItem.taxesRate ? Number(toFixed(nextItem.taxesRate * 100)) : 100,
        };
    };
    return (
        <div className={styles.wrap} ref={ref}>
            {value.map((ls, index) => {
                const preItem = index > 0 ? value[index - 1] : {}; //
                const nextItem = value.length - 1 > index ? value[index + 1] : {};
                const currentItem = value[index];
                const isNoEdit = ls.initType !== 'add' && executeAmountVal && currentItem.min <= executeAmountVal;
                return (
                    <div className={styles.item} key={index}>
                        <span className={styles.itemTitle}>
                            阶梯
                            {index + 1}
                            :
                        </span>
                        <span className={styles.itemContainer}>
                            <NumberArea
                                index={index}
                                disabled={disabled}
                                value={ls}
                                maxFields={returnMaxFields({ preItem, currentItem, nextItem, executeAmountVal })}
                                taxesRateFields={returnTaxesRateFields({
                                    preItem,
                                    currentItem,
                                    nextItem,
                                    executeAmountVal,
                                })}
                                onChange={(val) => {
                                    return onChange(val, index);
                                }}
                            />
                            {!isNoEdit ? renderDelBtn(index) : null}
                            {renderAddBtn(index)}
                        </span>
                    </div>
                );
            })}
            {value.length === 0 ? renderAddBtn() : null}
        </div>
    );
}
export default forwardRef(Step);
