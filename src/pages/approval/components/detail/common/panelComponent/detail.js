/* eslint-disable */
import React from 'react';
import moment from 'moment';
import styles from './detail.less';
import Upload from '@/components/upload';
import { getOutOffice } from '@/services/globalDetailApi';
import FlexDetail from '@/components/flex-detail';
import BITable from '@/ant_components/BITable';
import { getOptionName, thousandSeparatorFixed } from '@/utils/utils';
import { OUTOFFICESTATUS } from '@/utils/enum';
import { formateValue } from './formatting';

export default class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pannerData: [], // 宣传明细
            list: [], // 一般list
            totalMoney: 0,
        };
    }

    componentWillMount() {}
    componentWillReceiveProps(nextProps) {
        if (
            JSON.parse(JSON.stringify(this.props.apprlvalDetail)) !==
            JSON.parse(JSON.stringify(nextProps.apprlvalDetail))
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
            item.approvalFromFieldAttrs &&
            item.type === 'business' &&
            item.name === 'common_ContractCommerce' &&
            Array.isArray(item.approvalFromFieldAttrs) &&
            Array.isArray(item.value)
        ) {
            const approvalFromFieldAttrs = item.approvalFromFieldAttrs[0];
            const linkUrl = approvalFromFieldAttrs.attrValue;
            const linkId = item.value[0].value;
            return (
                <a href={`${linkUrl}?id=${linkId}`} target="_blank">
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
        const apprlvalDetail = JSON.parse(JSON.stringify(this.props.apprlvalDetail)) || {};
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
        const apprlvalDetail = JSON.parse(JSON.stringify(this.props.apprlvalDetail)) || {};
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
                <div className={styles.itemContent} key={item.id}>
                    {item.title}：{this.checkoutItemType(item)}
                </div>
            );
        });
    };

    formattingData = (arr) => {
        // 格式化日期
        return arr.map((item) => {
            if (item.type === 'datepicker') {
                item.value = item.value && moment(item.value).format('YYYY-MM-DD');
            } else if (item.type === 'timepicker' || item.type === 'rangepicker') {
                item.value = item.value && moment(item.value).format('YYYY-MM-DD HH:mm');
            }
            return item;
        });
    };

    renderPanel = () => {
        // 展示panel
        return this.state.pannerData.map((item, index) => (
            <ul className={styles.content} key={index}>
                <div className={styles.titleContent}>宣传明细{index + 1}</div>
                {item.map((i) => (
                    <li key={i.id} className={styles.item}>
                        <span className={styles.label}>{i.title}</span>
                        <span className={styles.value}>{i.name}</span>
                    </li>
                ))}
            </ul>
        ));
    };

    panelMth = () => {
        // 获取panle 数据
        const apprlvalDetail2 = JSON.parse(JSON.stringify(this.props.apprlvalDetail)) || {};
        const data2 = apprlvalDetail2.approvalForm.approvalFormFields;
        data2.map((item) => {
            if (item.type === 'panel') {
                let pannerData = this.changeData(item).value;
                let totalMoney = this.getTotalMoney(item);
                this.setState({
                    pannerData,
                    totalMoney,
                });
            }
        });
    };

    changeData(obj) {
        // 转换数据
        const newObj = JSON.parse(JSON.stringify(obj));
        let { approvalFormFields = [], value = [] } = newObj;
        if (value && value.length > 0) {
            let newValue = value.map((item) => {
                let arr = this.formattingOneLevel(approvalFormFields, item);
                let newArr = formateValue(arr);
                return newArr;
            });
            newObj.value = newValue;
        }
        return newObj;
    }
    formattingOneLevel = (approvalFormFields = [], value = []) => {
        // 循环一级
        return value.map((item) => {
            let obj = approvalFormFields.filter((ls) => Number(ls.id) === Number(item.fieldId))[0] || {};
            obj.value = item.fieldValue;
            return obj;
        });
    };

    getTotalMoney = (obj) => {
        // 获取宣传总金额
        let { approvalFormFields = [], value = [] } = obj || {};
        let idArr = approvalFormFields.filter((i) => i.name === 'money');
        let id = idArr[0] && idArr[0].id;
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

    render() {
        return (
            <div className={styles.wrap}>
                {this.renderItem()}
                <div className={styles.itemContent}>
                    宣传金额总计：<span>¥{this.state.totalMoney}</span>
                </div>
                {this.renderPanel()}
                <ul className={styles.content}>{this.renderFile()}</ul>
            </div>
        );
    }
}
