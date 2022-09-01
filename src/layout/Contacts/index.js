import React, { memo } from "react";
import { Outlet } from "react-router-dom";
import s from "./index.module.less";
import SideBar from "./SideBar";

const Content = () => {
  return (
    <div className={s.contentWrap}>
      <SideBar />
      <Outlet />
    </div>
  );
};

export default memo(Content);
