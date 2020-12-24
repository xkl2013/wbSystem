import styles from './styles.less';
import ybh from '@/assets/approval/ybh@2x.png';
import dsp from '@/assets/approval/dsp@2x.png';
import ycx from '@/assets/approval/ycx@2x.png';
import yty from '@/assets/approval/yty@2x.png';
import yht from '@/assets/approval/yht@2x.png';

function getIcon(status) {
    switch (status) {
        case -1:
            return ycx;
        case 0:
            return ybh;
        case 2:
            return yty;
        case 1:
        case 3:
        case 5:
        case 7:
            return dsp;
        case 8:
            return yht;
        default:
            return '';
    }
}

export default function (status) {
    // 审批状态角标
    const icon = getIcon(Number(status));
    if (icon) {
        // eslint-disable-next-line react/react-in-jsx-scope
        return <img src={icon} alt="" className={styles.imgState} />;
    }
    return null;
}
