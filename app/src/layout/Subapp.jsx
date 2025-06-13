import Breadcrumbs from "@components/Breadcrums";
import React from "react";
import Header from "./Header";
import Carousel from "@components/Carousel";

const Subapp = (props) => {
  return (
    <>
      <Header />
      <main>
        <div className="max-w-[1440px] mx-auto pt-4 px-6">
          {props.is_breadcrumb && (
            <Breadcrumbs
              items={[
                {
                  path: "/",
                  title: "Trang chủ",
                },
              ]}
            />
          )}
          {props.children}
        </div>
      </main>
    </>
  );
};

export default Subapp;
