import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Menu, Dropdown, Tooltip } from 'antd';
import { connect } from 'dva';
import styles from './style.less';

const Head = ({ item }) => {
    return (
        <div className={styles.head}>
            <div className={styles.headImg}>
                {item.userIcon ? (
                    <img src={item.userIcon} alt="" />
                ) : (
                    <span>{item.userName && item.userName.slice(-2)}</span>
                )}
            </div>
            <span className={styles.headIcon} style={{ background: item.color }} />
        </div>
    );
};


const Index = ({ userList = [] }) => {
    const [visible, setVisible] = useState(false);
    const onVisibleChangeMth = (v) => {
        setVisible(v);
    };

    const menu = (
        <Menu onClick={() => { setVisible(false); }}>
            {userList.map((item) => {
                return (
                    <Menu.Item key={item.userId}>
                        <div className={styles.menuItem}>
                            <Head item={item} />
                            <span className={styles.menuItemName}>{item.userName}</span>
                        </div>
                    </Menu.Item>
                );
            })}
        </Menu>
    );
    return (
        <div className={styles.userList}>
            {visible ? (
                <div className={styles.userMultiple}>
                    <div className={styles.text}>
                        共有
                        {userList.length}
                        个协作者
                    </div>
                </div>
            ) : (
                <div className={styles.userSingle}>
                    {userList.slice(0, 5).map((item) => {
                        return (
                            <Tooltip title={item.userName} key={item.userId} placement="bottom">
                                <div className={styles.headWrap}>
                                    <Head item={item} key={item.userId} />
                                </div>
                            </Tooltip>
                        );
                    })}
                </div>
            )}
            {userList.length > 5 && (
                <Dropdown overlay={menu} onVisibleChange={onVisibleChangeMth} placement="bottomCenter">
                    <div>
                        {visible ? (
                            <img src="https://attachment.mttop.cn/icondrow.png" alt="" className={styles.userMoreIcon} />
                        ) : (
                            <div className={styles.userMore}>
                                +
                                {userList.length - 5}
                            </div>
                        )}
                    </div>
                </Dropdown>
            )}
        </div>
    );
};

export default connect(({ liveMessage }: any) => {
    return {
        userList: liveMessage.userList,
    };
})(Index);
