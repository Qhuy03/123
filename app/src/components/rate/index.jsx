import { ConfigProvider } from "antd";
import React from "react";

const Rate = (props) => {
  return (
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
      <Rate disabled={props.disabled} allowHalf defaultValue={props.value} />
    </ConfigProvider>
  );
};

export default Rate;
