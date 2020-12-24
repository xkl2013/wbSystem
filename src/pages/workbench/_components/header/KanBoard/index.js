import React from 'react';
import { Menu } from 'antd';
import styles from './index.less';
import { getOptionName } from '@/utils/utils';
import IconFont from '@/components/CustomIcon/IconFont';
import DropDown from '@/ant_components/BIDropDown';

const config = [
    { id: '1', name: '看板视图', icon: 'iconshituqiehuan-kanbanshitu' },
    { id: '2', name: '日历视图', icon: 'iconshituqiehuan-rilishitu' },
    // { id: '3', name: '列表视图', icon: 'iconshituqiehuan-liebiaoshitu' },
];
class KanBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 1,
            tempValue: 1,
        };
    }

    static getDerivedStateFromProps(nextProps, preState) {
        if (nextProps.value !== preState.tempValue) {
            return {
                value: nextProps.value || 1,
                tempValue: nextProps.value || 1,
            };
        }
        return null;
    }

    changeMenu = ({ key }) => {
        this.setState({
            value: key,
        });
        this.props.onChange && this.props.onChange(key);
    };

    renderMenu = () => {
        const { value } = this.state;
        return (
            <Menu onClick={this.changeMenu} selectedKeys={[String(value)]} className={styles.menus}>
                {config.map((item) => {
                    return (
                        <Menu.Item key={item.id} className={styles.menu}>
                            <IconFont type={item.icon} className={styles.iconCls} />
                            {item.name}
                        </Menu.Item>
                    );
                })}
            </Menu>
        );
    };

    render() {
        const { value } = this.state;
        const { disabled } = this.props;

        return (
            <div className={styles.btnCls}>
                <DropDown
                    disabled={disabled}
                    trigger={['click']}
                    overlay={this.renderMenu()}
                    overlayClassName={styles.menusContainer}
                >
                    <div className={styles.showTitle}>
                        <IconFont type={config[Number(value) - 1].icon} className={styles.iconCls} />
                        {getOptionName(config, value)}
                        {disabled ? null : (
                            <img className={styles.dropdown} src={require('@/assets/comment/dropdown.png')} />
                        )}
                    </div>
                </DropDown>
            </div>
        );
    }
}
export default KanBoard;
