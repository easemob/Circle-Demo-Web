import s from "./index.module.less";
import React, { memo } from "react";
import Icon from "@/components/Icon";
import download from "@/utils/download";

const FileMsg = (props) => {
  const { message } = props;
  //下载
  const handleDownloadFile = () => {
    fetch(message.url)
      .then((res) => {
        return res.blob();
      })
      .then((blob) => {
        download(blob, message.filename);
      })
      .catch((err) => {
        console.log(err)
        return false;
      })
      .finally((res) => {
        return true;
      });
  };
  return (
    <div className={s.main}>
      <div className={s.fileCon}>
        <div className={s.flag}>
          <Icon name={"file"} size={"42px"} />
        </div>
        <div className={s.info}>
          <div className={s.fileName}>{message.filename}</div>
          <div className={s.more}>
            {message?.ext?.file_length && (
              <span className={s.size}>
                {Math.floor(message?.ext?.file_length / 1024) + "KB"}
              </span>
            )}
            <span className={s.download} onClick={handleDownloadFile}>
              <Icon
                name={"arrow_down_in_box"}
                size={"14px"}
                iconClass={s.iconColor}
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(FileMsg);
