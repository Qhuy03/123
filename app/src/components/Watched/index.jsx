import Carousel from "@components/Carousel";
import Product from "@components/Product";
import React from "react";

const WatchedProduct = () => {
  const items = Array.from({ length: 32 }).map(() => <Product />);

  return (
    <div className="flex flex-col bg-white text-black rounded-lg p-4 gap-4">
      <div className="flex items-center justify-between cursor-pointer">
        <div className="text-base font-semibold">Sản phẩm bạn đã xem</div>
      </div>
      <div>
        <Carousel cols={8} rows={1} items={items} autoSlide={false} />
      </div>
    </div>
  );
};

export default WatchedProduct;
