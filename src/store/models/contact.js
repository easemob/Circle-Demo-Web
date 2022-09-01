/**
 *
 * state状态
 * @typedef {Object} AppState
 * @description 应用本身使用的redux state
 */

const Contacts = {
  state: {
    contactsList: [],//好友列表
    applyInfo: [],//好友申请
    hasSentApply: [],//发出的好友申请
    conversationList: []//会话列表
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
        ...payload,
      }
    }
  },
  effects: {
    setApplyInfo(applyInfo) {
      this.updateState({ applyInfo: [...applyInfo] });
    },
    setContactsList(contactsList) {
      this.updateState({ contactsList: [...contactsList] });
    },
    setConversationList(conversationList) {
      this.updateState({ conversationList: [...conversationList] });
    },
    setHasSentApply(hasSentApply) {
      this.updateState({ hasSentApply: [...hasSentApply] });
    }
  }
};

export default Contacts;
