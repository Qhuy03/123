import Aside from "@components/Aside";
import useOders from "@hooks/useOders";
import { commaFormatter } from "@utils/helpers";
import { Button, Table } from "antd";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

const OrderView = () => {
  const { id } = useParams();
  console.log(id);
  const { orders } = useOders(id);
  console.log(orders);

  const items = useMemo(() => {
    if (!orders) return null;

    return orders;
  }, [orders]);

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Giá",
      dataIndex: "price",
      align: "right",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
    },
    {
      title: "Tạm tính",
      dataIndex: "subtotal",
    },
  ];
  return (
    <div className="orders flex w-full">
      <Aside />
      <div style={{ flex: "1 0 0%", overflow: "hidden" }} className="space-y-4">
        <div className="max-w-[950px]">
          <div className="text-xl my-5">Chi tiết đơn hàng - </div>
          <div className="text-right created-data"></div>
          <div className="flex gap-2 mb-2.5">
            <div className="flex-1 space-y-2">
              <div className="title uppercase text-xs">Địa chỉ người nhận</div>
              <div className="flex flex-col p-2.5 rounded bg-white h-full">
                <div className="font-semibold uppercase">
                  {items?.user_name}
                </div>
                <div className="text-xs">
                  <span>Địa chỉ: {items?.shipping_address}</span>
                </div>
                <div className="text-xs">
                  <span>Số điện thoại: {items?.user_email}</span>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="title uppercase text-xs">
                Hình thức thanh toán
              </div>
              <div className="flex flex-col p-2.5 rounded bg-white h-full">
                <div className="font-semibold uppercase">
                  {items?.payment_method}
                </div>
                <div className="text-xs">{/* <span>Địa chỉ: </span> */}</div>
                <div className="text-xs">
                  {/* <span>Số điện thoại: </span> */}
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-2"></div>
          </div>
        </div>
        <div className="max-w-[950px]">
          <div className="h-auto overflow-auto flex flex-col min-h-[calc(100vh-110px)]">
            {/* <Table
              columns={columns}
              dataSource={data}
              bordered
              title={() => "Header"}
              footer={() => "Footer"}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderView;
