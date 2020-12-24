import NotifyNode from '@/components/notifyNode/user_org_jole';
import React from 'react';
import {
    formaterApprovalNodeList,
    formaterNoticerList,
    setFormaterNoticerList,
    setFormaterApprovalNodeList,
} from '../_utils';

const pannelConfig = {
    // 设置选择控件属性,可单独设置,设置属性及显示多少
    org: {
        chooseType: 'user', // 在组织里面可选择用户
    },
    user: {},
    role: {
        isDepartment: true,
    },
};
const getFormater = {
    noticer: formaterNoticerList,
    approval: formaterApprovalNodeList,
};
const setFormater = {
    noticer: setFormaterNoticerList,
    approval: setFormaterApprovalNodeList,
};
export default class NodeList extends React.Component {
    state = {
        data: [],
    };

    componentDidMount() {
        this.initData();
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data)) {
            this.initData(nextProps.data);
        }
    }

    initData = (dataSource = this.props.data) => {
        this.formaterData(dataSource);
    };

    formaterData = (dataSource) => {
        // 格式化自审批流数据
        if (!dataSource) return;
        const { componentType } = this.props;
        const formater = getFormater[componentType];
        const data = formater ? formater(dataSource) : dataSource;
        this.setState({ data });
    };

    onChange = (dataSource) => {
        const { componentType, onChange } = this.props;
        const formater = setFormater[componentType];
        const data = formater ? formater(dataSource) : dataSource;
        if (onChange) onChange(data);
    };

    render() {
        return <Node {...this.props} data={this.state.data} onChange={this.onChange} />;
    }
}
function Node(props) {
    const { componentType, ...others } = props;
    return (
        {
            approval: <NotifyNode {...others} pannelConfig={pannelConfig} isRepeat isRealName />,
            noticer: (
                <NotifyNode
                    {...others}
                    pannelConfig={{
                        ...pannelConfig,
                        role: { isDepartment: false },
                    }}
                    isRealName
                />
            ),
        }[componentType] || null
    );
}
