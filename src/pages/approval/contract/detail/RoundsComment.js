import React from 'react';
import styles from './RoundsComment.less';
import IconFont from '@/components/CustomIcon/IconFont';
import SlefProgress from '@/components/Progress';
import BIButton from '@/ant_components/BIButton';

// 轮次业务组件
class RoundsComment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            commentStatus: true,
            commentText: '展开评论',
        };
    }

    componentDidMount() {
        const { commentShowStatus } = this.props;
        this.setState({
            commentStatus: commentShowStatus,
            commentText: commentShowStatus ? '收起评论' : '展开评论',
        });
    }

    btnRoundsCommentFn() {
        const { commentStatus } = this.state;
        this.setState({
            commentStatus: !commentStatus,
            commentText: !commentStatus ? '收起评论' : '展开评论',
        });
    }

    render() {
        const { commentStatus, commentText } = this.state;
        const { id } = this.props;
        return (
            <>
                <div className={styles.roundsComment}>
                    <div className={`${styles.roundsCommentBox} ${commentStatus ? styles.show : styles.hide}`}>
                        <SlefProgress type="single" id={Number(id)} interfaceName="11" />
                    </div>
                    <BIButton
                        type="link"
                        className={`${styles.btnRoundsComment}`}
                        onClick={this.btnRoundsCommentFn.bind(this)}
                    >
                        {commentText}
                        <IconFont type="iconzhankai" className={`${commentStatus ? styles.hide : styles.show}`} />
                    </BIButton>
                </div>
            </>
        );
    }
}
export default RoundsComment;
