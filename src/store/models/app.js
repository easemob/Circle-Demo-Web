import { CHAT_TYPE } from "@/consts";
import WebIM from "@/utils/WebIM";
/**
 *
 * state状态
 * @typedef {Object} AppState
 * @description 应用本身使用的redux state
 * @property {boolean} serverFormVisible: 新建编辑社区弹窗
 */

const App = {
  state: {
    isOnline: true,//在线状态
    serverFormVisible: false,
    isLogging: false,
    loginSuccess: false,
    selectedTab: "",
    userInfo: null, //当前用户信息
    appUserInfo: {}, //app下用户的信息
    chatMap: {
      [CHAT_TYPE.groupChat]: new Map(),
      [CHAT_TYPE.single]: new Map()
    },
    //在server下的角色
    serverRole: {},
    reactionMap: new Map(), // reaction Map
    currentChannelInfo: {},
    currentChatInfo: {}, //当前聊天对象的信息{chatType:"singleChat" "groupChat"  id:string}
    serverChannelMap: {},//server下channel映射关系及未读消息数(单独处理)
  },
  reducers: {
    /**
     * @description 更新state
     * @param state: 当前state
     * @param payload: 更新state对象
     */
    updateState(state, payload) {
      return {
        ...state,
        ...payload
      };
    },
    updateUserInfo(state, payload) {
      return {
        ...state,
        ...payload
      };
    },
    // 拉取历史消息插数据
    pushMessage(state, { chatType, fromId, messageInfo, reset }) {
      let ls = [];
      if (!reset && state.chatMap[chatType].has(fromId)) {
        ls = [
          ...state.chatMap[chatType].get(fromId)?.list,
          ...messageInfo?.list
        ];
      } else {
        ls = messageInfo?.list;
      }
      return {
        ...state,
        chatMap: {
          ...state.chatMap,
          [chatType]: new Map([
            ...state.chatMap[chatType],
            ...new Map().set(fromId, {
              ...messageInfo,
              list: ls
            })
          ])
        }
      };
    },
    // 发送消息收到消息头部插入数据
    insertMessage(state, { chatType, fromId, messageInfo }) {
      let ls = [];
      const dt = state.chatMap[chatType].get(fromId);
      if (state.chatMap[chatType].has(fromId) && dt?.list) {
        ls = [...messageInfo?.list, ...dt?.list];
      } else {
        ls = messageInfo?.list;
      }
      return {
        ...state,
        chatMap: {
          ...state.chatMap,
          [chatType]: new Map([
            ...state.chatMap[chatType],
            ...new Map().set(fromId, {
              ...dt,
              ...messageInfo,
              list: ls
            })
          ])
        }
      };
    },
    //本地发送的消息状态更新，发送成功时消息id修改为serverId
    updateChatMessageIdMid(state, { id, mid, to, status }) {
      if (to === state.currentChatInfo.id) {
        const chatType = state.currentChatInfo.chatType
        const dt = state.chatMap[chatType].get(to)
        if (state.chatMap[chatType].has(to)) {
          const ls = dt?.list || [];
          const findIndex = ls.findIndex(item => item.id === id);
          if (findIndex > -1) {
            const newMsg = { ...ls[findIndex], ...{ status, id: mid || id } }
            ls.splice(findIndex, 1, newMsg);
            return {
              ...state,
              chatMap: {
                ...state.chatMap,
                [chatType]: new Map([
                  ...state.chatMap[chatType],
                  ...new Map().set(to, {
                    ...dt,
                    list: ls
                  })
                ])
              }
            }
          }
        }
      }
      return state
    },
    //本地发送的附件消息上传成功后url更新
    changeChatMessageUrl(state, { id, to, url }) {
      if (to === state.currentChatInfo.id) {
        const chatType = state.currentChatInfo.chatType
        const dt = state.chatMap[chatType].get(to)
        if (state.chatMap[chatType].has(to)) {
          const ls = dt?.list || [];
          const findIndex = ls.findIndex(item => item.localId && item.localId === id);
          if (findIndex > -1) {
            const newMsg = { ...ls[findIndex], url }
            ls.splice(findIndex, 1, newMsg);
            return {
              ...state,
              chatMap: {
                ...state.chatMap,
                [chatType]: new Map([
                  ...state.chatMap[chatType],
                  ...new Map().set(to, {
                    ...dt,
                    list: ls
                  })
                ])
              }
            }
          }
        }
      }
      return state
    },
    //更新已读，未读
    updateUnReadNum(state, { chatType, fromId, number, message = {} }) {
      if (state.currentChatInfo.chatType === chatType && state.currentChatInfo.id === fromId) {
        if (chatType === CHAT_TYPE.single) {
          //清空未读消息
          let msg = WebIM.message.create({
            chatType: CHAT_TYPE.single,
            type: "channel",
            to: fromId
          });
          WebIM.conn.send(msg);
        }
        //当前聊天 拉取历史消息后会重置未读消息为0
        return state;
      }
      let dt = {};
      if (chatType && state.chatMap[chatType].has(fromId)) {
        dt = state.chatMap[chatType].get(fromId);
      }
      let unReadNum = number === "reset" ? 0 : dt.unReadNum && message.onlineState === 1 ? dt.unReadNum + number : number;
      if (chatType === CHAT_TYPE.groupChat) {
        //channel server 未读消息数单独处理
        const info = { ...state.serverChannelMap };
        let sId = ""
        Object.keys(info).forEach(item => {
          const channelInfo = info[item];
          if (Object.keys(channelInfo).indexOf(fromId) > -1) {
            sId = item
          }
        })
        const map = { ...state.serverChannelMap };
        map[sId][fromId] = map[sId][fromId]+unReadNum;
        state = {
          ...state,
          serverChannelMap: map
        }
        return state;
      }
      return {
        ...state,
        chatMap: {
          ...state.chatMap,
          [chatType]: new Map([
            ...state.chatMap[chatType],
            ...new Map().set(fromId, {
              ...dt,
              unReadNum
            })
          ])
        }
      };
    },
    deleteMessage(state, { chatType, fromId, id, operator }) {
      if (!chatType) {
        //其他人撤回消息
        chatType =
          fromId === WebIM.conn.user ? CHAT_TYPE.single : CHAT_TYPE.groupChat;
        if (chatType === CHAT_TYPE.single) {
          fromId = operator;
        }
      }
      const dt = state.chatMap[chatType].get(fromId);
      if (state.chatMap[chatType].has(fromId)) {
        let ls = [...state.chatMap[chatType].get(fromId)?.list];
        const idx = ls.findIndex((item) => {
          return item.id === id;
        });
        if (idx > -1) {
          const newMessage = {
            ...ls[idx],
            type: "recall",
            msg: "撤回了一条消息"
          };
          ls.splice(idx, 1, newMessage);
          return {
            ...state,
            chatMap: {
              ...state.chatMap,
              [chatType]: new Map([
                ...state.chatMap[chatType],
                ...new Map().set(fromId, {
                  ...dt,
                  list: ls
                })
              ])
            }
          };
        }
      }
      return state;
    },
    //删除未发送成功的本地消息
    deleteLocalMessage(state, { id, fromId, chatType }) {
      const dt = state.chatMap[chatType].get(fromId);
      if (state.chatMap[chatType].has(fromId)) {
        let ls = [...dt?.list];
        const idx = ls.findIndex((item) => {
          return item.id === id;
        });
        if (idx > -1) {
          ls.splice(idx, 1);
          return {
            ...state,
            chatMap: {
              ...state.chatMap,
              [chatType]: new Map([
                ...state.chatMap[chatType],
                ...new Map().set(fromId, {
                  ...dt,
                  list: ls
                })
              ])
            }
          };
        }
      }
      return state;
    },
    //更新channel消息的thread信息
    updateChatMessage(state, { chatType, fromId, updateInfo }) {
      const { operation, messageId } = updateInfo;
      let updateOverview = {};
      if (operation === "userRemove" || operation === "destroy") {
        updateOverview = undefined;
      } else if (operation === "create" || operation === "update") {
        updateOverview = { ...updateInfo };
      }
      if (state.chatMap[chatType].has(fromId)) {
        let ls = [...state.chatMap[chatType].get(fromId).list];
        const idx = ls.findIndex((item) => {
          return item.id === messageId;
        });
        if (idx > -1) {
          const findMessage = ls[idx];
          const info =
            findMessage.chatThreadOverview && updateOverview
              ? { ...findMessage.chatThreadOverview }
              : {};
          if (operation === "destroy") {
            findMessage.chatThreadOverview = {};
          } else if (
            operation !== "create" ||
            (operation === "create" && !info.timestamp)
          ) {
            findMessage.chatThreadOverview = { ...info, ...updateOverview };
          }
        }
        return {
          ...state,
          chatMap: {
            ...state.chatMap,
            [chatType]: new Map([
              ...state.chatMap[chatType],
              ...new Map().set(fromId, {
                ...state.chatMap[chatType].get(fromId),
                list: ls
              })
            ])
          }
        };
      }
    },
    //更新server角色
    updateServerRole(state, { serverId, role }) {
      return {
        ...state,
        serverRole: {
          ...state.serverRole,
          [serverId]: role
        }
      };
    },
    //set reaction
    updateMsgReaction(state, { msgId, reactions }) {
      return {
        ...state,
        reactionMap: new Map([
          ...state.reactionMap,
          ...new Map().set(msgId, reactions)
        ])
      };
    },
    // insert reaction
    insertReaction(state, { messageId, reaction }) {
      const { reactionMap } = state;
      const hasMsgReactions = reactionMap.has(messageId);
      const reactions = reactionMap.get(messageId) || [];
      const idx = reactions.findIndex((item) => {
        return item.reaction === reaction;
      });
      let ls = [];
      // 该消息已存在reaction
      if (hasMsgReactions) {
        if (idx > -1) {
          reactions[idx].isAddedBySelf = true;
          reactions[idx].count++;
        } else {
          reactions.push({
            count: 1,
            isAddedBySelf: true,
            reaction,
            op: [
              {
                operator: WebIM.conn.user,
                reactionType: "create"
              }
            ],
            userList: [WebIM.conn.user]
          });
        }
        ls = [...reactions];
      } else {
        ls.push({
          count: 1,
          isAddedBySelf: true,
          reaction,
          op: [
            {
              operator: WebIM.conn.user,
              reactionType: "create"
            }
          ],
          userList: [WebIM.conn.user]
        });
      }

      return {
        ...state,
        reactionMap: new Map([
          ...state.reactionMap,
          ...new Map().set(messageId, ls)
        ])
      };
    },
    // delete reaction
    deleteReaction(state, { messageId, reaction }) {
      const { reactionMap } = state;
      const reactions = reactionMap.get(messageId) || [];
      const idx = reactions.findIndex((item) => {
        return item.reaction === decodeURIComponent(reaction);
      });
      let ls = [];
      if (idx > -1) {
        reactions[idx].isAddedBySelf = false;
        reactions[idx].count--;
        if (reactions[idx].count === 0) {
          reactions.splice(idx, 1);
        }
      }
      ls = [...reactions];
      return {
        ...state,
        reactionMap: new Map([
          ...state.reactionMap,
          ...new Map().set(messageId, ls)
        ])
      };
    },
    //更新channel未读
    updateServerChannelMap(state, { serverId, channelId, unReadNum }) {
      const map = { ...state.serverChannelMap };
      if (map[serverId]) {
        map[serverId][channelId] = unReadNum;
      } else {
        map[serverId] = {
          [channelId]: unReadNum
        }
      }
      state = {
        ...state,
        serverChannelMap: map
      }
      return state;
    }
  },
  effects: (dispatch) => ({
    setVisible(visible) {
      this.updateState({ serverFormVisible: visible });
    },
    setCurrentChannelInfo(channelInfo) {
      this.updateState({ currentChannelInfo: channelInfo });
    },
    setLoginStatus(isLogging) {
      this.updateState({ isLogging });
    },
    setLoginSuccess(loginSuccess) {
      this.updateState({ loginSuccess });
    },
    setUserInfo(userInfo) {
      this.updateUserInfo({ userInfo: { ...userInfo } });
    },
    setAppUserInfo(appUserInfo) {
      this.updateState({ appUserInfo });
    },
    pushChatMessage({ fromId, messageInfo, chatType, reset }) {
      this.pushMessage({ fromId, messageInfo, chatType, reset });
    },
    insertChatMessage({ fromId, messageInfo, chatType, reset }, rootState) {
      this.insertMessage({ fromId, messageInfo, chatType, reset });
      if (
        messageInfo.list?.length &&
        messageInfo.list[0].from !== WebIM.conn.user
      ) {
        this.updateUnReadNum({
          chatType,
          fromId,
          number: messageInfo.list.length,
          message: messageInfo.list[0]
        });
      }
      //私聊列表
      const conversationList = [...rootState.contact?.conversationList] || [];
      if (
        chatType === CHAT_TYPE.single &&
        conversationList.indexOf(fromId) < 0
      ) {
        conversationList.unshift(fromId);
        dispatch.contact.setConversationList(conversationList);
      }
    },
    updateChatThreadMessage({ chatType, fromId, updateInfo }) {
      this.updateChatMessage({ chatType, fromId, updateInfo });
    },
    setServerRole({ serverId, role }) {
      this.updateServerRole({ serverId, role });
    },
    setMsgReaction({ msgId, reactions }) {
      this.updateMsgReaction({ msgId, reactions });
    },
    insertMsgReaction({ messageId, reaction }) {
      this.insertReaction({ messageId, reaction });
    },
    setDeleteMessage({ chatType, fromId, id, operator }) {
      this.deleteMessage({ chatType, fromId, id, operator });
    },
    setCurrentChatInfo(currentChatInfo) {
      this.updateState({ currentChatInfo });
    },
    setUnReadNumber({ chatType, fromId, number }) {
      this.updateUnReadNum({ chatType, fromId, number });
    },
    setSelectedTab(selectedTab) {
      this.updateState({ selectedTab });
    },
    updateChatMessageId({ id, mid, to, status }) {
      this.updateChatMessageIdMid({ id, mid, to, status })
    },
    updateChatMessageUrl({ id, to, url }) {
      this.changeChatMessageUrl({ id, to, url })
    },
    updateOnline(isOnline) {
      this.updateState({ isOnline });
    },
    deleteFailedMessage({ id, fromId, chatType }) {
      this.deleteLocalMessage({ id, fromId, chatType });
    },
    setServerChannelMap({ serverId, channelId, unReadNum }) {
      this.updateServerChannelMap({ serverId, channelId, unReadNum })
    }
  })
};

export default App;
