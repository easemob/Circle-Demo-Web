import React, { memo, useRef } from "react";
import s from "./index.module.less";
import { connect } from "react-redux";
import ServerForm from "./index";
import { Modal, Button } from "antd";
import { SERVER_OPT_TYPE } from "@/consts";
import CloseIcon from "@/components/CloseIcon";
import { useState } from "react";

const CreateServer = ({ onClick, isEdit, hasEdit }) => {
  return (
    <Button
      className={`${s.createBtn} circleBtn ${!hasEdit ? "disable" : null}`}
      onClick={onClick}
    >
      {isEdit ? "保存" : "创建"}
    </Button>
  );
};

const Server = (props) => {
  const { visible, setVisible } = props;
  const [hasEdit, setHasEdit] = useState(false);

  const isEdit = visible === SERVER_OPT_TYPE.edit;

  const formRef = useRef();

  const onOk = () => {
    if (!hasEdit) { return }
    formRef?.current.submit(
      () => {
        setVisible(false);
      },
      () => {
        setVisible(false);
      }
    );
  };

  //编辑
  const fieldsChange = () => {
    setHasEdit(true)
  }

  return (
    <Modal
      width={544}
      title={isEdit ? "编辑社区" : "新建社区"}
      visible={visible}
      centered
      destroyOnClose={true}
      footer={<CreateServer isEdit={isEdit} onClick={onOk} hasEdit={hasEdit} />}
      closeIcon={<CloseIcon />}
      onCancel={() => {
        setVisible(false);
      }}
      className={s.serverFormModal}
    >
      <ServerForm isEdit={isEdit} ref={formRef} onchange={fieldsChange} />
    </Modal>
  );
};

const mapStateToProps = ({ app }) => {
  return {
    visible: app.serverFormVisible
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setVisible: (params) => {
      return dispatch({
        type: "app/setVisible",
        payload: params
      });
    }
  };
};

export default memo(connect(mapStateToProps, mapDispatchToProps)(Server));
