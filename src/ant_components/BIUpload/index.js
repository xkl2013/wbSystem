import React from 'react';
import { Upload } from 'antd';
import './style.less';

/*
 * BIUpload 组件
 *
 * 基于原 ant BIUpload
 * 只扩展自定义样式
 * */
const { Dragger } = Upload;
const BIUpload = (props) => {
    return (
        <span className="Upload">
            <Upload {...props} />
        </span>
    );
};

export default BIUpload;
BIUpload.Dragger = Dragger;
