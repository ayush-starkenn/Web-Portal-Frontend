import React from "react";
import { Link, useLocation } from "react-router-dom";
import DashIcon from "components/icons/DashIcon";
import { Tooltip } from "primereact/tooltip";

// chakra imports

export function SidebarLinks(props) {
  // Chakra color mode
  let location = useLocation();

  const { routes } = props;
  const { hover } = props;

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };

  const createLinks = (routes_admin) => {
    return routes_admin.map((route, index) => {
      if (route.layout === "/admin" || route.layout === "/customer") {
        return (
          <Link key={index} to={route.layout + "/" + route.path}>
            <div className={`relative mb-5 flex items-center text-left `}>
              <li
                className={`tooltip-button-${index} my-auto  flex items-center px-6 py-[5px]`}
                key={index}
              >
                <span
                  className={`hover:text-gray-700 ${
                    activeRoute(route.path) === true
                      ? "font-bold text-activeLink dark:text-white"
                      : "font-2xl text-gray-600"
                  }`}
                  style={{ verticalAlign: "middle" }}
                >
                  {route.icon ? route.icon : <DashIcon />}
                </span>
                {hover && (
                  <h1
                    className={`ml-2  ${
                      activeRoute(route.path) === true
                        ? "font-bold text-activeLink dark:text-white"
                        : "font-2xl text-gray-600"
                    }`}
                    style={{ verticalAlign: "middle" }}
                  >
                    {route.title}
                  </h1>
                )}
                {!hover && (
                  <Tooltip
                    target={`.tooltip-button-${index}`}
                    className="custom-tooltip"
                    mouseTrackLeft={12}
                  >
                    {route.title}
                  </Tooltip>
                )}
              </li>
              {activeRoute(route.path) ? (
                <div className="absolute right-0 top-[5px] h-7 w-1 rounded-lg bg-brand-500 dark:bg-brand-400" />
              ) : null}
            </div>
          </Link>
        );
      }
      return null;
    });
  };

  return createLinks(routes);
}

export default SidebarLinks;
