import React from 'react';
import { message } from 'antd';
import { formatDetailCols } from '../constants/detailConstants';
import ModalCom from '@/components/CalendarForm/modal/index.jsx';
import { getScheduleDetailFn, renderNoticers } from '../../_utils';

export default class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            formData: { scheduleType: '0' },
            id: '', // 详情ID
            detailType: 'detailPage',
            scheduleProjectDto: [], // 所属项目
            schedulePanelList: [], // 所属列表
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.detailType !== nextProps.detailType) {
            this.setState({ detailType: nextProps.detailType });
        }
    }

    showModal = async (id) => {
        // 此方法需传递instanceId ,用于非此实例模块调用
        const resData = await getScheduleDetailFn(id);
        this.setState({ ...resData, detailType: 'detailPage', id });
    };

    showInstanceModal = async (param) => {
        // 详情数据回显
        const { id, limit } = param;
        if (limit) {
            message.error('你暂无权限查看');
            return;
        }
        const resData = await getScheduleDetailFn(id);
        this.setState({ ...resData, id, visible: true });
    };

    hideForm = (onlyClose) => {
        const { getData, onClose } = this.props;
        // 隐藏弹框
        this.setState({ visible: false });
        if (!onlyClose) {
            getData();
            this.refreshScheduleList();
        }
        if (onClose) {
            onClose();
        }
    };

    goEdit = () => {
        const { goEditPage } = this.props;
        if (goEditPage) {
            goEditPage('editPage');
        }
    };

    render() {
        const {
            visible, formData, id, loading, schedulePanelList, scheduleProjectDto, detailType,
        } = this.state;
        const { maskClosable } = this.props;
        const detailCol = formatDetailCols({
            isEdit: 1,
            formData,
            renderNoticers,
            scheduleProjectDto,
            schedulePanelList,
        });
        return !visible ? null : (
            <ModalCom
                visible={visible}
                goEdit={this.goEdit}
                onCancel={() => {
                    return this.hideForm(1);
                }}
                wrappedComponentRef={(fv) => {
                    this.formView = fv;
                }}
                cols={detailCol}
                detailType={detailType}
                formData={formData}
                handleCancel={() => {
                    return this.hideForm(1);
                }}
                commentId={id} // 评论id
                loading={loading}
                maskClosable={maskClosable || false}
                isShowDelBtn={true} // 展示删除按钮
                interfaceName="13" // 动态消息的配置id
                commentSort={1} // 动态排序1:正序，2:倒序
                className="editFormModal"
                width={920}
                title={null}
                footer={null}
            />
        );
    }
}
