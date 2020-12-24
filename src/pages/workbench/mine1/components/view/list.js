import React from 'react';

export default class List extends React.Component {
    constructor(props) {
        super(props);
        List.headerMonitor = this.headerMonitor;
    }

    headerMonitor = (val, key) => {};

    render() {
        return <div>123</div>;
    }
}
