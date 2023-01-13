import React, { memo } from "react";
import s from "./index.module.less";
import Setting from "@/views/ServerSetting";

const ServerSetting = (props) => {
  return (
    <div className={s.layout}>
      <Setting/>
    </div>
  );
};

export default memo(ServerSetting);

