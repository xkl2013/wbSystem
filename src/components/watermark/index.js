import React from 'react';
/* eslint-disable import/no-extraneous-dependencies */
import withRouter from 'umi/withRouter';
import watermark from 'watermark-dom';
import storage from '../../utils/storage';

/*
 * 将节点挂载到body,并设置mask_w_h节点的样式(全局)
 */

export const Watermark = (Com) => {
    const ForWardedComponent = React.forwardRef((props, ref) => {
        return (
            <div ref={ref}>
                <Com {...props} />
            </div>
        );
    });

    class Wrap extends React.Component {
        componentDidMount() {
            setTimeout(() => {
                this.initWatermark();
            }, 600);
            document.addEventListener('resize', this.initWatermark);
        }

        componentWillUnmount() {
            const { informationModel } = this.props;
            if (informationModel) return;
            watermark.remove();
            document.removeEventListener('resize', this.initWatermark);
        }

        initWatermark = () => {
            // 在信息贯穿模式下会传informationModel,当判断是这个字段时不予处理水印
            const { informationModel } = this.props;
            if (informationModel) return;
            const userInfo = storage.getUserInfo() || {};
            const userRealName = userInfo.userRealName || '';
            watermark.load({
                watermark_x: 20,
                watermark_y: 20,
                watermark_txt: userRealName,
                watermark_color: '#8C97A3FF',
                watermark_alpha: 0.1,
                watermark_fontsize: '18px',
                watermark_angle: 15,
                watermark_width: 150, // 水印宽度
                watermark_height: 150,
            });
        };

        render() {
            return <ForWardedComponent {...this.props} />;
        }
    }
    return withRouter(Wrap);
};
export default Watermark;
