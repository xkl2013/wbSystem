/**
 */
import React, { Component } from 'react';
import modalfy from '@/components/modalfy';
import FormWrap from '../form';
import './index.less';
import FormDetail from '@/components/formDetail';
import SlefProgress from '@/components/airTable/component/dynamic';

@modalfy
class EditForm extends Component {
    render() {
        const { detailType = '', isShowDelBtn, interfaceName, commentId, isOnlyShowSelfProgress } = this.props;
        return (
            <div style={{ display: 'flex' }}>
                {detailType === 'detailPage' ? <FormDetail {...this.props} /> : <FormWrap {...this.props} />}
                {(isShowDelBtn || isOnlyShowSelfProgress) && (
                    <div style={{ width: '340px', height: '650px', background: '#FAFAFA' }}>
                        <SlefProgress id={Number(commentId)} interfaceName={interfaceName} {...this.props} />
                    </div>
                )}
            </div>
        );
    }
}

export default EditForm;
