import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

/* Argon-ui theme css */
import "@argon-ui/assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@argon-ui/assets/scss/argon-dashboard-react.scss";

/* App css */
import "./styles/index.scss";

import { store } from "./store";
import Routes from "./routes";
import { ErrorBoundary, GlobalModal, ToastUtil } from "./modules/utils";

__webpack_public_path__ = `${window.CONST?.remoteJsUrl || "https://localhost:3000"}/dist/`;

const Root = () => (
    <Provider store={store}>
        <BrowserRouter>
            <ErrorBoundary>
                <div className="app">
                    <Routes />
                    <GlobalModal />
                    <ToastUtil />
                </div>
            </ErrorBoundary>
        </BrowserRouter>
    </Provider>
);

render(<Root />, document.getElementById("app"));
