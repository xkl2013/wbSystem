/* eslint-disable */
import React from 'react';
import { connect } from 'dva';
import { getAppVersion, updateAppVersion } from '@/services/api';
import MenuLayout from '../MenuLayout';
import storage from '@/utils/storage';
import QuickEntry from './quickEntry';
import Guide from './guidePage';


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

@connect(({ menu, login }: any) => ({
    menuData: menu.menuData,
    menuList: login.menuList,
    breadcrumbNameMap: menu.breadcrumbNameMap,
}))
class BaseLayout extends React.Component<Prop, any>{
    constructor(props) {
        super(props);
        this.quickNode = null
        this.state = {
            visible: false,
        }
    }
    public componentDidMount() {
        this.getRouterData(null);
        this.initData();
    }
    public componentWillReceiveProps(nextProps: any) {
        if (JSON.stringify(nextProps.menuList) !== JSON.stringify(this.props.menuList)) {
            this.getRouterData(nextProps.menuList);
        }
    }
    initData = () => {
        if (!storage.getToken()) return;
        this.getAppVersion();
        this.props.dispatch({
            type: 'admin_global/initFEData',
        })
    }
    getAppVersion = async () => {
        const response = await getAppVersion();
        if (response && response.success) {
            const data = response.data || {};
            const visible = !!data.hasGuidePage && !data.hasRead;
            this.setState({ visible })
        }
    }
    setAppVersion = async () => {
        const res = await updateAppVersion();
        if (res && res.success) {
            this.setState({ visible: false })
            this.showEntryList()
        }
    }
    showEntryList = () => {
        if (this.quickNode) {
            this.quickNode.showList();
        }
    }
    onShowTip = () => {
        this.setState({ visible: true });
    }
    getRouterData = (list: any) => {
        let authData = list || storage.getUserAuth() || [];
        const {
            route: { path },
        } = this.props;
        this.props.dispatch({
            type: 'menu/getMenu',
            payload: { routes: [this.props.route], path, authData, },
        })
    }
    public render() {
        return (
            <>
                <MenuLayout {...this.props}>
                    {this.props.children}
                    <QuickEntry
                        ref={(dom: any) => this.quickNode = dom}
                        onShowTip={this.onShowTip}
                    />
                </MenuLayout>
                {/* 引导页 */}
                {this.state.visible ? (<Guide
                    onSkip={this.setAppVersion}
                />) : null}
            </>
        )
    }
}
export default BaseLayout;


/* eslint-disable */

