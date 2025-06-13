import React, { useState } from "react";

const Description = ({ content }) => {
  const [visibility, setVisibility] = useState(true);
  return (
    <div className="flex flex-col bg-white text-black rounded-lg p-4 gap-4">
      <div className="flex items-center">
        <div className="text-base font-semibold">Mô tả sản phẩm</div>
      </div>
      <div
        className={`relative ${visibility ? "overflow-hidden h-[250px] " : ""}`}
      >
        <p dangerouslySetInnerHTML={{ __html: content }} />
        {visibility && (
          <div
            className="gradient absolute bottom-0 left-0 w-full h-[200px]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255, 255, 255, 0), rgb(255, 255, 255))",
            }}
          ></div>
        )}
      </div>
      <span
        className="block w-full h-10 mt-2.5 mx-auto text-sm text-center text-accent hover:cursor-pointer hover:underline"
        onClick={() => setVisibility(!visibility)}
      >
        {visibility ? "Xem thêm" : "Thu gọn"}
      </span>
    </div>
  );
};

export default Description;
