import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { Form, Button } from 'antd';
import { config } from '../component/base/config';
import { transferAttr } from '../component/base/_utils/transferAttr';
import { setFormat, getFormat } from '../component/base';
import styles from './index.less';

const FormItem = Form.Item;
const EditForm = (props: any) => {
    const [form] = Form.useForm();
    const {
        data, rowData, onFinish, initialValues, onCancel, colsNum = 1,
    } = props;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        form.resetFields();
    }, [data]);
    if (!rowData) {
        form.resetFields();
    }

    const renderEditForm = (item: any) => {
        const {
            columnType,
            columnName,
            columnChsName,
            columnAttrObj,
            value,
            renderEditForm,
            readOnlyFlag,
            rules = [],
            validateFirst = true,
            validateTrigger = 'onChange',
        } = item;
        let detailConfig: any;
        if (typeof renderEditForm === 'function') {
            detailConfig = renderEditForm({ cellData: value, rowData, columnConfig: item });
        } else {
            detailConfig = config[String(columnType)] || config['1'];
        }
        const EditComp: any = detailConfig.editComp;
        const newProps = {
            ...(detailConfig.componentAttr || {}),
            ...(columnAttrObj || {}),
        };
        const transferColumn = transferAttr(columnType, newProps);
        return (
            <FormItem
                name={columnName}
                key={columnName}
                label={columnChsName}
                rules={[{ required: !!item.requiredFlag }, ...rules]}
                initialValue={getFormat(detailConfig, item, value)}
                validateFirst={validateFirst}
                validateTrigger={validateTrigger}
            >
                <EditComp {...transferColumn} columnConfig={item} disabled={readOnlyFlag} origin="editForm" />
            </FormItem>
        );
    };
    const formItemLayout = {
        labelCol: { span: 24 },
        wrapperCol: { span: 24 },
    };
    const onSelfFinish = async (values: any) => {
        const newValues: any[] = [];
        _.keys(values).map((key) => {
            const item = data.find((temp: any) => {
                return temp.columnName === key;
            });
            const { columnType, value, renderEditForm, readOnlyFlag } = item;
            if (readOnlyFlag) {
                return;
            }
            let detailConfig: any;
            if (typeof renderEditForm === 'function') {
                detailConfig = renderEditForm({ cellData: value, rowData, columnConfig: item });
            } else {
                detailConfig = config[String(columnType)] || config['1'];
            }
            const cellValueList = setFormat(detailConfig, item, values[key], value);
            newValues.push({
                columnCode: key,
                cellValueList,
            });
        });
        if (typeof onFinish === 'function') {
            await setLoading(true);
            await onFinish(newValues);
            await setLoading(false);
        }
    };
    return (
        <div className={styles.wrap}>
            <Form
                form={form}
                layout="vertical"
                name="form"
                {...formItemLayout}
                onFinish={onSelfFinish}
                initialValues={initialValues}
                scrollToFirstError
            >
                {data.map((item: any, i: number) => {
                    return (
                        <div
                            className={styles.item}
                            style={{
                                width: `${100 / colsNum}%`,
                                marginLeft: colsNum > 1 && i % colsNum === 0 ? '-50px' : 0,
                                paddingLeft: colsNum > 1 ? '50px' : 0,
                            }}
                        >
                            {renderEditForm(item)}
                        </div>
                    );
                })}
                <div className={styles.btns}>
                    <Button className={styles.btn} htmlType="button" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button className={styles.btn} type="primary" htmlType="submit" loading={loading}>
                        Save
                    </Button>
                </div>
            </Form>
        </div>
    );
};
export default EditForm;
