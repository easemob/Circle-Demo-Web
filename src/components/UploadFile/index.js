import React, { useState } from "react";
import { Upload, Button, message } from "antd";
import ImgCrop from "antd-img-crop";
import WebIM from "@/utils/WebIM";
import { LoadingOutlined } from "@ant-design/icons";
import lrz from "lrz";
import s from "./index.module.less";

const ConfirmBtn = () => {
  return <div className={`circleBtn ${s.confirmBtn}`}>确认</div>;
};

/**
 * 文件上传
 */
const UploadFile = ({
  onChange,
  value,
  autoUpload = true,
  accept,
  amount,
  size,
  otherProps,
  extra,
  children
}) => {
  const [loading, setLoading] = useState(false);
  // 数量限制
  const checkLimit = (fileList) => {
    return new Promise((resolve, reject) => {
      const isLen = (value?.length ?? 0) + fileList.length;
      if (amount && isLen > amount) {
        reject(Error());
      } else {
        resolve();
      }
    }).then(
      () => {
        return true;
      },
      () => {
        message.error(`超过最大上传数量${amount}个，请重新选择！`);
        return Promise.reject(Error("超过最大上传数量"));
      }
    );
  };

  // 大小限制
  const checkSize = (file) => {
    return new Promise((resolve, reject) => {
      if (size && file.size > Window.Math.pow(1024, 2) * size) {
        reject(Error());
      } else {
        resolve();
      }
    }).then(
      () => {
        return true;
      },
      () => {
        message.error(`超过大小限制${size}M，请重新选择！`);
        return Promise.reject(Error("超过大小限制"));
      }
    );
  };

  // 格式限制
  const checkAccept = (file) => {
    return new Promise((resolve, reject) => {
      if (accept && file?.type && accept.indexOf(file?.type) === -1) {
        message.error({
          title: `文件格式不正确，请重新选择！`
        });
        reject(Error("文件格式不正确，请重新选择！"));
      } else {
        resolve();
      }
    }).then(
      () => {
        return true;
      },
      () => {
        message.error("文件格式不正确，请重新选择！");
        return Promise.reject(Error("文件格式不正确，请重新选择！"));
      }
    );
  };
  // 上传前验证
  const beforeCheck = (file, fileList = []) => {
    if (otherProps.isCrop) {
      return new Promise(async (resolve) => {
        try {
          await checkAccept(file);
          await checkLimit(fileList);
          await checkSize(file);
          let rst = await lrz(file);
          resolve(rst.file);
        } catch (error) {
          throw Error(error);
        }
      });
    }
    const func = async () => {
      try {
        await checkAccept(file);
        await checkLimit(fileList);
        await checkSize(file);
        return true;
      } catch (error) {
        throw Error(error);
      }
    };
    const res = func().then((resp) => {
      return resp;
    });

    if (autoUpload) {
      return res;
    }
    return false;
  };

  // 抛出数值
  const handleChange = ({ file, fileList }) => {
    if (file.status === "error") {
      message.error("上传出错！");
    }
    if (file.status === "uploading") {
      setLoading(true);
    }

    if (file.status === "done") {
      setLoading(false);
    }

    if (onChange) {
      onChange(
        fileList?.map((v) => ({
          ...v,
          status: "done"
        }))
      );
    }
  };

  const uploadProps = {
    name: "file",
    ...otherProps,
    fileList: value,
    accept,
    showUploadList: false,
    beforeUpload: beforeCheck,
    onChange: handleChange,
    action: `${WebIM.conn.apiUrl}/${WebIM.conn.orgName}/${WebIM.conn.appName}/chatfiles`,
    onPreview: () => { }
  };
  return (
    <>
      {otherProps?.isCrop ? (
        <ImgCrop
          modalTitle={"上传头像"}
          modalWidth={960}
          modalHeight={572}
          modalCancel="取消"
          modalOk={<ConfirmBtn />}
          quality={1}
        >
          <Upload {...uploadProps}>
            {loading ? (
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  border: "1px solid #3a3a3a",
                  lineHeight: "100px"
                }}
              >
                上传中
                <LoadingOutlined />
              </div>
            ) : (
              children || <Button type="primary">选择文件</Button>
            )}
          </Upload>
          {extra && <div style={{ color: "#999" }}>{extra}</div>}
        </ImgCrop>
      ) : (
        <>
          <Upload customRequest={() => { }} {...uploadProps}>
            {children || <Button type="primary">选择文件</Button>}
          </Upload>
          {extra && <div style={{ color: "#999" }}>{extra}</div>}
        </>
      )}
    </>
  );
};

export default React.memo(UploadFile);
