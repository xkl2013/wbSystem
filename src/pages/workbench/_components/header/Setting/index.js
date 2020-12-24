import React from 'react';
import { Menu } from 'antd';
import DropDown from '@/ant_components/BIDropDown';
import IconFont from '@/components/CustomIcon/IconFont';
import File from '../Modal'; // 归档
import styles from './index.less';

// 设置的配置
const config = [{ id: '1', name: '已归档' }];
class Setting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedKeys: [],
        };
    }

    componentDidMount() {}

    changeMenu = ({ key }) => {
        this.setState({
            selectedKeys: [key],
        });
        if (this.props.onChange) this.props.onChange(key);
    };

    renderMenu = () => {
        const { selectedKeys } = this.state;
        return (
            <Menu onClick={this.changeMenu} selectedKeys={selectedKeys} className={styles.menus}>
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
        const { visible, hideModal } = this.props;
        return (
            <div className={styles.btnCls}>
                <DropDown trigger={['click']} overlay={this.renderMenu()} overlayClassName={styles.menusContainer}>
                    <IconFont type="iconshezhi" className={styles.iconCls} />
                </DropDown>

                <File visible={visible} hideModal={hideModal} {...this.props} />
            </div>
        );
    }
}
export default Setting;
