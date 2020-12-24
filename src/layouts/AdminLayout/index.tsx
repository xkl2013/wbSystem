/* eslint-disable */
import React from 'react';
import { connect } from 'dva';
import MenuLayout from '../MenuLayout';
import storage from '@/utils/storage';

interface dispatchOps {
    type: string,
    payload?: any,
}
interface Prop {
    dispatch: (ops: dispatchOps) => any,
    route: any,
    menuData: any[],
    breadcrumbNameMap: any,
    history: any,
    menuList: any,
}
@connect(({ menu, login, loading }: any) => ({
    menuData: menu.menuData,
    breadcrumbNameMap: menu.breadcrumbNameMap,
    menuList: login.menuList,
}))
class BaseLayout extends React.Component<Prop>{

    public componentDidMount() {
        this.getRouterData(null);
    }
    public componentWillReceiveProps(nextProps: any) {
        if (JSON.stringify(nextProps.menuList) !== JSON.stringify(this.props.menuList)) {
            this.getRouterData(nextProps.menuList);
        }
    }
    getRouterData = (list: any) => {
        let authData = list || storage.getUserAuth() || [];
        const {
            route: { path },
        } = this.props;
        this.props.dispatch({
            type: 'menu/getMenu',
            payload: { routes: [this.props.route], path, authData },
        })
    }

    public render() {
        return (
            <>
                <MenuLayout {...this.props}>
                    {this.props.children}
                </MenuLayout>
            </>
        )
    }
}
export default BaseLayout;
/* eslint-disable */
