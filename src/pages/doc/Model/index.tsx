import React, { Component } from 'react';

interface HelloProps {
    name: string,
    age: number
}
export default class Hello extends React.Component<HelloProps, {}>{
    render() {
        const num: number = 222;
        return (<div>{num}</div>
        );
    };
}