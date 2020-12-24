import React, { Component } from 'react';
import styles from './index.less';
import Upload from '@/components/upload';
import selectedFile from '@/assets/comment/selectedFile.png';

export default class File extends Component {
    getFormat = (item) => {
        return {
            commentAttachmentName: item.name,
            commentAttachmentUrl: item.value,
            commentAttachmentDomain: item.domain,
            commentAttachmentFileSize: item.size,
        };
    };

    setFormat = (item) => {
        if (item.name || item.value || item.value === 0) {
            return item;
        }
        return {
            name: item.commentAttachmentName,
            value: item.commentAttachmentUrl,
            domain: item.commentAttachmentDomain,
            size: item.commentAttachmentFileSize,
        };
    };

    renderBtn = () => {
        return (
            <div className={styles.addBtn}>
                <img className={styles.fileIcon} alt="" src={selectedFile} />
                <span className={styles.addTitle}>添加附件</span>
            </div>
        );
    };

    render() {
        const {
            onChange, value, overlayClassName, renderButton, showUploadList, componentAttr,
        } = this.props;
        return (
            <div className={overlayClassName || styles.fileContainer}>
                <Upload
                    value={value}
                    onChange={onChange}
                    getFormat={this.getFormat}
                    setFormat={this.setFormat}
                    renderButton={renderButton || this.renderBtn()}
                    showUploadList={showUploadList || true}
                    {...componentAttr}
                />
            </div>
        );
    }
}
