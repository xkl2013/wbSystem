import React from 'react';
import { message, Modal } from 'antd';
import styles from './detail.less';

export default class uploadDetail extends React.Component {
    state = {
        showDialog: false,
        type: 'image',
        url: '',
    };

    onPreview = (url:string, name:string) => {
        const nameTypeArr = name.match(/\.[a-zA-Z0-9]+$/);
        const urlTypeArr = url.match(/\.[a-zA-Z0-9]+$/);
        const typeArr = urlTypeArr || nameTypeArr;
        let type = typeArr && typeArr[0] ? typeArr[0].replace('.', '') : '';
        type = type.toLowerCase();
        if (['png', 'gif', 'bmp', 'jpg', 'jpeg', 'heic'].includes(type)) {
            if (type === 'heic') {
                url += '?imageView2/2/w/700/q/100';
            }
            this.setState({ showDialog: true, type: 'image', url });
        } else if (['doc', 'docx', 'document', 'xls', 'xlsx', 'ppt', 'pptx'].includes(type)) {
            this.setState({ showDialog: true, type: 'office', url });
        } else if (type === 'pdf') {
            this.setState({ showDialog: true, type: 'pdf', url });
        } else if (['mp4', 'webm', 'ogg'].includes(type)) {
            this.setState({ showDialog: true, type: 'video', url });
        } else {
            message.warn('暂不支持预览');
        }
    };

    handleCancel = (e:any) => {
        e.stopPropagation();
        this.setState({ showDialog: false });
    };

    render() {
        const { showDialog, type, url } = this.state;
        return (
            <div>
                <Modal
                    className={styles.dialog}
                    visible={showDialog}
                    onCancel={this.handleCancel}
                    footer={null}
                    destroyOnClose
                >
                    <div>
                        {type === 'image' && <img alt="example" style={{ width: '100%' }} src={url} />}
                        {type === 'office' && (
                            <iframe
                                title="office"
                                width="100%"
                                height={500}
                                src={`https://view.officeapps.live.com/op/view.aspx?src=${url}`}
                            />
                        ) }
                        {type === 'pdf' && <iframe width="100%" height={500} src={`${url}`} title="pdf" />}
                        {type === 'video' && (
                            <>
                                <video src={url} controls width="100%" className={styles.videoWrap}>
                                    你的浏览器暂不支持该视频在线播放,请下载后播放
                                </video>
                                <span className={styles.tips}>如无法播放，请下载后播放</span>
                            </>
                        )}
                    </div>
                </Modal>
            </div>
        );
    }
}
