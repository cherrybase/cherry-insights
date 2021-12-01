import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import "@argon-ui/assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@argon-ui/assets/scss/argon-dashboard-react.scss";

import AdminLayout from "@argon-ui/layouts/Admin";
import AuthLayout from "@argon-ui/layouts/Auth.js";

export default function ({ match, ...rest }) {
  return (
    <Switch>
      <Route path={`${match.path}/admin`} render={(props) => <AdminLayout {...props} />} />
      <Route path={`${match.path}/auth`} render={(props) => <AuthLayout {...props} />} />

      <Redirect from={`/`} to={`${match.path}/admin`} />
    </Switch>
  );
}
