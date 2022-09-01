import s from "./index.module.less";
import React, { memo } from "react";

const RecallMsg = (props) => {
  const { message } = props;
  return (
    <div className={s.main}>
      <div className={s.txt}>{message.msg}</div>
    </div>
  );
};

export default memo(RecallMsg);
