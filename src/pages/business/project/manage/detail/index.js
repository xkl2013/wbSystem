import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Radio } from 'antd';

import BIRadio from '@/ant_components/BIRadio';
import BIButton from '@/ant_components/BIButton';
import BIModal from '@/ant_components/BIModal';
import SelfProgress from '@/components/Progress';
import AuthButton, { checkPathname } from '@/components/AuthButton';
import { Watermark } from '@/components/watermark';
import styles from './index.less';
import { stopProject, endProject } from '../services';
import {
    checkStopAuthority,
    checkAddContractAuthority,
    checkEditAuthority,
    checkEndAuthority,
} from '../config/authority';

@Watermark
@connect(({ business_project_manage }) => {
    return {
        business_project_manage,
        formData: business_project_manage.formData,
    };
})
class Index extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selTab: '', // 选中tab
            id: '', // 详情ID
            tabRoutes: [], // tab路由列表
        };
    }

    componentDidMount() {
        const { routes = [] } = this.props.route;
        const tabRoutes = routes.filter((item) => {
            // tab 路由列表
            if (item.path && checkPathname(item.path)) {
                return {
                    name: item.name,
                    path: item.path,
                };
            }
        });
        const {
            query: { id = '' },
            pathname,
        } = this.props.location;
        this.setState({
            tabRoutes,
            selTab: pathname,
            id,
        });
        this.props.dispatch({
            type: 'business_project_manage/getProjectDetail',
            payload: {
                id,
            },
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location.pathname !== this.state.selTab) {
            this.setState({
                selTab: nextProps.location.pathname,
            });
        }
        if (JSON.stringify(this.props.formData) !== JSON.stringify(nextProps.formData)) {
            // 平台下单的项目隐藏合同、费用、结算tab项
            if (Number(nextProps.formData.trailPlatformOrder) === 1) {
                const hideRoute = [
                    '/foreEnd/business/project/manage/detail/contract',
                    '/foreEnd/business/project/manage/detail/cost',
                    '/foreEnd/business/project/manage/detail/settlement',
                ];
                const showRoute = [];
                this.state.tabRoutes.map((item) => {
                    if (!hideRoute.includes(item.path)) {
                        showRoute.push(item);
                    }
                });
                this.setState({
                    tabRoutes: showRoute,
                });
            }
            // 直播项目隐藏结算、审批
            if (Number(nextProps.formData.projectingType) === 4) {
                const hideRoute = [
                    '/foreEnd/business/project/manage/detail/settlement',
                    '/foreEnd/business/project/manage/detail/apply',
                ];
                const showRoute = [];
                this.state.tabRoutes.map((item) => {
                    if (!hideRoute.includes(item.path)) {
                        showRoute.push(item);
                    }
                });
                this.setState({
                    tabRoutes: showRoute,
                });
            }
        }
        this.props.dispatch({
            type: 'header/saveHeaderName',
            payload: {
                title: '项目详情',
                subTitle: `项目编号${nextProps.formData.projectingCode}`,
                component: this.rightBtns(nextProps.formData),
            },
        });
    }

    tabChange = (e) => {
        // 切换tab
        this.setState({
            selTab: e.target.value,
        });
        this.props.history.push({
            pathname: e.target.value,
            query: {
                id: this.state.id,
            },
        });
    };

    edit = () => {
        // 编辑详情
        this.props.history.push({
            pathname: '/foreEnd/business/project/manage/edit',
            query: {
                id: this.state.id,
            },
        });
    };

    rightBtns = (formData) => {
        // 右侧按钮
        return (
            <div>
                <AuthButton authority="/foreEnd/business/project/manage/detail/end">
                    {checkEndAuthority(formData) && (
                        <BIButton type="primary" ghost className={styles.headerBtn} onClick={this.end}>
                            结案
                        </BIButton>
                    )}
                </AuthButton>
                <AuthButton authority="/foreEnd/business/project/manage/detail/stop">
                    {checkStopAuthority(formData) && (
                        <BIButton type="primary" ghost className={styles.headerBtn} onClick={this.revocation}>
                            终止
                        </BIButton>
                    )}
                </AuthButton>
                <AuthButton authority="/foreEnd/business/project/manage/detail/add">
                    {checkAddContractAuthority(formData) && (
                        <BIButton type="primary" className={styles.headerBtn} onClick={this.newProject}>
                            新增合同
                        </BIButton>
                    )}
                </AuthButton>
            </div>
        );
    };

    end = () => {
        // 项目结案
        const { query } = this.props.location;
        const { history } = this.props;
        BIModal.confirm({
            title: '项目结案',
            content: '操作结案后，对应的项目状态将会变为已结案，确认操作吗？',
            autoFocusButton: null,
            onOk: async () => {
                await endProject(query.id);
                this.props.dispatch({
                    type: 'business_project_manage/getProjectDetail',
                    payload: {
                        id: this.state.id,
                    },
                });
                history.goBack();
            },
        });
    };

    revocation = () => {
        // 终止项目
        const { query } = this.props.location;
        const { history } = this.props;
        BIModal.confirm({
            title: '终止项目',
            content: '操作终止后，对应的项目状态将会变为已终止，确认操作吗？',
            autoFocusButton: null,
            onOk: async () => {
                await stopProject(query.id);
                this.props.dispatch({
                    type: 'business_project_manage/getProjectDetail',
                    payload: {
                        id: this.state.id,
                    },
                });
                history.goBack();
            },
        });
    };

    newProject = () => {
        // 新建合同
        const { query } = this.props.location;
        this.props.history.push({
            pathname: '/foreEnd/business/project/contract/add',
            query: {
                projectId: query && query.id,
            },
        });
    };

    render() {
        const { tabRoutes, selTab } = this.state;
        const { formData } = this.props;
        const showEdit = selTab === '/foreEnd/business/project/manage/detail'
            && checkEditAuthority(formData)
            && Number(formData.projectingType) !== 4;
        return (
            <div className={styles.detailPage}>
                <div className={styles.detailTabBtnWrap}>
                    <BIRadio value={selTab} buttonStyle="solid" onChange={this.tabChange}>
                        {tabRoutes.map((item) => {
                            return (
                                <Radio.Button className={styles.tabBtn} value={item.path} key={item.path}>
                                    {item.name}
                                </Radio.Button>
                            );
                        })}
                    </BIRadio>
                    {showEdit && (
                        <AuthButton authority="/foreEnd/business/project/manage/detail/edit">
                            <BIButton
                                icon="form"
                                type="primary"
                                ghost
                                onClick={this.edit}
                                disabled={Number(formData.endStatus) === 1}
                            >
                                编辑
                            </BIButton>
                        </AuthButton>
                    )}
                </div>
                {this.props.children}
                <AuthButton authority="/foreEnd/business/project/manage/detail/commen">
                    <SelfProgress
                        id={Number(this.props.location.query.id)}
                        interfaceName="6"
                        authority="/foreEnd/business/project/manage/detail/publishCommen"
                    />
                </AuthButton>
            </div>
        );
    }
}

export default Index;
