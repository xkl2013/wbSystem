/**
 * data：数据源,
 * isShowDelBtn：是否展示删除按钮,
 * detailType:'editPage'-编辑页面
 */
import React, { Component } from 'react';
import modalfy from '@/components/modalfy';
import FormDetailWrap from '@/components/formDetail';
import FormWrap from '../form';
import SlefProgress from '../dynamic';

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
    constructor(props) {
        super(props);
        this.state = {
            tempData: props.data,
            dataSource: filterData(props.data, props.detailType),
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (JSON.stringify(nextProps.data) !== JSON.stringify(prevState.tempData)) {
            return {
                tempData: nextProps.data,
                dataSource: filterData(nextProps.data, nextProps.detailType),
            };
        }
        return null;
    }

    render() {
        const { dataSource } = this.state;
        const {
            rowId, rowData, detailType, isShowComment, interfaceName, commentSort, name,
        } = this.props;
        return (
            <div style={{ display: 'flex' }}>
                {detailType === 'editPage' || detailType === 'addPage' ? (
                    <FormWrap {...this.props} data={dataSource} />
                ) : (
                    <FormDetailWrap {...this.props} data={dataSource} formTitle={name} />
                )}
                {isShowComment ? (
                    <div style={{ width: '340px', height: '650px', background: '#FAFAFA' }}>
                        <SlefProgress
                            id={Number(rowId)}
                            interfaceName={interfaceName || 12}
                            rowData={rowData}
                            commentSort={commentSort}
                        />
                    </div>
                ) : null}
            </div>
        );
    }
}

export default EditForm;
