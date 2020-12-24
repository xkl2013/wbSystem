import React from 'react';
import { Empty } from 'antd';
import lodash from 'lodash';
import styles from './styles.less';
import { selUser } from './server';
import { renderTxt } from '@/utils/hoverPopover';

class userList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            isLoading: true,
        };
    }

    componentDidMount() {
        // this.getData()
        this.getData = lodash.debounce(this.getData, 400);
    }

    getData = async (name = '') => {
        if (name.length > 30) {
            return;
        }
        this.setState({
            isLoading: true,
        });
        const res = await selUser({
            name,
            pageNum: 1,
            pageSize: 50,
        });
        if (res && res.success && res.data) {
            this.setState({
                list: res.data.list || [],
                isLoading: false,
            });
            if (res.data.list && res.data.list.length > 0) {
                this.props.handleUserListHasData(true);
            } else {
                this.props.handleUserListHasData(false);
            }
        } else {
            this.setState({
                isLoading: false,
            });
            this.props.handleUserListHasData(false);
        }
    };

    emptyRender = () => {
        if (this.state.isLoading) {
            return <img src="https://static.mttop.cn/loading.gif" alt="" className={styles.loading} />;
        }
        return <Empty description="暂无数据" />;
    };

    render() {
        const { list } = this.state;
        return (
            <div className={styles.userList}>
                {list && list.length > 0 ? (
                    <ul>
                        {list.map((item, index) => {
                            return (
                                <li
                                    onClick={() => {
                                        return this.props.selUers(item);
                                    }}
                                    key={index}
                                >
                                    <div className={styles.left}>
                                        {item.avatar ? <img src={item.avatar} alt="" /> : <em />}
                                        <span>{item.name}</span>
                                    </div>
                                    <p>{renderTxt(item.deptName, 6)}</p>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    this.emptyRender()
                )}
            </div>
        );
    }
}

export default userList;
