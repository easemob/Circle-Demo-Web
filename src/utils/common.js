import WebIM from "@/utils/WebIM";
import moment from "moment";
import store from "../store";
import { ERROR_CODE, USER_ROLE } from "@/consts";
import { CHAT_TYPE, SERVER_COVER_MAP } from "@/consts";
import Icon from "@/components/Icon";
import { message as messageTip, Modal } from "antd";
import { emojiMap } from "@/consts/emoji";
import { startBasicCall, endBasicCall } from "@/utils/basicVoiceCall"
import http from "@/utils/axios"
import { rtc } from "@/utils/basicVoiceCall"

const { dispatch, getState } = store;

//根据uid获取好友详情以及在线状态，返回全量数据（object）,并订阅所有人
export function getUsersInfo(userIdList) {
  //订阅在线状态
  const findIndex = userIdList.indexOf(WebIM.conn.user);
  let subList = [...userIdList];
  if (findIndex > -1) {
    subList.splice(findIndex, 1);
  }
  if (subList.length > 0) {
    WebIM.conn.subscribePresence({ usernames: subList, expiry: 2592000 });
  }
  const list = getState().app.appUserInfo;
  const result = {};

  return new Promise((resolve, reject) => {
    const type = [
      "nickname",
      "avatarurl",
      "mail",
      "phone",
      "gender",
      "sign",
      "birth",
      "ext"
    ];
    const reUserInfo = {};
    userIdList.forEach((item) => {
      reUserInfo[item] = {
        uid: item,
        online: 0
      };
    });
    if (userIdList.length === 0) {
      resolve(Object.assign({}, reUserInfo));
    } else {
      WebIM.conn
        .fetchUserInfoById(userIdList, type)
        .then((res) => {
          res.data &&
            Object.keys(res.data).forEach((item) => {
              type.forEach((key) => {
                reUserInfo[item][key] = res.data[item][key]
                  ? res.data[item][key]
                  : "";
              });
            });
          WebIM.conn
            .getPresenceStatus({ usernames: userIdList })
            .then((res) => {
              res.result &&
                res.result.forEach((item) => {
                  if (reUserInfo[item.uid]) {
                    if (
                      Object.prototype.toString.call(item.status) ===
                      "[object Object]" &&
                      Object.values(item.status).indexOf("1") > -1
                    ) {
                      reUserInfo[item.uid].online = 1;
                    }
                  }
                });
              dispatch.app.setAppUserInfo(Object.assign({}, list, reUserInfo));
              resolve(Object.assign({}, result, reUserInfo));
            })
            .catch((e) => {
              reject(e);
            });
        })
        .catch((e) => {
          reject(e);
        });
    }
  });
}

//格式化消息的时间，也可以传入第二个参数并根据参数返回响应格式时间
//renderTime(threadOriginalMsg.time, "MMM D, YYYY, HH:mm")
export function renderTime(time, timeStyle) {
  if (!time || isNaN(Number(time))) return "";
  const localStr = new Date(Number(time));
  const localMoment = moment(localStr);
  const localFormat = timeStyle
    ? localMoment.format(timeStyle)
    : localMoment.format("MM-DD HH:mm");
  return localFormat;
}

// 小于一分钟：1m ago
// 60分钟以内：XXm ago，忽略下一级单位，下同；
// 24小时以内：XXh ago；
// 本周之内：Xd ago；
// 本月之内：Xwk ago;
// 超过本月不满一年：Xmo ago
// 超过一年：Xyr ago
//Get time difference
export function getTimeDiff(time) {
  if (!time || isNaN(Number(time))) return "";
  const localTime = new Date();
  const MsgTime = new Date(Number(time));
  const spanYear = localTime.getFullYear() - MsgTime.getFullYear();
  const spanMonth = localTime.getMonth() - MsgTime.getMonth();
  const spanDate = localTime.getDate() - MsgTime.getDate();
  const spanDay = localTime.getDay() - MsgTime.getDay();
  let spanWeek = 0;
  if (spanDate >= localTime.getDay()) {
    spanWeek = Math.ceil((spanDate + 1 - localTime.getDay()) / 7);
  }
  const spanHour = localTime.getHours() - MsgTime.getHours();
  const spanMinute = localTime.getMinutes() - MsgTime.getMinutes();
  if (spanYear !== 0) {
    return `${spanYear}年前`;
  } else if (spanMonth !== 0) {
    return `${spanMonth}月前`;
  } else if (spanWeek !== 0) {
    return `${spanWeek}周前`;
  } else if (spanDay !== 0) {
    return `${spanDay}日前`;
  } else if (spanHour !== 0) {
    return `${spanHour}小时前`;
  } else if (spanMinute !== 0) {
    return `${spanMinute}分钟前`;
  } else {
    return "1分钟前";
  }
}

const getConfirmModalConf = ({
  title = "",
  content = "",
  okText = "确认",
  cancelText = "取消",
  onOk = () => { },
  onCancel = () => { },
}) => {
  return {
    className: "confirmModalWrap",
    width: 545,
    title,
    okText,
    closable: true,
    cancelText,
    autoFocusButton: null,
    closeIcon: <Icon name="xmark" color="#c7c7c7" size="16px" />,
    cancelButtonProps: {
      className: "circleBtnGray"
    },
    okButtonProps: {
      className: "circleBtn"
    },
    icon: null,
    content,
    onOk: () => {
      onOk();
    },
    onCancel: () => {
      onCancel();
    }
  };
};

// 获取store fromId
const getMessageFromId = (message) => {
  const { to, from, chatType } = message;
  return chatType === CHAT_TYPE.groupChat ? `${to}` : `${from}`;
};

// 创建消息
const createMsg = (opt) => {
  return WebIM.message.create(opt);
};
// 发送消息
const deliverMsg = (msgObj) => {
  if (!getState().app.isOnline) {
    messageTip.info("您已离线，请联网后再试！");
    return
  }
  const { msg, needShow } = msgObj;
  if (needShow) {//需要本地展示消息
    if (msg.isChatThread) {
      dispatch.thread.setThreadMessage({
        message: { ...msg, from: WebIM.conn.user, status: "sending" },
        fromId: msg.to
      });
    } else {
      dispatch.app.insertChatMessage({
        chatType: msg.chatType,
        fromId: msg.to,
        messageInfo: { list: [{ ...msg, from: WebIM.conn.user, status: "sending" }] }
      });
    }
  }
  return new Promise((resolve, reject) => {
    WebIM.conn
      .send(msg)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        if (e.message === ERROR_CODE.notLogin) {
          console.log("未登录");
        } else if (e.reason === ERROR_CODE.muted) {
          messageTip.info("您已被禁言！");
        } else if (e.message === ERROR_CODE.trafficLimit) {
          messageTip.info("消息发送频繁，请稍后再试！");
        }
        if (msg.isChatThread) {
          dispatch.thread.updateChatThreadMessageId({ ...e.data, to: msg.to, status: "failed" })
        } else {
          dispatch.app.updateChatMessageId({ id: msg.id, to: msg.to, status: "failed" })
        }
        reject(e);
      });
  });
};
// 撤回消息
const recallMessage = (message, isChatThread = false) => {
  const { chatType, id, to } = message;
  WebIM.conn.recallMessage({
    to: to,
    mid: id,
    type: chatType,
    isChatThread,
    success: () => {
      if (isChatThread) {
        dispatch.thread.setDeleteMessage({
          id,
          fromId: to
        });
      } else {
        dispatch.app.setDeleteMessage({
          chatType,
          id,
          fromId: to
        });
      }
    },
    fail: (err) => {
      console.log(err);
      if (err.type === 504 && err.reason === "exceed recall time limit") {
        messageTip.info("超出撤回时效！");
      }
    }
  });
};
//删除本地发送失败的消息
const deleteFailedMessage = (message, isChatThread = false) => {
  const { id, to: fromId, chatType } = message;
  if (isChatThread) {
    dispatch.thread.deleteThreadFailedMessage({ id, fromId, chatType })
  } else {
    dispatch.app.deleteFailedMessage({ id, fromId, chatType })
  }
}

const pasteHtmlAtCaret = (html, lastEditRange) => {
  let sel, range;
  if (window.getSelection) {
    // IE9 and non-IE
    sel = window.getSelection();
    // 存在最后光标对象，选定对象清除所有光标并添加最后光标还原之前的状态
    if (lastEditRange) {
      sel.removeAllRanges();
      sel.addRange(lastEditRange);
    }
    if (sel.getRangeAt && sel.rangeCount) {
      range = sel.getRangeAt(0);
      range.deleteContents();
      let el = document.createElement("div");
      el.innerHTML = html;
      let frag = document.createDocumentFragment(),
        node,
        lastNode;
      while ((node = el.firstChild)) {
        lastNode = frag.appendChild(node);
      }
      range.insertNode(frag);
      // Preserve the selection
      if (lastNode) {
        range = range.cloneRange();
        range.setStartAfter(lastNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  } else if (document.selection && document.selection.type !== "Control") {
    // IE < 9
    document.selection.createRange().pasteHTML(html);
  }
};

//获取thread历史消息
const getThreadHistoryMessage = (target, isScroll = false) => {
  const { threadCursor, threadHasHistory, isLoadingThreadMessage } =
    getState().thread;
  if (isLoadingThreadMessage || (isScroll && !threadHasHistory)) return;
  let options = {
    targetId: target,
    cursor: isScroll ? threadCursor : -1,
    pageSize: 10,
    chatType: "groupChat",
    searchDirection: "down"
  };
  dispatch.thread.setIsLoadingThreadMessage(true);
  WebIM.conn
    .getHistoryMessages(options)
    .then((res) => {
      let msgList = res.messages;
      let hasHistory = true;
      if (msgList.length < options.pageSize || msgList.length === 0) {
        hasHistory = false;
      }
      res.messages.forEach((item) => {
        dispatch.app.setMsgReaction({
          msgId: item.id,
          reactions: item.reactions
        });
      });
      //维护cursor及是否拉取完整的历史记录信息
      dispatch.thread.setThreadCursor(res.cursor);
      dispatch.thread.setThreadHasHistory(hasHistory);
      //存储thread历史消息
      dispatch.thread.setThreadMessage({
        message: msgList,
        fromId: target,
        isScroll
      });
      dispatch.thread.setIsLoadingThreadMessage(false);
    })
    .catch(() => {
      dispatch.thread.setIsLoadingThreadMessage(false);
    });
};

// 格式化file文件
const formatImFile = (file) => {
  return {
    filename: file.name,
    filetype: file.type.split("/")[1],
    data: file
  };
};

const getThreadParentMsg = (parentId, messageId) => {
  const messageList =
    getState().app.chatMap[CHAT_TYPE.groupChat].get(parentId)?.list || [];
  return messageList.find((item) => item.id === messageId);
};

const scrollToBottom = (dom) => {
  dom?.scrollTo({
    top: dom?.scrollHeight
  });
};

//过滤数据
const filterData = (baseList, queryList, key) => {
  const resList = [];
  queryList?.forEach((item) => {
    let isInList = false;
    baseList.forEach((single) => {
      if (single[key] === item[key]) {
        isInList = true;
      }
    });
    !isInList && resList.push(item);
  });
  return resList;
};
//加入、同意加入server后列表插入数据
const insertServerList = (serverId, serverDetail) => {
  if (!serverDetail) {
    WebIM.conn.getServerDetail({ serverId }).then((res) => {
      addServer(res.data);
    });
  } else {
    addServer(serverDetail);
  }
  //初始化当前社区的消息未读数
  initServerIdUnread(serverId)
};
//加入、同意加入channel后列表插入channel数据
const insertChannelList = (serverId, channelId, channelDetail) => {
  checkIsHasServerInfo(serverId).then(() => {
    if (!channelDetail) {
      WebIM.conn.getChannelDetail({ serverId, channelId }).then((res) => {
        setChannelList(res.data);
      });
    } else {
      setChannelList(channelDetail);
    }
  });
  //初始化channel未读数据
  dispatch.app.setServerChannelMap({
    serverId,
    channelId,
    unReadNum: 0,
  })
};
const checkIsHasServerInfo = (serverId) => {
  return new Promise((resolve) => {
    const list = getState().server.joinedServerInfo.list || [];
    const index = list.findIndex((item) => item.id === serverId);
    if (index > -1) {
      //有server信息
      resolve();
    } else {
      WebIM.conn.getServerDetail({ serverId }).then((res) => {
        addServer(res.data).then(() => {
          resolve();
        });
      });
    }
  });
};
const setChannelList = (data) => {
  const { categoryId, isPublic } = data;
  if (getState().server.channelMap.has(categoryId)) {
    const channelInfo = getState().server.channelMap.get(categoryId);
    if (!channelInfo) return;
    if (isPublic) {
      const publicChannel = [...channelInfo?.public] || [];
      const channelList = filterData(publicChannel, [data], "channelId");
      if (channelList.length > 0) {
        publicChannel.splice(1, 0, data);
        updateChannelList(categoryId, channelInfo, publicChannel, "public");
      }
    } else {
      const privateChannel = [...channelInfo?.private] || [];
      const channelList = filterData(privateChannel, [data], "channelId");
      if (channelList.length > 0) {
        privateChannel.unshift(data);
        updateChannelList(categoryId, channelInfo, privateChannel, "private");
      }
    }
  } else { }
};

//收到通知或者编辑server成功后更新server信息
const updateServerDetail = (source, info) => {
  const baseServerInfo = getState().server.joinedServerInfo?.list || [];
  const index = baseServerInfo.findIndex(
    (item) => item.id === info.serverId || item.id === info.id
  );
  if (index > -1) {
    let newServerInfo = {};
    if (source === "notify") {
      const updateInfo = { ...info };
      delete updateInfo.operator;
      delete updateInfo.serverId;
      delete updateInfo.timestamp;
      delete updateInfo.operation;
      newServerInfo = { ...baseServerInfo[index], ...updateInfo };
    } else {
      newServerInfo = info;
    }
    baseServerInfo.splice(index, 1, newServerInfo);
    dispatch.server.setJoinedServerInfo({
      ...getState().server.joinedServerInfo,
      list: baseServerInfo
    });
  }
};
//插入一条server数据
const addServer = (data) => {
  return new Promise((resolve, reject) => {
    const list = getState().server.joinedServerInfo.list || [];
    const findIndex = list.findIndex(item => item.id === data.id)
    if (findIndex < 0) {
      list.unshift(data);
      dispatch.server.setJoinedServerInfo({
        ...getState().server.joinedServerInfo,
        list
      });
    }
    resolve(list);
  });
};
//删除一条server数据
const deleteServer = (serverId) => {
  return new Promise((resolve, reject) => {
    const list = getState().server.joinedServerInfo.list || [];
    const index = list.findIndex((item) => item.id === serverId);
    if (index > -1) {
      list.splice(index, 1);
      dispatch.server.setJoinedServerInfo({
        ...getState().server.joinedServerInfo,
        list
      });
      if (getState().server.channelMap.has(serverId)) {
        const channelInfoMap = getState().server.channelMap;
        const channelInfo = channelInfoMap.get(serverId);
        const channelIds = [...channelInfo.private, ...channelInfo.public];
        // 移除thread信息
        channelIds.forEach((item) => {
          dispatch.channel.deleteChannelThreadMap({
            channelId: item.channelId
          });
        });
        channelInfoMap.delete(serverId);
        dispatch.server.deleteChannelMap(channelInfoMap);
        resolve(list);
      } else {
        resolve(list);
      }
    } else {
      reject("false");
    }
  });
};

const addLocalThread = (parentId, threadInfo) => {
  return new Promise((resolve) => {
    if (getState().channel.threadMap.has(parentId)) {
      const list = [...getState().channel.threadMap.get(parentId).list] || [];
      const findIndex = list.findIndex((item) => item.id === threadInfo.id);
      if (findIndex < 0) {
        list.unshift(threadInfo);
        dispatch.channel.setThreadMap({
          channelId: parentId,
          threadInfo: { ...getState().channel.threadMap.get(parentId), list }
        });
      }
      resolve(list);
    }
  });
};
const deleteLocalThread = (parentId, threadId) => {
  return new Promise((resolve) => {
    if (getState().channel.threadMap.has(parentId)) {
      const list = getState().channel.threadMap.get(parentId).list || [];
      const findIndex = list.findIndex((item) => item.id === threadId);
      if (findIndex > -1) {
        list.splice(findIndex, 1);
        dispatch.channel.setThreadMap({
          parentId,
          threadInfo: { ...getState().channel.threadMap.get(parentId), list }
        });
      }
      resolve(list);
    }
  });
};

//更新channel信息
const updateLocalChannelDetail = (type, serverId, categoryId, data) => {
  //type
  //收到channel更新的通知 "notify"
  //本账号编辑channel "edit"
  const { id } = data;
  const currentChannelInfo = getState().app.currentChannelInfo;
  const settingChannelInfo = getState().channel.settingChannelInfo;
  const currentRtcChannelInfo = getState().channel.curRtcChannelInfo;
  if (settingChannelInfo.serverId === serverId && settingChannelInfo.channelId === data.id) {
    dispatch.channel.setSettingChannelInfo({
      ...settingChannelInfo,
      ...data
    })
  }
  if (currentChannelInfo.serverId === serverId && currentChannelInfo.channelId === data.id) {
    dispatch.app.setCurrentChannelInfo({
      ...currentChannelInfo,
      ...data
    });
  } else if (currentRtcChannelInfo?.serverId === serverId && currentRtcChannelInfo.channelId === data.id) {
    dispatch.channel.setCurRtcChannelInfo({
      ...currentRtcChannelInfo,
      ...data
    });
  }
  if (getState().server.channelMap.has(categoryId)) {
    const channelInfo = getState().server.channelMap.get(categoryId);
    const publicChannel = [...channelInfo?.public] || [];
    const findIndex1 = publicChannel.findIndex((item) => item.channelId === id);
    if (findIndex1 > -1) {
      const newChannelInfo = {
        ...publicChannel[findIndex1],
        ...data
      };
      publicChannel.splice(findIndex1, 1, newChannelInfo);
      updateChannelList(categoryId, channelInfo, publicChannel, "public");
    } else {
      const privateChannel = [...channelInfo?.private] || [];
      const findIndex2 = privateChannel.findIndex(
        (item) => item.channelId === id
      );
      if (findIndex2 > -1) {
        const newChannelInfo = {
          ...privateChannel[findIndex2],
          ...data
        };
        privateChannel.splice(findIndex2, 1, newChannelInfo);
        updateChannelList(categoryId, channelInfo, privateChannel, "private");
      }
    }
  }
};
//更新channel列表
const updateChannelList = (
  categoryId,
  channelInfo,
  channelList,
  type = "public"
) => {
  dispatch.server.setChannelMap({
    categoryId,
    channelInfo: { ...channelInfo, [type]: channelList }
  });
};
/**
 * 
 * @param {*} serverId 操作频道的serverId
 * @param {*} categoryId 操作频道的分组ID
 * @param {*} channelId 操作频道的ID
 * @param {*} isDestroy 是否要删除数据，删除频道需要删除数据；所有成员离开公开频道不需要，user离开私有频道需要删除数据，owner moderator离开私有频道不需要删除数据
 * @param {*} isTransfer 是否移动频道，如果是移动频道则都需要将当前数据移除
 */
//删除本地频道
const deleteLocalChannel = ({ serverId, categoryId, channelId, isDestroy = false, isTransfer = false }) => {
  if (getState().server.channelMap.has(categoryId)) {
    const channelInfo = getState().server.channelMap.get(categoryId);
    const publicChannel = [...channelInfo?.public] || [];
    const findIndex1 = publicChannel.findIndex(
      (item) => item.channelId === channelId
    );
    //移动频道
    if (isTransfer) {
      if (findIndex1 > -1) {
        //公开频道删除
        publicChannel.splice(findIndex1, 1);
        dispatch.channel.deleteChannelThreadMap({ channelId });
        updateChannelList(categoryId, channelInfo, publicChannel, "public");
      } else {
        const privateChannel = [...channelInfo?.private] || [];
        const findIndex2 = privateChannel.findIndex(
          (item) => item.channelId === channelId
        );
        if (findIndex2 > -1) {
          privateChannel.splice(findIndex2, 1);
          dispatch.channel.deleteChannelThreadMap({ channelId });
          updateChannelList(categoryId, channelInfo, privateChannel, "private");
        }
      }
      return
    }
    //删除或退出频道
    //清空channel未读数据
    dispatch.app.setServerChannelMap({
      serverId,
      channelId,
      unReadNum: 0,
    })
    if (findIndex1 > -1 && isDestroy) {
      //公开频道删除
      publicChannel.splice(findIndex1, 1);
      dispatch.channel.deleteChannelThreadMap({ channelId });
      updateChannelList(categoryId, channelInfo, publicChannel, "public");
    } else {
      const privateChannel = [...channelInfo?.private] || [];
      const findIndex2 = privateChannel.findIndex(
        (item) => item.channelId === channelId
      );
      let role = USER_ROLE.user;
      if (Object.prototype.hasOwnProperty.call(getState().app.serverRole, serverId)) {
        role = getState().app.serverRole[serverId]
      }
      if (findIndex2 > -1 && (role === USER_ROLE.user || isDestroy)) {
        privateChannel.splice(findIndex2, 1);
        dispatch.channel.deleteChannelThreadMap({ channelId });
        updateChannelList(categoryId, channelInfo, privateChannel, "private");
      }
    }
  }
};

const getServerCover = (id) => {
  let s = 0;
  if (id) {
    s = (id.substr(-1).charCodeAt() % 9) + 1;
  }
  return SERVER_COVER_MAP[`cover0${s}`];
};
// 标识符转JSX DOM
const renderTxt = (txt) => {
  if (txt === undefined) {
    return [];
  }
  let rnTxt = [];
  let match = null;
  const regex = /(\[.*?\])/g;
  let start = 0;
  let index = 0;
  while ((match = regex.exec(txt))) {
    index = match.index;
    if (index > start) {
      rnTxt.push(txt.substring(start, index));
    }
    if (emojiMap.has(match[1])) {
      const v = emojiMap.get(match[1]);
      rnTxt.push(
        <img
          key={
            match[1] +
            Math.floor(Math.random() * 100000 + 1) +
            new Date().getTime().toString()
          }
          alt={match[1]}
          src={v}
          width={20}
          height={20}
          style={{ verticalAlign: "middle" }}
        />
      );
    } else {
      rnTxt.push(match[1]);
    }
    start = index + match[1].length;
  }
  rnTxt.push(txt.substring(start, txt.length));

  return rnTxt;
};
const renderHtml = (txt) => {
  if (txt === undefined) {
    return [];
  }
  let rnTxt = "";
  let match = null;
  const regex = /(\[.*?\])/g;
  let start = 0;
  let index = 0;
  while ((match = regex.exec(txt))) {
    index = match.index;
    if (index > start) {
      rnTxt += txt.substring(start, index);
    }
    if (emojiMap.has(match[1])) {
      const v = emojiMap.get(match[1]);
      rnTxt += getEmojiHtml({ src: v, dataKey: match[1], alt: [match[1]] });
    } else {
      rnTxt += match[1];
    }
    start = index + match[1].length;
  }
  rnTxt += txt.substring(start, txt.length);
  return rnTxt;
};
function convertToMessage(e) {
  var t = (function () {
    var t = [],
      r = document.createElement("div");
    r.innerHTML = e;
    // r.innerHTML = e.replace(/\\/g, "###h###");
    for (
      var n = r.querySelectorAll("img"),
      a = r.querySelectorAll("div"),
      i = n.length,
      o = a.length;
      i--;

    ) {
      var s = document.createTextNode(n[i].getAttribute("data-key"));
      n[i].parentNode.insertBefore(s, n[i]);
      n[i].parentNode.removeChild(n[i]);
    }
    // eslint-disable-next-line no-unused-expressions
    for (; o--;) t.push(a[o].innerHTML), a[o].parentNode.removeChild(a[o]);
    var c = (t = t.reverse()).length ? "\n" + t.join("\n") : t.join("\n");
    return (r.innerText + c)
      .replace(/###h###/g, "&#92;")
      .replace(/<br>/g, "\n")
      .replace(/&amp;/g, "&");
  })();
  new RegExp("(^[\\s\\n\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\n\\s\\t]+$)", "g");
  return t.replace(/&nbsp;/g, " ").trim();
}

// 存储常用表情
function setFrequentlyEmoji(emojiId) {
  const emojiList = JSON.parse(localStorage.getItem("frequentlyEmoji")) || [];
  if (emojiList.includes(emojiId)) {
    emojiList.splice(emojiList.indexOf(emojiId), 1);
    emojiList.unshift(emojiId);
  } else {
    if (emojiList.length > 20) {
      emojiList.splice(emojiList.length - 1, 1);
    }
    emojiList.unshift(emojiId);
  }
  localStorage.setItem("frequentlyEmoji", JSON.stringify(emojiList));
}

function resetFrequentlyEmoji() {
  localStorage.removeItem("frequentlyEmoji");
}

function getEmojiHtml({
  src = "",
  dataKey = "",
  alt = "",
  className = "emojiMsg"
}) {
  return `<span><img class=${className} src=${src} data-key=${dataKey} alt=${alt} width="20" height="20" style="vertical-align: middle" /></span>`;
}

const formatterInputCount = ({ count, maxLength }) => `${count}/${maxLength}`;

const addReactions = ({ messageId, reaction }) => {
  WebIM.conn
    .addReaction({
      messageId,
      reaction
    })
    .then(() => {
      dispatch.app.insertMsgReaction({ messageId, reaction });
    })
    .catch((e) => {
      if (e.message === "The quantity has exceeded the limit!") {
        messageTip.info("Reaction类型数量已达到限制");
      } else if (e.message === "the user is already operation this message") {
        messageTip.info("Reaction类型重复");
      }
    });
};

const deleteReactions = ({ messageId, reaction }) => {
  console.log('deleteReactions')
  WebIM.conn
    .deleteReaction({
      messageId,
      reaction
    })
    .then(() => {
      dispatch.app.deleteReaction({ messageId, reaction });
    });
};

//获取默认分组信息
const getDefaultCategoryInfo = (categoryInfo) => {
  if (!categoryInfo) return
  return categoryInfo?.list?.find(item => item.defaultCategory === true) || {};
}
const updateCategoryMap = ({ type, categoryInfo }) => {
  const { serverId, id } = categoryInfo
  const ls = getState().server.categoryMap.get(serverId)?.list || [];
  switch (type) {
    case "add":
      ls.push(categoryInfo)
      break;
    case "update":
      const fd = ls.findIndex(item => item.id === id)
      if (fd > -1) {
        const newData = { ...ls[fd], ...categoryInfo }
        ls.splice(fd, 1, newData)
      }
      break;
    case "delete":
      const findIndex = ls.findIndex(item => item.id === id)
      if (findIndex > -1) {
        ls.splice(findIndex, 1);
        //重新拉取默认分组数据
        dispatch.server.setTransferCategory(true);
      }
      break;
    default:
      break;
  }
  dispatch.server.setCategoryMap({
    serverId,
    categoryInfo: {
      ...getState().server.categoryMap.get(serverId),
      list: ls
    }
  });
}
//根据分组ID、channelId,查询本地channelInfo
const getChannelInfo = ({ categoryId, channelId }) => {
  const channelData = getState().server.channelMap.get(categoryId);
  const channelList = channelData
    ? [...channelData?.public, ...channelData?.private]
    : [];
  return channelList.find(item => item.id === channelId)
}
//加入 rtcRoom
const joinRtcRoom = (channelInfo) => {
  const { channelId } = channelInfo
  return new Promise((resolve) => {

    WebIM.conn.getChatRoomAttributes({
      chatRoomId: channelId
    }).then(res => {
      //记录当前加入的语聊房频道的kv属性
      const rtcUserInfo = {};
      getUsersInfo(Object.keys(res.data))
      Object.keys(res.data).forEach(item => {
        rtcUserInfo[item] = { agoraUid: res.data[item] }
      })
      dispatch.rtc.setRtcUserInfo(rtcUserInfo);
      http("get", `https://a1.easemob.com/inside/token/rtc/channel/${channelId}`).then(res => {
        startBasicCall({ accessToken: res.accessToken, channel: channelId, agoraUid: res.agoraUid }).then(() => {
          rtc.localAudioTrack.setEnabled(false);
          // startBasicCall({ accessToken: "007eJxTYMhaI3D/eM2hJdcnpCyy3M8SelOaIf2Hsekzjjovu7rK/GwFhqREC1NTAxMzI0NjA5O0JAtLE3NLA3MDixQg19zSJO2K39bkhkBGhhPJxZyMDIwMLEAM4jOBSWYwyQIlkw2NjBkZDABJXiAQ", channel: "c123", agoraUid: null}).then(()=>{
          //记录当前加入的语聊房频道
          dispatch.channel.setCurRtcChannelInfo(channelInfo);
          updateRtcMember({
            type: "add",
            channelId,
            userId: getState().app.userInfo.username,
          })
          //设置聊天室kv属性
          WebIM.conn.setChatRoomAttribute({
            chatRoomId: channelId,
            attributeKey: getState().app.userInfo.username,
            attributeValue: res.agoraUid,
            autoDelete: true,
            isForced: false,
          }).then(() => {
            dispatch.rtc.setRtcUserInfo({
              ...getState().rtc.rtcUserInfo,
              [getState().app.userInfo.username]: {
                agoraUid: res.agoraUid,
              }
            });
            resolve()
          })
        })
      })
    })
  });
}

//退出语聊房 a.退出circle channel;b.退出rtcRoom
const leaveRtcChannel = ({ needLeave, serverId, channelId }) => {
  const { categoryId, isPublic } = getState().channel.curRtcChannelInfo
  return new Promise((resolve, reject) => {
    if (needLeave) {
      //退出rtcRoom
      endBasicCall().then(() => {
        //更新成员
        updateRtcMember({
          type: "delete",
          channelId,
          userId: getState().app.userInfo.username,
        })
        //清空当前加入的语聊房频道信息
        dispatch.channel.setCurRtcChannelInfo({});
        //移除聊天室kv
        WebIM.conn.removeChatRoomAttribute({
          chatRoomId: channelId,
          attributeKey: getState().app.userInfo.username,
          isForced: false,
        }).then(() => {
          //退出当前频道
          WebIM.conn.leaveChannel({ serverId, channelId }).then(res => {
            resolve();
            //如果是私有频道，更新列表
            if (!isPublic) {
              deleteLocalChannel({
                serverId,
                categoryId,
                channelId,
                isDestroy: false,
                isTransfer: false
              })
            }
          })
        })
      }).catch(() => {
        reject();
      })
    } else {
      //用户被踢后不在聊天室，无法设置聊天室属性
      //退出rtcRoom
      endBasicCall().then(() => {
        //更新成员
        updateRtcMember({
          type: "delete",
          channelId,
          userId: getState().app.userInfo.username,
        })
        //清空当前加入的语聊房频道信息
        dispatch.channel.setCurRtcChannelInfo({});
        //移除聊天室kv
        resolve();
      })
    }
  });
}
//语聊房成员更新
const updateRtcMember = ({ type, channelId, userId, role }) => {
  if (type === "add") {
    let channelUserMap = getState().channel.channelUserMap.get(channelId) || {};
    let list = channelUserMap?.list || [];
    const findIndex = list.findIndex((item) => userId === item.uid);
    if (findIndex < 0) {
      list.push({ uid: userId, role });
      dispatch.channel.setChannelUserMap({
        id: channelId,
        userListInfo: {
          ...channelUserMap,
          list
        }
      });
    }
  } else if (type === "delete") {
    if (getState().channel.channelUserMap.get(channelId)) {
      let channelUserMap = getState().channel.channelUserMap.get(channelId);
      let list = channelUserMap?.list || [];
      const findIndex = list.findIndex((item) => userId === item.uid);
      if (findIndex > -1) {
        list.splice(findIndex, 1);
        dispatch.channel.setChannelUserMap({
          id: channelId,
          userListInfo: {
            ...channelUserMap,
            list
          }
        });
      }
    }
  }
}
//初始化社区所有channel的未读数
const initServerIdUnread = (id, cursor = "") => {
  const { apiUrl, orgName, appName } = WebIM.conn;
  http("get", `${apiUrl}/${orgName}/${appName}/circle/channel/user/joined/list?userId=${getState().app.userInfo.username}&serverId=${id}&limit=100&cursor=${cursor}`).then((res) => {
    const { channelIds, cursor } = res;
    channelIds.forEach(item => {
      dispatch.app.setServerChannelMap({
        serverId: id,
        channelId: item,
        unReadNum: 0,
      })
    })
    if (cursor) {
      initServerIdUnread(id, cursor);
    }
  })
}
//更新频道列表用户角色
const updateUserRole = ({ serverId, channelId, userId, role }) => {
  let dt = getState().channel.channelUserMap.get(channelId);
  const userList = dt?.list || [];
  const index = userList.findIndex(item => item.uid === userId);
  if (index > -1) {
    const info = { ...userList[index], role };
    userList.splice(index, 1, info)
    dispatch.channel.setChannelUserMap({
      channelId: getState().channel.curRtcChannelInfo.channelId,
      userListInfo: {
        ...dt,
        list: userList
      }
    });
  }
}
//更新社区列表用户角色
const updateServerUserRole = ({ serverId, userId, role }) => {
  let dt = getState().server.serverUserMap.get(serverId);
  const userList = dt?.list || [];
  const index = userList.findIndex(item => item.uid === userId);
  if (index > -1) {
    const info = { ...userList[index], role };
    userList.splice(index, 1, info)
    dispatch.server.setServerUserMap({
      serverId,
      userListInfo: {
        ...dt,
        list: userList
      }
    });
  }
}

export {
  getConfirmModalConf,
  getMessageFromId,
  createMsg,
  deliverMsg,
  recallMessage,
  deleteFailedMessage,
  pasteHtmlAtCaret,
  getThreadHistoryMessage,
  formatImFile,
  getThreadParentMsg,
  scrollToBottom,
  setFrequentlyEmoji,
  resetFrequentlyEmoji,
  filterData,
  insertServerList,
  insertChannelList,
  updateServerDetail,
  addServer,
  deleteServer,
  deleteLocalThread,
  addLocalThread,
  updateLocalChannelDetail,
  deleteLocalChannel,
  getServerCover,
  renderTxt,
  renderHtml,
  addReactions,
  deleteReactions,
  getEmojiHtml,
  formatterInputCount,
  convertToMessage,
  getDefaultCategoryInfo,
  updateCategoryMap,
  getChannelInfo,
  joinRtcRoom,
  leaveRtcChannel,
  updateRtcMember,
  initServerIdUnread,
  updateUserRole,
  updateServerUserRole
};
