import React, { Component } from 'react';
import { message } from 'antd';
import BIModal from '@/ant_components/BIModal';
import BIRadio from '@/ant_components/BIRadio';
import { getBloggersRecommendList, updateBloggersRecommendList } from '../services';
import FilterPanel from '@/rewrite_component/filter_panel/modalFiles';
import styles from './index.less';

class Recommend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            recommendType: 1, //  1:重点推荐 2:近期推荐 3:其他
            chooseRecommendBloggers: [], // 选中的人
            filterPanelVisible: false,
            totalBloggers: [], // 初始化时默认所有博主数据
        };
    }

    initData = () => {
        // 初始化
        this.setState({
            modalVisible: true,
            recommendType: 1,
        });
    };

    recommendTypeChange = (e) => {
        // 推荐类型单选
        this.setState({
            recommendType: e.target.value,
        });
    };

    modalCancel = () => {
        // 模态框关闭
        this.setState({
            modalVisible: false,
        });
    };

    modalOk = () => {
        // 模态框确定
        this.initRecommendBlogger();
        this.setState({ filterPanelVisible: true });
    };

    // 处理博主推荐弹框数据
    initRecommendBlogger = async () => {
        const { recommendType } = this.state;
        const response = await getBloggersRecommendList({ bloggerRecommendTypeList: [String(recommendType), '1,2'] });
        if (response && response.success) {
            let chooseRecommendBloggers = Array.isArray(response.data) ? response.data : [];
            chooseRecommendBloggers = chooseRecommendBloggers.map((ls) => {
                return {
                    ...ls,
                    id: ls.id,
                    name: ls.bloggerName,
                };
            });
            const arr = JSON.parse(JSON.stringify(chooseRecommendBloggers));
            this.setState({
                chooseRecommendBloggers: arr,
            });
        }
    };

    // 搜索框数据处理
    fetchBlogger = async (bloggerNickName) => {
        const response = await getBloggersRecommendList({
            bloggerRecommendTypeList: ['1', '2', '3', '1,2'],
            bloggerNickName,
        });
        let chooseRecommendBloggers = [];
        if (response && response.success) {
            chooseRecommendBloggers = Array.isArray(response.data) ? response.data : [];
            chooseRecommendBloggers = chooseRecommendBloggers.map((ls) => {
                return {
                    ...ls,
                    id: ls.id,
                    name: ls.bloggerName,
                };
            });
        }
        if (!bloggerNickName) {
            this.setState({
                totalBloggers: chooseRecommendBloggers,
            });
        }
        return chooseRecommendBloggers;
    };

    // 发送前处理数据格式
    handleBloggerRecommendType = (item, type) => {
        const { recommendType } = this.state;
        let bloggerRecommendTypeArr = item.bloggerRecommendType ? item.bloggerRecommendType.split(',') : [];
        const recommendType12Index = bloggerRecommendTypeArr.indexOf(String(recommendType));
        if (type === 1) {
            if (recommendType12Index === -1) {
                bloggerRecommendTypeArr.push(recommendType);
                bloggerRecommendTypeArr = bloggerRecommendTypeArr.filter((i) => {
                    return Number(i) !== 3;
                });
            }
        } else if (type === 2) {
            if (recommendType12Index > -1) {
                bloggerRecommendTypeArr.splice(recommendType12Index, 1);
                if (bloggerRecommendTypeArr.length === 0) {
                    bloggerRecommendTypeArr = [3];
                }
            }
        }
        bloggerRecommendTypeArr = bloggerRecommendTypeArr.sort((a, b) => {
            return Number(a) - Number(b);
        });
        return {
            id: item.id,
            bloggerRecommendType: bloggerRecommendTypeArr.join(','),
        };
    };

    // 提交数据
    submitRecommendBloggers = async (value) => {
        if (!Array.isArray(value)) return;
        const { totalBloggers } = this.state;
        const bloggerRecommendList = totalBloggers.map((item) => {
            const obj = value.find((i) => {
                return i.id === item.id;
            });
            if (obj) {
                return this.handleBloggerRecommendType(item, 1);
            }
            return this.handleBloggerRecommendType(item, 2);
        });

        const response = await updateBloggersRecommendList({ bloggerRecommendList });
        if (response && response.success) {
            message.success('设置成功');
            this.setState({ filterPanelVisible: false, modalVisible: false });
            // eslint-disable-next-line
            this.props.refresh && this.props.refresh();
        }
    };

    render() {
        const { modalVisible, recommendType, filterPanelVisible } = this.state;
        return (
            <>
                <BIModal
                    visible={modalVisible}
                    centered="center"
                    title="博主推荐"
                    onCancel={this.modalCancel}
                    onOk={this.modalOk}
                >
                    <p className={styles.mb20}>请选择博主推荐类型</p>
                    <BIRadio value={recommendType} onChange={this.recommendTypeChange}>
                        <BIRadio.Radio value={1}>重点博主推荐</BIRadio.Radio>
                        <BIRadio.Radio value={2}>近期推荐</BIRadio.Radio>
                    </BIRadio>
                </BIModal>
                {filterPanelVisible ? (
                    <FilterPanel
                        visible={filterPanelVisible}
                        instanceName="博主"
                        title="选择博主"
                        value={this.state.chooseRecommendBloggers}
                        handleOk={this.submitRecommendBloggers}
                        onCancel={() => {
                            return this.setState({ filterPanelVisible: false });
                        }}
                        request={this.fetchBlogger}
                    />
                ) : null}
            </>
        );
    }
}

export default Recommend;
