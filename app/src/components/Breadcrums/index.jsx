import { Breadcrumb, ConfigProvider } from "antd";
import React from "react";
import { Link } from "react-router-dom";
function itemRender(currentRoute, params, items, paths) {
  const isLast = currentRoute?.path === items[items.length - 1]?.path;

  return isLast ? (
    <span className="capitalize font-normal">{currentRoute.title}</span>
  ) : (
    <Link
      to={`/${paths.join("/")}`}
      className="capitalize text-accent font-normal"
    >
      {currentRoute.title}
    </Link>
  );
}
const Breadcrumbs = (props) => {
  return (
    <div className="py-4 text-sm">
      <ConfigProvider
        theme={{
          token: {
            colorBgTextHover: "transparent",
          },
        }}
      >
        <Breadcrumb separator=">" itemRender={itemRender} items={props.items} />
      </ConfigProvider>
    </div>
  );
};

export default Breadcrumbs;
