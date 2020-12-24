import React, {Component} from "react";
import {Popover} from "antd";
import {config} from './config';
import s from './index.less';

export default class extends Component {

    render() {
        const {type, value, onChange} = this.props;
        const Comp = config[type];
        return (
            <Popover
                overlayClassName={s.cardContainer}
                trigger="click"
                content={<Comp.component value={value} onChange={onChange} componentAttr={Comp.componentAttr}/>}
            >
                <div className={s.slot}>
                    <div className={s.iconContainer}>
                        <img className={s.icon} src={value.length > 0 ? Comp.selectedIcon : Comp.icon}/>
                    </div>
                    {value.length > 0 && <div className={s.desc}>{value.length > 9 ? '9+' : value.length}</div>}
                </div>
            </Popover>
        )
    }
}
