import React from 'react';
interface HelloProps {
    name: string;
    age: number;
}
export default class Hello extends React.Component<HelloProps, {}> {
    render(): JSX.Element;
}
export {};
