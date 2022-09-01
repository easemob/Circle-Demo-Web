/**
 *
 * state状态
 * @typedef {Object} AppState
 * @description 应用本身使用的redux state
 */
import { message } from "antd";
import WebIM from "@/utils/WebIM";

const thread = {
    state: {
        showThreadPanel: false,//channel布局内是否展示thread面板部分
        currentThreadInfo: {},//thread基础信息，parentMessage信息
        isCreatingThread: false,//true创建thread页面 ,false 查看thread||发送thread消息
        //拉取thread历史记录相关数据信息
        threadCursor: "",
        threadHasHistory: true,
        //正在加载thread信息
        isLoadingThreadMessage: false,
        threadMessage: new Map(),//thread消息
        deleteThreadEvent: {}//thread事件
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
        //收到thread通知后thread面板相关操作
        updateCurrentThread(state, { updateInfo }) {
            const { operation, messageId, id, operator } = updateInfo;
            if (state.currentThreadInfo.id === id && (operation === "userRemove" || operation === "destroy")) {
                //第一种情况：用户被移除当前子区，或者当前子区被销毁
                //清空数据
                state.currentThreadInfo = {};
                //关闭面板
                state.showThreadPanel = false;
                const warnText = operation === 'userRemove' ? "您被移除当前子区！" : "子区被销毁！";
                message.warn({ content: warnText });
                return state;
            } else if (state.currentThreadInfo.id === id || state.currentThreadInfo.parentMessage?.id === messageId) {
                //第二种情况：当前子区更新，或者创建thread中收到其他用户创建完成的消息，需要更新当前thread
                if (operation === 'create') {
                    //其他用户创建thread
                    if (WebIM.conn.user !== operator) {
                        //清空数据
                        state.currentThreadInfo = {};
                        //关闭面板
                        state.showThreadPanel = false;
                        message.warn({ content: "消息已创建子区！" });
                    } else {
                        //create 事件下发时间大部分晚于update，收到create不处理messageCount字段，防止覆盖 messageCount 字段
                        if (!state.currentThreadInfo.timestamp) {
                            //update the owner
                            state.currentThreadInfo = { ...state.currentThreadInfo, owner: updateInfo.operator, name: updateInfo.name, id: updateInfo.id }
                        }
                    }
                }
                if (operation === 'update') {
                    state.currentThreadInfo = { ...state.currentThreadInfo, ...updateInfo, source: "notify" }
                }
                return {
                    ...state,
                    isCreatingThread: false,
                }
            } else {
                return state
            }
        },
        //thread消息
        updateThreadMessage(state, { message, fromId, isScroll }) {
            let baseData = state.threadMessage.get(fromId) ? [...state.threadMessage.get(fromId)] : [];
            var ls = [];
            if (isScroll) {
                ls = [...baseData, ...message]
            } else {
                if (!Array.isArray(message)) {
                    if (state.threadHasHistory) return state
                    ls = [...baseData, message]
                } else {
                    ls = message
                }
            }
            return {
                ...state,
                threadMessage: new Map([
                    ...state.threadMessage,
                    ...new Map().set(fromId, ls)
                ])
            }
        },
        //撤回thread消息
        deleteMessage(state, { fromId, id }) {
            if (state.threadMessage.has(fromId)) {
                let ls = [...state.threadMessage.get(fromId)];
                const idx = ls.findIndex((item) => {
                    return item.id === id;
                });
                if (idx > -1) {
                    const newMessage = { ...ls[idx], type: "recall", msg: "撤回了一条消息" }
                    ls.splice(idx, 1, newMessage);
                    return {
                        ...state,
                        threadMessage: new Map([
                            ...state.threadMessage,
                            ...new Map().set(fromId, ls)
                        ])
                    }
                }
            }
            return state
        },
    },
    effects: {
        setThreadPanelStatus(showThreadPanel) {
            this.updateState({ showThreadPanel: showThreadPanel });
        },
        setThreadInfo(threadInfo) {
            this.updateState({ currentThreadInfo: threadInfo });
            this.updateState({ threadHasHistory: true });
            this.updateState({ threadCursor: "" });
        },
        setIsCreatingThread(data) {
            this.updateState({ isCreatingThread: data });
        },
        updateThreadInfo({ fromId, updateInfo }) {
            this.updateCurrentThread({ fromId, updateInfo });
        },
        setThreadCursor(cursor) {
            this.updateState({ threadCursor: cursor });
        },
        setThreadHasHistory(state) {
            this.updateState({ threadHasHistory: state });
        },
        setIsLoadingThreadMessage(status) {
            this.updateState({ isLoadingThreadMessage: status });
        },
        setThreadMessage({ message, fromId, isScroll }) {
            this.updateThreadMessage({ message, fromId, isScroll });
        },
        setDeleteMessage({ fromId, id }) {
            this.deleteMessage({ fromId, id })
        },
        setDeleteThreadEvent(deleteThreadEvent) {
            this.updateState({ deleteThreadEvent });
        }
    }
};

export default thread;
