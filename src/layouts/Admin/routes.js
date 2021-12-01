import { lazy } from "react";

const Dashboard = lazy(() => import(/* webpackChunkName: "dashboard" */ "@modules/Dashboard"));
const Profile = lazy(() => import(/* webpackChunkName: "profile" */ "@modules/Profile"));

const routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: Profile,
    layout: "/admin",
    sidebar: false
  }
];

export const routesMap = {};
routes.forEach(route => {
  routesMap[route.name.toLowerCase()] = { ...route };
});

export default routes;
