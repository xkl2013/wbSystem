import React, { forwardRef } from 'react';
import { List, Comment } from 'antd';
import FileList from '@/components/editor/File/detail';
import avatar from '@/assets/avatar.png';
import TagList from '../../../editor/Tag/tagList';
import styles from './styles.less';

function ListView(props, ref) {
    console.log(props.dataSource);
    // 附件数据格式化
    const formatFileValue = (value) => {
        if (!Array.isArray(value)) return [];
        return value.map((item) => {
            return {
                name: item.commentAttachmentName,
                value: item.commentAttachmentUrl,
                size: item.commentAttachmentFileSize,
                domain: item.commentAttachmentDomain,
            };
        });
    };
    return (
        <List
            ref={ref}
            className="comment-list"
            itemLayout="horizontal"
            dataSource={props.dataSource}
            renderItem={(item) => {
                return (
                    <li>
                        <Comment
                            author={item.commentUserName}
                            avatar={
                                <img
                                    src={
                                        (item.commentUserIcon
                                            // eslint-disable-next-line max-len
                                            && `${item.commentUserIcon}?imageView2/1/w/32/h/32`)
                                        || avatar
                                    }
                                    alt=""
                                />
                            }
                            content={
                                <>
                                    <pre
                                        dangerouslySetInnerHTML={{
                                            __html: item.commentContent,
                                        }}
                                    />
                                    {item.tagsList && item.tagsList.length ? (
                                        <div style={{ marginTop: '14px' }}>
                                            <TagList tagList={item.tagsList} hideClose />
                                        </div>
                                    ) : null}
                                    {item.commentAttachmentDTOs && item.commentAttachmentDTOs.length ? (
                                        <div style={{ marginTop: '20px' }}>
                                            <FileList
                                                overlayClassName={styles.fileCls}
                                                showUploadList={{ showRemoveIcon: false }}
                                                listType="picture-card"
                                                data={formatFileValue(item.commentAttachmentDTOs)}
                                            />
                                        </div>
                                    ) : null}
                                </>
                            }
                            datetime={item.commentCreatedAt}
                        />
                    </li>
                );
            }}
        />
    );
}
export default forwardRef(ListView);
