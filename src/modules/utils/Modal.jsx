import React from "react";

class Modal extends React.Component {
    constructor() {
        super();
        this.state = {
            mount: false,
            data: {}
        };
    }

    componentDidMount() {
        this.props.onRef && this.props.onRef(this);
        this.dialog.focus();
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevState.mount && this.state.mount) {
            this.dialog.focus();
        }
    }

    componentWillUnmount = () => {
        this.props.onRef && this.props.onRef(null);
    };

    show = ({ data, awaitModal } = {}) => {
        return new Promise((resolve, reject) => {
            this.setState({ data, mount: true });
            if (!awaitModal) return resolve();
            this.resolveModalPromise = resolve;
            this.rejectModalPromise = reject;
        });
    };

    asyncShow = ({ data } = {}) => this.show({ data, awaitModal: true });

    syncShow = ({ data } = {}) => this.show({ data, awaitModal: false });

    hide = async ({ data, reject } = {}) => {
        await this.setState({ data: {}, mount: false }, () => {
            if (reject) {
                this.rejectModalPromise && this.rejectModalPromise({ data });
            } else {
                this.resolveModalPromise && this.resolveModalPromise({ data });
            }
        });
    };

    onKeyDownModal = e => {
        if (e.which === 27) this.setState({ mount: false });
    };

    render() {
        let { mount, data } = this.state;
        let { containerStyles, containerClass, hideClose } = this.props;
        const childrenWithProps = React.Children.map(this.props.children, child =>
            React.cloneElement(child, { data, close: this.hide })
        );
        return (
            <div
                className="dialog"
                ref={ref => (this.dialog = ref)}
                style={{ ...(mount ? {} : { display: "none" }), outline: "none" }}
                tabIndex="0"
                onKeyDown={this.onKeyDownModal}
                autoFocus="autoFocus"
            >
                <div className={`dialog-container ${containerClass}`} style={{ ...containerStyles }}>
                    <div className="dialog-content pos-rel">
                        {mount ? childrenWithProps : ""}
                        <div
                            style={!hideClose ? { display: "block" } : { display: "none" }}
                            className="close-btn"
                            onClick={() => this.hide({ reject: true })}
                        >
                            <i className="fa fa-close" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Modal;
