import React, { Component } from 'react';
import moment from 'moment';
import styles from '../styles.less';
import Upload from '@/components/upload';
import FlexDetail from '@/components/flex-detail';

export default class CommonDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {};
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
        return value;
        // return moment(value).format('YYYY-MM-DD');
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

    renderItem = () => {
        const { instanceData } = this.props;
        const approvalForm = instanceData.approvalForm || {};
        const data = Array.isArray(approvalForm.approvalFormFields) ? approvalForm.approvalFormFields : [];
        let newData = data.filter((ls) => {
            return ls.type !== 'hidden';
        });
        newData = this.formattingData(newData);
        return newData.map((item) => {
            return (
                <li key={item.id} className={styles.item}>
                    <span className={styles.label}>{item.title}</span>
                    <span className={styles.value}>{this.checkoutItemType(item)}</span>
                </li>
            );
        });
    };

    render() {
        return (
            <FlexDetail LabelWrap={[[]]} detail={{}} title="审批详情">
                <ul className={styles.content}>{this.renderItem()}</ul>
            </FlexDetail>
        );
    }
}
