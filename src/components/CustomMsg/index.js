import s from "./index.module.less";
import React, { memo } from "react";
import AvatarInfo from "../AvatarInfo";
import { CHAT_TYPE, INVITE_TYPE, ACCEPT_INVITE_TYPE } from "@/consts";
import WebIM from "@/utils/WebIM";
import { getConfirmModalConf, createMsg, deliverMsg, insertServerList } from "@/utils/common";
import { message as messageWarn, Modal } from "antd";
import InviteModal from "@/components/InviteModal";
import { connect } from "react-redux";
import { insertChannelList } from "@/utils/common"

const CustomMsg = (props) => {
  const { message, insertChatMessage, appUserInfo, setServerRole } = props;
  const isServerInvite = message.customEvent === INVITE_TYPE.inviteServer;
  const acceptInviteEvent =
    message.customEvent === ACCEPT_INVITE_TYPE.acceptInviteServer ||
    message.customEvent === ACCEPT_INVITE_TYPE.acceptInviteChannel;
  let acceptInfo = "";
  if (acceptInviteEvent) {
    if (message.customEvent === ACCEPT_INVITE_TYPE.acceptInviteServer) {
      acceptInfo = `已加入社区 ${message.customExts?.server_name}`;
    } else {
      acceptInfo = `已加入频道${message.customExts?.server_name}-#${message.customExts.channel_name}`;
    }
  }
  const channelName = isServerInvite
    ? ""
    : message.customExts?.channel_name || "";
  const inviteInfo = isServerInvite ? "邀请您加入社区" : "邀请您加入频道";
  const inviteMe = message.to === WebIM.conn.user;
  const confirmJoinServer = () => {
    if (isServerInvite) {
      WebIM.conn
        .acceptServerInvite({
          serverId: message.customExts?.server_id,
          inviter: message.from
        })
        .then((res) => {
          //插入数据
          insertServerList(message.customExts?.server_id);
          //发送消息
          let msg = createMsg({
            chatType: CHAT_TYPE.groupChat,
            type: "custom",
            to: res.data.defaultChannelId,
            customEvent: ACCEPT_INVITE_TYPE.acceptInviteServer,
            customExts: {
              server_name: message.customExts?.server_name
            }
          });
          deliverMsg(msg).then(() => {
            insertChatMessage({
              chatType: msg.chatType,
              fromId: msg.to,
              messageInfo: {
                list: [{ ...msg, from: WebIM.conn.user }]
              }
            });
            const serverId = message.customExts?.server_id || "";
            WebIM.conn.getServerRole({ serverId }).then((res) => {
              setServerRole({ serverId, role: res.data.role });
            });
          });
        })
        .catch((err) => {
          if (err.message === "User is already in server.") {
            messageWarn.warn({ content: "已经在社区了！" });
          } else {
            messageWarn.warn({ content: "加入失败，请重试！" });
          }
        });
    } else {
      WebIM.conn
        .acceptChannelInvite({
          serverId: message.customExts?.server_id,
          channelId: message.customExts?.channel_id,
          inviter: message.from
        })
        .then((res) => {
          //插入数据
          insertChannelList(message.customExts?.server_id, message.customExts?.channel_id, res.data);
          //发送消息
          let msg = createMsg({
            chatType: CHAT_TYPE.groupChat,
            type: "custom",
            to: message.customExts?.channel_id,
            customEvent: ACCEPT_INVITE_TYPE.acceptInviteChannel,
            customExts: {
              server_name: message.customExts?.server_name,
              channel_name: message.customExts?.channel_name
            }
          });
          deliverMsg(msg).then(() => {
            insertChatMessage({
              chatType: msg.chatType,
              fromId: msg.to,
              messageInfo: {
                list: [{ ...msg, from: WebIM.conn.user }]
              }
            });
          });
        })
        .catch((err) => {
          if (err.message === "User is already in channel.") {
            messageWarn.warn({ content: "已经在频道了！" });
          } else {
            messageWarn.warn({ content: "加入失败，请重试！" });
          }
        });
    }
  };
  const rejectJoin = () => {
    if (isServerInvite) {
      WebIM.conn.rejectServerInvite({
        serverId: message.customExts?.server_id,
        inviter: message.from
      });
    } else {
      WebIM.conn.rejectChannelInvite({
        serverId: message.customExts?.server_id,
        channelId: message.customExts?.channel_id,
        inviter: message.from
      });
    }
  }
  const joinServer = () => {
    if (inviteMe) {
      const conf = getConfirmModalConf({
        title: <div style={{ color: "#fff" }}>{inviteInfo}</div>,
        okText: "立即加入",
        cancelText: "暂不加入",
        content: (
          <InviteModal
            serverId={message.customExts?.server_id}
            isServerInvite={isServerInvite}
            channelName={channelName}
          />
        ),
        onOk: () => confirmJoinServer(),
        onCancel: () => rejectJoin()
      });
      Modal.confirm(conf);
    }
  };
  if (acceptInviteEvent) {
    return <div className={s.customCon}>{message.from === WebIM.conn.user ? "我" : appUserInfo[message.from]?.nickname || message.from}{acceptInfo}</div>;
  } else {
    return (
      <div className={s.main}>
        <div
          className={`${s.custom} ${inviteMe ? s.canHover : null}`}
          onClick={joinServer}
        >
          <div className={s.iconCon}>
            <AvatarInfo
              size={48}
              src={message.customExts?.icon}
              shape="square"
              isServer={true}
            />
          </div>
          <div className={s.infoCon}>
            <div className={s.inviteInfo}>{inviteInfo}</div>
            <div className={s.serverName}>
              {message.customExts?.server_name}
            </div>
            {!isServerInvite && (
              <div className={s.channelName}>
                #{message.customExts?.channel_name}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
};
const mapStateToProps = ({ app }) => {
  return {
    appUserInfo: app.appUserInfo
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    insertChatMessage: (params) => {
      return dispatch({
        type: "app/insertChatMessage",
        payload: params
      });
    },
    setServerRole: (params) => {
      return dispatch({
        type: "app/setServerRole",
        payload: params,
      })
    },
  };
};
export default memo(connect(mapStateToProps, mapDispatchToProps)(CustomMsg));
