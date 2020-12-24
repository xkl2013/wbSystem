import { renderProjectObligation } from './projectObligation';
import { renderProjectExecute } from './projectExecute';

export const renderObligation = (obj, { from }) => {
    let obligation = renderProjectExecute(obj, { from });
    if (Number(obj.formData.trailPlatformOrder) === 1) {
        obligation = renderProjectObligation(obj, { from });
    }
    return obligation;
};
export default renderObligation;
