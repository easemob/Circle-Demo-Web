import React, { memo, useState } from "react";
import s from "./index.module.less";
import AvatarInfo from "@/components/AvatarInfo";
import { connect } from "react-redux";
import WebIM from "@/utils/WebIM";
import { Modal, message } from "antd";
import UploadImg from "@/components/UploadImg";
import Icon from "@/components/Icon";
import CloseIcon from "@/components/CloseIcon";
import { resetFrequentlyEmoji } from "@/utils/common";

const operationList = [
  {
    op: "userInfo",
    title: "个人资料",
    iconName: "person_normal"
  }
];

const SideBar = (props) => {
  const { userInfo, setUserInfo, appUserInfo, setAppUserInfo } = props;
  //退出登录
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    WebIM.conn.close();
    setIsModalVisible(false);
    resetFrequentlyEmoji();
    window.location.href = "/";
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  //修改头像
  const onChange = (url) => {
    WebIM.conn
      .updateUserInfo({ avatarurl: url })
      .then((res) => {
        setUserInfo(
          Object.assign({ ...userInfo }, { avatarurl: res.data.avatarurl })
        );
        setAppUserInfo({
          ...appUserInfo,
          [userInfo.username]: {
            ...appUserInfo[userInfo.username],
            ...res.data
          }
        });
      })
      .catch((e) => {
        message.warn({ content: "头像修改失败，请重试！" });
      });
  };
  return (
    <div className={s.sideBarWrap}>
      <div className={s.info}>
        <div className={s.avatar}>
          <UploadImg
            update={onChange}
            innerNode={
              <div>
                <AvatarInfo size={90} src={userInfo.avatarurl} />
                <div className={s.cover}></div>
                <span className={s.edit}>
                  <Icon name="pencil" size="32px" color="#fff" />
                </span>
              </div>
            }
          ></UploadImg>
        </div>
        <span className={s.nickname}>
          {userInfo.nickname || userInfo.username}
        </span>
        <span className={s.uid}>环信ID：{userInfo.username}</span>
        <div className={s.operationList}>
          {operationList.length > 0 &&
            operationList.map((item) => {
              return (
                <div className={s.operationItem} key={item}>
                  <span className={`${s[item.op]}`}>
                    <Icon name={item.iconName} size="24px" />
                  </span>
                  <span className={s.text}>{item.title}</span>
                </div>
              );
            })}
        </div>
      </div>
      <div className={s.logout} onClick={showModal}>
        <span className={s.logoutIcon}>
          <Icon name="door" size="22px" />
        </span>
        <span className={s.logoutText}>退出登录</span>
      </div>
      <Modal
        className={`logoutModal`}
        title="退出登录"
        width={546}
        destroyOnClose={true}
        maskClosable={false}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        closeIcon={<CloseIcon />}
      >
        <div className={s.logoutCon}>
          <span className={s.content}>确认退出吗？下次见哦！</span>
          <div className={s.buttons}>
            <div
              className={`circleBtn106 circleBtnGray`}
              onClick={handleCancel}
            >
              取消
            </div>
            <div
              className={`circleBtn106 circleBtn ${s.confirm}`}
              onClick={handleOk}
            >
              确认
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
const mapStateToProps = ({ app }) => {
  return {
    userInfo: app.userInfo,
    appUserInfo: app.appUserInfo
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setUserInfo: (params) => {
      return dispatch({
        type: "app/setUserInfo",
        payload: params
      });
    },
    setAppUserInfo: (params) => {
      return dispatch({
        type: "app/setAppUserInfo",
        payload: params
      });
    }
  };
};
export default memo(connect(mapStateToProps, mapDispatchToProps)(SideBar));
