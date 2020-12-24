import React from 'react';
import Button from '@/ant_components/BIButton';
import ChooseItem from '@/components/chooseItem';
import styles from './styles.less';
class FormFilterButton extends React.Component {
    render() {
        const { chooseItems } = this.props;
        console.log('chooseItems', chooseItems);
        return (React.createElement("div", { className: styles.formFooter },
            React.createElement("div", { className: styles.chooseItem },
                React.createElement(ChooseItem, { params: chooseItems, onChange: this.props.onRemoveItem })),
            React.createElement("div", { className: styles.buttonGroup },
                React.createElement(Button, { type: "primary", icon: "search", className: styles.btnCls, onClick: this.props.onSubmit }, "\u67E5\u8BE2"),
                React.createElement("span", { className: styles.resertButton },
                    React.createElement(Button, { onClick: this.props.onResert, className: styles.btnCls }, "\u91CD\u7F6E")))));
    }
}
export default FormFilterButton;
