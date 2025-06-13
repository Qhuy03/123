import Product from "@components/Product";
import useProducts from "@hooks/useProducts";
import { commaFormatter } from "@utils/helpers";
import { Button } from "antd";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";

const Categories = () => {
  const { id, category } = useParams();
  const { products } = useProducts(id);
  const items = useMemo(() => {
    if (!products) return [];
    return products;
  }, [products]);
  return (
    <>
      <div className="bg-white rounded-lg">
        <h2 className="text-lg py-3 px-4 rounded-tl-lg rounded-tr-lg capitalize">
          {category.replace(/-/g, " ")}
        </h2>
      </div>
      <div className="flex flex-col items-center pb-3 gap-4 rounded-bl-lg rounded-br-lg">
        <div className="content grid self-stretch gap-2 grid-cols-4">
          {items.map((item, _) => (
            <Product
              id={item.product_id}
              image={item.product_thumb[0]}
              name={item.product_name}
              price={commaFormatter(item.product_price)}
              rate={item.product_ratingsAverage}
              key={_}
            />
          ))}
        </div>
        <Button size="middle" type="dashed" className="text-primary">
          Xem thêm
        </Button>
      </div>
    </>
  );
};

export default Categories;
