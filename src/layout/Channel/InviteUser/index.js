import React, { memo, useEffect, useState, useCallback } from "react";
import s from "./index.module.less";
import { connect } from "react-redux";
import { Modal, Input, message } from "antd";
import MemberItem from "@/components/MemberItem";
import WebIM from "@/utils/WebIM";
import { getUsersInfo, createMsg, deliverMsg } from "@/utils/common";
import Icon from "@/components/Icon";
import { useParams } from "react-router-dom";
import { CHAT_TYPE, INVITE_TYPE } from "@/consts";

const invite = ({ serverId, uid, onSend, channelId, type }) => {
  if (type === INVITE_TYPE.inviteServer) {
    WebIM.conn
      .inviteUserToServer({
        serverId,
        userId: uid
      })
      .then(() => {
        onSend();
        message.success("邀请已发送");
      })
      .catch((e) => {
        if (e.message === "User is already in server.") {
          message.info("用户已加入社区");
        }
      });
  } else {
    WebIM.conn
      .inviteUserToChannel({
        serverId,
        channelId,
        userId: uid,
        inviteMessage: "welcome"
      })
      .then(() => {
        onSend();
        message.success("邀请已发送");
      })
      .catch((e) => {
        if (e.message === "User is already in channel.") {
          message.info("用户已加入频道");
        }
      });
  }
};

const InviteBtn = ({ isInvite, uid, serverId, onSend, type, channelId }) => {
  return (
    <div>
      {isInvite ? (
        <div className={s.invited}>已发送</div>
      ) : (
        <div
          className={`${s.inviteBtn} circleBtn`}
          onClick={() => {
            invite({ serverId, channelId, uid, onSend, type });
          }}
        >
          邀请
        </div>
      )}
    </div>
  );
};

const InviteUser = (props) => {
  const {
    visible,
    setVisible,
    serverName = "",
    channelName = "",
    contactsList,
    setContactsList,
    appUserInfo,
    serverList,
    insertChatMessage
  } = props;
  const [contactMap, setContactMap] = useState({});

  const { serverId, channelId } = useParams();

  const [searchValue, setSearchValue] = useState("");

  const isInviteServer = visible === INVITE_TYPE.inviteServer;

  const onSend = (uid, channelName, visible) => {
    contactMap[uid].isInvite = true;
    setContactMap({ ...contactMap });
    let msg = {};
    if (isInviteServer) {
      const serverInfo = serverList.find((item) => item.id === serverId);
      msg = createMsg({
        chatType: CHAT_TYPE.single,
        type: "custom",
        to: uid,
        customEvent: INVITE_TYPE.inviteServer,
        customExts: {
          server_id: serverInfo.id,
          server_name: serverInfo.name,
          icon: serverInfo.icon,
          desc: serverInfo.description
        }
      });
    } else {
      const serverInfo = serverList.find((item) => item.id === serverId);
      msg = createMsg({
        chatType: CHAT_TYPE.single,
        type: "custom",
        to: uid,
        customEvent: INVITE_TYPE.inviteChannel,
        customExts: {
          server_id: serverInfo.id,
          server_name: serverInfo.name,
          icon: serverInfo.icon,
          desc: serverInfo.description,
          channel_id: channelId,
          channel_name: channelName
        }
      });
    }
    deliverMsg(msg).then(() => {
      insertChatMessage({
        chatType: msg.chatType,
        fromId: uid,
        messageInfo: {
          list: [{ ...msg, from: WebIM.conn.user }]
        }
      });
    });
  };

  const getContacts = useCallback(() => {
    let dt = {};
    if (!contactsList.length) {
      WebIM.conn.getContacts().then((res) => {
        if (res.data.length > 0) {
          getUsersInfo(res.data);
          setContactsList(res.data);
          res.data.forEach((item) => {
            dt[item] = {
              isInvite: false,
              uid: item
            };
          });
        }
      });
    } else {
      contactsList.forEach((item) => {
        dt[item] = {
          isInvite: false,
          uid: item
        };
      });
    }
    setContactMap(dt);
  }, [contactsList, setContactsList]);

  useEffect(() => {
    if (visible) {
      getContacts();
    }
  }, [visible, getContacts]);

  return (
    <Modal
      width={544}
      className={`${s.inviteModal}`}
      title={
        isInviteServer
          ? `邀请好友加入社区  ${serverName}`
          : `邀请好友加入  ${serverName} - ${channelName}频道`
      }
      visible={visible}
      footer={null}
      closeIcon={<Icon name="xmark" color="#c7c7c7" size="16px" />}
      destroyOnClose={true}
      onCancel={() => {
        setSearchValue("");
        setVisible(false);
      }}
    >
      <div className={`${s.iptWrap}`}>
        <Icon name="magnify" color="#999" />
        <Input
          value={searchValue}
          placeholder="搜索好友"
          autoComplete="off"
          onInput={(e) => {
            setSearchValue(e.target.value);
          }}
        />
      </div>
      {Object.values(contactMap).length > 0 ? (
        Object.values(contactMap)
          .filter((filterItem) => {
            let userInfo = appUserInfo[filterItem.uid];
            return (
              userInfo?.uid.includes(searchValue) ||
              userInfo?.nickname.includes(searchValue)
            );
          })
          .map((item) => {
            return (
              <MemberItem
                style={{ padding: 0 }}
                info={appUserInfo[item.uid]}
                uid={item.uid}
                key={item.uid}
                operationReactNode={
                  <InviteBtn
                    {...item}
                    type={visible}
                    serverId={serverId}
                    channelId={channelId}
                    onSend={() => {
                      onSend(item.uid, channelName, visible);
                    }}
                  />
                }
              />
            );
          })
      ) : (
        <div className={s.empty}>您还没有好友</div>
      )}
    </Modal>
  );
};

const mapStateToProps = ({ channel, app, contact, server }) => {
  return {
    visible: channel.inviteVisible,
    appUserInfo: app.appUserInfo,
    applyInfo: contact.applyInfo,
    contactsList: contact.contactsList,
    serverList: server.joinedServerInfo.list || []
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setVisible: (params) => {
      return dispatch({
        type: "channel/setInviteVisible",
        payload: params
      });
    },
    setContactsList: (params) => {
      return dispatch({
        type: "contact/setContactsList",
        payload: params
      });
    },
    insertChatMessage: (params) => {
      return dispatch({
        type: "app/insertChatMessage",
        payload: params
      });
    }
  };
};

export default memo(connect(mapStateToProps, mapDispatchToProps)(InviteUser));
