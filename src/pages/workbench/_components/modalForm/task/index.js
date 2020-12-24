/*
 * getData: function,请求成功后回掉
 * editAuthority: string,编辑按钮权限
 * authority: string，删除/归档按钮权限
 */
import React from 'react';
import ModalAdd from './add';
// import ModalEdit from './edit';
import ModalDetail from '../baseForm';

export default class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    showInstanceModal(params) {
        this.setState({ ...params }, () => {
            if (this.modalDetail && this.modalDetail.showInstanceModal) {
                this.modalDetail.showInstanceModal(params);
            }
        });
    }

    renderCom = () => {
        const { isEdit } = this.state;
        const { getData, editAuthority, authority } = this.props;
        if (isEdit) {
            return (
                // <ModalEdit
                //     ref={(dom) => {
                //         this.modalDetail = dom;
                //     }}
                //     getData={getData}
                //     authority={authority}
                // />
                <ModalDetail
                    ref={(dom) => {
                        this.modalDetail = dom;
                    }}
                    getData={getData}
                    editAuthority={editAuthority}
                    authority={authority}
                />
            );
        }
        if (!isEdit && isEdit === 0) {
            return (
                <ModalAdd
                    ref={(dom) => {
                        this.modalDetail = dom;
                    }}
                    getData={getData}
                />
            );
        }
    };

    render() {
        return <>{this.renderCom()}</>;
    }
}
