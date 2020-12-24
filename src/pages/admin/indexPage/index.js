import React from 'react';
import styles from './styles.less';
import logo from '@/assets/logo.png';
const IndexPage = (props) => {
    return (React.createElement("div", { className: styles.container },
        React.createElement("div", { className: styles.box },
            React.createElement("img", { src: logo, alt: "", className: styles.img }),
            React.createElement("h3", { className: styles.title }, "\u6B22\u8FCE\u4F7F\u7528Mountaintop\u7BA1\u7406\u7CFB\u7EDF"),
            React.createElement("p", { className: styles.des }, "Welcome to background management"))));
};
export default IndexPage;
