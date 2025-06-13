import React from "react";

const Detail = ({ items }) => {
  return (
    <div className="flex flex-col bg-white text-black rounded-lg p-4 gap-4">
      <div className="flex items-center">
        <div className="text-base font-semibold">Thông tin chi tiết</div>
      </div>
      <div className="flex flex-col">
        {Object.keys(items).length > 0 ? (
          Object.entries(items).map(([key, value]) => {
            return (
              <div key={key} className="border-b border-border text-sm py-2">
                <div className="grid grid-cols-[55%,45%] gap-1">
                  <div className="max-w-[300px] text-gray">{key}</div>
                  <div className="break-words text-black">{value}</div>
                </div>
              </div>
            );
          })
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Detail;
