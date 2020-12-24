/* eslint-disable react/no-danger */
import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import Input from '@/ant_components/BIInput';
import styles from './styles.less';
import { getPosition } from './utils';

import UserList from './userList';
import { myBrowser } from '@/utils/userAgent';

const userListDomHeight = 320;
/* eslint-disable no-return-assign */
class MyEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userListIsShow: false, // user列表是否显示
            userListHasData: false, // user列表是否搜到数据
            userList: [], // 选中用户
            selRealUserArr: [], // 去重后选择的列表
            value: '', // 原始数据
            valueShow: '', // 要展示的HTML数据
            left: 0, // userlist弹框left
            top: 0, // userlist弹框top
        };
        this.userList = null;
    }

    componentDidMount() {
        this.initUserList(this.props.userList);
        // eslint-disable-next-line react/no-find-dom-node
        this.inputNode = ReactDOM.findDOMNode(this.input);
        if (this.props.value) {
            this.initValue(this.props.value || '');
        }
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.userList) !== JSON.stringify(this.props.userList)) {
            this.initUserList(nextProps.userList);
        }
        if (JSON.stringify(nextProps.value) !== JSON.stringify(this.props.value)) {
            this.initValue(nextProps.value);
        }
    }

    initUserList = (userList) => {
        if (!Array.isArray(userList)) return;
        this.setState({ userList });
    };

    initValue = (value) => {
        this.setState({ value, valueShow: this.hadleValueShow(value) });
        const { changeSendBtn } = this.props;
        changeSendBtn(value);
    };

    hadleValueShow = (value) => {
        return (
            value
                .replace(/[\r\n]/g, '<br/>')
                // .replace(/((https|http)?:\/\/)[^\s]+/g, '<a>$&</a>')
                .replace(/\s/g, '&nbsp;')
                .replace("/<span id='spanDom'></span>/", '')
        );
    };

    onChange = (e) => {
        const { changeSendBtn } = this.props;
        let userStr = ''; // 要搜索的name
        let userListIsShow = false;
        let { value } = e.currentTarget;
        const position = getPosition(this.inputNode);
        const currStr = value.substr(position - 1, 1); // 光标前一个字符
        const sLen = value.slice(0, position - 1); // 光标前所有字符
        let isTrue = false;
        if (currStr === '@') {
            value = `${sLen}\u202a${value.slice(position - 1)}`;
            isTrue = true;
        }
        const lastStartIndex = value.lastIndexOf('\u202a@', position - 1); // 光标前最后一个起始位置
        const lastEndIndex = value.lastIndexOf('\u00a0', position - 1); // 光标前最后一个结束位置
        let valueShow = this.hadleValueShow(value);
        if (lastStartIndex > lastEndIndex) {
            userStr = value.substring(lastStartIndex + 2, position);
            userListIsShow = !(userStr.length > 30);
            userStr = userStr === '@' ? '' : userStr;
            if (this.userList && this.userList.getData) {
                this.userList.getData(userStr);
            }
            const lastIndexOnShow = this.countNum(sLen);
            valueShow = `${valueShow.slice(
                0,
                lastIndexOnShow,
            )}<span id='spanDom' style="display: inline-block;"></span>${valueShow.slice(lastIndexOnShow)}`;
        }

        valueShow = this.selUserNames(value, valueShow);
        this.setState({ value, valueShow, userListIsShow }, () => {
            if (isTrue) {
                if (myBrowser() === 'Safari') {
                    this.inputNode.setSelectionRange(sLen.length + 2, sLen.length + 2);
                } else {
                    setTimeout(() => {
                        this.inputNode.setSelectionRange(sLen.length + 2, sLen.length + 2);
                    }, 10);
                }
            }

            if (document.getElementById('spanDom')) {
                const clientWidth = document.body.clientWidth;
                const clientRect = document.getElementById('spanDom').getBoundingClientRect();
                let left = clientRect.left + 18;
                left = left + 300 > clientWidth ? left - 300 : left; // 右侧防遮挡
                let top = clientRect.top + 15;
                top = this.props.placement === 'bottom' ? top - userListDomHeight : top;
                this.setState({
                    left,
                    top,
                });
            }

            // 兼容动态检测是否可发送信息，客户跟进模块修改
            if (typeof changeSendBtn === 'function') changeSendBtn();
        });
    };

    selUserNames = (value, val) => {
        let valueShow = val;
        // 选中的@人集合 加色块
        let arr = value.match(/\u202a@([^\u202a@\u00a0]+?)\u00a0/g) || [];
        arr = arr.map((item) => {
            return item.replace(/\u202a@/, '').replace(/\u00a0/, '');
        });
        arr = Array.from(new Set(arr));
        const selRealUserArr = [];
        arr.map((item) => {
            this.state.userList.map((i) => {
                if (i.name === item) {
                    selRealUserArr.push(i);
                }
            });
        });
        if (selRealUserArr.length > 0) {
            selRealUserArr.map((item) => {
                valueShow = valueShow.replace(new RegExp(`\u202a@${item.name}`, 'g'), `<em>@${item.name}</em>`);
            });
        }
        this.setState({
            selRealUserArr,
        });
        return valueShow;
    };

    countNum = (str) => {
        // 当前光标前的对应HTML的长度
        const newStr = str.replace(/[\r\n]/g, '<br/>').replace(/\s/g, '&nbsp;');
        return newStr.length;
    };

    selUers = (obj) => {
        // 选择@人
        const position = getPosition(this.inputNode);
        // eslint-disable-next-line prefer-const
        let { value, userList } = this.state;
        let isHas = false; // 是否已选择过
        userList.map((item) => {
            if (item.name === obj.name) {
                isHas = true;
            }
        });
        if (!isHas) userList.push(obj);
        const { name } = obj;
        const lastStartIndex = value.lastIndexOf('\u202a@', position - 1); // 光标前最后一个起始位置
        value = `${value.slice(0, lastStartIndex + 2) + name}\u00a0${value.slice(position)}`;
        let valueShow = value.replace(/[\r\n]/g, '<br/>').replace(/\s/g, '&nbsp;');
        valueShow = this.selUserNames(value, valueShow);
        this.setState(
            {
                value,
                valueShow,
                userListIsShow: false,
                userListHasData: false,
                userList,
            },
            () => {
                if (myBrowser() === 'Safari') {
                    this.inputNode.setSelectionRange(
                        lastStartIndex + 3 + name.length,
                        lastStartIndex + 3 + name.length,
                    );
                    this.inputNode.focus();
                } else {
                    setTimeout(() => {
                        this.inputNode.setSelectionRange(
                            lastStartIndex + 3 + name.length,
                            lastStartIndex + 3 + name.length,
                        );
                        this.inputNode.focus();
                    }, 10);
                }
            },
        );
    };

    getCommonValue = () => {
        // 抛出要发送的数据
        return {
            commentContent: this.state.value,
            userList: this.state.selRealUserArr,
        };
    };

    handleReset = () => {
        // 数据初始化
        this.setState({
            userListIsShow: false,
            userListHasData: false,
            userList: [],
            selRealUserArr: [],
            value: '',
            valueShow: '',
            left: 0,
            top: 0,
        });
    };

    handleUserListHasData = (boo) => {
        // 姓名模糊搜索是否搜到数据
        this.setState({
            userListHasData: boo,
        });
    };

    setFocus = () => {
        // 聚焦
        this.inputNode.focus();
    };

    render() {
        const { value = '', userListIsShow, top, left, userListHasData } = this.state;
        const { overlayClassName, autoSize } = this.props;
        const maxLength = this.props.maxLength || 2000;

        return (
            <>
                <Input.TextArea
                    className={classnames(styles.textArea, overlayClassName)}
                    onChange={this.onChange}
                    // eslint-disable-next-line no-return-assign
                    ref={(dom) => {
                        return (this.input = dom);
                    }}
                    placeholder="请输入评论内容"
                    autoSize={autoSize || true}
                    maxLength={maxLength}
                    value={value}
                />
                <div dangerouslySetInnerHTML={{ __html: this.state.valueShow }} className={styles.textBox} />
                {userListIsShow && <div />}
                <div
                    style={{
                        position: 'fixed',
                        top,
                        left,
                        zIndex: 40,
                        display: userListIsShow && userListHasData ? 'block' : 'none',
                    }}
                >
                    <UserList
                        // eslint-disable-next-line no-return-assign
                        ref={(dom) => {
                            return (this.userList = dom);
                        }}
                        selUers={this.selUers}
                        handleUserListHasData={this.handleUserListHasData}
                    />
                </div>
                <span className={styles.words}>
                    {value.length}
/
                    {maxLength}
                </span>
            </>
        );
    }
}
export default MyEditor;
