import businessFormatCols from './business';
import movieFormatCols from './movie';
import varietyFormatCols from './variety';
import liveFormatCols from './live';

const getFormatCols = (projectingType) => {
    let formatCols = businessFormatCols;
    switch (String(projectingType)) {
        case '1':
            formatCols = businessFormatCols;
            break;
        case '2':
            formatCols = varietyFormatCols;
            break;
        case '3':
            formatCols = movieFormatCols;
            break;
        case '4':
            formatCols = liveFormatCols;
            break;
        default:
            break;
    }
    return formatCols;
};
export default getFormatCols;
