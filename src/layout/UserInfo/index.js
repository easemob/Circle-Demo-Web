import React, { memo } from "react";
import { Outlet } from "react-router-dom";
import s from "./index.module.less";
import SideBar from "./SideBar";
import UserInfo from "@/views/UserInfo";

const Content = (props) => {
  return (
    <div className={s.userInfo}>
      <SideBar />
      <UserInfo />
      <Outlet />
    </div>
  );
};

export default memo(Content);

