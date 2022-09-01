import React, { memo } from "react";
import s from "./index.module.less";
import Icon from "@/components/Icon";

const SideBar = () => {
  return <div className={s.sideBarWrap}>
    <div className={s.title}>
      <Icon name="square_4" size="24px" iconClass={s.icon} />
      <span className={s.text}>广场</span>
    </div>
    <div className={s.menuList}>
      <div className={s.menuItem}>
        <Icon name="point_9" size="24px" iconClass={s.icon} />
        <span className={s.text}>全部分类</span>
      </div>
    </div>
  </div>;
};

export default memo(SideBar);
