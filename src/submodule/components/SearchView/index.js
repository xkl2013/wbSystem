// 库/框架
import React from 'react';
import classnames from 'classnames';
// 第三方组件
import { Form, TreeSelect, Row, Col } from 'antd';
// ant_components
import BIInput from '@/ant_components/BIInput';
import BISelect from '@/ant_components/BISelect';
import BIButton from '@/ant_components/BIButton';
import BIRadio from '@/ant_components/BIRadio';
import BIDatePicker from '@/ant_components/BIDatePicker';
import BICheckbox from '@/ant_components/BICheckbox';
import BIForm from '@/ant_components/BIForm';
// components
import OrgTreeSelect from '@/components/orgTreeSelect/index.tsx';
import AssociationSearch from '@/components/associationSearch/index.tsx';
import AssociationSearchFilter from '@/components/associationSearchFilter/index.tsx';
import NumberRange from '@/components/numberRange';
import SearchViewAdvanced from '@/submodule/components/SearchViewAdvanced';
// 样式
import styles from './index.less';
// 工具
/* eslint-disable no-underscore-dangle */
// 基础搜索组件
// mode分为page 为页面模式下的搜索框, modal 弹框模式下搜索组件
/**
 * select 拓展参数,将options 设置成function,用于基于业务处理options回调
 */


const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
    },
};
class SearchView extends React.Component {
    _renderItem = (col) => {
        const { type, placeholder, options = [], style, disabled, className, render, componentAttr = {}, key } = col;
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
                        className={classnames(styles.timeStyle, className || styles.itemContent)}
                        placeholder={placeholder}
                        disabled={disabled}
                    />
                );
            case 'datetime':
                return (
                    <BIDatePicker
                        {...componentAttr}
                        placeholder={placeholder}
                        className={classnames(styles.timeStyle, className || styles.itemContent)}
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
                        className={classnames(styles.timeStyle, className || styles.itemContent)}
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
                        className={classnames(styles.timeStyle, className || styles.itemContent)}
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
    _renderModalForm = (col) => {
        const { label, type, key, checkOption = [], className } = col;
        const { getFieldDecorator } = this.props.form;
        return (
            <Form.Item label={label} className={styles.formItem} key={key}>
                {getFieldDecorator(key, checkOption)(this._renderItem(col))}
            </Form.Item>
        )

    }

    _renderCol = (col) => {
        const { label, type, key, checkOption, className } = col;
        const { getFieldDecorator } = this.props.form;
        if (!key && type !== 'custom') {
            return null;
        }
        if (this.props.modal === 'modal') {
            return this._renderModalForm(col);
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
        if (len > 0) {
            colClass += ` ${styles[`_${len}`]}`;
        }
        return (
            <div className={classnames(styles.rowWrap, this.props.modal === 'modal' ? styles.modalRowWrap : '')} key={index}>
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
    /**
     * 弹框模式下渲染数据,使用以为数组,平铺展示
     */
    _renderModalItem = (col = {}) => {
        if (Object.prototype.toString.call(col) !== '[object Object]') return null;
        return this._renderModalForm(col)

    }

    render() {
        const { style, searchCols = [], advancedSearchCols = [], modal } = this.props;
        return (
            <BIForm className={styles.view} {...(this.props.formItemLayout || formItemLayout)} style={style}>
                {/* 基础搜索 modal模式下为对象,非modal下为数组 */}
                {searchCols.map((arr, index) => {
                    return modal === 'modal' ? this._renderModalItem(arr) : this._renderRow(arr, index);
                })}
                {/* 高级搜索 */}
                {Array.isArray(advancedSearchCols) && advancedSearchCols.length > 0 ? (
                    <SearchViewAdvanced>
                        {advancedSearchCols.map((arr, index) => {
                            return this._renderRow(arr, index);
                        })}
                    </SearchViewAdvanced>
                ) : null}
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
