import React from 'react';
import { Icon } from 'antd';
import styles from './styles.less';
import BIButton from '@/ant_components/BIButton';
import BIRadio from '@/ant_components/BIRadio';
import BIDatePicker from '@/ant_components/BIDatePicker';
import BISelect from '@/ant_components/BISelect';
import { checkPathname } from '@/components/AuthButton';
/* eslint-disable max-len */
export default class Header extends React.Component {
    render() {
        const { talentType, projectType, projectTypeValue, timeType, listType } = this.props;
        const projectTypeList = JSON.parse(JSON.stringify(projectType));
        projectTypeList.unshift({ id: 0, name: '全部' });
        return (
            <div className={styles.wrap}>
                <div className={styles.wrapLeft}>
                    <BISelect className={styles.mr10} value={listType} onChange={this.props.listTypeChange}>
                        <BISelect.Option value={0}>
                            全部
                            {talentType === 0 ? '艺人' : '博主'}
                        </BISelect.Option>
                        <BISelect.Option value={1}>我关注的</BISelect.Option>
                    </BISelect>
                    <BIButton type="primary" onClick={this.props.goToday}>
                        今天
                    </BIButton>
                    <div className="selStyle">
                        {talentType === 1 && (
                            <BISelect
                                size="small"
                                suffixIcon={<Icon type="caret-down" theme="filled" style={{ color: '#848F9B' }} />}
                                value={timeType}
                                onChange={this.props.timeTypeChange}
                            >
                                <BISelect.Option value={1}>上线日期(预计)</BISelect.Option>
                                <BISelect.Option value={2}>上线日期(实际)</BISelect.Option>
                            </BISelect>
                        )}
                        <BIDatePicker
                            allowClear={false}
                            placeholder="请选择"
                            showToday={false}
                            className={styles.wrapLeftDate}
                            value={this.props.dateValue}
                            onChange={this.props.dateChange}
                        />
                    </div>
                    {talentType === 0 && (
                        <BISelect
                            className={styles.selInput}
                            value={projectTypeValue}
                            onChange={this.props.projectTypeChange}
                        >
                            {projectTypeList.map((item) => {
                                return (
                                    <BISelect.Option key={item.id} value={item.id}>
                                        {item.name}
                                    </BISelect.Option>
                                );
                            })}
                        </BISelect>
                    )}
                </div>
                <div className={styles.wrapCenter}>
                    <Icon
                        type="left"
                        className={styles.wrapCenterIcon}
                        onClick={() => {
                            return this.props.goTurn(1);
                        }}
                    />
                    <p>{this.props.title}</p>
                    <Icon
                        type="right"
                        className={styles.wrapCenterIcon}
                        onClick={() => {
                            return this.props.goTurn(2);
                        }}
                    />
                </div>

                <div className={styles.wrapRight}>
                    {((talentType === 0 && checkPathname('/foreEnd/business/talentManage/schedule/actor/add'))
                        || (talentType === 1 && checkPathname('/foreEnd/business/talentManage/schedule/blogger/add'))) && (
                        <BIButton type="primary" onClick={this.props.addSchedult}>
                            新增档期
                        </BIButton>
                    )}
                    <BIRadio
                        value={this.props.viewType}
                        onChange={this.props.viewTypeChange}
                        buttonStyle="outline"
                        className={styles.wrapRightRadio}
                    >
                        <BIRadio.Button className={styles.tabBtn} value={2}>
                            周
                        </BIRadio.Button>
                        <BIRadio.Button className={styles.tabBtn} value={1}>
                            月
                        </BIRadio.Button>
                    </BIRadio>
                </div>
            </div>
        );
    }
}
