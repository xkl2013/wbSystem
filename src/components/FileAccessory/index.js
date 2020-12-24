import React, { Component } from 'react';
import { Popover } from 'antd';
import styles from './index.less';
import FileDetail from '@/components/upload/detail';

class FileAccessory extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    contentListRender() {
        const { dataSource } = this.props;
        const contentList = dataSource.contractAppointmentAttachments.map((item, index) => ({
            domain: item.contractAppointmentAttachmentDomain,
            value: item.contractAppointmentAttachmentUrl,
            name: item.contractAppointmentAttachmentName,
        }));
        return contentList.length > 0 ? (
            <FileDetail listType="text" data={contentList} />
        ) : (
            <span className={styles.noData}>暂无数据</span>
        );
    }
    render() {
        const { dataSource } = this.props;
        return (
            <>
                <Popover
                    content={this.contentListRender()}
                    placement="topLeft"
                    trigger="click"
                    overlayStyle={{ zIndex: 1000 }}
                >
                    <span
                        className={
                            dataSource.contractAppointmentAttachments.length > 0 ? styles.btn : ''
                        }
                    >
                        历史附件
                    </span>
                </Popover>
            </>
        );
    }
}
export default FileAccessory;
