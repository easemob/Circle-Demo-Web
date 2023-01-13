/**
 *
 * state状态
 * @typedef {Object} AppState
 * @description 应用本身使用的redux state
 * @property {Object} rtcUserInfo: rtc 用户信息
 */

const App = {
  state: {
    rtcUserInfo: {},
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
  },
  effects: () => ({
    setRtcUserInfo(rtcUserInfo) {
      this.updateState({ rtcUserInfo });
    },
  })
};

export default App;
