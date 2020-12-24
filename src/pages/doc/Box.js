import React, { Component } from 'react';
import style from './style.css';

class Box extends Component {
  render() {
    return (
      <div className={style.box}>
        <h3 className={style.left}>{this.props.title}</h3>
        <div className={style.right}>
          { this.props.children }
        </div>
      </div>
    )
  }
}


export default Box;

