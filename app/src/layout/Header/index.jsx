import { Badge, Button, Image, Input, Space } from "antd";
import React, { Fragment } from "react";
import {
  HomeFilled,
  RedditOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";

import Tick from "@assets/icons/tick.png";
import Freeship from "@assets/icons/freeship.png";
import Exchange from "@assets/icons/exchange.png";
import Restock from "@assets/icons/restock.png";
import Fast from "@assets/icons/fast.png";
import Tag from "@assets/icons/tag.png";
import { useAuth } from "@contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ILogo from "@assets/logo.png";
const items = [
  {
    icon: Tick,
    title: "100% hàng thật",
  },
  {
    icon: Freeship,
    title: "Freeship mọi đơn",
  },
  {
    icon: Exchange,
    title: "Hoàn 200% nếu hàng giả",
  },
  {
    icon: Restock,
    title: "30 ngày đổi trả",
  },
  {
    icon: Fast,
    title: "Giao nhanh 2h",
  },
  {
    icon: Tag,
    title: "Giá siêu rẻ",
  },
];
const Header = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  return (
    <>
      <header id="main-header" className="bg-white border-b pb-4">
        <div className="max-w-[1440px] mx-auto pt-2 px-6">
          <div className="flex justify-start items-center gap-12">
            <a className="flex flex-col items-center text-accent font-semibold gap-2">
              <Image src={ILogo} width={96} height={60} preview={false} />
              {/* <span>Tốt & Nhanh</span> */}
            </a>
            <div className="flex flex-1 gap-12">
              <Space.Compact style={{ width: "100%" }}>
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Tìm kiếm sản phẩm"
                  size="large"
                />
                <Button
                  size="large"
                  type="default"
                  className="text-accent font-normal"
                >
                  Tìm kiếm
                </Button>
              </Space.Compact>
              <div className="flex justify-end items-center">
                <Button
                  className="text-primary"
                  size="large"
                  type="text"
                  icon={<HomeFilled className="text-inherit" />}
                  onClick={() => navigate("/")}
                >
                  Trang chủ
                </Button>
                <Button
                  className="text-secondary"
                  size="large"
                  type="text"
                  icon={<RedditOutlined className="text-inherit" />}
                  onClick={() =>
                    navigate("/customer/account/edit", {
                      replace: false,
                    })
                  }
                >
                  Tài khoản
                </Button>
                <div className="border-l border-gray h-1/2 mx-6"></div>
                <Badge count={0}>
                  <Button
                    size="large"
                    type="text"
                    variant="outlined"
                    icon={
                      <ShoppingCartOutlined
                        style={{ fontSize: "22px", color: "#0a68ff" }}
                      />
                    }
                    onClick={() =>
                      navigate("/checkout/cart", {
                        replace: false,
                      })
                    }
                  ></Button>
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="bg-white">
        <div className="max-w-[1440px] mx-auto py-2 px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-sm text-accent">Cam kết</span>
            </div>
            {items.map((item) => (
              <Fragment key={item.title}>
                <div className="flex items-center gap-1">
                  <Image
                    src={item.icon}
                    preview={false}
                    width={20}
                    height={20}
                  />
                  <span className="font-semibold text-xs">{item.title}</span>
                </div>
                <div className="border-l border-border h-5"></div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
