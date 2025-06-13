import { GatewayInstanceWithToken } from "../api/config";
import ButtonQuantity from "@components/ButtonQuantity";
import Carousel from "@components/Carousel";
import Description from "@components/Description";
import Detail from "@components/Detail";
import ReviewNotFound from "@components/notfound/Review";
import Policy from "@components/policy";
import SimilarProduct from "@components/SimalarProduct";
import WatchedProduct from "@components/Watched";
import { useAuth } from "@contexts/AuthContext";
import useProducts from "@hooks/useProducts";
import {
  commaFormatter,
  compareArraysByOrder,
  generateCombinations,
} from "@utils/helpers";
import { Button, ConfigProvider, Image, Rate } from "antd";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const { getProductDetail } = useProducts(null, {
    revalidateOnFocus: false,
    revalidateOnMount: false,
  });
  const { slug } = useParams();
  const productId = slug.split("-p").pop();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    let isMounted = true; // Biến để kiểm tra nếu component đã unmount

    const fetchProduct = async () => {
      try {
        const productDetail = await getProductDetail(productId);
        if (!productDetail[0]) navigate("/error");
        if (isMounted) {
          setProduct(productDetail[0]);
        }
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [navigate, productId]);

  const [indexImage, setIndexImage] = useState(0);
  const [indexVariant, setIndexVariant] = useState([0]);
  const images = useMemo(() => {
    if (!product) return [];
    return product.product_thumb;
  }, [product]);

  useEffect(() => {
    if (product?.product_variations) {
      {
        setIndexVariant(new Array(product.product_variations.length).fill(0));
        return product.sku_list;
      }
    }
  }, [product]);

  const { watch, register, setValue } = useForm({});

  const watchQuantity = watch("quantity", 1);

  const { isAuthenticated } = useAuth();

  const handleOptionClick = (position, optionIndex) => {
    const updatedOptions = [...indexVariant];
    updatedOptions[position] = optionIndex;
    setIndexVariant(updatedOptions);
  };

  const variantSelected = useMemo(() => {
    if (!product) return [];
    if (product?.product_variations?.length > 0) {
      const item = product.sku_list.find((sku) =>
        compareArraysByOrder(indexVariant, sku.sku_tier_idx)
      );
      return { ...item, product_price: item?.sku_price };
    } else {
      return product;
    }
  }, [product, handleOptionClick]);
  console.log(product)
  const handleAddToCart = async () => {
    if (!isAuthenticated) return navigate("/login");
    const data = {
      product_id: product.product_id,
      quantity: parseInt(watchQuantity),
      product_shop: "1000",
      sku_id: variantSelected?.sku_id,
    };
    try {
      const res = await GatewayInstanceWithToken.post("/carts", data);
      console.log(res);
      toast.success("Đã thêm vào giỏ hàngThêm vào giỏ hàng thành công!");
    } catch (error) {
      toast.error(error?.message);
    }
  };

  return (
    <div className="max-w-[1440px] m-auto">
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-[1fr,360px] gap-6">
          {/* left */}
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-[400px,1fr] gap-6 rounded-lg items-start">
              {/* sub left */}
              <div className="flex flex-col w-[400px] bg-white sticky top-3 gap-4 pt-4 pb-3 rounded-lg">
                {/* image */}
                <div className="flex flex-col gap-2 px-4">
                  <div className="rounded-lg overflow-hidden relative border border-border">
                    <Image
                      preview={false}
                      src={images[indexImage]}
                      width={368}
                      height={368}
                    />
                  </div>
                  <div className="h-[54px] flex">
                    <div className="w-full relative">
                      <span className="left hidden absolute"></span>
                      <div className="content overflow-hidden">
                        <div className="slider gap-2 inline-flex min-w-full ease-in-out duration-500">
                          {images.map((image, _) => (
                            <span
                              key={_}
                              className="cursor-pointer relative inline-block w-[54px] h-[54px] p-1 rounded-sm overflow-hidden border"
                              onClick={() => setIndexImage(_)}
                            >
                              <Image preview={false} src={image} />
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="right hidden absolute"></span>
                    </div>
                  </div>
                </div>
                {/* end image */}
                {/* special */}
                <div className="flex flex-col gap-2 px-4">
                  <span className="font-semibold text-base">
                    Đặc điểm nổi bật
                  </span>
                  <div className="flex flex-col gap-1">
                    <div className="flex overflow-hidden gap-2 font-medium text-sm">
                      <div className="flex shrink-0 h-5 items-center">
                        <img
                          src="https://salt.tikicdn.com/ts/upload/81/61/d4/92e63f173e7983b86492be159fe0cff4.png"
                          alt="icon"
                          className="max-w-full h-full"
                          width={16}
                          height={16}
                        />
                      </div>
                      Thiết kế nắp mở một chạm tiện lợi và dễ sử dụng.
                    </div>
                  </div>
                </div>
                {/* end- special */}
              </div>
              {/* end sub left */}
              {/* sub right */}
              <div className="flex flex-col overflow-hidden gap-4">
                <div className="flex flex-col gap-4">
                  {/* info */}
                  <div className="flex flex-col bg-white rounded-lg p-4 gap-4">
                    {/* top */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-2 items-center flex-wrap">
                          <Image
                            src="https://salt.tikicdn.com/ts/upload/be/67/48/04a82ab8df178e1a13bde38316081865.png"
                            className="object-contain block"
                            width={91}
                            height={20}
                            preview={false}
                          />
                          <Image
                            src="https://salt.tikicdn.com/ts/ta/b1/3f/4e/cc3d0a2dd751a7b06dd97d868d6afa56.png"
                            className="object-contain block"
                            width={114}
                            height={20}
                            preview={false}
                          />
                          <Image
                            src="https://salt.tikicdn.com/ts/upload/d7/56/04/b93b8c666e13f49971483596ef14800f.png"
                            className="object-contain block"
                            width={89}
                            height={20}
                            preview={false}
                          />
                        </div>
                      </div>
                      <h1 className="m-0 font-medium text-xl whitespace-break-spaces break-words">
                        {product?.product_name}
                      </h1>
                      <div className="flex gap-1.5">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="text-sm">
                            {product?.product_ratingsAverage}
                          </span>
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
                            <Rate
                              disabled
                              allowHalf
                              value={product?.product_ratingsAverage}
                            />
                          </ConfigProvider>
                          {/* <span className="text-sm">4.8</span> */}
                          <span className="h-1/2 border-l-[1.5px] border-border "></span>
                        </div>
                        <div className="text-sm text-gray">Đã bán 22k</div>
                      </div>
                    </div>
                    <div className="price text-2xl font-semibold text-red">
                      {commaFormatter(variantSelected?.product_price || 0)}
                      <sup>đ</sup>
                    </div>
                    {/* top */}
                    {/* bottom */}
                    {product?.product_variations && (
                      <div className="flex flex-col items-start gap-4">
                        <div className="flex flex-col items-start gap-3">
                          {product?.product_variations.map(
                            (variation, variationIndex) => {
                              return (
                                <Fragment key={variation?.name}>
                                  <p className="text-sm font-semibold m-0 ">
                                    {variation?.name}
                                  </p>
                                  <div className="flex flex-wrap gap-x-3 gap-y-2">
                                    {variation?.options?.map(
                                      (option, optionIndex) => {
                                        return (
                                          <div
                                            key={option}
                                            className="block text-sm font-normal relative bg-white py-1 px-4 items-start"
                                            onClick={() =>
                                              handleOptionClick(
                                                variationIndex,
                                                optionIndex
                                              )
                                            }
                                          >
                                            <span className="line-clamp-1 block overflow-hidden text-black">
                                              {option}
                                            </span>
                                            <img
                                              src="https://salt.tikicdn.com/ts/upload/6d/62/b9/ac9f3bebb724a308d710c0a605fe057d.png"
                                              alt="logo"
                                              className={
                                                "absolute -top-[1px] -right-[1px] w-[13px] h-[13px] " +
                                                (indexVariant[
                                                  variationIndex
                                                ] === optionIndex
                                                  ? ""
                                                  : "hidden")
                                              }
                                            />
                                            <div
                                              className={
                                                "border absolute -inset-[1px] border-border rounded-lg " +
                                                (indexVariant[
                                                  variationIndex
                                                ] === optionIndex
                                                  ? "border-primary border-2"
                                                  : "")
                                              }
                                            ></div>
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                </Fragment>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}
                    {/* bottom */}
                  </div>
                  {/* info */}
                  {/* <SimilarProduct /> */}
                  <Policy />
                  <Detail items={product?.product_attributes || {}} />
                  <Description content={product?.product_description} />
                </div>
              </div>
              {/* end sub right */}
            </div>
            <div className="product-comparison-widget-id"></div>
            <div className="customer-review-widget-id">
              <div className="flex flex-col bg-white rounded-lg p-4 gap-1">
                <div className="text-base font-semibold">
                  Khách hàng đánh giá
                </div>
                <div className="customer-reviews pb-4">
                  <ReviewNotFound />
                </div>
              </div>
            </div>
          </div>
          {/* end left */}
          <div className="flex flex-col">
            <div className="flex flex-col items-stretch top-3 gap-3 sticky">
              <div className="flex flex-col gap-4 p-4 rounded-lg bg-white">
                {/* store info */}
                {/* store info */}
                {/* product info */}
                <div className="grid-cols-[40px,1fr] gap-2 items-center text-base hidden">
                  <Image
                    src="https://salt.tikicdn.com/cache/280x280/ts/product/8a/0b/fd/ed3a18d593387c8c13d2884480064d6f.jpg"
                    width={40}
                    height={40}
                    preview={false}
                  />
                  <div className="line-clamp-2 text-black">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Porro, assumenda.
                  </div>
                </div>
                {/* product info */}
                {/* button */}
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <p className="font-semibold text-base text-black">
                      Số lượng
                    </p>
                    <ButtonQuantity
                      register={register("quantity")}
                      setValue={setValue}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="font-semibold text-base text-black">
                      Tạm tính
                    </p>
                    <p className="font-semibold text-2xl text-black">
                      {commaFormatter(
                        watchQuantity * variantSelected?.product_price
                      )}
                      <sup>đ</sup>
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button danger type="primary" size="large">
                      Mua ngay
                    </Button>
                    <Button
                      size="large"
                      type="primary"
                      ghost
                      onClick={() => handleAddToCart()}
                    >
                      Thêm vào giỏ
                    </Button>
                  </div>
                </div>
                {/* button */}
              </div>
              <Carousel rows={1} cols={1} />
            </div>
          </div>
        </div>
        {/* <WatchedProduct /> */}
        <Carousel />
      </div>
    </div>
  );
};

export default ProductDetail;
