// import storage from '@/utils/storage';
// import * as Sentry from "@sentry/browser";

// try {
//     Sentry.init({
//         dsn: "https://e12da45f6b804c4bbdfda72c6f8b4b82:fb9299cf31c3441dbdb0b3e2351ccc86@sentry.io/1550816",
//         debug: true
//     });
//     Sentry.configureScope((scope) => {
//         let userInfo = storage.getUserInfo();
//         scope.setUser({
//             userId: userInfo && userInfo.userId,
//             userName: userInfo && userInfo.userName,
//         });
//     });
// }catch (e) {
//     console.error('sentry资源有误');
// }
export const dva = {
    config: {
        onError(err: ErrorEvent) {
            err.preventDefault();
            console.error(err.message);
        },
    },
};
