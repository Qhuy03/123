import Product from "@components/Product";
import useProducts from "@hooks/useProducts";
import { Button } from "antd";
import React, { useMemo } from "react";

const Home = () => {
  const { products } = useProducts();
  const items = useMemo(() => {
    if (!products) return [];
    return products;
  }, [products]);
  return (
    <>
      <div className="bg-white rounded-lg">
        <h2 className="text-lg py-3 px-4 rounded-tl-lg rounded-tr-lg">
          Gợi ý hôm nay
        </h2>
      </div>
      <div className="flex flex-col items-center pb-3 rounded-bl-lg rounded-br-lg">
        <div className="content grid self-stretch gap-2 grid-cols-5">
          {items.map((item, index) => {
            return (
              <Product
                key={index}
                id={item.product_id}
                image={item.product_thumb[0]}
                name={item.product_name}
                price={item.product_price}
                rate={item.product_ratingsAverage}
              />
            );
          })}
        </div>
        <Button size="middle" type="dashed" className="text-primary mt-4">
          Xem thêm
        </Button>
      </div>
    </>
  );
};

export default Home;
