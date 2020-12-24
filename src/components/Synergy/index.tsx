/* eslint-disable */
import React, { useState, useEffect, useCallback, useImperativeHandle, useRef } from 'react';
import { connect } from 'dva';
import LiveSocket from '@/utils/liveSocket';
import storage from '@/utils/storage';
import { createStyle, changeUserListData } from './common';
import UserList from './components/userList';


const typeText = {
    1:'add',
    2:'edit',
    3:'del',
    5:'clear',
}


const Index = (props) => {

    const { liveId } = props.location.query || {};
    const { userId } = storage.getUserInfo() || {};

    // 接收消息
    const messageCallback = (result) => {
        const { data, messageType,liveId } = result || {};
        // 0-用户列表 1-新增 2-修改 3-删除
        switch (messageType) {
            case 0:
                if (data && Array.isArray(data)) {
                    const arr = changeUserListData(data);
                    props.dispatch({
                        type: 'liveMessage/setUserList',
                        payload: {
                            userList:arr
                        },
                    });
                }
                break;
            case 1:
            case 2:
            case 3:
            case 5:
                const operateType = typeText[messageType]
                props.dispatch({
                    type: 'liveMessage/receiveMsgCallback',
                    payload: {
                        liveId,
                        operateType,
                        data,
                    },
                });
                break;
            default:
                break;
        }
    }

    const initMth = () => {
        const ws = new LiveSocket({
            path: `/wsMessage/live/${liveId}_${userId}`,
            messageCallback,
        });
        props.dispatch({
            type: 'liveMessage/setWsInstance',
            payload: {
                ws
            },
        });
    }


    useEffect(() => {
        initMth();
        return () => {
            props.dispatch({
                type: 'liveMessage/close',
            });
        }
    }, []);

    useEffect(() => {
        props.dispatch({
            type: 'header/saveHeaderName',
            payload: {
                component: <UserList />,
            },
        });
        return () => {
            props.dispatch({
                type: 'header/saveHeaderName',
                payload: {
                    component: null,
                },
            });
        }
    }, [props.location]);

    return <div dangerouslySetInnerHTML={{ __html: createStyle( props.userList) }} />;
};


export default connect(({ routing,liveMessage }: any) => {

    return {
        location: routing.location,
        userList: liveMessage.userList,
        ws: liveMessage.ws,
        onReceiveMsg: liveMessage.onReceiveMsg,
    };
})(Index);
