import React from 'react';
import { Tag } from 'antd';
import styles from './styles.less';
import { checkoutType } from '@/utils/utils';
class ChooseItem extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            isShowFiexd: false,
        };
        this.pageOnscroll = (e) => {
            const pageTop = document.documentElement.scrollTop;
            // const { top } = this.props;
            const top = 350;
            const { isShowFiexd } = this.state;
            // // 此处应增加防抖操作
            if (pageTop > top && !isShowFiexd) {
                this.setState({ isShowFiexd: !isShowFiexd });
            }
            else if (pageTop <= top && isShowFiexd) {
                this.setState({ isShowFiexd: !isShowFiexd });
            }
        };
        this.closeSampleTag = (e, newObj) => {
            e.preventDefault();
            this.onChange(newObj);
        };
        this.closeMultiPleTags = (e, id, obj) => {
            e.preventDefault();
            const { value } = obj;
            obj.value = value.filter((item) => item.id !== id);
            this.onChange(obj);
        };
        this.onChange = (newObj) => {
            const { params = [] } = this.props;
            if (this.props.onChange) {
                const newParams = params.map((item) => ({
                    ...item,
                    value: item.key === newObj.key ? newObj.value : item.key,
                }));
                this.props.onChange(newParams);
            }
        };
        this.renderMultipleChoice = (obj) => {
            return (React.createElement(React.Fragment, null, obj.value.map((item) => {
                item && (React.createElement("span", { key: item.name + item.id, className: styles.tags },
                    React.createElement(Tag, { closable: false, onClose: (e) => this.closeMultiPleTags(e, item.id, obj) }, item.name)));
            })));
        };
        this.renderSampleTag = (obj) => {
            const { value } = obj;
            return !value.name ? null : (React.createElement("span", { key: value.name + value.id, className: styles.tags },
                React.createElement(Tag, { closable: true, onClose: (e) => this.closeSampleTag(e, { ...obj, value: undefined }) }, value.name)));
        };
        this.renderValueTag = (obj) => {
            return !obj.value ? null : (React.createElement("span", { key: obj.value + obj.key, className: styles.tags },
                React.createElement(Tag, { closable: true, onClose: (e) => this.closeSampleTag(e, { ...obj, value: undefined }) }, obj.value)));
        };
        this.checkoutTypeTage = (obj) => {
            const type = checkoutType(obj.value);
            switch (type) {
                case 'object':
                    return this.renderSampleTag(obj);
                case 'array':
                    return this.renderMultipleChoice(obj);
                case 'undefined':
                    return null;
                default:
                    return this.renderValueTag(obj);
                    break;
            }
        };
        this.renderChooseTags = () => {
            const { params = [] } = this.props;
            const returnNode = [];
            params.forEach(item => {
                const node = this.checkoutTypeTage(item);
                item.value && node && returnNode.push(node);
            });
            return returnNode;
        };
    }
    componentDidMount() {
        // window.addEventListener('scroll', this.pageOnscroll);
    }
    componentWillUnmount() {
        // window.removeEventListener('scroll', this.pageOnscroll)
    }
    render() {
        const children = this.renderChooseTags();
        const { isShowFiexd } = this.state;
        const isShowBox = children && children.length > 0;
        return (!isShowBox ? null : React.createElement("div", { className: `${styles.tagContent} ${isShowFiexd ? styles.flexGroupTags : ''}` },
            React.createElement("span", { className: styles.gropLabel }, "\u5DF2\u9009\u6761\u4EF6:"),
            children));
    }
}
export default ChooseItem;
