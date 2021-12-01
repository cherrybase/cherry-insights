import React from "react";
import { useLocation, Route, Switch, Redirect } from "react-router-dom";
import { Container } from "reactstrap";
import AdminSidebar from "@modules/Sidebar/AdminSidebar";
import AdminNavbar from "@modules/Navbar/AdminNavbar";
import AdminFooter from "@modules/Footer/AdminFooter";
import routes, { routesMap } from "@layouts/Admin/routes";

const Admin = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={props.match.path + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  const getBrandText = () => { // getModuleName
    for (let i = 0; i < routes.length; i++) {
      if (
        props.location.pathname.indexOf(routes[i].layout + routes[i].path) !==
        -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  return (
    <>
      <AdminSidebar
        {...props}
        routes={routes}
        logo={{
          innerLink: `${props.match.path}${routesMap.dashboard.path}`,
          imgSrc: require("@styles/amx-logo-kwt.png"),
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContent}>
        <AdminNavbar
          {...props}
          brandText={getBrandText()}
        />
        <Switch>
          {getRoutes(routes)}
          <Redirect from="/" to={`${props.match.path}${routesMap.dashboard.path}`} />
        </Switch>
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
};

export default Admin;
