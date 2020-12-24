import React from 'react';
import { connect } from 'dva';

interface dispatchOps {
    type: string,
    payload?: any,
}
interface Prop {
    dispatch: (ops: dispatchOps) => any,
}

@connect(({ menu }: any) => ({
    menuData: menu.menuData,
}))
class BaseLayout extends React.Component<Prop>{
    public render() {
        return (
            <>
                {this.props.children}
            </>
        )
    }
}
export default BaseLayout;
