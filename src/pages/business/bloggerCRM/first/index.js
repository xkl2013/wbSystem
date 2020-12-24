import React from 'react';
import Main, { mainEmitChangeCell4Msg, mainFormatColumns } from '../main';

export const emitChangeCell4Msg = (data) => {
    data.moduleType = 57;
    return mainEmitChangeCell4Msg(data);
};
export const formatColumns = (columns) => {
    return mainFormatColumns(57, columns);
};
const First = () => {
    return <Main moduleType={57} />;
};

export default First;
