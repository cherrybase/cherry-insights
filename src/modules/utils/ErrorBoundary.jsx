import React, { Component } from "react";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error, info) {
        this.setState({ hasError: true });

        // log the error to an error reporting service
        // logErrorToMyService(error, info);
        // if(process.env.NODE_ENV === 'production') DataService.postToSlack(
        //   `${window.location.href}: ${error.message}`,
        //   info.componentStack
        // );

        console.log(error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="container">
                    <div className="error-msg-container">
                        <h1>Something went wrong.</h1>
                        <br />
                        <br />
                        <a href={`/`} className="button">
                            Go to Dashboard
                        </a>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
