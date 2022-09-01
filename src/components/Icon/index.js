import React, { memo } from "react";
import s from "./index.module.less";

const Index = ({
  iconClass = "",
  name,
  style = {},
  color = "",
  size = "none",
  onClick = () => { }
}) => {
  return (
    <span className={`${s["icon-wrapper"]} anticon`} onClick={onClick}>
      <span
        className={`iconfont icon-${name} ${iconClass}`}
        style={{ color: color || "none", fontSize: size, ...style }}
      ></span>
    </span>
  );
};

export default memo(Index);
