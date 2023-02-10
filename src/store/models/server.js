/**
 *
 * state状态
 * @typedef {Object} AppState
 * @description 应用本身使用的redux state
 */

const Server = {
  state: {
    joinedServerInfo: {},
    categoryMap: new Map(),
    channelMap: new Map(),
    transferCategory: false, //移动频道后重新拉去默认分组数据
    serverUserMap: new Map(),
    serverMultiDeviceEvent: {},//event,data
    channelEvent: {},//event,data
    currentServerTag: [],// 当前社区的tag信息
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
    updateChannelMap(state, payload) {
      const { categoryId, channelInfo } = payload;
      const { channelMap } = state;
      return {
        ...state,
        channelMap: new Map([
          ...channelMap,
          ...new Map().set(categoryId, channelInfo)
        ])
      };
    },
    updateCategoryMap(state, payload) {
      const { serverId, categoryInfo } = payload;
      const { categoryMap } = state;
      return {
        ...state,
        categoryMap: new Map([
          ...categoryMap,
          ...new Map().set(serverId, categoryInfo)
        ])
      };
    },
    updateServerUserMap(state, payload) {
      const { serverId, userListInfo } = payload;
      const { serverUserMap } = state;
      return {
        ...state,
        serverUserMap: new Map([
          ...serverUserMap,
          ...new Map().set(serverId, userListInfo)
        ])
      };
    }
  },
  effects: {
    setJoinedServerInfo(joinedServerInfo) {
      this.updateState({ joinedServerInfo });
    },
    setChannelMap({ categoryId, channelInfo }) {
      this.updateChannelMap({ categoryId, channelInfo });
    },
    deleteChannelMap(channelMap) {
      this.updateState(channelMap)
    },
    setServerUserMap({ serverId, userListInfo }) {
      this.updateServerUserMap({ serverId, userListInfo });
    },
    setServerMultiDeviceEvent(serverMultiDeviceEvent) {
      this.updateState({ serverMultiDeviceEvent });
    },
    setChannelEvent(channelEvent) {
      this.updateState({ channelEvent });
    },
    setCurrentServerTag(currentServerTag) {
      this.updateState({ currentServerTag });
    },
    setCategoryMap({ serverId, categoryInfo }) {
      this.updateCategoryMap({ serverId, categoryInfo })
    },
    setTransferCategory(transferCategory){
      this.updateState({ transferCategory });
    }
  }
};
export default Server;
