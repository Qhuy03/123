import Carousel from "@components/Carousel";
import Product from "@components/Product";
import React from "react";

const SimilarProduct = () => {
  const items = Array.from({ length: 32 }).map(() => <Product />);
  return (
    <div className="flex flex-col bg-white text-black rounded-lg p-4 gap-4">
      <div className="flex items-center justify-between cursor-pointer">
        <div className="text-base font-semibold">Sản phẩm tương tự </div>
      </div>
      <div className="pt-3">
        <div className="w-full relative">
          <Carousel cols={4} rows={2} items={items} />
        </div>
      </div>
    </div>
  );
};

export default SimilarProduct;
