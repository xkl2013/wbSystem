import React from 'react';
import { Menu } from 'antd';
import Link from 'umi/link';
import styles from './styles.less';

const { SubMenu } = Menu;
/*
 * 此组件用于处理工作台项目项目列表的特殊化处理,其path为/foreEnd/workbench/project
 */

const customNavbar = (item, props) => {
    switch (item.path) {
        case '/foreEnd/workbench/project':
            const { projectMenuData = [], expandIcon } = props;
            return (
                <SubMenu
                    className={styles.projectTaskMenu}
                    key="projectTaskMenu"
                    title={item.name}
                    expandIcon={expandIcon}
                >
                    {projectMenuData.map((ls) => {
                        const new_path = `/foreEnd/workbench/project/${ls.id}`;
                        return (
                            <Menu.Item key={new_path}>
                                <Link key={new_path} to={new_path}>
                                    {ls.name}
                                </Link>
                            </Menu.Item>
                        );
                    })}
                </SubMenu>
            );
        default:
            return null;
    }
};
export default customNavbar;
