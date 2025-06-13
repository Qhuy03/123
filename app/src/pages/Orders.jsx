import Aside from "@components/Aside";
import useAddress from "@hooks/useAddress";
import useOders from "@hooks/useOders";
import { commaFormatter } from "@utils/helpers";
import { Button } from "antd";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const navigate = useNavigate();
  const { orders } = useOders();
  const { addresses } = useAddress();
  console.log(orders);

  const items = useMemo(() => {
    if (!orders) return [];

    return orders;
  }, [orders]);

  const addressSelected = useMemo(() => {
    if (!addresses) return null;

    return addresses.find((address) => address.isDefault);
  }, [addresses]);

  return (
    <div className="orders flex w-full">
      <Aside />
      <div style={{ flex: "1 0 0%", overflow: "hidden" }} className="space-y-4">
        <div className="max-w-[950px]">
          <div className="text-xl my-5">Đơn hàng của tôi</div>
          <div className="bg-white flex overflow-hidden sticky top-0 z-10">
            <div className="flex-1 py-3 text-sm text-center transition-all duration-300 hover:border-b hover:border-primary hover:text-primary hover:cursor-pointer">
              Tất cả đơn
            </div>
            <div className="flex-1 py-3 text-sm text-center transition-all duration-300 hover:border-b hover:border-primary hover:text-primary hover:cursor-pointer">
              Chờ thanh toán
            </div>
            <div className="flex-1 py-3 text-sm text-center transition-all duration-300 hover:border-b hover:border-primary hover:text-primary hover:cursor-pointer">
              Đang xử lý
            </div>
            <div className="flex-1 py-3 text-sm text-center transition-all duration-300 hover:border-b hover:border-primary hover:text-primary hover:cursor-pointer">
              Đang vận chuyển
            </div>
            <div className="flex-1 py-3 text-sm text-center transition-all duration-300 hover:border-b hover:border-primary hover:text-primary hover:cursor-pointer">
              Đã giao
            </div>
            <div className="flex-1 py-3 text-sm text-center transition-all duration-300 hover:border-b hover:border-primary hover:text-primary hover:cursor-pointer">
              Đã hủy
            </div>
          </div>
        </div>
        <div className="max-w-[950px]">
          <div className="h-auto overflow-auto flex flex-col min-h-[calc(100vh-110px)]">
            {items.map((item) => (
              <div className="bg-white rounded text-sm mb-5 p-4">
                <div className="border-b border-border pb-2 text-gray font-medium">
                  <span>{item?.order_status}</span>
                </div>
                <div className="products ">
                  {item?.OrderDetails?.map((product) => (
                    <div className="product flex py-4 px-0 justify-between items-center">
                      <div className="detail flex items-center">
                        <div className="w-20 h-20 rounded border border-border overflow-hidden">
                          <img
                            src={product?.product_thumb}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="product-info mx-3 flex flex-col">
                          <p className="product-name mb-1.5">
                            {product.product_name}
                          </p>
                          {product.product_variant && (
                            <p className="text-xs">{product.product_variant}</p>
                          )}
                        </div>
                      </div>
                      <div className="price min-w-32 justify-end flex">
                        <span>{commaFormatter(product.price || 0)} đ</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col justify-end mt-3">
                  <div className="text-right text-lg">
                    <span>Tổng tiền: </span>
                    <span>{commaFormatter(item.order_total || 0)} đ</span>
                  </div>
                  {/* <div className="ml-auto mt-3">
                    <Button
                      onClick={() => navigate("/sale/order/view/" + item.id)}
                      type="link"
                      size="large"
                    >
                      Xem chi tiết
                    </Button>
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
