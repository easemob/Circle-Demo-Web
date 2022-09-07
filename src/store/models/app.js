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
    currentChatInfo: {} //当前聊天对象的信息{chatType:"singleChat" "groupChat"  id:string}
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
    //更新已读，未读
    updateUnReadNum(state, { chatType, fromId, number, message = {} }) {
      if (state.currentChatInfo.chatType === chatType && state.currentChatInfo.id === fromId){
        if (chatType === CHAT_TYPE.single) {
          //清空未读消息
          let msg = WebIM.message.create({
            chatType: CHAT_TYPE.single,
            type: "channel",
            to: fromId
          });
          WebIM.conn.send(msg);
        }
        return state;
      }
      let dt = {};
      if (chatType && state.chatMap[chatType].has(fromId)) {
        dt = state.chatMap[chatType].get(fromId);
      }
      let unReadNum = dt.unReadNum ? dt.unReadNum + number : number;
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
    }
  })
};

export default App;
