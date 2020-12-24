import React from 'react';
import BIButton from '@/ant_components/BIButton';
import Hearder from '../_components/header';
import { View } from './calendar/view';
import styles from './styles.less';

/*
 *  viewType 视图类型,1看板视图 2日历视图
 *  groupType 任务分类1我的日历任务 2成员任务
 */

@View({ hearderParams: { viewType: 2 }, groupType: 2 })
class Mine extends React.Component {
    willFetch = () => {
        return {
            groupType: 2,
        };
    };

    renderCustomComs = () => {
        return (
            <BIButton className={styles.wrapLeftBtn} onClick={this.props.showOrganization}>
                我的关注
            </BIButton>
        );
    };

    render() {
        const hearderParams = this.props.hearderParams || {};
        const { viewType } = hearderParams;
        return (
            <>
                <Hearder
                    value={hearderParams}
                    fetchView={this.props.fetchView}
                    willFetch={this.willFetch}
                    showDetailPanel={this.props.showDetailPanel}
                    left={[
                        { type: 'KanBoard', key: 'viewType' },
                        String(viewType) !== '2' ? { type: 'Filter', key: 'filter' } : {},
                        { type: 'custom', render: this.renderCustomComs },
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
