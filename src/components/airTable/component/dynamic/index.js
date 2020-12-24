/* eslint-disable react/no-danger */
// 模块增加评论需要在config中配置模块名和接口名
// 在service下的comment文件写接口
// 在model下的model文件写数据层
// operateId:默认展示的下拉菜单项
// hideMenu:隐藏菜单
// 默认展示我的评论还是全部评论  initCommonType:'my','all'
import React, { Component } from 'react';
import { List, Comment, Popover } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import Editor from '@/components/editor';
import avatar from '@/assets/avatar.png';
import storage from '@/utils/storage';
import TagList from '@/components/editor/Tag/tagList';
import OperationLog from '@/components/OperationLog';
import FileList from '@/components/editor/File/detail';
import AuthButton from '@/components/AuthButton';
import { commentURL } from '@/utils/reg';
import { handleShimoURL } from '@/utils/utils';
import { commentAdd, commentList, myCommentList } from '@/services/comment';
import styles from './index.less';
import SelfMenu from './menu';

// const config = { 1:艺人 2:博主 3:客户 4:线索 5:立项 6:项目 7:合同 8:审批 9：费用报销 10:费用申请 12:客户跟进 13:日程, 18:档期}

class Dynamic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // loading: false,
            dataSource: [],
            selectedKeys: ['1'],
            opUsers: [],
        };
    }

    componentDidMount() {
        this.getDataList();
    }

    componentWillReceiveProps(nextProps) {
        const { id, rowData } = this.props;
        if (nextProps.id !== id) {
            this.getDataList({}, nextProps.id);
        }
        // 行数据更改时拉取最新操作记录
        if (JSON.stringify(nextProps.rowData) !== JSON.stringify(rowData)) {
            this.getDataList({}, nextProps.id);
        }
    }

    // 特殊化处理操作记录时发表评论（本地化）
    addCommentCb = (val) => {
        const { dataSource } = this.state;
        const myself = storage.getUserInfo();
        // 构造评论数据
        const temp = val;
        temp.tagsList = val.tagList;
        temp.commentUserIcon = myself.avatar;
        temp.commentUserId = myself.userId;
        temp.commentUserName = myself.userName;
        temp.commentCreatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
        const current = this.changeData([temp]);
        const newData = dataSource.concat(current);
        this.setState({
            dataSource: newData,
        });
    };

    // 请求添加评论
    addComment = async (val = {}, callback) => {
        const { id, interfaceName } = this.props;
        const { selectedKeys } = this.state;
        const response = await commentAdd({
            commentBusinessId: id,
            commentBusinessType: Number(interfaceName),
            ...val,
        });
        if (response && response.success) {
            if (selectedKeys[0] === '4') {
                this.addCommentCb(val);
            } else {
                this.getDataList();
            }
            if (typeof callback === 'function') {
                callback();
            }
        }
    };

    /**
     * 请求评论列表
     * @param param     接口请求参数
     * @param newId     实例id
     * @returns {Promise<void>}
     */
    getDataList = async (param = {}, newId) => {
        const { id, interfaceName, commentSort } = this.props;
        const { selectedKeys, opUsers } = this.state;
        const extra = this.getMenu(selectedKeys[0], opUsers);
        let func = commentList;
        if (selectedKeys[0] === '3') {
            func = myCommentList;
        }
        // 继承分页信息
        const newParam = _.assign({ pageSize: 10000, pageNum: 1 }, param, extra);
        // 默认倒叙排
        newParam.sort = commentSort || 2;
        // 实例id
        newParam.commentBusinessId = newId || id;
        // 模块分类
        newParam.commentBusinessType = Number(interfaceName);
        // await this.setState({ loading: true });
        const response = await func(newParam);
        if (response && response.success) {
            const data = response.data || {};
            const list = Array.isArray(data.list) ? data.list : [];
            const dataSource = this.changeData(list);
            this.setState({ dataSource });
            setTimeout(() => {
                const bottomDom = document.getElementById('goBottom');
                if (bottomDom) {
                    bottomDom.scrollTop = bottomDom.scrollHeight;
                }
            }, 100);
        }
        // await this.setState({ loading: false });
    };

    // 附件数据格式化
    formatFileValue = (value) => {
        if (!Array.isArray(value)) return [];
        return value.map((item) => {
            return {
                name: item.commentAttachmentName,
                value: item.commentAttachmentUrl,
                size: item.commentAttachmentFileSize,
                domain: item.commentAttachmentDomain,
            };
        });
    };

    // 处理数据
    changeData = (data = []) => {
        return data.map((item) => {
            return {
                ...item,
                commentContent: this.changeCommon(item.commentContent),
            };
        });
    };

    // 转换评论内容，高亮显示@人
    changeCommon = (content = '') => {
        return content.replace(/\u202a([^\u202a\u2005]+?)\u2005/g, '<span>$1 </span>').replace(commentURL, (url) => {
            return `<a href=${handleShimoURL(url)} target='_blank'>${url}</a>`;
        });
    };

    // 修改筛选条件
    changeMenu = (selectedMenu, selectedKeys, users) => {
        this.setState(
            {
                selectedKeys,
                opUsers: users,
            },
            this.getDataList,
        );
    };

    // 根据筛选条件构造请求参数
    getMenu = (selectedMenu, users) => {
        const { operateId } = this.props;
        const params = { pageSize: 10000, pageNum: 1 };
        const menuId = operateId || selectedMenu;
        switch (menuId) {
            case '1': // 所有动态
                break;
            case '2': // 所有评论
                params.commentType = 0;
                break;
            case '3': // 我的评论
                params.commentType = 0;
                break;
            case '4': // 所有操作记录
                params.commentType = 1;
                break;
            case '5': // 操作人操作记录
                params.operationUserIdList = users.map((item) => {
                    return item.userId;
                });
                break;
            default:
                break;
        }
        return params;
    };

    render() {
        const {
            id, hideMenu, interfaceName, menuConfig, hideAddComment, authority, rateProps, disabled,
        } = this.props;
        const { dataSource, selectedKeys } = this.state;
        return (
            <div className={styles.pageWrap}>
                {!hideMenu ? (
                    <div className={styles.titleCls}>
                        <SelfMenu
                            id={id}
                            interfaceName={interfaceName}
                            selectedKeys={selectedKeys}
                            onChange={this.changeMenu}
                            menuConfig={menuConfig}
                            disabled={disabled}
                        />
                    </div>
                ) : null}
                <div className={styles.contentCls} id="goBottom">
                    <List
                        className="comment-list"
                        itemLayout="horizontal"
                        dataSource={dataSource}
                        locale={{
                            emptyText: '暂无数据',
                        }}
                        renderItem={(item) => {
                            const userIcon = item.commentUserIcon
                                ? `${item.commentUserIcon}?imageView2/1/w/30/h/30`
                                : avatar;
                            return (
                                <li>
                                    {String(item.commentType) === '0' && (
                                        <Comment
                                            author={
                                                <>
                                                    <Popover
                                                        placement="topLeft"
                                                        content={item.commentUserName}
                                                        trigger="hover"
                                                    >
                                                        <span className={styles.userNameCls}>
                                                            {item.commentUserName}
                                                        </span>
                                                    </Popover>
                                                </>
                                            }
                                            avatar={<img alt="" src={userIcon} />}
                                            content={
                                                <>
                                                    <pre
                                                        dangerouslySetInnerHTML={{
                                                            __html: item.commentContent,
                                                        }}
                                                    />
                                                    {item.tagsList && item.tagsList.length ? (
                                                        <div>
                                                            <TagList tagList={item.tagsList} hideClose />
                                                        </div>
                                                    ) : null}
                                                    {item.commentAttachmentDTOs && item.commentAttachmentDTOs.length ? (
                                                        <FileList
                                                            overlayClassName={styles.fileCls}
                                                            showUploadList={{ showRemoveIcon: false }}
                                                            listType="picture-text"
                                                            data={this.formatFileValue(item.commentAttachmentDTOs)}
                                                        />
                                                    ) : null}
                                                </>
                                            }
                                            datetime={item.commentCreatedAt}
                                        />
                                    )}
                                    {String(item.commentType) === '1' && (
                                        <div>
                                            <OperationLog {...item} rateProps={rateProps} />
                                        </div>
                                    )}
                                </li>
                            );
                        }}
                    />
                </div>
                {!hideAddComment
                    && (authority ? (
                        <AuthButton authority={authority}>
                            <div className={styles.inputCls}>
                                <Editor
                                    maxHeight={500}
                                    maxLength={2000}
                                    slots={['1', '2']}
                                    inModal={true}
                                    onClick={(val, cal) => {
                                        return this.addComment(val, cal);
                                    }}
                                />
                            </div>
                        </AuthButton>
                    ) : (
                        <div className={styles.inputCls}>
                            <Editor
                                maxLength={2000}
                                slots={['1', '2']}
                                inModal={true}
                                onClick={(val, cal) => {
                                    return this.addComment(val, cal);
                                }}
                            />
                        </div>
                    ))}
            </div>
        );
    }
}

export default Dynamic;
