import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { getTalentList } from '@/services/globalSearchApi';
import { message } from 'antd';
import FilterPanel from '@/rewrite_component/actor_blogger/modalFiles';
import { getLiveTalentList, saveLiveTalent } from '../../service';

const TalentManage = (props, ref) => {
    const [talentVisible, setTalentVisible] = useState(false);
    const [selectList, setSelectList] = useState([]);
    const onHideTalentManage = () => {
        setSelectList([]);
        setTalentVisible(false);
    };
    const onSubmitRecommendBloggers = async (values = []) => {
        const talentVOList = values.map((ls) => {
            return {
                talentCode: ls.talentCode,
                talentId: ls.talentId,
                talentName: ls.talentName,
                talentType: ls.talentType,
                userId: Array.isArray(ls.businessLiveTalentUserList)
                    ? ls.businessLiveTalentUserList
                        .map((ls) => {
                            return ls.userId;
                        })
                        .join(',')
                    : undefined,
            };
        });
        const res = await saveLiveTalent({ talentVOList });
        if (res && res.success) {
            message.success(res.message);
            onHideTalentManage();
        }
    };

    const showInstance = async () => {
        let list = [];
        const res = await getLiveTalentList();
        if (res && res.success) {
            list = Array.isArray(res.data) ? res.data : [];
            list = list.map((ls) => {
                return { ...ls, id: `${ls.talentId}_${ls.talentType}` };
            });
        }
        setSelectList(list);
        setTalentVisible(true);
    };
    useImperativeHandle(ref, () => {
        return {
            showInstance,
        };
    });
    const fetchTalentList = async (data) => {
        let bloggers = [];
        const res = await getTalentList({ ...data, talentSignStateList: [2, 3], pageSize: 100 });
        if (res && res.success && res.data) {
            bloggers = res.data.list
                && res.data.list.map((item) => {
                    return {
                        ...item,
                        id: `${item.talentId}_${item.talentType}`,
                    };
                });
        }
        return bloggers;
    };

    return (
        <FilterPanel
            visible={talentVisible}
            title="主播管理"
            value={selectList}
            handleOk={onSubmitRecommendBloggers}
            onCancel={onHideTalentManage}
            request={fetchTalentList}
            defaultSearchType="actor"
            panelConfig={{
                actor: {
                    id: 'actor',
                    name: '主播名称',
                    talentType: 0,
                    defaultAvatar: 'https://static.mttop.cn/admin/avatar.png',
                },
            }}
        />
    );
};
export default forwardRef(TalentManage);
