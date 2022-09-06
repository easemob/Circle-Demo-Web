import React, { memo, useCallback, useEffect, useMemo } from "react";
import { Collapse } from "antd";
import { DownOutlined } from "@ant-design/icons";
import s from "../index.module.less";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import WebIM from "@/utils/WebIM";
import { getThreadParentMsg, filterData } from "@/utils/common";
import { CHAT_TYPE, THREAD_PAGE_SIZE } from "@/consts";
import { message } from "antd";
import Icon from "@/components/Icon";

const { Panel } = Collapse;

const ThreadItem = (props) => {
  const { threadInfo, currentId } = props;
  const isCurrentThread = currentId === threadInfo.id;
  return (
    <div
      className={
        isCurrentThread ? `${s.threadItem} ${s.threadActive}` : s.threadItem
      }
    >
      <span className={s.threadName}>
        <span className={s.name}>{threadInfo.name}</span>
      </span>

      <div style={{ width: "22px", textAlign: "left" }}>
        <Icon name="shevron_right" color="#858585" size="14px"></Icon>
      </div>
    </div>
  );
};

const LoadBtn = ({ onClick }) => {
  return (
    <div className={s.loadBtn} onClick={onClick}>
      加载更多子区
      <DownOutlined
        style={{ color: "#767676", fontSize: "12px", marginLeft: "2px" }}
      />
    </div>
  );
};

const getThreadInfoById = ({ channelId = "", threadMap = new Map() }) => {
  return threadMap.get(channelId);
};

const ChannelItem = (props) => {
  const {
    active,
    name,
    channelId,
    serverId,
    setThreadMap,
    threadMap,
    setThreadInfo,
    isPublic,
    setIsCreatingThread,
    chatMap
  } = props;

  const { threadId } = useParams();

  const navigate = useNavigate();

  const channelThreadInfo = useMemo(() => {
    return getThreadInfoById({ channelId, threadMap });
  }, [channelId, threadMap]);

  const getChannelThread = useCallback(
    async ({ channelId, cursor = "" }) => {
      try {
        let res = await WebIM.conn.getChatThreads({
          parentId: channelId,
          pageSize: THREAD_PAGE_SIZE,
          cursor
        });

        let ls = [];
        if (!channelThreadInfo?.list) {
          ls = res.entities;
        } else {
          const resList = filterData(
            channelThreadInfo?.list,
            res.entities,
            "id"
          );
          ls = [...channelThreadInfo?.list, ...resList];
        }
        setThreadMap({
          channelId,
          threadInfo: {
            list: ls,
            cursor: res.properties.cursor,
            loadCount: res.entities.length
          }
        });
      } catch (error) {
        console.log(error);
      }
    },
    [channelThreadInfo?.list, setThreadMap]
  );

  //thread路由跳转
  const gotoThread = (threadInfo) => {
    //查询本地thread的原始消息
    const findMsg = getThreadParentMsg(
      threadInfo.parentId,
      threadInfo.messageId
    );
    let parentMessage = findMsg ? { ...findMsg, chatThreadOverview: {} } : {};
    setIsCreatingThread(false);
    setThreadInfo({ ...threadInfo, parentMessage });
    WebIM.conn
      .joinChatThread({ chatThreadId: threadInfo.id })
      .then((res) => {
        //路由跳转
        navigate(`/main/channel/${serverId}/${channelId}/${threadInfo.id}`);
      })
      .catch((e) => {
        if (e.type === 1301) {
          //用户已经在子区了
          //路由跳转
          navigate(`/main/channel/${serverId}/${channelId}/${threadInfo.id}`);
        } else if (e.type === 1300) {
          message.warn({ content: "该子区已经被销毁" });
        }
      });
  };

  useEffect(() => {
    if (!threadMap.has(channelId)) {
      getChannelThread({ channelId, cursor: "" });
    }
  }, [channelId]);

  const getUnReadNum = (id) => {
    return chatMap[CHAT_TYPE.groupChat]?.get(id)?.unReadNum || 0;
  };

  const hasUnread = getUnReadNum(channelId) > 0;

  return (
    <div className={s.channelItemWrap}>
      <div
        onClick={() => {
          navigate(`/main/channel/${serverId}/${channelId}`);
        }}
        className={active ? `${s.channel} ${s.active}` : s.channel}
      >
        <span
          className={
            isPublic
              ? `${s.channelNameWrap} ${s.public} `
              : `${s.channelNameWrap} ${s.private}`
          }
        >
          <span className={s.name}>{name}</span>
        </span>
        <div
          className={s.unReadWrap}
        >
          {hasUnread && (
            <div className={s.unReadCount}>{getUnReadNum(channelId)}</div>
          )}
          <Icon name="shevron_right" color="#858585" size="14px"></Icon>
        </div>
      </div>
      <Collapse
        className={s.customCollapse}
        bordered={false}
        defaultActiveKey="1"
        expandIcon={({ isActive }) => {
          return (
            <Icon
              iconClass={isActive ? s.expand : s.fold}
              name={"shevron_down"}
              color="#767676"
              size="14px"
            />
          );
        }}
      >
        {channelThreadInfo?.list.length && (
          <Panel className={s.customCollapsePanel} header="子区" key="1">
            {channelThreadInfo?.list.map((item) => {
              return (
                <div key={item.id} onClick={() => gotoThread(item)}>
                  <ThreadItem threadInfo={item} currentId={threadId} />
                </div>
              );
            })}
            {channelThreadInfo?.loadCount === THREAD_PAGE_SIZE ? (
              <LoadBtn
                onClick={() => {
                  getChannelThread({
                    channelId,
                    cursor: channelThreadInfo?.cursor
                  });
                }}
              />
            ) : (
              <></>
            )}
          </Panel>
        )}
      </Collapse>
    </div>
  );
};

const mapStateToProps = ({ app, channel }) => {
  return {
    threadMap: channel.threadMap,
    chatMap: app.chatMap
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setThreadMap: (params) => {
      return dispatch({
        type: "channel/setThreadMap",
        payload: params
      });
    },
    setThreadInfo: (params) => {
      return dispatch({
        type: "thread/setThreadInfo",
        payload: params
      });
    },
    setIsCreatingThread: (params) => {
      return dispatch({
        type: "thread/setIsCreatingThread",
        payload: params
      });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(memo(ChannelItem));
