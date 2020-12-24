import React, { PureComponent } from 'react';
import { message } from 'antd';
import AriTable from '@/components/airTable';
import businessConfig from '@/config/business';
import DownLoad from '@/components/DownLoad';
import s from '@/pages/business/customer/content/index.less';
import BIButton from '@/ant_components/BIButton';
import IconFont from '@/components/CustomIcon/IconFont';
import { openUrl } from '@/utils/urlOp';
import AddContact from './addContact';
import { addContact } from './service';

export default class Followup extends PureComponent {
    state = {
        visible: false,
        callback: undefined,
    };

    exportData = ({ data, btn }) => {
        const attr = businessConfig[12] || {};
        const ids = [];
        if (data) {
            data.map((item) => {
                ids.push(item.id);
            });
        }
        // 导出
        return (
            <DownLoad
                loadUrl={`/crmApi/follow/export/${attr.tableId}`}
                params={{ method: 'post', data: { ids } }}
                fileName={() => {
                    return `${attr.name}.xlsx`;
                }}
                textClassName={s.exportContainer}
                text={
                    <BIButton type="default" className={s.btn}>
                        {btn.icon}
                        <span className={s.text}>{btn.label}</span>
                    </BIButton>
                }
                hideProgress
            />
        );
    };

    check = ({ data }) => {
        if (data.length !== 1) {
            message.error('每次立项只能选中一条记录');
            return;
        }
        const params = {
            customerFollowId: data[0].historyGroupId,
        };
        openUrl('/foreEnd/business/project/establish/add', params);
    };

    showPop = (callback) => {
        this.setState({
            visible: true,
            callback,
        });
    };

    addContact = async (values) => {
        const { callback } = this.state;
        const res = await addContact(values);
        if (res && res.success && res.data) {
            if (String(res.code) === '201') {
                message.success('该联系方式已存在，已为您开放权限，添加至列表中');
            }
            const { id, contactName, mobilePhone, weixinNumber } = res.data;
            let info = '';
            if (mobilePhone) {
                info = `手机：${mobilePhone}`;
            } else if (weixinNumber) {
                info = `微信：${weixinNumber}`;
            }
            const contact = [
                {
                    fieldValueName: contactName,
                    fieldValueValue: String(id),
                    extraData: { contactPhone: [{ text: info, value: info }] },
                },
            ];
            if (typeof callback === 'function') {
                callback(contact);
            }
            this.hidePop();
        }
    };

    hidePop = () => {
        this.setState({
            visible: false,
        });
    };

    columnConfigCallback = ({ config, callback }) => {
        if (config.columnName === 'contactName') {
            const extraOption = (
                <div className={s.addContact} onMouseDown={this.showPop.bind(this, callback)}>
                    <IconFont className={s.addIcon} type="iconxinzeng" />
                    添加联系人
                </div>
            );
            // 此selfCom为防止单元格popover失去焦点
            const selfCom = this.renderSelfCom();
            return { extraOption, selfCom };
        }
    };

    renderSelfCom = () => {
        const { visible } = this.state;
        return (
            visible && (
                <AddContact
                    visible={visible}
                    title="添加联系人"
                    footer={null}
                    handleSubmit={this.addContact}
                    handleCancel={this.hidePop}
                    onCancel={this.hidePop}
                    width={440}
                    zIndex={1031}
                    mask={false}
                />
            )
        );
    };

    render() {
        const attr = businessConfig[12] || {};
        return (
            <>
                <AriTable
                    {...attr}
                    columnConfigCallback={this.columnConfigCallback}
                    btns={[
                        {
                            label: '立项',
                            icon: <IconFont type="iconlixiang" />,
                            type: 'multiple',
                            check: this.check,
                        },
                        {
                            label: '导出',
                            icon: <IconFont type="iconliebiaoye-daochu" />,
                            download: this.exportData,
                            type: 'multiple',
                        },
                    ]}
                />
                {this.renderSelfCom()}
            </>
        );
    }
}
