import React from 'react';
import { Icon, message, Tooltip } from 'antd';
import { saveAs } from 'file-saver';
import { urlReg } from '@/utils/reg';
import styles from './detail.less';
import { checkoutFileType } from './utils/utils';
import Preview from './preview';
import PictureCard from './components/detail/pictureCard';

const getUrl = (value, CDN_HOST) => {
    return urlReg.test(value.value)
        ? value.value
        : `${value.domain ? `https://${value.domain}` : CDN_HOST}/${value.value}`;
};
/* eslint-disable */
export default class uploadDetail extends React.Component {
    onPreview = (item) => {
        if (this.model && this.model.onPreview) {
            const url = getUrl(item, CDN_HOST);
            this.model.onPreview(url);
        }
    };
    onDownLoad = (item) => {
        // debugger
        if (!item.value) {
            message('下载异常');
            return;
        }
        const url = getUrl(item, CDN_HOST);
        // const typeArr = url.match(/\.[a-zA-Z]+$/);
        // const type = typeArr && typeArr[0] ? typeArr[0].replace('.', '') : '';
        saveAs(url, item.name);
        // let a = document.createElement('a');
        // a.href = url;
        // a.target = '_blank';
        // a.download = item.name;
        // a.click();
        // a = null;
    };
    handleCancel = () => {
        this.setState({ showDialog: false });
    };
    checkoutDetailType = () => {
        const listType = this.props.listType;
        switch (listType) {
            case 'picture': // 单纯图片
                return this.renderUpload();
            case 'text': //  淡村文本
                return this.rendertextUpload();
            case 'picture-text': //  图文混排
                return this.renderPictureText();
            case 'picture-card': //  图文卡片混排
                return <PictureCard data={this.props.data} onPreview={this.onPreview} onDownLoad={this.onDownLoad} />;
            default:
                return this.renderUpload();
        }
    };
    renderPictureText = (item = this.props.data || []) => {
        if (!Array.isArray(item)) return item;
        return (
            <ul className={styles.pictureTextUploadList}>
                {item.map((ls, num) => (
                    <li key={num} className={styles.textUploadListItem}>
                        <div className={styles.textUploadListItemInfo}>
                            <span className={styles.textUploadListItemBox}>
                                <img
                                    ref={(img) => (this.img = img)}
                                    className={styles.fileImgStyle}
                                    onClick={this.onPreview.bind(this, ls)}
                                    src={checkoutFileType(getUrl(ls, CDN_HOST)).thumbUrl}
                                />
                                <Tooltip title={ls.name} placement="bottom">
                                    <a
                                        className={styles.textUploadListItemInfoName}
                                        onClick={this.onPreview.bind(this, ls)}
                                    >
                                        {ls.name}
                                    </a>
                                </Tooltip>

                                <Icon
                                    type="download"
                                    className={styles.downIcon}
                                    onClick={this.onDownLoad.bind(this, ls)}
                                />
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        );
    };
    rendertextUpload = (item = this.props.data || []) => {
        if (!Array.isArray(item)) return item;
        return (
            <ul className={styles.textUploadList}>
                {item.map((ls, index) => (
                    <li key={index} className={styles.textUploadListItem}>
                        <div className={styles.textUploadListItemInfo}>
                            <span className={styles.textUploadListItemBox}>
                                <i aria-label="图标: paper-clip" className="anticon anticon-paper-clip">
                                    <svg
                                        viewBox="64 64 896 896"
                                        focusable="false"
                                        className=""
                                        data-icon="paper-clip"
                                        width="1em"
                                        height="1em"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path d="M779.3 196.6c-94.2-94.2-247.6-94.2-341.7 0l-261 260.8c-1.7 1.7-2.6 4-2.6 6.4s.9 4.7 2.6 6.4l36.9 36.9a9 9 0 0 0 12.7 0l261-260.8c32.4-32.4 75.5-50.2 121.3-50.2s88.9 17.8 121.2 50.2c32.4 32.4 50.2 75.5 50.2 121.2 0 45.8-17.8 88.8-50.2 121.2l-266 265.9-43.1 43.1c-40.3 40.3-105.8 40.3-146.1 0-19.5-19.5-30.2-45.4-30.2-73s10.7-53.5 30.2-73l263.9-263.8c6.7-6.6 15.5-10.3 24.9-10.3h.1c9.4 0 18.1 3.7 24.7 10.3 6.7 6.7 10.3 15.5 10.3 24.9 0 9.3-3.7 18.1-10.3 24.7L372.4 653c-1.7 1.7-2.6 4-2.6 6.4s.9 4.7 2.6 6.4l36.9 36.9a9 9 0 0 0 12.7 0l215.6-215.6c19.9-19.9 30.8-46.3 30.8-74.4s-11-54.6-30.8-74.4c-41.1-41.1-107.9-41-149 0L463 364 224.8 602.1A172.22 172.22 0 0 0 174 724.8c0 46.3 18.1 89.8 50.8 122.5 33.9 33.8 78.3 50.7 122.7 50.7 44.4 0 88.8-16.9 122.6-50.7l309.2-309C824.8 492.7 850 432 850 367.5c.1-64.6-25.1-125.3-70.7-170.9z" />
                                    </svg>
                                </i>
                                <a
                                    className={styles.textUploadListItemInfoName}
                                    onClick={this.onPreview.bind(this, ls)}
                                >
                                    {ls.name}
                                </a>
                                <Icon
                                    type="download"
                                    className={styles.downIcon}
                                    onClick={this.onDownLoad.bind(this, ls)}
                                />
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        );
    };
    renderUpload = (item = this.props.data || []) => {
        if (!Array.isArray(item)) return item;
        return item.map((ls, index) => {
            return (
                <div className={styles.wrap} key={index}>
                    <div className={styles.fileBox}>
                        <img
                            ref={(img) => (this.img = img)}
                            className={styles.fileStyle}
                            src={checkoutFileType(getUrl(ls, CDN_HOST)).thumbUrl}
                        />
                        <span className={styles.fileName}>{ls.name}</span>
                    </div>

                    <div className={styles.fileBoxHove}>
                        <span className={styles.icon} onClick={this.onPreview.bind(this, ls)}>
                            <Icon type="eye" style={{ fontSize: '20px', color: '#fff' }} />
                        </span>
                        <a className={styles.icon} onClick={this.onDownLoad.bind(this, ls)}>
                            <Icon type="download" style={{ fontSize: '20px', color: '#fff' }} />
                        </a>
                    </div>
                </div>
            );
        });
    };

    render() {
        const { stylePosition } = this.props;
        return (
            <>
                <Preview ref={(dom) => (this.model = dom)} />
                <div className={`${styles.fileList} ${stylePosition === 'center' ? styles.fileListCenter : null}`}>
                    {this.checkoutDetailType()}
                </div>
            </>
        );
    }
}
