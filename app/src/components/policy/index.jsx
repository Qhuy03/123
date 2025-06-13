import { RightOutlined } from "@ant-design/icons";
import React from "react";

const Polis = () => {
  return (
    <div className="flex flex-col bg-white text-black rounded-lg p-4 gap-4">
      <div className="flex items-center justify-between cursor-pointer">
        <div className="text-base font-semibold">An tâm mua sắm</div>
        <RightOutlined />
      </div>
      <div className="flex flex-col">
        <div className="flex gap-2 py-2 border-b border-border text-sm font-normal">
          <img
            className="w-4 h-4"
            src="https://salt.tikicdn.com/ts/upload/c5/37/ee/76c708d43e377343e82baee8a0340297.png"
            alt="logo"
          />
          <span>Được đồng kiểm khi nhận hàng</span>
        </div>
        <div className="flex gap-2 py-2 border-b border-border text-sm font-normal">
          <img
            className="w-4 h-4"
            src="https://salt.tikicdn.com/ts/upload/ea/02/b4/b024e431ec433e6c85d4734aaf35bd65.png"
            alt="logo"
          />
          <span>
            <b>Được hoàn tiền 200%</b> nếu là hàng giả.
          </span>
        </div>
        <div className="flex gap-2 py-2 border-b border-border text-sm font-normal">
          <img
            className="w-4 h-4"
            src="https://salt.tikicdn.com/ts/upload/d8/c7/a5/1cd5bd2f27f9bd74b2c340b8e27c4d82.png"
            alt="logo"
          />
          <span>Đổi trả miễn phí trong 30 ngày. Được đổi ý.</span>
        </div>
      </div>
    </div>
  );
};

export default Polis;
