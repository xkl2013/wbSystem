import React from 'react';
import CommonDetail from './components/commonDetail';
import PropagateDetail from './components/PropagateDetail';
import OutworkDetail from './components/outworkDetail';
import KanliDetail from './components/kanli';
import PurchaseDetail from './components/purchaseDetail';

function commonDetail(props, ref) {
    const { flowKey } = props;
    switch (flowKey) {
        case 'propagate':
            return <PropagateDetail {...props} ref={ref} />;
        case 'outwork':
            return <OutworkDetail {...props} ref={ref} />;
        case 'quotation':
            return <KanliDetail {...props} ref={ref} />;
        case 'flow_key_chou_jiang':
            return <PurchaseDetail {...props} ref={ref} />;
        default:
            return <CommonDetail {...props} ref={ref} />;
    }
}
export default React.forwardRef(commonDetail);
