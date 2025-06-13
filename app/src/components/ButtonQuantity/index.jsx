import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, InputNumber } from "antd";
import React, { useState } from "react";

const ButtonQuantity = ({
  data,
  name,
  value = 1,
  min = 1,
  max = 100,
  register,
  setValue,
  onMinus,
  onPlus,
}) => {
  const [quantity, setQuantity] = useState(value);
  return (
    <div className="flex items-center gap-2">
      <Button
        type="default"
        icon={<MinusOutlined />}
        onClick={() => {
          if (quantity === min) return;
          setQuantity((prev) => prev - 1);
          setValue && setValue("quantity", quantity - 1);
          if (onMinus) onMinus({ ...data, quantity: quantity - 1 });
        }}
      />
      <InputNumber
        // name={name}
        {...(register && register)}
        controls={false}
        min={min}
        max={max}
        value={quantity}
        onChange={(e) => {
          setValue && setValue("quantity", e);
          setQuantity(e);
        }}
        onPressEnter={(e) => {
          onMinus && onMinus({ ...data, quantity });
        }}
      />
      <Button
        type="default"
        icon={<PlusOutlined />}
        onClick={() => {
          if (quantity === max) return;
          setQuantity((prev) => prev + 1);
          setValue && setValue("quantity", quantity + 1);
          if (onPlus) onPlus({ ...data, quantity: quantity + 1 });
        }}
      />
    </div>
  );
};

export default ButtonQuantity;
