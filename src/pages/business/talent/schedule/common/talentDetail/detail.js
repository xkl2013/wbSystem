/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import React from 'react';
import { message } from 'antd';
import { formatFormCols } from '@/utils/utils';
import { formatCols } from './constants';
import ModalCom from '@/components/CalendarForm/modal';
// import ModalCom from './modal';
import { getStarsDetail, updateStarsDetail, getBloggersDetail, updateBloggersDetail } from '../../services';

export default class Detail extends React.Component {
    state = {
        visible: false,
        formData: {},
        talentType: 0, // 0-艺人  1-博主
        id: '', // 详情ID
    };

    componentDidMount() {}

    showInstanceModal = async (talentType, id) => {
        //  打开弹框
        this.setState({
            talentType,
            id,
            formData: {},
        });
        if (talentType === 0) {
            const res = await getStarsDetail(id);
            if (res && res.success) {
                const formData = {
                    home: res.data.star.starHome,
                    homeId: res.data.star.starHomeId,
                    calendarRemark: res.data.star.starCalendarRemark,
                };
                this.setState({
                    formData,
                    visible: true,
                });
            }
        } else if (talentType === 1) {
            const res = await getBloggersDetail(id);
            if (res && res.success) {
                const formData = {
                    home: res.data.blogger.bloggerHome,
                    homeId: res.data.blogger.bloggerHomeId,
                    calendarRemark: res.data.blogger.bloggerCalendarRemark,
                };
                this.setState({
                    formData,
                    visible: true,
                });
            }
        }
    };

    hideForm = (onlyClose) => {
        // 隐藏弹框
        this.setState({ visible: false });
        if (!onlyClose) {
            this.props.getTalentList();
        }

        if (this.props.onClose) {
            this.props.onClose();
        }
    };

    handleSubmit = async (data) => {
        // 提交
        const { talentType, id } = this.state;
        if (talentType === 0) {
            const obj = {
                starId: id,
                starHomeId: data.homeId,
                starHome: data.home,
                starCalendarRemark: data.calendarRemark,
            };
            const res = await updateStarsDetail(obj);
            if (res && res.success) {
                message.success('编辑成功');
                this.hideForm();
            }
        } else if (talentType === 1) {
            const obj = {
                bloggerId: id,
                bloggerHomeId: data.homeId,
                bloggerHome: data.home,
                bloggerCalendarRemark: data.calendarRemark,
            };
            const res = await updateBloggersDetail(obj);
            if (res && res.success) {
                message.success('编辑成功');
                this.hideForm();
            }
        }
    };

    render() {
        const { visible, formData, loading, talentType } = this.state;
        const cols = formatFormCols(
            formatCols(
                {
                    formData,
                },
                { talentType },
            ),
        );
        return !visible ? null : (
            <ModalCom
                formTitle="编辑"
                visible={visible}
                className="editFormModal"
                width={580}
                title={null}
                footer={null}
                onCancel={() => {
                    return this.hideForm(1);
                }}
                wrappedComponentRef={(fv) => {
                    this.formView = fv;
                }}
                cols={cols}
                detailType="editPage"
                formData={formData}
                handleCancel={() => {
                    return this.hideForm(1);
                }}
                handleSubmit={this.handleSubmit}
                loading={loading}
                interfaceName="13" // 动态消息的配置id（todo 档期目前没有动态）
            />
        );
    }
}
