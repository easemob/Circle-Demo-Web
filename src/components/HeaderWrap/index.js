import React, { memo } from "react";
import s from "./index.module.less";

const HeaderWrap = (props) => {
  const { children, style = {} } = props;
  return (
    <div className={s.headerWrap} style={style}>
      {children}
    </div>
  );
};

export default memo(HeaderWrap);
