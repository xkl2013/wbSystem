import React from 'react';
import { getUrlParams } from '@/utils/utils';
import Hearder from '../_components/header';
import { View } from './components/view';
import { myProjectId } from '../_enum';

/**
 * @hearderParams(viewType===2) 不展示filter功能
 */
@View({ hearderParams: { viewType: getUrlParams('viewType') || 2 }, modelId: 8, scheduleTypeFlag: null })
class Mine extends React.Component {
    willFetch = () => {
        return {
            groupType: 1,
            projectId: myProjectId,
        };
    };

    render() {
        const hearderParams = this.props.hearderParams || {};
        const { viewType } = hearderParams;
        return (
            <>
                <Hearder
                    value={hearderParams}
                    willFetch={this.willFetch}
                    showDetailPanel={this.props.showDetailPanel}
                    fetchView={this.props.fetchView}
                    left={[
                        { type: 'KanBoard', key: 'viewType' },
                        String(viewType) !== '2' ? { type: 'Filter', key: 'filter' } : {},
                    ]}
                    right={[
                        { type: 'Search', key: 'search', willFetch: this.willFetch },
                        { type: 'Setting', key: 'Setting' },
                    ]}
                    onChange={this.props.onChangeHeader}
                />
            </>
        );
    }
}

export default Mine;
