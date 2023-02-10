import React, { memo, useRef, useState } from "react";
import s from "./index.module.less";
import { connect } from "react-redux";
import ChannelForm from "./index";
import Icon from "@/components/Icon";
import { Modal } from "antd";

const CreateChannel = ({ onClick, isEdit, len }) => {
  return (
    <div className={`${s.createBtn} circleBtn ${len === 0 ? "disable" : null}`} onClick={onClick}>
      {isEdit ? "编辑" : "创建"}
    </div>
  );
};

const Channel = (props) => {
  const { visible, setVisible } = props;
  const formRef = useRef();

  const isEdit = visible === "edit";

  const onOK = () => {
    formRef?.current.submit(
      () => {
        setVisible(false);
      },
      () => {
        setVisible(false);
      }
    );
  };
  const [name, setName] = useState("")
  const onChange = (name) => {
    setName(name)
  }

  return (
    <Modal
      width={546}
      title={isEdit ? "编辑频道" : "创建频道"}
      open={visible}
      destroyOnClose={true}
      closeIcon={<Icon name="xmark" color="#c7c7c7" size="16px" />}
      footer={<CreateChannel onClick={onOK} isEdit={isEdit} len={name.length} />}
      onCancel={() => {
        setVisible(false);
      }}
      className={s.channelFormModal}
    >
      <ChannelForm ref={formRef} isEdit={isEdit} onChange={onChange} />
    </Modal>
  );
};

const mapStateToProps = ({ channel }) => {
  return {
    visible: channel.channelVisible
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setVisible: (params) => {
      return dispatch({
        type: "channel/setChannelVisible",
        payload: params
      });
    }
  };
};

export default memo(connect(mapStateToProps, mapDispatchToProps)(Channel));
