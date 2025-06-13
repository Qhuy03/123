import { Button, Checkbox, Form, Input, Radio, Select } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useProvince from "@hooks/useProvince";
import useDistrict from "@hooks/useDistrict";
import useAddress from "@hooks/useAddress";
import { useAuth } from "@contexts/AuthContext";

// Định nghĩa schema Zod cho form
const addressFormSchema = z.object({
  user_name: z.string().min(1, { message: "Họ tên là bắt buộc" }),
  user_phone: z
    .string()
    .min(10, { message: "Số điện thoại phải ít nhất 10 ký tự" })
    .regex(/^[0-9]+$/, { message: "Số điện thoại chỉ chứa số" }),
  user_id: z.string().min(1, { message: "ID người dùng là bắt buộc" }),
  street: z.string().min(1, { message: "Địa chỉ là bắt buộc" }),
  district: z.string().min(1, { message: "Quận/Huyện là bắt buộc" }),
  city: z.string().min(1, { message: "Tỉnh/Thành phố là bắt buộc" }),
  type: z.string().min(1, { message: "Loại địa chỉ là bắt buộc" }),
  isDefault: z.boolean().default(false),
});

const Address = () => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useForm({
    mode: "onSubmit",
    resolver: zodResolver(addressFormSchema),
  });
  const watchedCity = watch("city");
  const watchedDistrict = watch("district");

  const [checked, setChecked] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const toggleForm = () => setIsOpen(!isOpen);
  const { provinces } = useProvince();
  const { districts } = useDistrict(watchedCity);

  const { handleCreate, addresses, handleUpdate } = useAddress();
  const cities = useMemo(() => {
    if (!provinces) return [];

    return provinces.map((item) => ({
      label: item.name,
      value: item.name,
    }));
  }, [provinces]);

  const districtsApi = useMemo(() => {
    if (!districts) return [];

    return districts.districts.map((item) => ({
      label: item.name,
      value: item.code,
    }));
  }, [districts]);

  const onSubmit = (data) => {
    console.log(data);
  };

  useEffect(() => {
    setValue("user_id", user.id);
  }, [user]);

  return (
    <div>
      <h3 className="font-bold text-base">Địa chỉ giao hàng</h3>
      <h3 className="font-semibold text-sm my-5">
        Chọn địa chỉ giao hàng có sẵn bên dưới:
      </h3>
      <div className="grid grid-cols-2 gap-5">
        {addresses?.map((address) => (
          <div
            className={
              "border border-dashed rounded py-2.5 px-4 relative " +
              (address?.isDefault ? "border-green" : "border-gray")
            }
          >
            <div className="name text-sm font-semibold mb-1 text-black">
              {address?.user_name}
            </div>
            <div>
              Địa chỉ:{" "}
              {address?.street + " " + address?.district + " " + address?.city}
            </div>
            <div>Điện thoại: {address?.user_phone}</div>
            <div className="flex gap-2 mt-2">
              <Button
                type="primary"
                onClick={() =>
                  handleUpdate(address?.id, {
                    ...address,
                    isDefault: true,
                  })
                }
              >
                Giao đến địa chỉ này
              </Button>
              <Button>Xóa</Button>
            </div>
            {address?.isDefault && (
              <div className="absolute top-2.5 right-4 text-green">
                Mặc định
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4">
        Bạn muốn giao hàng đến địa chỉ khác?{" "}
        <span className="text-primary" onClick={toggleForm}>
          Thêm địa chỉ giao hàng mới
        </span>
      </div>
      <div
        className={`transition-all duration-500 ease-in-out mt-4 border border-gray rounded py-2.5 bg-[#f7f7f7] overflow-hidden ${
          isOpen ? "h-fit block" : "h-0 hidden"
        }`}
      >
        <Form
          className="max-w-[550px] mx-auto"
          onFinish={handleSubmit(handleCreate)}
        >
          <div className="flex my-4 gap-2 items-start">
            <label htmlFor="fullname" className="w-[250px] font-semibold">
              Họ tên
            </label>
            <Form.Item
              style={{
                width: "100%",
                marginBottom: 0,
              }}
              validateStatus={errors.user_name ? "error" : ""}
              help={errors.user_name ? errors.user_name.message : ""}
            >
              <Controller
                name="user_name"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Nhập họ tên" />
                )}
              />
            </Form.Item>
          </div>
          <div className="flex my-4 gap-2 items-center">
            <label htmlFor="phone" className="w-[250px] font-semibold">
              Điện thoại di động
            </label>
            <Form.Item
              style={{
                width: "100%",
                marginBottom: 0,
              }}
              validateStatus={errors.user_phone ? "error" : ""}
              help={errors.user_phone ? errors.user_phone.message : ""}
            >
              <Controller
                name="user_phone"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Nhập số điện thoại" />
                )}
              />
            </Form.Item>
          </div>
          <div className="flex my-4 gap-2 items-center">
            <label htmlFor="city" className="w-[250px] font-semibold">
              Tỉnh/Thành phố
            </label>
            <Form.Item
              style={{
                width: "100%",
                marginBottom: 0,
              }}
              validateStatus={errors.city ? "error" : ""}
              help={errors.city ? errors.city.message : ""}
            >
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    showSearch
                    placeholder="Chọn Tỉnh/Thành phố"
                    style={{
                      width: "100%",
                      marginBottom: 0,
                    }}
                    options={cities}
                  />
                )}
              />
            </Form.Item>
          </div>
          <div className="flex my-4 gap-2 items-center">
            <label htmlFor="city" className="w-[250px] font-semibold">
              Quận/Huyện
            </label>
            <Form.Item
              style={{
                width: "100%",
                marginBottom: 0,
              }}
              validateStatus={errors.district ? "error" : ""}
              help={errors.district ? errors.district.message : ""}
            >
              <Controller
                name="district"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    showSearch
                    placeholder="Chọn Quận/Huyện"
                    style={{
                      width: "100%",
                      marginBottom: 0,
                    }}
                    options={[
                      {
                        label: "Quận Hà Đông",
                        value: "Hà Đông",
                      },
                    ]}
                  />
                )}
              />
            </Form.Item>
          </div>
          <div className="flex my-4 gap-2 items-center">
            <label htmlFor="district" className="w-[250px] font-semibold">
              Phường/Xã
            </label>
            <Form.Item
              style={{
                width: "100%",
                marginBottom: 0,
              }}
              validateStatus={errors.district ? "error" : ""}
              help={errors.district ? errors.district.message : ""}
            >
              <Select
                {...register("street")}
                showSearch
                placeholder="Chọn Phường/Xã"
                style={{
                  width: "100%",
                  marginBottom: 0,
                }}
                options={[
                  {
                    label: "Phường Yên Nghĩa",
                    value: "Yên Nghĩa",
                  },
                ]}
              />
            </Form.Item>
          </div>
          <div className="flex my-4 gap-2 items-center">
            <label htmlFor="city" className="w-[250px] font-semibold">
              Địa chỉ
            </label>
            <Form.Item
              style={{
                width: "100%",
                marginBottom: 0,
              }}
              validateStatus={errors.street ? "error" : ""}
              help={errors.street ? errors.street.message : ""}
            >
              <Controller
                name="street"
                control={control}
                render={({ field }) => (
                  <Input.TextArea
                    {...field}
                    placeholder="Ví dụ: 52 Trần Hưng Đạo"
                    autoSize={{ minRows: 3 }}
                  />
                )}
              />
            </Form.Item>
          </div>
          <div className="flex my-4 gap-2 items-center">
            <label htmlFor="city" className="w-[250px] font-semibold">
              Loại địa chỉ
            </label>
            <div className="w-full">
              <Form.Item
                style={{
                  width: "100%",
                  marginBottom: 0,
                }}
                validateStatus={errors.type ? "error" : ""}
                help={errors.type ? errors.type.message : ""}
              >
                <Controller
                  name="type"
                  control={control}
                  defaultValue="Nhà riêng / Chung cư"
                  render={({ field }) => (
                    <Radio.Group
                      {...field}
                      style={{
                        width: "100%",
                      }}
                    >
                      <Radio value="Nhà riêng / Chung cư">
                        Nhà riêng / Chung cư
                      </Radio>
                      <Radio value="Cơ quan / Công ty">Cơ quan / Công ty</Radio>
                    </Radio.Group>
                  )}
                />
              </Form.Item>
            </div>
          </div>
          <div className="flex my-4 gap-2 items-center">
            <label htmlFor="city" className="w-[250px] font-semibold"></label>
            <div className="w-full">
              <Form.Item>
                <Controller
                  name="isDefault"
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <Checkbox
                      {...field}
                      checked={checked}
                      onChange={(e) => {
                        setChecked(e.target.checked);
                        field.onChange(e.target.checked);
                      }}
                    >
                      Sử dụng địa chỉ này làm mặc định.
                    </Checkbox>
                  )}
                />
              </Form.Item>
            </div>
          </div>
          <div className="flex my-4 gap-2 items-center">
            <label htmlFor="city" className="w-[250px] font-semibold"></label>
            <div className="w-full flex gap-4">
              <Button>Hủy bỏ</Button>
              <Button type="primary" htmlType="submit">
                Giao đến địa chỉ này
              </Button>
            </div>
          </div>
        </Form>
      </div>
      <div className="h-20"></div>
    </div>
  );
};

export default Address;
