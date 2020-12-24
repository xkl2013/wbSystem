import React from 'react';
import { Menu } from 'antd';
import styles from './index.less';
import { getOptionName } from '@/utils/utils';
import DropDown from '@/ant_components/BIDropDown';

const config = [{ id: '1', name: '执行时间' }, { id: '2', name: '优先级' }];
class SecFilter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: props.kanbanType,
        };
    }

    componentDidMount() {}

    changeMenu = ({ key }) => {
        this.setState({
            selected: key,
        });
        this.props.onChange && this.props.onChange(key);
    };

    renderMenu = () => {
        const { selected } = this.state;
        return (
            <Menu
                onClick={this.changeMenu}
                selectedKeys={[selected].map((ls) => {
                    return String(ls);
                })}
                className={styles.menus}
            >
                {config.map((item) => {
                    return (
                        <Menu.Item key={item.id} className={styles.menu}>
                            {item.name}
                        </Menu.Item>
                    );
                })}
            </Menu>
        );
    };

    render() {
        const { selected } = this.state;
        return (
            <div className={styles.btnCls}>
                <DropDown trigger={['click']} overlay={this.renderMenu()} overlayClassName={styles.menusContainer}>
                    <div className={styles.showTitle}>
                        {getOptionName(config, selected)}
                        <img className={styles.dropdown} src={require('@/assets/comment/dropdown.png')} />
                    </div>
                </DropDown>
            </div>
        );
    }
}
export default SecFilter;
