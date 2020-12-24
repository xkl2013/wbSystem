/* eslint-disable */
const CDN_PATH = process.env.CDN_PATH || '';
export const fileConfig = {
    'image': {},
    'ppt': {
        thumbUrl: `${CDN_PATH}/pptIcon.png`
    },
    'pptx': {
        thumbUrl: `${CDN_PATH}/pptIcon.png`
    },
    'zip': {
        thumbUrl: `${CDN_PATH}/zipIcon.png`
    },
    'xlsx': {
        thumbUrl: `${CDN_PATH}/xlsIcon.png`
    },
    'xls': {
        thumbUrl: `${CDN_PATH}/xlsIcon.png`
    },
    'doc': {
        thumbUrl: `${CDN_PATH}/docIcon.png`
    },
    'docx': {
        thumbUrl: `${CDN_PATH}/docIcon.png`
    },
    'pdf': {
        thumbUrl: `${CDN_PATH}/pdfIcon.png`
    },
    'other': {
        thumbUrl: `${CDN_PATH}/otherIcon.png`
    }
}
