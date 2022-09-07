import React, { memo, useEffect, useState, useMemo } from "react";
import s from "./index.module.less";
import Header from "./components/Header";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import MessageLeft from "@/components/MessageLeft";
import Input from "@/components/Input";
import { CHAT_TYPE, MESSAGE_ITEM_SOURCE, SCROLL_WARP_ID } from "@/consts";
import WebIM from "@/utils/WebIM";
import { recallMessage, getUsersInfo } from "@/utils/common";
import { Spin } from "antd";
import ContactDetail from "./components/ContactDetail";
import InfiniteScroll from "react-infinite-scroll-component";

const PAGE_SIZE = 20;

const Chat = (props) => {
  const { chatMap, pushChatMessage, handleThreadPanel, setMsgReaction, conversationList, setConversationList } = props;

  const { userId } = useParams();

  const messageInfo = useMemo(() => {
    return chatMap[CHAT_TYPE.single].get(userId) || {};
  }, [userId, chatMap]);

  const loadMoreData = () => {
    getHistoryMsg({ cursor: messageInfo?.cursor });
  };

  const getHistoryMsg = ({ cursor = "" }) => {
    WebIM.conn
      .getHistoryMessages({
        targetId: userId,
        pageSize: PAGE_SIZE,
        chatType: CHAT_TYPE.single,
        cursor
      })
      .then((res) => {
        res.messages.forEach((item) => {
          setMsgReaction({
            msgId: item.id,
            reactions: item.reactions
          });
        });
        pushChatMessage({
          chatType: CHAT_TYPE.single,
          fromId: userId,
          messageInfo: {
            list: res.messages,
            cursor: res.cursor,
            loadCount: res.messages.length
          },
          reset: cursor ? false : true
        });
      });
  };

  //拉取漫游消息
  useEffect(() => {
    // 切换channel 关闭thread面板
    handleThreadPanel(false);
    getHistoryMsg({ cursor: "" });
    if (conversationList.indexOf(userId) < 0) {
      conversationList.unshift(userId)
      setConversationList(conversationList)
    }
  }, [userId]);

  //好友详情展示
  const [visible, setVisible] = useState(false);
  //消息操作
  const handleOperation = (op, isThreadMessage = false, data) => {
    console.log("chat:", op, data);
    switch (op) {
      case "recall":
        recallMessage(data, isThreadMessage);
        break;
      case "openUserInfoPanel":
        //打开单聊者详情
        if (data.from !== WebIM.conn.user) {
          //更新单聊者信息
          getUsersInfo([data.from]).then(() => {
            setVisible(true);
          })
        }
        break;
      default:
        break;
    }
  };
  return (
    <div className={s.chatWrap}>
      <div className={s.main}>
        <Header />
        <div className={s.contentWrap}>
          <div id={SCROLL_WARP_ID} className={s.messageWrap}>
            <InfiniteScroll
              inverse={true}
              dataLength={messageInfo?.list?.length || 0}
              next={loadMoreData}
              hasMore={messageInfo?.loadCount >= PAGE_SIZE}
              style={{ display: "flex", flexDirection: "column-reverse" }}
              loader={<Spin />}
              endMessage={
                <div style={{ textAlign: "center" }}>没有更多消息啦～</div>
              }
              scrollableTarget={SCROLL_WARP_ID}
            >
              {messageInfo?.list?.map((item) => {
                return (
                  <div key={item.id}>
                    <MessageLeft
                      message={item}
                      onHandleOperation={handleOperation}
                      source={MESSAGE_ITEM_SOURCE.single}
                    />
                  </div>
                );
              })}
            </InfiniteScroll>
          </div>
          <div className={s.iptWrap}>
            <Input chatType={CHAT_TYPE.single} fromId={userId} />
          </div>
        </div>
      </div>
      <ContactDetail
        visible={visible}
        userId={userId}
        handleCancel={() => setVisible(false)}
      />
    </div>
  );
};

const mapStateToProps = ({ channel, app, contact }) => {
  return {
    visible: channel.channelVisible,
    chatMap: app.chatMap,
    showThreadPanel: channel.showThreadPanel,
    conversationList: contact.conversationList
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setVisible: (params) => {
      return dispatch({
        type: "channel/setVisible",
        payload: params
      });
    },
    pushChatMessage: (params) => {
      return dispatch({
        type: "app/pushChatMessage",
        payload: params
      });
    },
    handleThreadPanel: (params) => {
      return dispatch({
        type: "channel/setThreadPanelStatus",
        payload: params
      });
    },
    setMsgReaction: (params) => {
      return dispatch({
        type: "app/setMsgReaction",
        payload: params
      });
    },
    setConversationList: (params) => {
      return dispatch({
        type: "contact/setConversationList",
        payload: params
      });
    },
  };
};

export default memo(connect(mapStateToProps, mapDispatchToProps)(Chat));
