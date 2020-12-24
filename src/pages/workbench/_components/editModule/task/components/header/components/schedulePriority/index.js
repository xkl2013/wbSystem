import React, { forwardRef } from 'react';
import Dropdown from '@/ant_components/BIDropDown';
import Menu from '@/ant_components/BIMenu';
import IconFont from '@/components/CustomIcon/IconFont';
import { PRIORITY_TYPE } from '../../../../../../../_enum';

/*
 * params(dataSource)  数据源
 * 注意  默认是普通优先级
 *
 */

const Priority = (props, ref) => {
    const { onChange } = props;
    const value = props.value; //
    const colorFIlter = (id) => {
        switch (Number(id)) {
            case 1:
                return { color: '#848f9b', icon: 'iconputongjinji' };
            case 2:
                return { color: '#F7B500', icon: 'iconjinji' };
            case 3:
                return { color: '#F05969', icon: 'iconfeichangjinji' };
            default:
                break;
        }
        return { color: '#848f9b', icon: 'iconputongjinji' };
    };
    const onClick = ({ key }) => {
        if (String(key) === String(value)) return;
        onChange({ schedulePriority: key });
    };
    const menu = (
        <Menu selectedKeys={value ? [String(value)] : []} onClick={onClick}>
            {PRIORITY_TYPE.map((ls) => {
                return (
                    <Menu.Item key={ls.id}>
                        <div style={{ color: colorFIlter(ls.id).color }}>
                            <IconFont type={colorFIlter(ls.id).icon} />
                            <span>{ls.name}</span>
                        </div>
                    </Menu.Item>
                );
            })}
        </Menu>
    );
    return (
        <Dropdown ref={ref} overlay={menu} trigger={['click']} overlayStyle={{ zIndex: 1000 }} placement="bottomCenter">
            <IconFont type={colorFIlter(value).icon} style={{ color: colorFIlter(value).color }} />
        </Dropdown>
    );
};
export default forwardRef(Priority);
