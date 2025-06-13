import useAddress from "@hooks/useAddress";
import React, { useMemo } from "react";
import { Link } from "react-router-dom";

const Aside = () => {
  const { addresses } = useAddress();

  const addressSelected = useMemo(() => {
    if (!addresses) return null;

    return addresses.find((address) => address.isDefault);
  }, [addresses]);
  return (
    <div className="w-[250px] mr-4">
      <div className="flex items-center pl-2 mx-3">
        <img
          src="/assets/icons/aside.png"
          alt="aside"
          className="w-11 h-11 rounded mr-3"
        />
        <div className="info text-sm" style={{ flex: "1 0 0%" }}>
          Tài khoản của <br />
          <strong>{addressSelected?.user_name}</strong>
        </div>
      </div>
      <div className="mt-4 p-0">
        <div className="item">
          <Link
            to={"/customer/account/edit"}
            className="flex items-center px-2 py-4 hover:bg-zinc-200 rounded-lg"
          >
            <svg
              className="w-6 h-6 mr-5 text-2xl"
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 24 24"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
            </svg>
            <span>Thông tin tài khoản</span>
          </Link>
          <Link
            to={"/sale/order/history"}
            className="flex items-center px-2 py-4 hover:bg-zinc-200 rounded-lg"
          >
            <svg
              className="w-6 h-6 mr-5 text-2xl"
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 24 24"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M13 12h7v1.5h-7zm0-2.5h7V11h-7zm0 5h7V16h-7zM21 4H3c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 15h-9V6h9v13z"></path>
            </svg>
            <span>Quản lý đơn hàng</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Aside;
