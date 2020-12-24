import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import headerStyle from './styles.less';
import admin from '@/assets/menuIcon/admin.png';
import settingIcon from '@/assets/menuIcon/setting.png';
import loginoutIcon from '@/assets/menuIcon/loginout.png';
import forendIcon from '@/assets/menuIcon/forend.png';
import storage from '@/utils/storage';
import ChangePwd from '@/pages/login/changePwd';
import ChangeRole from '../component/chengeRole';

interface Props {
  location: any,
  history: any
}
export const HomeMenu: React.SFC<Props> = (props) => {
  const [visible, setVisible] = useState(false);
  let role: any = null
  const onClickMenu = (type: string) => {
    switch (type) {
      case 'admin':
        props.history.push('/admin');
        break;
      case 'setting':
        showChangePwd(true)
        break;
      case 'changeRole':
        role && role.onShow();
        break;
      case 'loginout':
        storage.clearUserInfo();
        props.history.push('/loginLayout/loginIn');
        break;
      case 'forend':
        props.history.push('/foreEnd');
        break;
      default:
        break;
    }
  }
  const showChangePwd = (visible: boolean) => {
    setVisible(visible);
  }
  const checkoutPath = () => {
    const location = props.location || {};
    const isadmin = /^\/admin\/?(\w+\/?)*$/.test(location.pathname);
    return isadmin ? [{ id: 'forend', name: '进入前台', type: forendIcon }] : [{ id: 'admin', name: '进入后台', type: admin }];
  }
  const checkoutRoleNum = () => {
    const userInfo = storage.getUserInfo() || {};
    const roleAmount = userInfo.roleAmount || 0;
    return roleAmount > 1 ? [{ id: 'changeRole', name: '切换角色', type: loginoutIcon }] : [];
  }
  const gobackHome = () => {
    setTimeout(() => {
      props.history.push('/');
    }, 200);

  }
  const renderMenu = () => {
    const menuData = [
      ...checkoutPath(),
      { id: 'setting', name: '账户设置', type: settingIcon },
      ...checkoutRoleNum(),
      { id: 'loginout', name: '退出登录', type: loginoutIcon },
    ]
    return (
      <>
        <ChangePwd onShow={showChangePwd} visible={visible} />
        <ChangeRole ref={(dom: any) => { role = dom }} goback={gobackHome} />

        <Menu className={headerStyle.menu} selectedKeys={[]}>
          {menuData.map(item => (
            <Menu.Item key={item.id} onClick={onClickMenu.bind(null, item.id)}>
              <span style={{ display: 'inline-block', width: '20px', marginLeft: '-3px' }}>
                <img src={item.type} alt="icon" className={headerStyle.icon} />
              </span>
              {item.name}
            </Menu.Item>
          ))}
        </Menu>
      </>
    );
  }
  return renderMenu()
}
