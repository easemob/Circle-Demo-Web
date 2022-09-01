import s from "./index.module.less";
import React, { memo } from "react";
import { renderTxt } from "@/utils/common";

const TxtMsg = (props) => {
  const { message } = props;
  return (
    <div className={s.main}>
      <div className={s.txt}>{renderTxt(message.msg)}</div>
    </div>
  );
};

export default memo(TxtMsg);
