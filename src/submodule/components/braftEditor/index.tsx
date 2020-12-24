/* eslint-disable react/no-access-state-in-setstate */
import React, { useState, useRef, useEffect, useImperativeHandle } from 'react';
// 引入编辑器组件
import BraftEditor from 'braft-editor';
import ColorPicker from 'braft-extensions/dist/color-picker';
import { ContentUtils } from 'braft-utils';
import { Progress } from 'antd';
import { PropertySafetyFilled } from '@ant-design/icons';
import UploadQIniu from './uploadQIniu';
import Preview from './preview';
// 引入编辑器样式
import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/color-picker.css';
import styles from './style.less';

// 颜色色盘
BraftEditor.use(ColorPicker({
    includeEditors: ['editor-with-color-picker'],
    theme: 'light', // 支持dark和light两种主题，默认为dark
}));

// 默认不显示的控件
const excludeControlsDefault = ['emoji', 'blockquote', 'code', 'media', 'fullscreen', 'subscript', 'superscript'];

interface IObj {
    [propsName: string]: any
}
interface IProps {
    value?: string; // html
    language?: 'zh' | 'en';
    cRef?: any;
    excludeControls?: string[]; // 不需要显示的控件
    onChange?: Function
    extendControls?: any[];
}

const EditorDemo: React.FC<IProps> = ({
    value, language = 'zh', onChange, cRef, excludeControls = excludeControlsDefault, ...others
}) => {
    // 创建一个空的editorState作为初始值
    const [editorState, setEditorState] = useState(BraftEditor.createEditorState(null));
    const [percent, setPercent] = useState(0); // 进度条
    const previewRef = useRef(null);
    useEffect(() => {
        if (value && typeof value === 'object') { // 不做转换
            setEditorState(value);
        } else {
            // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorStat
            setEditorState(BraftEditor.createEditorState(value));
        }
    }, [value]);
    // 获取HTML
    const getHtml = () => {
        // 直接调用editorState.toHTML()来获取HTML格式的内容
        const htmlContent = editorState.toHTML();
        return htmlContent;
    };


    // change事件
    const handleEditorChange = (editorState: any) => {
        setEditorState(editorState);
        if (onChange) {
            onChange(editorState);
        }
    };


    // 图片上传进度
    const percentCbk = (val: number) => {
        setPercent(val);
    };

    // 图片上传进度条
    const componentBelowControlBar = () => {
        return (percent > 0 && percent < 100) ? (<Progress
            percent={percent}
            strokeColor="#04B4AD"
            format={(p) => { return `${language === 'zh' ? '图片上传中' : 'uploading'}${parseInt(p, 10)}%`; }}
            className={styles.progress}
        />) : null;
    };

    // 图片上传成功，获取图片信息
    const successCbk = (obj: IObj) => {
        const { url } = obj || {};
        setEditorState(ContentUtils.insertMedias(editorState, [{
            type: 'IMAGE',
            url,
        }]));
    };

    // 预览方法
    const previewMth = () => {
        previewRef && previewRef.current && previewRef.current.openFun();
    };

    // 图片上传组件
    const extendControls = [
        {
            key: 'antd-uploader',
            type: 'component',
            component: (
                <UploadQIniu percentCbk={percentCbk} successCbk={successCbk} language={language} />
            ),
        },
        ...(others.extendControls || [])
    ];
    const insertText = (text: string) => {
        setEditorState(ContentUtils.insertText(editorState, text));
    };

    // 向外抛出数据
    useImperativeHandle(cRef, () => {
        return {
            getHtml,
            previewMth,
            insertText,
        };
    });

    const hooks = {
        'toggle-link': ({ href, target }) => {
            if (href) {
                href = href.indexOf('http') === 0 ? href : `http://${href}`;
                return { href, target };
            }
        },
        'set-image-link': (href) => {
            if (href) {
                href = href.indexOf('http') === 0 ? href : `http://${href}`;
                return href;
            }
        },
    };
    return (
        <div className={styles.box}>
            <BraftEditor
                {...others}
                id="editor-with-color-picker"
                value={editorState}
                excludeControls={excludeControls}
                onChange={handleEditorChange}
                extendControls={extendControls}
                componentBelowControlBar={componentBelowControlBar()}
                language={language}
                hooks={hooks}
                defaultLinkTarget="_blank"
            />
            <Preview cRef={previewRef} htmlStr={getHtml()} language={language} />
        </div>
    );
};


export default EditorDemo;
