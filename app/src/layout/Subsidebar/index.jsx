import useCategories from "@hooks/useCategories";
import { Collapse, ConfigProvider } from "antd";
import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";

const Subsidebar = () => {
  const { id } = useParams();
  const { categories } = useCategories(id);
  const items = useMemo(() => {
    if (!categories) return [];

    return categories.map((category, index) => {
      return {
        key: index,
        label: (
          <Link
            to={"/" + category.category_path}
            className="hover:underline font-medium text-sm"
          >
            {category.category_name}
          </Link>
        ),
        children: category.category_children?.map((chil) => (
          <div key={chil.category_name}>
            <Link className="pl-4 text-xs" to={"/" + chil.category_path}>
              {chil.category_name}
            </Link>
          </div>
        )),
      };
    });
  }, [categories]);
  return (
    <div className="w-[230px] max-h-screen sticky overflow-y-scroll top-4 bg-transparent flex pb-[117px] flex-col text-black scrollbar-w text-sm rounded-tl-md rounded-bl-md">
      <div className="relative flex mb-4 py-3 px-2 flex-col bg-white rounded-lg">
        <div className="mb-2 pl-4 font-bold text-sm border-b pb-2">
          Khám phá theo danh mục{" "}
        </div>
        <ConfigProvider
          theme={{
            components: {
              Collapse: {
                headerBg: "transparent",
              },
            },
          }}
        >
          <Collapse
            collapsible="icon"
            bordered={false}
            expandIconPosition="end"
            defaultActiveKey={["0"]}
            items={items}
          />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default Subsidebar;
