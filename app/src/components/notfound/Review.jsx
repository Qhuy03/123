import React from "react";
import ImageNotFound from "@assets/icons/notfound.png";
import { Image } from "antd";
const ReviewNotFound = ({
  title = "Chưa có đánh giá nào cho sản phẩm này",
}) => {
  return (
    <div className="customer-review-empty">
      <div className="flex flex-col w-full rounded-lg border border-border items-center">
        <Image src={ImageNotFound} preview={false} />
        <span className="text-sm text-gray">{title}</span>
      </div>
    </div>
  );
};

export default ReviewNotFound;
