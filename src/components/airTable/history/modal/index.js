import React, { Component } from 'react';
import modalfy from '@/components/modalfy';
import FormDetailWrap from '../formDetail';
import FormWrap from '../form';
import List from '../list';
import s from './index.less';

@modalfy
class EditForm extends Component {
    render() {
        const {
            rowId,
            historyList,
            historyColumnConfig,
            detailType,
            isShowHistory,
            showAddPage,
            showEditPage,
        } = this.props;
        return (
            <div className={s.modalCls}>
                {detailType === 'addPage' || detailType === 'editPage' ? (
                    <FormWrap {...this.props} />
                ) : (
                    <FormDetailWrap {...this.props} />
                )}
                {isShowHistory && (
                    <div className={s.historyCls}>
                        <List
                            historyColumnConfig={historyColumnConfig}
                            historyList={historyList}
                            showAddPage={showAddPage}
                            showEditPage={showEditPage}
                            rowId={rowId}
                        />
                    </div>
                )}
            </div>
        );
    }
}

export default EditForm;
