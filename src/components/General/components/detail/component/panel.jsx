import React from 'react';

const Input = (props) => {
    const {
        data: { value },
    } = props || {};
    return <div>{value}</div>;
};
export default Input;
