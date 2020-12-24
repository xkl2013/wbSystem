import renderContentProjectingName from './content2trailName';
import renderCustomerProjectingName from './follow2trailName';

const renderTrailName = (obj, { from }) => {
    let trailName = renderCustomerProjectingName(obj, { from });
    if (Number(obj.formData.projectingTrailType) === 2) {
        trailName = renderContentProjectingName(obj, { from });
    }
    return trailName;
};
export default renderTrailName;
