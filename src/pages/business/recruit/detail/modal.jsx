/* eslint-disable */
import React, { Component } from 'react';
import { StarFilled } from '@ant-design/icons';
import modalfy from '@/components/modalfy';
import FormDetailWrap from '@/submodule/components/apolloTable/detailForm';
import FormWrap from '@/submodule/components/apolloTable/editFormV3';
import SlefProgress from '@/components/airTable/component/dynamic';
import s from './modal.less';

const filterData = (arr, detailType) => {
    if (!Array.isArray(arr)) return [];
    // 过滤在表格中隐藏的字段
    const filterFlag = { editPage: 'EDIT', addPage: 'ADD', detailPage: 'DETAIL' }[detailType];
    return arr.filter((ls) => {
        return ls.hideScope.indexOf(filterFlag) === -1;
    });
};
@modalfy
class EditForm extends Component {
    render() {
        const {
            rowData,
            detailType,
            isShowComment,
            interfaceName,
            commentSort,
            hideEditBtn,
            historyGroupId,
            data,
            rowId,
        } = this.props;
        const dataSource = filterData(data, detailType);
        return (
            <div className={s.modalWrap}>
                <div className={s.formWrap}>
                    {hideEditBtn ? (
                        <FormDetailWrap {...this.props} data={dataSource} />
                    ) : (
                        <FormWrap {...this.props} data={dataSource} />
                    )}
                </div>
                {isShowComment && (
                    <div className={s.commentWrap}>
                        <SlefProgress
                            id={Number(historyGroupId) || Number(rowId)}
                            interfaceName={interfaceName}
                            rowData={rowData}
                            commentSort={commentSort}
                        />
                    </div>
                )}
            </div>
        );
    }
}

export default EditForm;
