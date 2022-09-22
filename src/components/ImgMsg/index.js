import s from "./index.module.less";
import React, { memo } from "react";
import { Image } from "antd";

const ImgMsg = (props) => {
  const { message } = props;
  const getUrl = (url) => {//修改为优先展示本地url，但是存储服务端url,方便后期其他操作
    return url.indexOf("blob") > -1 ? url : url + "?thumbnail=true"
  }
  return (
    <div className={s.main}>
      <div className={s.imgCon}>
        <Image src={getUrl(message.localUrl || message.url)} placeholder={true}
          preview={{
            src: message.localUrl || message.url,
          }} />
      </div>
    </div>
  );
};

export default memo(ImgMsg);
