import useCategories from "@hooks/useCategories";
import { Image } from "antd";
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
const Sidebar = () => {
  const { categories } = useCategories();

  const items = useMemo(() => {
    if (!categories) return [];

    return categories;
  }, [categories]);
  return (
    <div className="w-[230px] max-h-screen sticky overflow-y-scroll top-4 bg-transparent flex pb-[117px] flex-col text-black scrollbar-w text-sm rounded-tl-md rounded-bl-md">
      <div className="relative flex mb-4 py-3 px-2 flex-col bg-white rounded-lg">
        <div className="mb-2 pl-4 font-bold text-sm">Danh mục</div>
        {items.map((item, index) => {
          return (
            <Link
              to={item.category_path}
              key={index}
              className="hover:bg-[#27272a1f] flex px-4 py-2 items-center rounded-lg cursor-pointer transition duration-300"
            >
              <div className="w-[32px] h-[32px] mr-2">
                <Image src={item.category_thumb} preview={false} />
              </div>
              <span>{item.category_name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
