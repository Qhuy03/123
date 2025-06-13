import React, { useMemo } from "react";
import Header from "@layout/Header";
import Sidebar from "./Sidebar";
import Carousel from "@components/Carousel";
import Breadcrumbs from "@components/Breadcrums";
import { useParams } from "react-router-dom";
import Subsidebar from "./Subsidebar";
import useCategories from "@hooks/useCategories";
const App = (props) => {
  const { id, category } = useParams();
  const { categories } = useCategories(id);
  const items = useMemo(() => {
    if (!categories) return [];

    return categories.length === 0 ? false : categories;
  }, [categories]);

  console.log(items);
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
                {
                  path: "#",
                  title: category,
                },
              ]}
            />
          )}
          <div className="flex justify-between">
            {!props.is_breadcrumb ? <Sidebar /> : items && <Subsidebar />}
            <div
              className={
                "overflow-x-hidden flex flex-col gap-3 " +
                (items !== false ? "w-[calc(100%-254px)]" : "w-[calc(100%)]")
              }
            >
              <div>
                <Carousel />
              </div>
              {props.children}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default App;
