import s from "./index.module.less";
import React, { memo } from "react";
import { Image } from "antd";

const ImgMsg = (props) => {
  const { message } = props;
  return (
    <div className={s.main}>
      <div className={s.imgCon}>
        <Image src={`${message.url}?thumbnail=true`} placeholder={true}
          preview={{
            src: message.url,
          }} />
        {/* <img src={message.url} alt="" className={s.imgSrc} /> */}
      </div>
    </div>
  );
};

export default memo(ImgMsg);
