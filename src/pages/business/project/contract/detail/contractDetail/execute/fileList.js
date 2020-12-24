/*
 * @Author: your name
 * @Date: 2019-12-27 15:40:13
 * @LastEditTime : 2020-01-19 18:14:20
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /admin_web/src/pages/business/project/contract/detail/contractDetail/execute/fileList.js
 */
import { Popover } from 'antd';
import React from 'react';
import { contractAttach } from '../../services';
import styles from './index.less';
import FileDetail from '@/components/upload/detail';

class FileList extends React.Component {
    state = {
        contentList: [],
    };

    componentDidMount() {
        this.getFileList();
    }

    getFileList = async () => {
        const item = this.props.dataSource;
        const response = await contractAttach(item.contractAppointmentId);
        let contentList = [];
        if (response && response.success) {
            const dataSource = response.data || {};
            contentList = Array.isArray(dataSource.list) ? dataSource.list : [];
            this.setState({ contentList });
        }
    };

    contentListRender = () => {
        // 附件列表
        let contentList = this.state.contentList || [];
        contentList = contentList.map((item) => {
            return {
                domain: item.contractAppointmentAttachmentDomain,
                value: item.contractAppointmentAttachmentUrl,
                name: item.contractAppointmentAttachmentName,
            };
        });
        return contentList.length > 0 ? (
            <FileDetail listType="text" data={contentList} />
        ) : (
            <span className={styles.noData}>暂无数据</span>
        );
        //
    };

    render() {
        return (
            <Popover
                content={this.contentListRender()}
                // trigger="click"
                placement="right"
                onClick={this.getFileList}
                overlayStyle={{ zIndex: 1000 }}
            >
                <span>历史附件</span>
            </Popover>
        );
    }
}

export default FileList;
