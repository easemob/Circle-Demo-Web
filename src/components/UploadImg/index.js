import React, { memo } from "react";
import { Upload, message } from "antd";
import ImgCrop from "antd-img-crop";
import WebIM from "@/utils/WebIM";
import s from "./index.module.less";
import lrz from "lrz";

const ConfirmBtn = () => {
  return <div className={`circleBtn ${s.confirmBtn}`}>确认</div>;
};
const CancelBtn = () => {
  return <div className={`circleBtnGray ${s.confirmBtn}`}>取消</div>;
};

const UploadEl = (props) => {
  const { update, innerNode, title, maxSize } = props;
  const beforeCheck = (file, fileList = []) => {
    return new Promise(async (resolve) => {
      try {
        let rst = await lrz(file);
        resolve(rst.file);
      } catch (error) {
        throw Error(error);
      }
    });
  };
  const onChange = ({ fileList: newFileList }) => {
    const fileObj = newFileList[0];
    let imgUrl = "";
    if (
      fileObj.status === "done" &&
      fileObj.response.entities &&
      fileObj.response.entities[0]
    ) {
      imgUrl = fileObj.response.uri + "/" + fileObj.response.entities[0].uuid;
      update(imgUrl);
    }
  };
  const test = (e)=>{
    if (maxSize && e.size > maxSize * 1024 * 1000) {
      message.error(`上传文件超出${maxSize}M，请重新上传！`);
      return false
    }else{
      return true
    }
  }

  const uploadProps = {
    showUploadList: false,
    maxCount: 1,
    action: `${WebIM.conn.apiUrl}/${WebIM.conn.orgName}/${WebIM.conn.appName}/chatfiles`,
    onChange: onChange,
    beforeUpload: beforeCheck,
  };
  return (
    <div>
      <ImgCrop
        modalTitle={title}
        modalWidth={960}
        modalHeight={572}
        modalOk={<ConfirmBtn />}
        modalCancel={<CancelBtn />}
        quality={0.2}
        maxZoom={2}
        beforeCrop={test}
      >
        <Upload {...uploadProps}>{innerNode}</Upload>
      </ImgCrop>
    </div>
  );
};

export default memo(UploadEl);
