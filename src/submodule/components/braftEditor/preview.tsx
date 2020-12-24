import React, { useState, useImperativeHandle } from 'react';
import { Modal } from 'antd';

interface IProps {
    htmlStr?: string;
    cRef?: any;
    language?: 'zh' | 'en';
}
const Preview: React.FC<IProps> = ({ htmlStr, cRef, language = 'zh' }) => {
    const [visible, setVisible] = useState(false);

    useImperativeHandle(cRef, () => {
        return {
            openFun: () => {
                setVisible(true);
            },
        };
    });


    const closeFun = () => {
        setVisible(false);
    };

    return (
        <Modal
            title={language === 'zh' ? '预览' : 'preview'}
            visible={visible}
            onCancel={closeFun}
            centered
            destroyOnClose
            footer={null}
            width={800}
        >
            <div dangerouslySetInnerHTML={{ __html: htmlStr }} style={{ minHeight: '80vh', overflow: 'auto' }} />
        </Modal>
    );
};

export default Preview;
