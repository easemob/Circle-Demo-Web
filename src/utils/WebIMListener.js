import WebIM from "./WebIM";
import store from "../store";
import {
  getUsersInfo,
  getMessageFromId,
  getConfirmModalConf,
  insertServerList,
  insertChannelList,
  addLocalThread
} from "@/utils/common";
import { message, Modal } from "antd";
import InviteModal from "@/components/InviteModal";
import {
  updateServerDetail,
  createMsg,
  deliverMsg,
  updateLocalChannelDetail,
  deleteLocalChannel
} from "./common";
import {
  MULTI_DEVICE_EVENT,
  CHAT_TYPE,
  ACCEPT_INVITE_TYPE,
  CHANNEL_EVENT,
  REACTION_TYPE
} from "@/consts";

const { dispatch, getState } = store;
export default function initListener() {
  //登录登出
  WebIM.conn.addEventHandler("login", {
    onConnected: () => {
      console.log("登录");
      dispatch.app.setLoginSuccess(true);
    },
    onDisconnected: () => {
      console.log("登出");
      dispatch.app.setLoginSuccess(false);
    }
  });
  //联系人相关事件
  WebIM.conn.addEventHandler("contacts", {
    //收到好友申请
    onContactInvited: (msg) => {
      const applyList = getState().contact.applyInfo;
      const allList = getState().contact.contactsList;
      if (allList.indexOf(msg.from) < 0 && applyList.indexOf(msg.from) < 0) {
        getUsersInfo([msg.from]);
        dispatch.contact.setApplyInfo([...applyList, msg.from]);
      }
    },
    //同意好友申请
    onContactAdded: (msg) => {
      let applyList = getState().contact.applyInfo;
      const index = applyList.indexOf(msg.from);
      if (index > -1) {
        applyList.splice(index, 1);
        dispatch.contact.setApplyInfo(applyList);
      }
      const allList = getState().contact.contactsList;
      if (allList.indexOf(msg.from) < 0) {
        allList.push(msg.from);
        dispatch.contact.setContactsList(allList);
      }
    },
    //发送的好友申请被同意
    onContactAgreed: (msg) => {
      //加入好友列表
      const allList = getState().contact.contactsList;
      const contactIndex = allList.indexOf(msg.from);
      if (contactIndex < 0) {
        getUsersInfo([msg.from]);
        allList.push(msg.from);
        dispatch.contact.setContactsList(allList);
      }
      //删除本地存储的已发送请求记录
      const hasSentApply = getState().contact.hasSentApply;
      const sentIndex = hasSentApply.indexOf(msg.from);
      if (sentIndex > -1) {
        hasSentApply.splice(sentIndex, 1);
        dispatch.contact.setHasSentApply(...[hasSentApply]);
      }
    },
    //删除好友、被好友删除
    onContactDeleted: (msg) => {
      const allList = getState().contact.contactsList;
      const index = allList.indexOf(msg.from);
      if (index > -1) {
        allList.splice(index, 1);
        dispatch.contact.setContactsList(allList);
        WebIM.conn.unsubscribePresence({ usernames: [msg.from] });
      }
    }
    //拒绝好友申请-无事件触发，暂不处理
    //发送好友申请被拒绝-不处理
  });
  //在线离线状态
  WebIM.conn.addEventHandler("presence", {
    //好友在线状态
    onPresenceStatusChange: (msg) => {
      msg.length > 0 &&
        msg.forEach((presenceInfo) => {
          const appUserInfo = getState().app.appUserInfo;
          if (appUserInfo[presenceInfo.userId]) {
            const detailList = presenceInfo.statusDetails;
            let isOnline = 0;
            detailList.forEach((item) => {
              if (item.status === 1) {
                isOnline = 1;
              }
            });
            appUserInfo[presenceInfo.userId].online = isOnline;
            dispatch.app.setAppUserInfo({ ...appUserInfo });
          }
        });
    }
  });
  //channel事件
  WebIM.conn.addEventHandler("channelEvent", {
    onChannelEvent: (e) => {
      const { operator, operation, id, name, to, serverInfo } = e;
      switch (operation) {
        case CHANNEL_EVENT.destroy:
          dispatch.server.setChannelEvent({
            event: CHANNEL_EVENT.destroy,
            data: e
          });
          deleteLocalChannel(serverInfo.id, id,true);
          break;
        case CHANNEL_EVENT.update:
          updateLocalChannelDetail("notify", serverInfo.id, e);
          break;
        case CHANNEL_EVENT.removed:
          dispatch.server.setChannelEvent({
            event: CHANNEL_EVENT.removed,
            data: e
          });
          deleteLocalChannel(serverInfo.id, id);
          break;
        case CHANNEL_EVENT.inviteToJoin:
          const conf = getConfirmModalConf({
            title: <div style={{ color: "#fff" }}>邀请加入频道</div>,
            okText: "加入频道",
            cancelText: "暂不加入",
            content: (
              <InviteModal
                serverId={serverInfo.id}
                isServerInvite={false}
                channelName={name}
              />
            ),
            onOk: () => {
              WebIM.conn
                .acceptChannelInvite({
                  serverId: serverInfo.id,
                  channelId: id,
                  inviter: operator
                })
                .then(() => {
                  //插入数据
                  insertChannelList(serverInfo.id, id);
                  //发送消息
                  let msg = createMsg({
                    chatType: CHAT_TYPE.groupChat,
                    type: "custom",
                    to: id,
                    customEvent: ACCEPT_INVITE_TYPE.acceptInviteChannel,
                    customExts: {
                      server_name: name,
                      channel_name: name
                    }
                  });
                  deliverMsg(msg).then(() => {
                    dispatch.app.insertChatMessage({
                      chatType: msg.chatType,
                      fromId: msg.to,
                      messageInfo: {
                        list: [{ ...msg, from: WebIM.conn.user }]
                      }
                    });
                  });
                });
            },
            onCancel: () => {
              WebIM.conn.rejectChannelInvite({
                serverId: serverInfo.id,
                channelId: id,
                inviter: operator
              });
            }
          });
          Modal.confirm(conf);
          break;
        case CHANNEL_EVENT.memberPresence:
          message.success(`${operator}加入频道`);
          break;
        case CHANNEL_EVENT.memberAbsence:
          // 有用户离开频道
          let hasFlag = getState().channel.channelUserMap.has(id);
          if (hasFlag) {
            let dt = getState().channel.channelUserMap.get(id);
            const list = dt?.list || [];
            const findIndex = list.findIndex((item) => operator === item.uid);
            if (findIndex > -1) {
              list.splice(findIndex, 1);
              dispatch.channel.setChannelUserMap({
                id,
                userListInfo: {
                  ...dt,
                  list
                }
              });
            }
          }
          break;
        case CHANNEL_EVENT.muteMember:
          let isHas = getState().channel.channelUserMap.has(id);
          if (isHas) {
            let dt = getState().channel.channelUserMap.get(id);
            dispatch.channel.setChannelUserMap({
              channelId: id,
              userListInfo: {
                ...dt,
                muteList: dt.muteList?.length
                  ? [
                      ...dt.muteList,
                      {
                        userId: to
                      }
                    ]
                  : [{ userId: to }]
              }
            });
          }
          break;
        case CHANNEL_EVENT.unmuteMember:
          let isDt = getState().channel.channelUserMap.has(id);
          if (isDt) {
            let dt = getState().channel.channelUserMap.get(id);
            let muteList = [];
            if (dt.muteList?.length) {
              muteList = dt.muteList;
              let idx = muteList.findIndex((item) => {
                return item.userId === to;
              });
              muteList.splice(idx, 1);
            }
            dispatch.channel.setChannelUserMap({
              channelId: id,
              userListInfo: {
                ...dt,
                muteList
              }
            });
          }
          break;
        case CHANNEL_EVENT.rejectInvite:
          message.info(`${operator}拒绝了您的频道邀请`);
          break;
        case CHANNEL_EVENT.acceptInvite:
          console.log(`${operator}接受了您的频道邀请`);
          break;
        default:
          break;
      }
    }
  });
  //server事件
  WebIM.conn.addEventHandler("serverEvent", {
    onServerEvent: (e) => {
      const { serverId, operator, name } = e;
      switch (e.operation) {
        case "update":
          updateServerDetail("notify", e);
          break;
        case "destroy":
          dispatch.server.setServerMultiDeviceEvent({
            event: "serverDestroy",
            data: e
          });
          break;
        case "acceptInvite":
          //接受邀请者在群里发消息
          break;
        case "refuseInvite":
          message.info(`${e.operator}拒绝了您的社区邀请`);
          break;
        case "inviteToJoin":
          const conf = getConfirmModalConf({
            title: <div style={{ color: "#fff" }}>邀请加入社区</div>,
            okText: "加入社区",
            cancelText: "暂不加入",
            content: <InviteModal serverId={serverId} isServerInvite={true} />,
            onOk: () => {
              WebIM.conn
                .acceptServerInvite({
                  serverId,
                  inviter: operator
                })
                .then((res) => {
                  //插入数据
                  insertServerList(serverId);
                  //发送消息
                  let msg = createMsg({
                    chatType: CHAT_TYPE.groupChat,
                    type: "custom",
                    to: res.data.defaultChannelId,
                    customEvent: ACCEPT_INVITE_TYPE.acceptInviteServer,
                    customExts: {
                      server_name: name
                    }
                  });
                  deliverMsg(msg).then(() => {
                    dispatch.app.insertChatMessage({
                      chatType: msg.chatType,
                      fromId: msg.to,
                      messageInfo: {
                        list: [{ ...msg, from: WebIM.conn.user }]
                      }
                    });
                    WebIM.conn.getServerRole({ serverId }).then((res) => {
                      dispatch.app.setServerRole({
                        serverId,
                        role: res.data.role
                      });
                    });
                  });
                });
            },
            onCancel: () => {
              WebIM.conn.rejectServerInvite({
                serverId,
                inviter: operator
              });
            }
          });
          Modal.confirm(conf);
          break;
        case "removed":
          dispatch.server.setServerMultiDeviceEvent({
            event: "serverRemoved",
            data: e
          });
          break;
        case "updateRole":
          if (e.userId === WebIM.conn.user) {
            dispatch.app.updateServerRole({
              serverId,
              role: e.role
            });
          }
          break;
        default:
          break;
      }
    }
  });
  // 多设备事件
  WebIM.conn.addEventHandler("multiDeviceEvent", {
    onMultiDeviceEvent: (e) => {
      const { operation } = e;
      switch (operation) {
        case MULTI_DEVICE_EVENT.serverUpdate:
          updateServerDetail("notify", e);
          break;
        case MULTI_DEVICE_EVENT.serverCreate:
          dispatch.server.setServerMultiDeviceEvent({
            event: "serverCreate",
            data: e
          });
          break;
        case MULTI_DEVICE_EVENT.serverDestroy:
          dispatch.server.setServerMultiDeviceEvent({
            event: "serverDestroy",
            data: e
          });
          break;
        case MULTI_DEVICE_EVENT.serverJoin:
          dispatch.server.setServerMultiDeviceEvent({
            event: "serverJoin",
            data: e
          });
          break;
        case MULTI_DEVICE_EVENT.serverLeave:
          dispatch.server.setServerMultiDeviceEvent({
            event: "serverLeave",
            data: e
          });
          break;
        case MULTI_DEVICE_EVENT.serverRemoveMember:
          dispatch.server.setServerMultiDeviceEvent({
            event: "serverRemoveMember",
            data: e
          });
          break;
        case MULTI_DEVICE_EVENT.serverAcceptInvite:
          Modal.destroyAll();
          break;
        case MULTI_DEVICE_EVENT.serverRefuseInvite:
          Modal.destroyAll();
          break;
        case MULTI_DEVICE_EVENT.serverSetRole:
          //todo
          break;

        case MULTI_DEVICE_EVENT.channelCreate:
          insertChannelList(e.serverInfo.id, e.id);
          break;
        case MULTI_DEVICE_EVENT.channelDestroy:
          deleteLocalChannel(e.serverInfo.id, e.id, true);
          break;
        case MULTI_DEVICE_EVENT.channelJoin:
          insertChannelList(e.serverInfo.id, e.id);
          break;
        case MULTI_DEVICE_EVENT.channelUpdate:
          updateLocalChannelDetail("notify", e.serverInfo.id, e);
          break;
        case MULTI_DEVICE_EVENT.channelLeave:
          deleteLocalChannel(e.serverInfo.id, e.id);
          break;
        case MULTI_DEVICE_EVENT.channelAcceptInvite:
          Modal.destroyAll();
          insertChannelList(e.serverInfo.id, e.id);
          break;
        case MULTI_DEVICE_EVENT.channelRejectInvite:
          Modal.destroyAll();
          break;
        case MULTI_DEVICE_EVENT.channelMuteMember:
          //广播事件，channel通知部分已处理
          break;
        case MULTI_DEVICE_EVENT.channelUnMuteMember:
          //广播事件，channel通知部分已处理
          break;

        case MULTI_DEVICE_EVENT.chatThreadCreate:
          //多端多设备，thread创建后会广播信息，在thread监听中操作左侧列表插入数据，不再处理此事件
          break;
        case MULTI_DEVICE_EVENT.chatThreadDestroy:
          //删除thread 退出路由
          dispatch.thread.setDeleteThreadEvent({
            event: "chatThreadDestroy",
            parentId: e.parentId,
            threadId: e.chatThreadId
          });
          break;
        case MULTI_DEVICE_EVENT.chatThreadLeave:
          //离开thread 退出路由
          dispatch.thread.setDeleteThreadEvent({
            event: "chatThreadLeave",
            parentId: e.parentId,
            threadId: e.chatThreadId
          });
          break;
        default:
          break;
      }
    }
  });
  //消息事件
  WebIM.conn.addEventHandler("messageEvent", {
    onTextMessage: (message) => {
      const fromId = getMessageFromId(message);
      if (message.chatThread) {
        dispatch.thread.setThreadMessage({
          message,
          fromId
        });
      } else {
        dispatch.app.insertChatMessage({
          chatType: message.chatType,
          fromId,
          messageInfo: {
            list: [message]
          }
        });
      }
    },
    onReactionChange: ({ messageId, reactions }) => {
      try {
        const reactionMap = getState().app.reactionMap;
        const hasMsgReactions = reactionMap.has(messageId);
        const currentReaction = hasMsgReactions
          ? [...(reactionMap.get(messageId) || [])]
          : [];
        let list = [];
        // 获取当前操作的reaction
        let opItem = reactions.filter((item) => {
          return item.op;
        })[0];
        // 获取当前reaction数组下标
        let idx = currentReaction.findIndex(
          (item) => item.reaction === opItem.reaction
        );
        let isAddedBySelf;
        // 记录当前 isAddedBySelf
        if (idx > -1) {
          isAddedBySelf = currentReaction[idx].isAddedBySelf;
        }
        // 如果操作人是自己，则更新isAddedBySelf
        if (opItem.op[0].operator === WebIM.conn.user) {
          isAddedBySelf =
            opItem.op[0].reactionType === REACTION_TYPE.create ? true : false;
        }

        if (hasMsgReactions) {
          if (idx > -1) {
            currentReaction[idx] = {
              ...opItem,
              isAddedBySelf
            };
          } else {
            currentReaction.push({
              ...opItem,
              isAddedBySelf
            });
          }
        } else {
          list = reactions.map((item) => {
            let isAddedBySelf = false;
            let op = item.op;
            if (op && op[0].operator === WebIM.conn.user) {
              if (op[0].reactionType === REACTION_TYPE.create) {
                isAddedBySelf = true;
              }
            }
            return {
              ...item,
              isAddedBySelf
            };
          });
        }
        dispatch.app.updateMsgReaction({
          msgId: messageId,
          reactions: hasMsgReactions || idx > -1 ? currentReaction : list
        });
      } catch (error) {
        console.log(error, "error");
      }
    },
    onImageMessage: (message) => {
      if (message.chatThread) {
        dispatch.thread.setThreadMessage({
          message,
          fromId: getMessageFromId(message)
        });
      } else {
        dispatch.app.insertChatMessage({
          chatType: message.chatType,
          fromId: getMessageFromId(message),
          messageInfo: {
            list: [message]
          }
        });
      }
    },
    onFileMessage: (message) => {
      if (message.chatThread) {
        dispatch.thread.setThreadMessage({
          message,
          fromId: getMessageFromId(message)
        });
      } else {
        dispatch.app.insertChatMessage({
          chatType: message.chatType,
          fromId: getMessageFromId(message),
          messageInfo: {
            list: [message]
          }
        });
      }
    },
    onRecallMessage: (message) => {
      dispatch.app.setDeleteMessage({
        id: message.mid,
        fromId: message.to,
        operator: message.from
      });
      dispatch.thread.setDeleteMessage({
        id: message.mid,
        fromId: message.to
      });
    },
    onCustomMessage: (message) => {
      dispatch.app.insertChatMessage({
        chatType: message.chatType,
        fromId: getMessageFromId(message),
        messageInfo: {
          list: [message]
        }
      });
    }
  });
  //thread事件 'create' | 'update' | 'destroy' | 'userRemove'
  WebIM.conn.addEventHandler("threadEvent", {
    onChatThreadChange: (msg) => {
      switch (msg.operation) {
        //需要特殊处理的操作
        case "create":
          //新创建thread
          WebIM.conn
            .getChatThreadDetail({ chatThreadId: msg.id })
            .then((res) => {
              addLocalThread(msg.parentId, res.data);
            });
          break;
        case "destroy":
          //删除thread 退出路由
          dispatch.thread.setDeleteThreadEvent({
            event: "destroy",
            parentId: msg.parentId,
            threadId: msg.id
          });
          break;
        case "userRemove":
          //删除thread 退出路由
          dispatch.thread.setDeleteThreadEvent({
            event: "userRemove",
            parentId: msg.parentId,
            threadId: msg.id
          });
          break;
        default:
          break;
      }
      //更新聊天信息
      dispatch.app.updateChatThreadMessage({
        chatType: "groupChat",
        fromId: msg.parentId,
        updateInfo: msg
      });
      //更新当前currentInfo
      dispatch.thread.updateThreadInfo({
        fromId: msg.parentId,
        updateInfo: msg
      });
      //更新channel列表中threadInfo
      dispatch.channel.updateChannelThreadInfo({
        updateInfo: msg
      });
    }
  });
}
