import React, { memo } from "react";
import { Outlet } from "react-router-dom";
import s from "./index.module.less";
import SideBar from "./SideBar";
import ServerSquare from "@/views/ServerSquare"

const Content = () => {
  return (
    <div className={s.contentWrap}>
      <SideBar />
      <ServerSquare />
      <Outlet />
    </div>
  );
};

export default memo(Content);
