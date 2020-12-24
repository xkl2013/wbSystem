import { useEffect } from 'react';
import { connect } from 'dva';
import storage from '@/submodule/utils/storage';

const MsgTransfer = (props: any) => {
    const { dispatch, onReceiveMsg, userEditMsg, callbackId } = props;
    useEffect(() => {
        if (onReceiveMsg) {
            dispatch({
                type: 'liveMessage/register',
                payload: {
                    onReceiveMsg,
                },
            });
        }
    }, [onReceiveMsg]);
    useEffect(() => {
        if (callbackId) {
            dispatch({
                type: 'liveMessage/reCallMsgCallback',
                payload: {
                    callbackId,
                },
            });
        }
    }, [callbackId]);
    useEffect(() => {
        const userInfo = storage.getUserInfo();
        userEditMsg.userId = userInfo.userId;
        dispatch({
            type: 'liveMessage/sendMessage',
            payload: {
                messageData: userEditMsg,
            },
        });
    }, [userEditMsg]);
    return null;
};

export default connect()(MsgTransfer);
