/*
 * getData: function,请求成功后回掉(必传)
 * editAuthority: string,编辑按钮权限
 * authority: string，删除/归档按钮权限
 * typeflag: 扩展字段，区分是普通还是特殊项目
 */
import React from 'react';
import ModalCalendar from './calendar';
import ModalTask from './task';
import { getScheduleDetail } from './services';

// 此类为临时中转
export default class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    showModalMessage = async (id) => {
        // 此方法需传递instanceId ,用于非此实例模块调用(消息模块)
        const resData = (await getScheduleDetail(id)) || {};
        const { data = {} } = resData;
        this.setState({ type: data.type }, () => {
            if (this.modalDetail && this.modalDetail.showInstanceModal) {
                this.modalDetail.showInstanceModal({ type: data.type, isEdit: 1, id });
            }
        });
    };

    showModal(params) {
        if (Number.isInteger(params)) {
            this.showModalMessage(params);
        } else {
            this.setState({ ...params }, () => {
                if (this.modalDetail && this.modalDetail.showInstanceModal) {
                    this.modalDetail.showInstanceModal(params);
                }
            });
        }
    }

    renderCom = () => {
        const { type } = this.state;
        if (Number(type) === 1) {
            return (
                <ModalTask
                    ref={(dom) => {
                        this.modalDetail = dom;
                    }}
                    {...this.props}
                />
            );
        }
        if (Number(type) === 0) {
            return (
                <ModalCalendar
                    ref={(dom) => {
                        this.modalDetail = dom;
                    }}
                    {...this.props}
                />
            );
        }
        return null;
    };

    render() {
        return <>{this.renderCom()}</>;
    }
}
