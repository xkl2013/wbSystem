import { Menu } from 'antd';

const RoleList = (props) => {
    const { value, allRoles } = props;
    const selectedKeys = value ? [String(value)] : [];
    return (
        <Menu selectedKeys={selectedKeys} onSelect={props.onSelectRole}>
            {allRoles.map((ls) => {
                return <Menu.Item key={ls.dataUserId}>{ls.dataUserName}</Menu.Item>;
            })}
        </Menu>
    );
};
export default RoleList;
