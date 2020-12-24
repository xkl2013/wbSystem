import React, { forwardRef } from 'react';
import { Icon, Tooltip } from 'antd';
import { checkoutFileType } from '../../../utils/utils';
import styles from './styles.less';

function PictureCard(props, ref) {
    const { data } = props;
    if (!Array.isArray(data)) return data;
    return (
        <div className={styles.pictureTextUploadList} ref={ref}>
            {data.map((ls, num) => {
                return (
                    <div key={num} className={styles.textUploadListItem}>
                        <div className={styles.textUploadListItemInfo}>
                            <span className={styles.textUploadListItemBox}>
                                <img
                                    className={styles.fileImgStyle}
                                    onClick={props.onPreview.bind(null, ls)}
                                    src={
                                        checkoutFileType(
                                            `${ls.domain ? `https://${ls.domain}` : window.CDN_HOST}/${ls.value}`,
                                        ).thumbUrl
                                    }
                                    alt=""
                                />
                                <Tooltip title={ls.name} placement="bottom">
                                    <span
                                        className={styles.textUploadListItemInfoName}
                                        onClick={props.onPreview.bind(null, ls)}
                                    >
                                        {ls.name}
                                    </span>
                                </Tooltip>

                                <Icon
                                    type="download"
                                    className={styles.downIcon}
                                    onClick={props.onDownLoad.bind(null, ls)}
                                />
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
export default forwardRef(PictureCard);
