import host from '@/config/host';

export function socketInstancePath() {
    return process.env.ENV === 'development' ? '/ws/webServer' : `${host[process.env.BUILD_ENV]}/cms/webServer`;
}
export default {
    socketInstancePath,
};
