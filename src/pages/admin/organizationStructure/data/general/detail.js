import React, { Component } from 'react';
import BIRadio from '@/ant_components/BIRadio';
import BICheckbox from '@/ant_components/BICheckbox';
import styles from './detail.less';

class DataTreeDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editStatus: false,
        };
    }

    // 数据类型
    creatDataType = (type) => {
        if (type) {
            const { dataTypeP } = this.props;
            const { editStatus } = this.state;
            const result = [];
            const shareArr = ['公盘数据', '范围盘数据', '私盘数据'];
            for (let i = 1; i <= 3; i += 1) {
                result.push(
                    <BIRadio.Radio
                        value={i}
                        key={i}
                        disabled={i < dataTypeP}
                        style={{ marginRight: '40px', marginBottom: '10px' }}
                    >
                        {shareArr[i - 1]}
                    </BIRadio.Radio>,
                );
            }
            return (
                <div className={styles.detailBox}>
                    <p className={styles.detailTitle}>数据类型</p>
                    <BIRadio
                        disabled={!editStatus}
                        value={type}
                        onChange={(e) => {
                            return this.changeData(e, 'dataType');
                        }}
                    >
                        {result}
                    </BIRadio>
                </div>
            );
        }
        return null;
    };

    // 共享范围
    creatShareScope = (type, dataType) => {
        if (type !== null && dataType === 2) {
            const { shareScopeP } = this.props;
            const { editStatus } = this.state;
            const result = [];
            const scopeArr = [
                '一级共享',
                '二级共享',
                '三级共享',
                '四级共享',
                '五级共享',
                '六级共享',
                '七级共享',
                '八级共享',
                '九级共享',
            ];
            for (let i = 1; i <= scopeArr.length; i += 1) {
                result.push(
                    <BIRadio.Radio
                        value={i}
                        key={i}
                        disabled={i < shareScopeP}
                        style={{ marginRight: '40px', marginBottom: '20px' }}
                    >
                        {scopeArr[i - 1]}
                    </BIRadio.Radio>,
                );
            }
            return (
                <div className={styles.detailBox}>
                    <p className={styles.detailTitle}>共享范围</p>
                    <BIRadio
                        disabled={!editStatus}
                        value={type}
                        onChange={(e) => {
                            return this.changeData(e, 'shareScope');
                        }}
                    >
                        {result}
                    </BIRadio>
                </div>
            );
        }
        return null;
    };

    // 角色人
    creatUserRole = (data) => {
        if (data !== null && Array.isArray(data)) {
            const userRoleP = this.props.userRoleP || [];
            const { editStatus } = this.state;
            const { userRoleEnum } = this.props;
            // const roleArr = [
            //     { label: '经理人', value: '1' },
            //     { label: '宣传人', value: '2' },
            //     { label: '制作人', value: '3' },
            //     { label: '知会人', value: '4' },
            //     { label: '审批人', value: '5' },
            //     { label: '参与人', value: '6' },
            //     { label: '创建人', value: '7' },
            //     { label: '负责人', value: '8' },
            //     { label: 'Boss', value: '9' },
            //     { label: '执行人', value: '10' },
            //     { label: '跟进人', value: '11' },
            //     { label: '合作人', value: '12' },
            // ];

            const defaultValue = [];
            userRoleEnum.map((item) => {
                if (
                    data.some((cItem) => {
                        return String(cItem.dataUserType) === String(item.value);
                    })
                ) {
                    defaultValue.push(item.value);
                }
            });

            return (
                <div className={styles.detailBox}>
                    <p className={styles.detailTitle}>角色人</p>
                    <BICheckbox
                        disabled={!editStatus}
                        value={defaultValue}
                        onChange={(value) => {
                            return this.changeData(value, 'userRole');
                        }}
                    >
                        {userRoleEnum.map((item) => {
                            return (
                                <BICheckbox.Checkbox
                                    value={item.value}
                                    key={item.value}
                                    disabled={!!(userRoleP.length > 0 && userRoleP.indexOf(item.value) < 0)}
                                    style={{ marginRight: '40px', marginBottom: '20px' }}
                                >
                                    {item.label}
                                </BICheckbox.Checkbox>
                            );
                        })}
                    </BICheckbox>
                </div>
            );
        }
        return null;
    };

    // 权限详情
    creatDetail = (dataSource) => {
        const dataType = this.creatDataType(dataSource.moduleDataType);
        const shareScope = this.creatShareScope(dataSource.moduleDataTypeScope, dataSource.moduleDataType);
        const UserRole = this.creatUserRole(dataSource.dataModuleUserList, dataSource.moduleDataType);
        return (
            <>
                {dataType}
                {shareScope}
                {UserRole}
            </>
        );
    };

    // 编辑状态
    editChange = (status) => {
        this.setState({
            editStatus: status,
        });
    };

    // 更新数据
    changeData = (e, type) => {
        if (type === 'userRole') {
            this.props.refreshData(e, type);
        } else {
            this.props.refreshData(e.target.value, type);
        }
    };

    render() {
        const { dataSource } = this.props;
        return <>{this.creatDetail(dataSource)}</>;
    }
}
export default DataTreeDetail;
