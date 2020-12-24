import React from 'react';
import { message, Modal } from 'antd';
import styles from './detail.less';

/* eslint-disable */
export default class uploadDetail extends React.Component {
    state = {
        showDialog: false,
        type: 'image',
        url: '',
    };
    onPreview = (url, name) => {
        const typeArr = (name || url).match(/\.[a-zA-Z]+$/);
        let type = typeArr && typeArr[0] ? typeArr[0].replace('.', '') : '';
        type = type.toLowerCase();
        if (['png', 'gif', 'bmp', 'jpg', 'jpeg', 'heic'].includes(type)) {
            this.setState({ showDialog: true, type: 'image', url });
        } else if (['doc', 'docx', 'document', 'xls', 'xlsx', 'ppt', 'pptx'].includes(type)) {
            this.setState({ showDialog: true, type: 'office', url });
        } else if (type === 'pdf') {
            this.setState({ showDialog: true, type: 'pdf', url });
        } else {
            message.warn('暂不支持预览');
        }
    };
    handleCancel = () => {
        this.setState({ showDialog: false });
    };
    render() {
        const { showDialog, type, url } = this.state;
        return (
            <div>
                <Modal className={styles.dialog} visible={showDialog} onCancel={this.handleCancel} footer={null}>
                    {type === 'image' ? (
                        <img alt="example" style={{ width: '100%' }} src={url + '?imageMogr2/auto-orient'} />
                    ) : null}
                    {type === 'office' ? (
                        <iframe
                            width={'100%'}
                            height={500}
                            src={`https://view.officeapps.live.com/op/view.aspx?src=${url}`}
                        />
                    ) : null}
                    {type === 'pdf' ? <iframe width={'100%'} height={500} src={`${url}`} /> : null}
                </Modal>
            </div>
        );
    }
}
