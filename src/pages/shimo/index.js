import React from 'react';
import { Spin, message } from 'antd';
import { getLoginPath } from './services';

export default class Shimo extends React.Component {
    componentWillMount() {
        this.redirctShimo();
    }
    redirctShimo = async () => {
        const response = await getLoginPath() || {};
        if (response && response.success) {
            const data = response.data || {};
            window.open(data.loginPath || '')
        } else {
            message.error(response.message)
        }

    }
    render() {
        return (
            <div>
                <Spin size="small" />
                <Spin />
            </div>
        )
    }
}