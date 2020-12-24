import React from 'react';
import moment from 'moment';
import { Row, Col } from 'antd';
import Upload from '@/components/upload';
import styles from '../styles.less';

import { formateValue } from './common';

class PropagateDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pannerData: [], // 宣传明细
            totalMoney: 0,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (
            JSON.parse(JSON.stringify(this.props.instanceData)) !== JSON.parse(JSON.stringify(nextProps.instanceData))
        ) {
            this.panelMth();
        }
    }

    formateValue = (item) => {
        const { value } = item;
        const itemType = item.type;
        if (!value) return value;
        const type = typeof value;
        switch (type) {
            case 'object':
                const isArr = Array.isArray(value);
                return isArr ? this.returnArrayValue(value, itemType) : this.formmateDatePicker(value.name, itemType);
            default:
                return this.formmateDatePicker(value, itemType);
        }
    };

    formmateDatePicker = (value, type) => {
        const isData = /picker/i.test(type);
        if (!isData || !value) return value;
        return moment(value).format('YYYY-MM-DD');
    };

    returnArrayValue = (arr, itemType) => {
        const newArr = arr.map((item) => {
            let newitem = item;
            if (typeof item === 'object' && item) {
                newitem = item.name;
            }
            return this.formmateDatePicker(newitem, itemType);
        });
        return newArr.join(',');
    };

    formateLink = (item) => {
        if (
            item.approvalFromFieldAttrs
            && item.type === 'business'
            && item.name === 'common_ContractCommerce'
            && Array.isArray(item.approvalFromFieldAttrs)
            && Array.isArray(item.value)
        ) {
            const approvalFromFieldAttrs = item.approvalFromFieldAttrs[0];
            const linkUrl = approvalFromFieldAttrs.attrValue;
            const linkId = item.value[0].value;
            return (
                <a href={`${linkUrl}?id=${linkId}`} target="_blank" rel="noopener noreferrer">
                    {item.value[0].name}
                </a>
            );
        }
        return this.formateValue(item);
    };

    checkoutItemType = (item) => {
        const { type } = item;
        switch (type) {
            case 'upload':
                return <Upload.Detail data={item.value} />;
            case 'imageupload':
                return <Upload.Detail data={item.value} />;
            case 'business':
                return this.formateLink(item);
            default:
                return this.formateValue(item);
        }
    };

    renderFile = () => {
        const apprlvalDetail = JSON.parse(JSON.stringify(this.props.instanceData)) || {};
        const approvalForm = apprlvalDetail.approvalForm || {};
        const data = Array.isArray(approvalForm.approvalFormFields) ? approvalForm.approvalFormFields : [];
        let newData = data.filter((ls) => {
            return ls.type !== 'hidden';
        });
        newData = this.formattingData(newData);
        return newData.map((item) => {
            if (item.type !== 'upload') {
                return null;
            }
            return (
                <li key={item.id} className={styles.item}>
                    <span className={styles.label}>{item.title}</span>
                    <span className={styles.value}>{this.checkoutItemType(item)}</span>
                </li>
            );
        });
    };

    renderItem = () => {
        const apprlvalDetail = JSON.parse(JSON.stringify(this.props.instanceData)) || {};
        const approvalForm = apprlvalDetail.approvalForm || {};
        const data = Array.isArray(approvalForm.approvalFormFields) ? approvalForm.approvalFormFields : [];
        let newData = data.filter((ls) => {
            return ls.type !== 'hidden';
        });
        newData = this.formattingData(newData);

        return newData.map((item) => {
            if (item.type === 'panel' || item.type === 'upload') {
                return null;
            }
            return (
                <Row className={styles.itemContent} key={item.id}>
                    <Col span={6} style={{ height: 'unset', maxWidth: '120px' }}>
                        {' '}
                        {`${item.title}：`}
                    </Col>
                    <Col span={18} style={{ height: 'unset', textAlign: 'left' }}>
                        {' '}
                        {this.checkoutItemType(item)}
                    </Col>
                </Row>
            );
        });
    };

    formattingData = (arr) => {
        // 格式化日期
        return arr.map((item) => {
            if (item.type === 'datepicker' && item.value) {
                Object.assign({}, item, { value: moment(item.value).format('YYYY-MM-DD') });
            }
            if (item.type === 'timepicker' || item.type === 'rangepicker') {
                Object.assign({}, item, { value: moment(item.value).format('YYYY-MM-DD HH:mm') });
            }
            return item;
        });
    };

    renderPanel = () => {
        const pannerData = Array.isArray(this.state.pannerData) ? this.state.pannerData : [];
        // 展示panel
        return pannerData.map((item, index) => {
            return (
                <ul className={styles.content} key={index}>
                    <div className={styles.titleContent}>
                        采购物品明细
                        {index + 1}
                    </div>
                    {item.map((i) => {
                        return (
                            <li key={i.id} className={styles.item}>
                                <span className={styles.label}>{i.title}</span>
                                <span className={styles.value}>{i.name}</span>
                            </li>
                        );
                    })}
                </ul>
            );
        });
    };

    panelMth = () => {
        // 获取panle 数据
        const apprlvalDetail2 = JSON.parse(JSON.stringify(this.props.instanceData)) || {};
        const data2 = apprlvalDetail2.approvalForm.approvalFormFields;
        data2.map((item) => {
            if (item.type === 'panel') {
                const pannerData = this.changeData(item).value;
                const totalMoney = this.getTotalMoney(item);
                this.setState({
                    pannerData,
                    totalMoney,
                });
            }
        });
    };

    formattingOneLevel = (approvalFormFields = [], value = []) => {
        // 循环一级
        return value.map((item) => {
            const obj = approvalFormFields.filter((ls) => {
                return Number(ls.id) === Number(item.fieldId);
            })[0] || {};
            obj.value = item.fieldValue;
            return obj;
        });
    };

    getTotalMoney = (obj) => {
        // 采购总金额
        const { approvalFormFields = [] } = obj || {};
        const value = Array.isArray(obj.value) ? obj.value : [];
        const idArr = approvalFormFields.filter((i) => {
            return i.name === 'WPJG';
        });
        const id = idArr[0] && idArr[0].id;
        let totalMoney = 0;
        value.map((item) => {
            item.map((i) => {
                if (Number(i.fieldId) === Number(id)) {
                    totalMoney += Number(i.fieldValue);
                }
            });
        });
        return totalMoney.toFixed(2);
    };

    changeData(obj) {
        // 转换数据
        const newObj = JSON.parse(JSON.stringify(obj));
        const { approvalFormFields = [], value = [] } = newObj;
        if (value && value.length > 0) {
            const newValue = value.map((item) => {
                const arr = this.formattingOneLevel(approvalFormFields, item);
                const newArr = formateValue(arr);
                return newArr;
            });
            newObj.value = newValue;
        }
        return newObj;
    }

    render() {
        return (
            <div className={styles.wrap}>
                {this.renderItem()}
                <div className={styles.itemContent}>
                    物品总金额：
                    <span>{`¥${this.state.totalMoney}`}</span>
                </div>
                {this.renderPanel()}
                <ul className={styles.content}>{this.renderFile()}</ul>
            </div>
        );
    }
}
export default PropagateDetail;
