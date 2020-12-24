import React, { Component } from 'react';
// import * as Sentry from "@sentry/browser";

export default function withErrorHandler(errorCallback, FallbackComponent, Component) {
    class WithErrorHandler extends React.Component {
        constructor(props) {
            super(props);
            // Construct the initial state
            this.state = {
                hasError: false,
                error: null,
                errorInfo: null,
            };
        }

        // componentDidCatch(error, info) {
        //     // Update state if error happens
        //     this.setState({hasError: true, error, errorInfo: info})

        //     // Report errors
        //     if (typeof errorCallback === 'function') {
        //         errorCallback(error, info, this.props)
        //     } else {
        //         try{
        //             Sentry.withScope(scope => {
        //                 scope.setExtras(info);
        //                 Sentry.captureException(error);
        //             });
        //         }catch (e) {
        //             console.error('sentry资源有误');
        //         }
        //     }
        // }

        render() {
            // if state contains error we render fallback component
            if (this.state.hasError) {
                const { error, errorInfo } = this.state;
                if (typeof FallbackComponent === 'React') {
                    return (
                        <FallbackComponent {...this.props} error={error} errorInfo={errorInfo} />
                    );
                }
            }

            return <Component {...this.props} />;
        }
    }
    return WithErrorHandler;
}
