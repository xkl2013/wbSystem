import React from 'react';
import ReactDOM from 'react-dom';
import styles from './index.less';
import {getCommonTag} from '@/services/news'
import List from './list'
import Add from './add';
import {Icon} from 'antd';

class Tag extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: 1, // 1-列表 2-新增 3-编辑
            tagList: [],
            editObj: {},
            chooseData: props.tagList || [],
        }
    }

    componentDidMount() {
        this.getTagList();
    }

    getTagList = async (bol) => {
        const response = await getCommonTag({pageNum: 1, pageSize: 100});
        if (response && response.success) {
            const data = response.data || {};
            const tagList = Array.isArray(data.list) ? data.list : [];
            bol && this.onUpdata(tagList);
            this.setState({tagList});
        }
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.tagList) !== JSON.stringify(this.props.tagList)) {
            this.setState({chooseData: nextProps.tagList});
        }
    }

    selTab = (type, editObj = {}) => { // tab切换
        this.setState({
            tab: type,
            editObj,
        })
    }


    goBack = () => {
        this.setState({
            tab: 1
        })
    }
    onUpdata = (tagList) => {
        const {chooseData} = this.state;
        if (!chooseData || chooseData.length === 0) return;
        const newData = chooseData.map(item => {
            const obj = tagList.find(ls => ls.tagId === item.tagId) || {};
            return {
                ...item,
                ...obj
            }
        })
        if (this.props.onChoose) {
            this.props.onChoose(newData)
        }
    }

    render() {
        let {tab, tagList} = this.state;
        let {onChange, value} = this.props;
        return (
            <div className={styles.tagCotainer} ref={node => this.divElement = node}>
                {tab == 1 && (
                    <List data={tagList} changeTab={this.selTab} onChoose={onChange}
                          chooseData={value}/>
                )}
                {tab == 2 && (
                    <>
                        <Add onRefresh={this.getTagList} goBack={this.goBack} editObj={this.state.editObj}
                             ref={node => this.add = node}/>
                    </>
                )}
            </div>
        );
    }
}

export default Tag;
