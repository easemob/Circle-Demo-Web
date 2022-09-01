/**
 *
 * state状态
 * @typedef {Object} AppState
 * @description 应用本身使用的redux state
 * @property {boolean} memberVisible: 是否展示社区成员Modal
 * @property {boolean} channelVisible: 是否展示创建频道Modal
 * @property {boolean} inviteVisible: 是否展示邀请加入社区Modal
 */

const channel = {
  state: {
    memberVisible: false,
    channelVisible: false,
    inviteVisible: false,
    threadMap: new Map(),
    channelMemberVisible: false,
    channelUserMap: new Map()
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
    updateThreadMap(state, payload) {
      const { channelId, threadInfo } = payload;
      const { threadMap } = state;
      return {
        ...state,
        threadMap: new Map([
          ...threadMap,
          ...new Map().set(channelId, threadInfo)
        ])
      };
    },
    removeThreadMap(state, payload) {
      const { channelId } = payload;
      const { threadMap } = state;
      console.log(channelId, 'channelId')
      threadMap.delete(channelId);
      console.log(threadMap, 'threadMap')
      return {
        ...state,
        threadMap
      };
    },
    updateThreadInfo(state, updateInfo) {
      const { id, operation, parentId } = updateInfo;
      if (state.threadMap.has(parentId)) {
        const list = [...state.threadMap.get(parentId)?.list] || [];
        const findIndex = list.findIndex((item) => item.id === id);
        if (findIndex > -1) {
          switch (operation) {
            case "update":
              const info = { ...list[findIndex], name: updateInfo.name };
              list.splice(findIndex, 1, info);
              break;
            case "destroy":
              list.splice(findIndex, 1);
              break;
            default:
              break;
          }
          return {
            ...state,
            threadMap: new Map([
              ...state.threadMap,
              ...new Map().set(parentId, {
                ...state.threadMap.get(parentId),
                list
              })
            ])
          };
        }
      }
      return state;
    },
    updateChannelUserMap(state, payload) {
      const { channelId, userListInfo } = payload;
      const { channelUserMap } = state;
      return {
        ...state,
        channelUserMap: new Map([
          ...channelUserMap,
          ...new Map().set(channelId, userListInfo)
        ])
      };
    }
  },
  effects: {
    setVisible(visible) {
      this.updateState({ memberVisible: visible });
    },
    setChannelVisible(visible) {
      this.updateState({ channelVisible: visible });
    },
    setInviteVisible(visible) {
      this.updateState({ inviteVisible: visible });
    },
    setChannelMemberVisible(visible) {
      this.updateState({ channelMemberVisible: visible });
    },
    setThreadMap({ channelId, threadInfo }) {
      this.updateThreadMap({ channelId, threadInfo });
    },
    setChannelUserMap({ channelId, userListInfo }) {
      this.updateChannelUserMap({ channelId, userListInfo });
    },
    updateChannelThreadInfo({ updateInfo }) {
      this.updateThreadInfo(updateInfo);
    },
    deleteChannelThreadMap({ channelId }) {
      this.removeThreadMap({ channelId });
    }
  }
};

export default channel;
