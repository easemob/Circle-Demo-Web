import React, { memo } from "react";
import { Upload } from "antd";
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
  const { update, innerNode } = props;
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

  const uploadProps = {
    showUploadList: false,
    maxCount: 1,
    action: `${WebIM.conn.apiUrl}/${WebIM.conn.orgName}/${WebIM.conn.appName}/chatfiles`,
    onChange: onChange,
    beforeUpload: beforeCheck
  };
  return (
    <div>
      <ImgCrop
        modalTitle={"上传头像"}
        modalWidth={960}
        modalHeight={572}
        modalOk={<ConfirmBtn />}
        modalCancel={<CancelBtn/>}
        quality={0.2}
        maxZoom={2}
      >
        <Upload {...uploadProps}>{innerNode}</Upload>
      </ImgCrop>
    </div>
  );
};

export default memo(UploadEl);
