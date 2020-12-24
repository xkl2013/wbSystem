import React from 'react';
export default class Hello extends React.Component {
    render() {
        const num = 222;
        return (React.createElement("div", null, num));
    }
    ;
}
