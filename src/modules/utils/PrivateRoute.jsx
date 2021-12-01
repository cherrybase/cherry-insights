import React from "react";
import { Route } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ component: Component, ...rest }) => {

    const isLoggedIn = true; // useSelector(state => !!state.auth.user);

    return (
        <Route
            {...rest}
            render={props =>
                isLoggedIn ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={{ pathname: '/auth/login', state: { from: props.location } }} />
                )
            }
        />
    )
}

export default PrivateRoute;
