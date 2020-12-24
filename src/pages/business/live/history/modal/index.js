/* eslint-disable */
import React, { Component } from 'react';
import modalfy from '@/components/modalfy';
import FormDetailWrap from '@/submodule/components/apolloTable/detailForm';
import FormWrap from '@/submodule/components/apolloTable/editFormV3';
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
            noAdd,
            noEdit,
        } = this.props;
        return (
            <div className={s.modalWrap}>
                <div className={s.formWrap}>
                    {detailType === 'addPage' || detailType === 'editPage' ? (
                        <FormWrap {...this.props} />
                    ) : (
                        <FormDetailWrap {...this.props} hideEditBtn={true} />
                    )}
                </div>
                {isShowHistory && (
                    <div className={s.historyWrap}>
                        <List
                            historyColumnConfig={historyColumnConfig}
                            historyList={historyList}
                            showAddPage={showAddPage}
                            showEditPage={showEditPage}
                            rowId={rowId}
                            noAdd={noAdd}
                            noEdit={noEdit}
                        />
                    </div>
                )}
            </div>
        );
    }
}

export default EditForm;
