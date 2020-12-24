// 库/框架
import React, { Component } from 'react';
// 组件
import { Form, TreeSelect } from 'antd';
import BIInput from '@/ant_components/BIInput';
import BISelect from '@/ant_components/BISelect';
import BIButton from '@/ant_components/BIButton';
import BIRadio from '@/ant_components/BIRadio';
import BIDatePicker from '@/ant_components/BIDatePicker';
import BICheckbox from '@/ant_components/BICheckbox';
import OrgTreeSelect from '@/components/orgTreeSelect/index.tsx';
import BIForm from '@/ant_components/BIForm';
import AssociationSearch from '@/components/associationSearch/index.tsx';
import AssociationSearchFilter from '@/components/associationSearchFilter/index.tsx';
import NumberRange from '@/components/numberRange';
// import AdvancedSearch from '@/components/advancedSearch';
// 样式
import styles from './index.less';
// 工具
/* eslint-disable no-underscore-dangle */
// 基础搜索组件
class SearchView extends Component {
    _renderItem = (col) => {
        const {
            type, placeholder, options = [], style, disabled, className, render, componentAttr = {}, key,
        } = col;
        switch (type) {
            case 'select':
                return (
                    <BISelect
                        {...componentAttr}
                        className={className || styles.itemContent}
                        style={style || { width: '250px' }}
                        placeholder={placeholder || '请选择'}
                        disabled={disabled}
                        dropdownRender={
                            componentAttr.dropdownStatus
                                ? (menu) => {
                                    return (
                                        <div>
                                            <div>
                                                <BIButton
                                                    type="link"
                                                    onClick={() => {
                                                        this.props.form.setFieldsValue({
                                                            [`${key}`]: options.map((item) => {
                                                                return `${item.id}`;
                                                            }),
                                                        });
                                                    }}
                                                    onMouseDown={(e) => {
                                                        e.preventDefault();
                                                    }}
                                                >
                                                      全选
                                                </BIButton>
                                                {/* 反选功能 */}
                                                {/* <BIButton
                                                  type="link"
                                                  onClick={e => {
                                                      const result =
                                                          this.props.searchForm[`${key}`] || [];
                                                      const resultArr = options.filter(
                                                          item => result.indexOf(`${item.id}`) < 0,
                                                      );
                                                      this.props.form.setFieldsValue({
                                                          [`${key}`]: resultArr.map(
                                                              item => `${item.id}`,
                                                          ),
                                                      });
                                                  }}
                                                  onMouseDown={e => {
                                                      e.preventDefault();
                                                  }}
                                              >
                                                  反选
                                              </BIButton> */}
                                            </div>
                                            {menu}
                                        </div>
                                    );
                                }
                                : undefined
                        }
                        dropdownMenuStyle={componentAttr.dropdownStatus ? { borderTop: '1px solid #E1E1E1' } : null}
                    >
                        {options.map((option) => {
                            return (
                                <BISelect.Option value={option.id} key={option.id}>
                                    {option.name}
                                </BISelect.Option>
                            );
                        })}
                    </BISelect>
                );
            case 'selectMult':
                return (
                    <BISelect
                        {...componentAttr}
                        className={className || styles.itemContent}
                        mode="multiple"
                        placeholder={placeholder || '请选择'}
                        disabled={disabled}
                    >
                        {options.map((option) => {
                            return (
                                <BISelect.Option value={option.id} key={option.id}>
                                    {option.name}
                                </BISelect.Option>
                            );
                        })}
                    </BISelect>
                );
            case 'radio':
                return (
                    <BIRadio {...componentAttr} className={className || styles.itemContent} disabled={disabled}>
                        {options.map((option) => {
                            return (
                                <BIRadio.Radio value={option.id} key={option.id}>
                                    {option.name}
                                </BIRadio.Radio>
                            );
                        })}
                    </BIRadio>
                );
            case 'checkbox':
                return (
                    <BICheckbox
                        {...componentAttr}
                        className={[className || styles.itemContent, styles.checkboxContainer]}
                        disabled={disabled}
                    >
                        {options.map((option) => {
                            return (
                                <div className={styles.checkbox} key={option.id}>
                                    <BICheckbox.Checkbox value={option.id} key={option.id}>
                                        {option.name}
                                    </BICheckbox.Checkbox>
                                </div>
                            );
                        })}
                    </BICheckbox>
                );
            case 'date':
                return (
                    <BIDatePicker
                        {...componentAttr}
                        className={className || styles.itemContent}
                        placeholder={placeholder}
                        disabled={disabled}
                    />
                );
            case 'datetime':
                return (
                    <BIDatePicker
                        {...componentAttr}
                        placeholder={placeholder}
                        className={className || styles.itemContent}
                        showTime
                        disabled={disabled}
                    />
                );
            case 'daterange':
                return (
                    <BIDatePicker.BIRangePicker
                        {...componentAttr}
                        placeholder={placeholder}
                        onCalendarChange={this.changeRange.bind(this, col.key)}
                        className={className || styles.itemContent}
                        disabled={disabled}
                    />
                );
            case 'daterangetime':
                return (
                    <BIDatePicker.BIRangePicker
                        {...componentAttr}
                        placeholder={placeholder}
                        onCalendarChange={this.changeRange.bind(this, col.key)}
                        showTime
                        className={className || styles.itemContent}
                        disabled={disabled}
                    />
                );
            case 'orgtree':
                return (
                    <OrgTreeSelect
                        {...componentAttr}
                        placeholder={placeholder}
                        className={className || styles.itemContent}
                        disabled={disabled}
                        mode="org"
                    />
                );
            case 'usertree':
                return (
                    <OrgTreeSelect
                        {...componentAttr}
                        placeholder={placeholder}
                        className={className || styles.itemContent}
                        disabled={disabled}
                        mode="user"
                    />
                );
            case 'associationSearch':
                return (
                    <AssociationSearch
                        {...componentAttr}
                        placeholder={placeholder}
                        className={className || styles.itemContent}
                        disabled={disabled}
                        dropdownRender={
                            componentAttr.dropdownStatus
                                ? (menu) => {
                                    return (
                                        <div>
                                            <div>
                                                <BIButton
                                                    type="link"
                                                    onClick={async () => {
                                                        const res = await componentAttr.request();
                                                        const result = res.data.list.map((item) => {
                                                            return {
                                                                value: item.index,
                                                                label: item.value,
                                                            };
                                                        });
                                                        this.props.form.setFieldsValue({
                                                            [`${key}`]: result,
                                                        });
                                                    }}
                                                    onMouseDown={(e) => {
                                                        e.preventDefault();
                                                    }}
                                                >
                                                      全选
                                                </BIButton>
                                            </div>
                                            {menu}
                                        </div>
                                    );
                                }
                                : undefined
                        }
                        dropdownMenuStyle={componentAttr.dropdownStatus ? { borderTop: '1px solid #E1E1E1' } : null}
                    />
                );
            case 'associationSearchFilter':
                return (
                    <AssociationSearchFilter
                        {...componentAttr}
                        placeholder={placeholder}
                        getPopupContainer={(triggerNode) => {
                            return triggerNode.parentNode;
                        }}
                        className={className || styles.itemContent}
                        disabled={disabled}
                    />
                );
            case 'numberRange':
                return (
                    <NumberRange
                        {...componentAttr}
                        placeholder={placeholder}
                        className={className || styles.itemContent}
                        disabled={disabled}
                    />
                );
            case 'custom':
                return render(this.props.form);
            case 'tag':
                return (
                    <TreeSelect
                        {...componentAttr}
                        placeholder={placeholder}
                        className={className || styles.itemContent}
                        treeDefaultExpandAll
                    />
                );
            case 'search':
                return (
                    <BIInput.Search
                        {...componentAttr}
                        className={className || styles.itemContent}
                        placeholder={placeholder}
                        disabled={disabled}
                    />
                );
            // case 'advancedSearch':
            //     return (
            //         <AdvancedSearch
            //             {...componentAttr}
            //             className={className || styles.itemContent}
            //         />
            //     );
            default:
                return (
                    <BIInput
                        {...componentAttr}
                        className={className || styles.itemContent}
                        placeholder={placeholder}
                        disabled={disabled}
                    />
                );
        }
    };

    changeRange = (key, dates) => {
        if (dates.length !== 2) {
            return;
        }
        const newData = {};
        newData[key] = dates;
        this.props.form.setFieldsValue(newData);
    };

    _renderCol = (col) => {
        const { label, type, key, checkOption, className } = col;
        const { getFieldDecorator } = this.props.form;
        if (!key && type !== 'custom') {
            return null;
        }
        return (
            <div className={styles.colInner}>
                {!!label && <div className={styles.label}>{label}</div>}
                <div className={styles.itemWrap}>
                    <div className={className || styles.itemContent}>
                        {type === 'custom'
                            ? this._renderItem(col)
                            : getFieldDecorator(key, checkOption)(this._renderItem(col))}
                    </div>
                </div>
            </div>
        );
    };

    _renderRow = (arr, index) => {
        const len = arr.length;
        let colClass = styles.colWrap;
        if (len > 1) {
            colClass += ` ${styles[`_${len}`]}`;
        }
        return (
            <div className={styles.rowWrap} key={index}>
                {arr.map((col, i) => {
                    return (
                        <div className={colClass} key={i}>
                            {this._renderCol(col)}
                        </div>
                    );
                })}
            </div>
        );
    };

    render() {
        const { style, searchCols = [] } = this.props;
        return (
            <BIForm className={styles.view} style={style}>
                {searchCols.map((arr, index) => {
                    return this._renderRow(arr, index);
                })}
            </BIForm>
        );
    }
}

function mapPropsToFields(props) {
    const { searchForm } = props;
    const returnObj = {};
    if (!searchForm || typeof searchForm !== 'object') return returnObj;
    Object.keys(searchForm).forEach((item) => {
        let value = searchForm[item];
        if (Array.isArray(searchForm[item])) {
            value = searchForm[item].slice();
        }
        returnObj[item] = Form.createFormField({
            value,
        });
    });
    return returnObj;
}

function onValuesChange(props, changedValues, allValues) {
    props.onChangeParams(props, changedValues, allValues);
}

export default Form.create({ name: 'search_view', mapPropsToFields, onValuesChange })(SearchView);
