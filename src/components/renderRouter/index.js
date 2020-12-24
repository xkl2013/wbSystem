import React,{ PureComponent } from 'react';



export default class RenderRoute extends PureComponent {
    render() {
        return (
            <>
            {this.props.children}
           
</>
        );
    }
}