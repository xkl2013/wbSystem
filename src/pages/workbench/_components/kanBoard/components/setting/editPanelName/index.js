import React, { forwardRef, useState, useEffect } from 'react';
import { Input, Row, Col, message } from 'antd';
import Modal from '@/ant_components/BIModal';
import { updateSchedulePanel } from '../../../../../services';

const EditPanelName = (props, ref) => {
    const { data, onRefresh, disabled, taskParams } = props;
    const panelId = (data || {}).key;
    const projectId = taskParams.projectId;
    const [title, setTitle] = useState(data.title);
    const [visible, setVisible] = useState(false);
    const [description, setDescription] = useState(data.description);
    useEffect(() => {
        setTitle(data.title);
        setDescription(data.description);
    }, [data.title, data.description]);
    const onChangeTitle = (e) => {
        const value = e.target.value;
        setTitle(value);
    };
    const onChangeDescription = (e) => {
        const value = e.target.value;
        setDescription(value);
    };
    const onOpen = () => {
        setTitle(data.title);
        setDescription(data.description);
        setVisible(true);
    };
    const onOk = async () => {
        if (!title) {
            message.warn('不可为空');
            return;
        }
        if (data.title !== title || data.description !== description) {
            const res = await updateSchedulePanel({ panelName: title, description, panelId, projectId });
            if (res && res.success) {
                message.success('修改成功');
                setVisible(false);
                onRefresh(panelId);
            }
        }
    };
    return (
        <>
            <div onClick={onOpen}>编辑列表</div>
            <Modal
                title="列表编辑"
                visible={visible}
                zIndex={1000}
                onCancel={() => {
                    return setVisible(false);
                }}
                onOk={onOk}
                ref={ref}
            >
                <div>
                    <Row>
                        <Col span={6}>列表名称</Col>
                        <Col span={18}>
                            <Input value={title} disabled={disabled} onChange={onChangeTitle} maxLength={15} />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>列表描述</Col>
                        <Col span={18}>
                            <Input.TextArea
                                value={description}
                                disabled={disabled}
                                onChange={onChangeDescription}
                                maxLength={500}
                            />
                        </Col>
                    </Row>
                </div>
            </Modal>
        </>
    );
};
export default forwardRef(EditPanelName);
