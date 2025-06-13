import { ConfigProvider, Rate } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const Product = ({
  image = "https://salt.tikicdn.com/cache/280x280/ts/product/60/d0/03/fc7a179de014d73a30a53bc442f4bcb2.jpg.webp",
  name = "Kem gel dưỡng ẩm và làm dịu dạng gel cho da rất khô đến viêm da cơ địa Atoderm Intensive gel-crème 500ml",
  rate = 5,
  price = 300000,
  id,
}) => {
  return (
    <div className="bg-white rounded-lg flex w-full">
      <div className="w-full">
        <div className="w-full h-full">
          <Link
            to={`/product/${encodeURIComponent(name)}-p${id}`}
            className="flex relative cursor-pointer w-full rounded-lg overflow-hidden"
          >
            <span className="flex flex-col overflow-hidden relative rounded-lg w-full">
              <div className="relative">
                <div className="thumbnail text-center relative w-full pt-[100%]">
                  <div className="image-wrapper absolute top-0 left-0 w-full h-full">
                    <img
                      src={image}
                      alt="logo"
                      className="block w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between p-2 gap-1">
                <div className="flex flex-col gap-1 h-28">
                  <h3 className="line-clamp-2 text-xs m-0 break-words">
                    {name}
                  </h3>
                  <div>
                    <ConfigProvider
                      theme={{
                        token: {
                          marginXS: "3px",
                        },
                        components: {
                          Rate: {
                            starSize: 12,
                            starHoverScale: "scale(1.0)",
                            starColor: "#ffc400",
                          },
                        },
                      }}
                    >
                      <Rate allowHalf defaultValue={rate} />
                    </ConfigProvider>
                  </div>
                  <span className="font-semibold text-md text-red">
                    {price}
                    <sup>d</sup>
                  </span>
                </div>
              </div>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Product;
