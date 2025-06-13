import { DeleteOutlined } from "@ant-design/icons";
import { GatewayInstanceWithToken } from "../api/config";
import ButtonQuantity from "@components/ButtonQuantity";
import ReviewNotFound from "@components/notfound/Review";
import useAddress from "@hooks/useAddress";
import useCarts from "@hooks/useCarts";
import usePayments from "@hooks/usePayments";
import { Checkbox, FormControlLabel } from "@mui/material";
import { commaFormatter } from "@utils/helpers";
import { Button, Flex, Image, Popconfirm, Radio } from "antd";
import React, { Fragment, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

const Checkout = () => {
  const navaigate = useNavigate();
  const { carts } = useCarts();
  const [paymentMethod, setPaymentMethod] = React.useState("1");
  const { addresses } = useAddress();
  const { payments } = usePayments();

  const PAYMENTDATA = useMemo(() => {
    if (!payments) return [];
    return payments.data.map((item) => {
      return {
        value: item.id,
        label: (
          <Flex gap="small" justify="center" align="center">
            <Image
              src={item.method_thumbnail}
              width={36}
              height={36}
              preview={false}
              className="rounded"
            />
            {item.method_name}
          </Flex>
        ),
      };
    });
  });

  const addressSelected = useMemo(() => {
    if (!addresses) return null;

    return addresses.find((address) => address.isDefault);
  }, [addresses]);

  const items = useMemo(() => {
    if (!carts) return [];

    return carts.shop_order_ids.map((item) => {
      const products = item.item_products?.map((product) => {
        if (product?.product_variations) {
          const result = product.product_tier_idx.map((tierIdx, idx) => {
            const variation = product.product_variations[idx];
            return variation ? variation.options[tierIdx] : null; // Lấy giá trị từ options
          });
          return {
            ...product,
            product_options: result.join(", "),
          };
        }
        return { ...product };
      });
      return {
        ...item,
        item_products: products.filter((product) => product.isSelected),
      };
    });
  });

  const totalProducts = items.reduce(
    (acc, shop) => acc + shop.item_products.length,
    0
  );

  const handleCheckout = async () => {
    const order = {
      cart_id: carts?.cart_id,
      user_id: carts?.user_id,
      shop_order_ids: items,
      user_address: addressSelected,
      user_payment: payments.data.find(
        (payment) => payment.id == paymentMethod
      ),
      checkout_order: {
        totalPrice: carts?.total,
        totalCheckout: carts?.total,
      },
    };
    console.log(order);
    const res = await GatewayInstanceWithToken.post("checkout", order, {
      withCredentials: true,
    });
    console.log(res);
    if (res.status === 201) {
      navaigate("/sale/order/history");
    }
  };

  return (
    <div className="max-w-[1440px] m-auto">
      {/* <h4 className="mb-3 text-xl font-medium text-black uppercase">
        Giỏ hàng
      </h4> */}
      <div className="flex flex-nowrap justify-between gap-5">
        <div className="grow shrink basis-0 w-[calc(100%-380px)]">
          {/* <div className="bg-white py-2 px-4 rounded font-normal mb-3 sticky top-5 z-10 items-center grid grid-cols-[auto,120px,180px,120px,20px] gap-4">
            <FormControlLabel
              control={<Checkbox />}
              label={`Tất cả (${totalProducts} sản phẩm)`}
            />
            <span>Đơn giá</span>
            <span>Số lượng</span>
            <span>Thành tiền</span>
            <div className="cursor-pointer">
              <DeleteOutlined />
            </div>
          </div> */}
          <div>
            <div className="infinite-scroll-component h-auto overflow-hidden">
              {/* item */}
              {items.map((item) => (
                <Fragment key={item.shop_id}>
                  {item.item_products.map((product) => (
                    <div className="bg-white rounded mb-2.5" key={product?.id}>
                      <div className="seller"></div>
                      <div className="bg-white">
                        <div className="p-4 items-center grid grid-cols-[auto,120px,180px,120px,20px] gap-4">
                          <div className="grid grid-cols-[18px,80px,1fr] gap-3 items-center">
                            <span></span>
                            <div className="relative">
                              <Image
                                src={product?.product_thumb[0]}
                                width={80}
                                height={80}
                                preview={false}
                              />
                              <div className="absolute -z-2 inset-0 w-full h-full">
                                <Image
                                  src="https://salt.tikicdn.com/ts/upload/c1/39/0a/ee4ffc29e27c7bdee99b8b5961db05fe.png"
                                  width={80}
                                  height={80}
                                  preview={false}
                                />
                              </div>
                            </div>
                            <div>
                              <Link
                                to={"/"}
                                className="cursor-pointer text-base line-clamp-2 text-ellipsis hover:text-primary font-semibold"
                              >
                                {product?.product_name}
                              </Link>
                              {product?.product_options && (
                                <p className="text-sm text-gray">
                                  {product?.product_options}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-sm font-semibold text-red">
                            {commaFormatter(product?.product_price || 0)}
                            <sup>đ</sup>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              {/* <ButtonQuantity
                                onMinus={handleMinus}
                                onPlus={handlePlus}
                                data={{
                                  cart_item_id: product.id,
                                  cart_id: carts?.cart_id,
                                }}
                                value={product.quantity}
                                min={0}
                              /> */}
                              <span className="text-center">
                                {product?.quantity}
                              </span>
                            </div>
                          </div>
                          <div className="text-sm font-semibold text-red">
                            {commaFormatter(product?.product_total || 0)}
                            <sup>đ</sup>
                          </div>
                          <div className="cursor-pointer">
                            <div></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Fragment>
              ))}
              {/* item */}
            </div>
          </div>

          <div className="bg-white py-2 px-4 rounded font-normal space-y-2">
            <h3 className="text-lg block">Chọn hình thức thanh toán</h3>
            <div>
              <Radio.Group
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
                defaultValue={"1"}
                options={PAYMENTDATA}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="w-80 block">
          <div className="sticky top-5">
            <div>
              <div className="rounded mb-3 relative p-4 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="title m-0 font-normal text-gray">
                    Giao tới
                  </div>
                  <Link
                    to={"/checkout/shipping"}
                    className="text-primary bg-transparent"
                  >
                    Thay đổi
                  </Link>
                </div>
                <div>
                  {addressSelected ? (
                    <>
                      <div className="customer-info flex gap-2 items-center mb-2 font-semibold text-sm">
                        <p className="customer-info_name line-clamp-1 ">
                          {addressSelected.user_name}
                        </p>
                        <p className="customer-info_phone line-clamp-1 ">
                          {addressSelected.user_phone}
                        </p>
                      </div>
                      <div className="address text-sm">
                        <span className="text-[#00ab56] bg-[#effff4] font-medium px-1.5 inline-flex items-center rounded mr-1">
                          Nhà
                        </span>
                        {addressSelected.street +
                          " " +
                          addressSelected.district +
                          " " +
                          addressSelected.city}
                      </div>
                    </>
                  ) : (
                    <ReviewNotFound title="Chưa có địa chỉ nào được thêm" />
                  )}
                </div>
              </div>
            </div>
            <div className="bg-white rounded p-4 space-y-2">
              <ul className="price-items list-unstyled p-0 my-2 border-b border-border text-sm">
                <li className="flex flex-nowrap mb-2 gap-2 justify-between">
                  <span className="text-gray inline-block">Tổng tiền hàng</span>
                  <span>
                    {commaFormatter(carts?.total || 0)}
                    <sup>đ</sup>
                  </span>
                </li>
                <li className="flex flex-nowrap mb-2 gap-2 justify-between">
                  <span className="text-gray inline-block">
                    Mã khuyến mại từ nhà bán
                  </span>
                  <span className="text-green">
                    0<sup>đ</sup>
                  </span>
                </li>
              </ul>
              <div className="price-total flex flex-nowrap justify-between m-0 text-sm">
                <span className="font-medium text-black">
                  Tổng tiền thanh toán
                </span>
                <span className="font-medium text-red text-base">
                  {commaFormatter(carts?.total || 0)}
                  <sup>đ</sup>
                </span>
              </div>
              <Button
                className="w-full font-semibold"
                type="primary"
                danger
                size="large"
                onClick={handleCheckout}
              >
                Mua hàng ({totalProducts})
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
