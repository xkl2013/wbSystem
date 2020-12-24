import React from 'react';
import Link from 'umi/link';

export const Fans = (props) => {
    const { value, rowData, cellRenderProps } = props;
    const [user] = value || [];
    const { text } = user || {};
    const { to } = cellRenderProps;
    return (
        <Link to={`${to}?liveId=${rowData.id}&roomId=${rowData.roomId}`} target="_blank">
            {text}
        </Link>
    );
};
export default Fans;
