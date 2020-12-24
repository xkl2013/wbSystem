import React from 'react';

const Input = (props) => {
    const {
        data: { value },
    } = props || {};
    return <span>{value}</span>;
};
export default Input;
