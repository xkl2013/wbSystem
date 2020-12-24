import React, { useMemo } from 'react';
import classnames from 'classnames';
import {
    Button as BIButton,
    Checkbox,
    Form,
    Row, Col,
} from 'antd';
// base-component
import Input from './baseComponent/input';
import DatePicker from './baseComponent/date';
import RangePicker from './baseComponent/rangePicker';
import Search from './baseComponent/selectSearch'
import Filter from '../filterCondition';
import styles from './styles.less';





export type searchCols = {
    key: string;
    type: string;
    label?: string | undefined;
    span?: number | undefined;       // 控件站位宽度
    expand?: boolean | undefined;     // 是否折叠
    itemAttr?: any;                  // 设置form.item, antd全量设
}
interface Props {
    searchCols?: searchCols[];
    advancedSearchCols?: searchCols[];
    searchForm?: any;
    search?: Function;
    onChangeParams?: Function
    onResert: Function
    onSubmit: Function
}
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
};
const SearchForm = (props: Props) => {
    const [form] = Form.useForm();
    const { searchCols = [], advancedSearchCols, searchForm } = props;
    const onValuesChange = (changedValues: any, allValues: any) => {
        if (props.onChangeParams) {
            console.log(allValues)
            props.onChangeParams(changedValues, allValues)
        }
    }
    const _renderItem = (col: any) => {
        const { type, placeholder, options = [], style, disabled, className, render, componentAttr = { width: 320 }, key } = col;
        switch (type) {
            case 'checkbox':
                return (
                    <Checkbox.Group
                        {...componentAttr}
                        className={[className || styles.itemContent, styles.checkboxContainer]}
                        disabled={disabled}
                    >
                        {options.map((option: any) => {
                            return (
                                <div className={styles.checkbox} key={option.id}>
                                    <Checkbox value={option.id} key={option.id}>
                                        {option.name}
                                    </Checkbox>
                                </div>
                            );
                        })}
                    </Checkbox.Group>
                );
            case 'date':
                return (
                    <DatePicker
                        {...componentAttr}
                        allowClear
                        className={classnames(styles.timeStyle, className || styles.itemContent)}
                        placeholder={placeholder}
                        disabled={disabled}
                    />
                );
            case 'daterange':
                return (
                    <RangePicker
                        {...componentAttr}
                        allowClear
                        placeholder={placeholder}
                        className={classnames(styles.timeStyle, className || styles.itemContent)}
                        disabled={disabled}
                    />
                );
            case 'search':
                return (
                    <Search
                        {...componentAttr}
                        allowClear
                        request={col.request}
                        optionsKey={col.optionsKey}
                        placeholder={placeholder}
                        className={classnames(styles.timeStyle, className || styles.itemContent)}
                        disabled={disabled}
                    />
                );
            default:
                return (
                    <Input
                        {...componentAttr}
                        className={classnames(styles.timeStyle, className || styles.itemContent)}
                        placeholder={placeholder}
                        disabled={disabled}
                    />
                );
        }
    };
    const getFields = () => {
        const children = searchCols.map((ls: searchCols, i) => {
            const { label } = ls;
            const node = _renderItem(ls);
            return (
                <Col span={ls.span || 8} key={i} className={styles.colInner}>
                    {!!label && <div className={styles.label}>{label}</div>}
                    <div className={styles.itemContent}>
                        {node ? (
                            <Form.Item

                                {...(ls.itemAttr || {})}
                                name={ls.key}
                            >
                                {node}
                            </Form.Item>
                        ) : null}
                    </div>
                </Col>
            )
        })
        return children;
    }
    const fields = useMemo(getFields, [searchCols])
    const onResert = () => {
        form.resetFields();
        if (props.onResert) {
            props.onResert();
        }
    }
    return (
        <div>
            <Form
                form={form}
                onValuesChange={onValuesChange}
                name="register">
                <Row gutter={24}>{fields}</Row>
            </Form>
            {/* 已选条件、搜索按钮 */}
            <Filter onResert={onResert} onSubmit={props.onSubmit} />
        </div>
    )
}
export default SearchForm