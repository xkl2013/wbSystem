import React from 'react';
import { connect } from 'dva';
import DrawerModal from './drawerModal';

const Analyse = (props) => {
    const onClose = () => {
        if (props.dispatch) {
            props.dispatch({
                type: 'live_analyse/changeCollapsed',
                payload: {
                    visible: false,
                },
            });
        }
    };
    if (!props.visible) return null;
    return <DrawerModal liveId={props.liveId} visible={props.visible} onClose={onClose} />;
};
export default connect(({ live_analyse }) => {
    return {
        visible: live_analyse.visible,
        liveId: live_analyse.liveId,
    };
})(Analyse);
