import React from 'react';
import Select from '@/ant_components/BISelect';
import styles from './styles.less';

export default function Header(props) {
    const { settings, messageTypeList } = props;
    const renderHeader = () => {
        const { listParams, messageCountList } = props;
        if (messageTypeList.length > 1) {
            return (
                <Select
                    style={{ width: '320px' }}
                    value={String(listParams.messageType || 0)}
                    onChange={props.changeMessageType}
                    getPopupContainer={() => {
                        return document.getElementById('message_header_custom');
                    }}
                >
                    {messageTypeList.map((item) => {
                        return <Select.Option key={String(item.messageType)}>{item.messageTypeName}</Select.Option>;
                    })}
                </Select>
            );
        }
        const obj = messageCountList.find((ls) => {
            return String(ls.messageModule) === String(listParams.messageModule);
        }) || {};
        if (obj.messageModule) {
            return obj.messageModuleName;
        }
        return '消息';
    };

    return (
        <div className={styles.header} id="message_header_custom" style={{ height: settings.headerHeight - 5 }}>
            {renderHeader()}
        </div>
    );
}
