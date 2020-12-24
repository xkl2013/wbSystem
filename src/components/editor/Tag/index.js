import React from 'react';
import ReactDOM from 'react-dom';
import lodash from 'lodash';
import styles from './index.less';
import { getCommonTag } from '@/services/news';
import List from './list';
import Add from './add';

class Tag extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: 1, // 1-列表 2-新增 3-编辑
            tagList: [],
            editObj: {},
            chooseData: props.tagList || [],
            searchVal: props.searchVal || '',
        };
        this.onSearchVal = lodash.debounce(this.getTagList, 400);
    }

    componentDidMount() {
        this.getTagList();
        document.addEventListener('click', this.onCLickDocument);
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.tagList) !== JSON.stringify(this.props.tagList)) {
            this.setState({ chooseData: nextProps.tagList });
        }
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.onCLickDocument);
    }

    onCLickDocument = (e) => {
        const { onChanl } = this.props;
        const target = e.target;
        // eslint-disable-next-line react/no-find-dom-node
        const addBox = ReactDOM.findDOMNode(this.add) || {};
        console.log(this.divElement.contains(target), 234);
        // 组件已挂载且事件触发对象不在div内
        if (this.divElement && !this.divElement.contains(target)) {
            if (addBox.className === styles.tagAdd) return;
            if (onChanl) {
                onChanl();
            }
        }
    };

    selTab = (type, editObj = {}) => {
        // tab切换
        this.setState({
            tab: type,
            editObj,
        });
    };

    getTagList = async (bol) => {
        const { getTagList } = this.props;
        const { searchVal } = this.state;
        if (getTagList) {
            const response = await getTagList({ pageNum: 1, pageSize: 100, tagName: searchVal });
            if (response && response.success) {
                const tagList = Array.isArray(response.data) ? response.data : [];
                if (bol) this.onUpdata(tagList);
                this.setState({ tagList });
            }
        } else {
            const response = await getCommonTag({ pageNum: 1, pageSize: 100 });
            if (response && response.success) {
                const data = response.data || {};
                const tagList = Array.isArray(data.list) ? data.list : [];
                if (bol) this.onUpdata(tagList);
                this.setState({ tagList });
            }
        }
    };

    goBack = () => {
        this.setState({
            tab: 1,
        });
    };

    onUpdata = (tagList) => {
        const { chooseData } = this.state;
        if (!chooseData || chooseData.length === 0) return;
        const newData = chooseData.map((item) => {
            const obj = tagList.find((ls) => {
                return ls.tagId === item.tagId;
            }) || {};
            return {
                ...item,
                ...obj,
            };
        });
        if (this.props.onChoose) {
            this.props.onChoose(newData);
        }
    };

    onSearch = (searchVal) => {
        this.setState({ searchVal }, () => {
            if (this.props.onSearch) {
                this.props.onSearch(searchVal);
            }
            this.onSearchVal();
        });
    };

    onChanl = () => {
        if (this.props.onChanl) {
            this.props.onChanl();
        }
    };

    render() {
        const { tab, tagList } = this.state;
        return (
            <div
                className={styles.tagCotainer}
                ref={(node) => {
                    this.divElement = node;
                }}
            >
                {tab === 1 && (
                    <List
                        {...this.props}
                        ref={(node) => {
                            this.list = node;
                        }}
                        searchVal={this.state.searchVal}
                        data={tagList}
                        changeTab={this.selTab}
                        onChoose={this.props.onChoose}
                        chooseData={this.state.chooseData}
                        onSearch={this.onSearch}
                    />
                )}
                {tab === 2 && (
                    <>
                        {/* <Icon type="close" className={styles.closeIcon} onClick={this.onChanl} /> */}
                        <Add
                            {...this.props}
                            onRefresh={this.getTagList}
                            goBack={this.goBack}
                            onChanl={this.onChanl}
                            editObj={this.state.editObj}
                            ref={(node) => {
                                this.add = node;
                            }}
                        />
                    </>
                )}
            </div>
        );
    }
}

export default Tag;
