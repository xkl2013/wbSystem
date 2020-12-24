import React from 'react';
import { Base64 } from 'js-base64';
import { connect } from 'dva';
import View from './components/commonView';
import { getButtonsAuthorities } from '../services';

/*
 *  此处需要做项目类型分发,项目分为一般项目,线性想,如果是一般项目走任务日程view,如果是特殊项目的话走订制view
 */

@connect(({ menu }) => {
    return {
        projectMenuData: menu.projectMenuData,
    };
})
class Project extends React.Component {
    state = {
        authButtons: [],
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.projectMenuData) !== JSON.stringify(this.props.projectMenuData)) {
            this.renderHeaderName(nextProps.projectMenuData);
        }
    }

    initPage = () => {
        this.renderHeaderName();
        this.getButtonsAuthorities();
    };

    renderHeaderName = (projectMenuData = this.props.projectMenuData) => {
        const [projectId] = this.handlePageId();
        const project = projectMenuData.find((ls) => {
            return String(ls.projectId) === String(projectId);
        }) || {};
        this.props.dispatch({
            type: 'header/saveHeaderName',
            payload: {
                title: project.name,
            },
        });
    };

    handlePageId = () => {
        const params = this.props.match.params || {};
        let id = params.id || '';
        id = Base64.decode(id) || '';
        return id.split('&');
    };

    getButtonsAuthorities = async () => {
        const [projectId] = this.handlePageId();
        let authButtons = [];
        const result = await getButtonsAuthorities({ projectId });
        if (result && result.success) {
            authButtons = Array.isArray(result.data) ? result.data : [];
        }
        this.setState({ authButtons });
    };

    render() {
        const [projectId] = this.handlePageId();
        return (
            <View projectId={projectId} authButtons={this.state.authButtons} key={projectId} initData={this.initPage} />
        );
    }
}
export default Project;
