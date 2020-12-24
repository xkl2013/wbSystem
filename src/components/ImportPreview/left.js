import React from 'react';
import Upload from '@/components/upload/selfUpload';
import s from './left.less';

export default class Left extends React.PureComponent {
    render() {
        const { fileUrl } = this.props;
        return (
            <div className={s.leftContainer}>
                <div className={s.title}>
                    <span className={s.tip}>上传Excel文件必须按照模版格式</span>
                    <a type="download" href={fileUrl} className={s.btn}>
                        导入模版下载
                    </a>
                </div>
                <div className={s.uploadContainer}>
                    <span className={s.tip}>文件</span>
                    <Upload className={s.upload} {...this.props} />
                </div>
            </div>
        );
    }
}
