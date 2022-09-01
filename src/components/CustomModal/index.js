import React, { memo } from "react";
import s from "./index.module.less";
import { Modal } from "antd";
import CloseIcon from "@/components/CloseIcon"

const CustomModal = (props) => {
  const { visible, onCancel, children, title } = props;
  return (
    <div className={s.modalWrap}>
      <Modal
        width="100%"
        style={{ top: 0 }}
        getContainer={false}
        title={title}
        visible={visible}
        mask={false}
        footer={false}
        destroyOnClose={true}
        onCancel={() => {
          onCancel();
        }}
        closeIcon={<CloseIcon />}
      >
        {children}
      </Modal>
    </div>
  );
};

export default memo(CustomModal);
