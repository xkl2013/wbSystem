/* eslint-disable no-unused-expressions */
import React from 'react';

import { message } from 'antd';
import Calendar from './calendar';
import ModalDetail from './detail/detail';
import TalentDetail from './talentDetail/detail';
import { getProjectType, followTalent } from '../services';
import storage from '@/utils/storage';

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            projectType: [], // 项目类型列表
        };
    }

    async componentDidMount() {
        // 获取项目类型   艺人：全部   博主：[1,2,3,15]
        const res = await getProjectType();
        if (res && res.success) {
            const projectType = [];
            res.data.map((item) => {
                if (this.props.talentType === 0) {
                    projectType.push({
                        id: item.value,
                        name: item.text,
                    });
                } else if (this.props.talentType === 1) {
                    if ([1, 2, 3, 15].includes(item.value)) {
                        projectType.push({
                            id: item.value,
                            name: item.text,
                        });
                    }
                }
            });
            this.setState({
                projectType,
            });
        }
    }

    componentWillUnmount() {
        storage.removeItem('actorSearchValue');
        storage.removeItem('bloggerSearchValue');
    }

    addSchedult = () => {
        // 新增档期
        if (this.modalDetail) {
            this.modalDetail.showInstanceModal && this.modalDetail.showInstanceModal(this.props.talentType, false);
        }
    };

    goDetail = (id) => {
        // 查看档期详情
        if (this.modalDetail) {
            this.modalDetail.showInstanceModal && this.modalDetail.showInstanceModal(null, true, id);
        }
    };

    editTalent = (id) => {
        // 编辑talent
        if (this.talentDetail) {
            this.talentDetail.showInstanceModal && this.talentDetail.showInstanceModal(this.props.talentType, id);
        }
    };

    attentionMth = async (id, isAttention) => {
        // 关注，取消关注
        const followed = isAttention ? 0 : 1;
        const res = await followTalent({
            businessType: 1,
            talentType: this.props.talentType,
            followed,
            talentId: id,
        });
        if (res && res.success) {
            message.success(res.message);
            this.props.getTalentList();
        }
    };

    render() {
        return (
            <div>
                <Calendar
                    addSchedult={this.addSchedult}
                    goDetail={this.goDetail}
                    editTalent={this.editTalent}
                    projectType={this.state.projectType}
                    attentionMth={this.attentionMth}
                    {...this.props}
                />
                <ModalDetail
                    ref={(dom) => {
                        this.modalDetail = dom;
                    }}
                    getScheduleData={this.props.getScheduleData}
                />

                <TalentDetail
                    ref={(dom) => {
                        this.talentDetail = dom;
                    }}
                    getTalentList={this.props.getTalentList}
                />
            </div>
        );
    }
}

export default Index;
