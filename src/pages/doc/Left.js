import React, { Component } from 'react';
import style from './style.css';

class Box extends Component {
  render() {
    return (
      <>
        <div className={style.boxLeft}>
          { this.props.children }
        </div>
      </>
    )
  }
}


export default Box;

