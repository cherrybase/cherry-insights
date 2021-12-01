import React, { lazy, Suspense } from "react";
import { Redirect, Route, withRouter, Switch } from "react-router-dom";

const Auth = lazy(() => import(/* webpackChunkName: "auth" */ "@layouts/Auth"));
const Admin = lazy(() => import(/* webpackChunkName: "admin" */ "@layouts/Admin"));
const ArgonUi = lazy(() => import(/* webpackChunkName: "argon-ui" */ "@argon-ui"));

const Routes = () => {
    return (
        <Suspense fallback={<span>Loading Route...</span>}>
            <Switch>
                <Route path={`/auth`} component={Auth} />
                <Route path={`/admin`} component={Admin} />
                <Route path={`/argon-ui`} component={ArgonUi} />
                <Route path={`/`} render={() => <Redirect to={`/admin`} />} />
            </Switch>
        </Suspense>
    );
};

export default withRouter(Routes);
