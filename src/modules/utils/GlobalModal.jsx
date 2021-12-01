import React, { Component } from "react";
import Modal from "./Modal";
import EventService from "../../services/EventService";

class GlobalModal extends Component {
    state = {
        data: {},
        hideClose: false,
        component: null,
        events: {}
    };

    componentDidMount() {
        this.eventShow = EventService.subscribe("globalModal.show", async ({ data, hideClose, component, events }) => {
            this.setState({ data, hideClose, component, events }, () => {
                try {
                    this.globalModal.show({ data });
                } catch (error) {
                    console.error("could not hide global modal!!");
                }
            });
        });

        this.eventHide = EventService.subscribe("globalModal.hide", ({ data, reject }) => {
            try {
                this.globalModal.hide({ data, reject });
            } catch (error) {
                console.error("could not hide global modal!!");
            } finally {
                this.setState({ data: {}, hideClose: false, component: null, events: {} });
            }
        });
    }

    componentWillUnmount() {
        this.eventShow.remove();
        this.eventHide.remove();
    }

    render() {
        let { component: ModalComponent, events } = this.state;
        return (
            <Modal onRef={ref => (this.globalModal = ref)} hideClose={this.state.hideClose}>
                {ModalComponent ? <ModalComponent {...events} /> : ""}
            </Modal>
        );
    }
}

export default GlobalModal;
