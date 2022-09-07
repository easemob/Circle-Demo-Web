import React, { memo, useEffect, useMemo } from "react";
import s from "./index.module.less";
import { connect } from "react-redux";
import AvatarInfo from "@/components/AvatarInfo";
import WebIM from "@/utils/WebIM";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Icon from "@/components/Icon";
import { CHAT_TYPE } from "@/consts"
import Number from "@/components/Number";
import { createMsg, deliverMsg, filterData, addServer, deleteServer, deleteLocalThread } from "@/utils/common";
import InfiniteScroll from "react-infinite-scroll-component";
import { MULTI_DEVICE_EVENT } from "@/consts"

const ScrollBar = (props) => {
  const {
    userInfo,
    setServerFormVisible,
    serverRole,
    setServerRole,
    setCurrentChatInfo,
    setUnReadNumber,
    chatMap,
    conversationData,
    joinedServerInfo,
    setJoinedServerInfo,
    serverMultiDeviceEvent,
    deleteThreadEvent,
    handleThreadPanel,
    setThreadInfo,
    channelEvent,
    applyNum,
    serverUserMap,
    setServerUserMap,
    selected,
    setSelected,
    appUserInfo,
  } = props;
  const SCROLL_WARP_ID = "serverScrollWrapId";
  const LIMIT = 20;
  const location = useLocation();

  const setSelectedVal = (loc) => {
    if (serverId) {
      setSelected(serverId);
    } else if (loc.indexOf("/main/user") > -1) {
      setSelected("userInfo");
    } else if (loc.indexOf("/main/server") > -1) {
      setSelected("serverSquare");
    } else {
      setSelected("contacts");
    }
  }
  const { serverId, channelId, userId, threadId } = useParams();

  const loadMoreData = () => {
    getJoinedServers({ cursor: joinedServerInfo?.cursor });
  };

  const getJoinedServers = ({ cursor = "" }) => {
    WebIM.conn
      .getJoinedServers({
        pageSize: LIMIT,
        cursor
      })
      .then((res) => {
        const { list, cursor } = res.data;
        if (cursor === "" && list.length > 0 && serverId) {
          const { id, defaultChannelId } = list[0];
          navigate(`/main/channel/${id}/${defaultChannelId}`);
        }
        let ls = [];

        if (joinedServerInfo?.list?.length) {
          //筛选已存在列表中的server(创建或加入时列表已自动插入server数据)
          const resList = filterData(joinedServerInfo.list, list, "id");
          ls = [...joinedServerInfo?.list, ...resList];
        } else {
          ls = list;
        }

        setJoinedServerInfo({
          list: ls,
          cursor,
          loadCount: list.length
        });
        if (!cursor) {
          if (res.data.list.length > 0 && serverId) {
            const { id, defaultChannelId } = res.data.list[0];
            navigate(`/main/channel/${id}/${defaultChannelId}`);
          }
        }
      });
  };

  useEffect(() => {
    serverId &&
      !serverRole[serverId] &&
      WebIM.conn.getServerRole({ serverId }).then((res) => {
        setServerRole({ serverId, role: res.data.role });
      });
    serverId && setSelected(serverId);
  }, [serverId]);

  useEffect(() => {
    if (channelId) {
      setCurrentChatInfo({
        chatType: CHAT_TYPE.groupChat,
        id: channelId
      })
      //清空未读数
      setUnReadNumber({
        chatType: CHAT_TYPE.groupChat,
        fromId: channelId,
        number: 0,
      })
    } else if (userId) {
      setCurrentChatInfo({
        chatType: CHAT_TYPE.single,
        id: userId
      })
      //清空未读数
      let msg = createMsg({
        chatType: CHAT_TYPE.single,
        type: "channel",
        to: userId
      });
      deliverMsg(msg).then(() => {
        setUnReadNumber({
          chatType: CHAT_TYPE.single,
          fromId: userId,
          number: 0,
        })
      });
    } else {
      setCurrentChatInfo({
        chatType: undefined,
        id: undefined
      })
    }
  }, [channelId, userId])
  useEffect(() => {
    getJoinedServers({ cursor: "" });
  }, []);

  useEffect(() => {
    setSelectedVal(location.pathname)
  }, [location])

  let navigate = useNavigate();
  const totalUnreadNum = () => {
    let total = 0;
    const conMap = chatMap[CHAT_TYPE.single];
    conversationData.forEach((item) => {
      if (conMap.get(item)?.unReadNum && conMap.get(item).unReadNum > 0) {
        total += conMap.get(item).unReadNum;
      }
    })
    total += applyNum;
    return total;
  }
  const serverMemberInfo = useMemo(() => {
    return serverUserMap.get(serverId) || {};
  }, [serverId, serverUserMap]);
  //处理server相关的事件
  const handleServerEvent = () => {
    switch (serverMultiDeviceEvent.event) {
      case MULTI_DEVICE_EVENT.serverCreate:
        WebIM.conn
          .getServerDetail({ serverId: serverMultiDeviceEvent.data.serverId })
          .then((res) => {
            addServer(res.data);
          })
        break;
      case MULTI_DEVICE_EVENT.serverDestroy:
        localDeleteServer(serverMultiDeviceEvent)
        break;
      case MULTI_DEVICE_EVENT.serverRemoved:
        if (serverMultiDeviceEvent.data.userId === WebIM.conn.user) {
          localDeleteServer(serverMultiDeviceEvent);
        } else {
          localDeleteUser(serverMultiDeviceEvent)
        }
        break;
      case MULTI_DEVICE_EVENT.serverJoin:
        WebIM.conn
          .getServerDetail({ serverId: serverMultiDeviceEvent.data.serverId })
          .then((res) => {
            addServer(res.data);
          })
        break;
      case MULTI_DEVICE_EVENT.serverLeave:
        localDeleteServer(serverMultiDeviceEvent);
        break;
      case MULTI_DEVICE_EVENT.serverRemoveMember:
        localDeleteUser(serverMultiDeviceEvent)
        break;
      default:
        break
    }
  }
  useEffect(() => {
    handleServerEvent()
  }, [serverMultiDeviceEvent])

  //被移除channel后跳转路由
  const handleChannelEvent = () => {
    switch (channelEvent.event) {
      case "removed":
        changeRoute(channelEvent);
        break;
      case "destroy":
        changeRoute(channelEvent);
        break;
      default:
        break;
    }
  }
  //退出或者删除频道后路由跳转
  const changeRoute = (channelEvent) => {
    const { serverInfo = {}, id = "" } = channelEvent.data;
    if (serverInfo.id === serverId && id === channelId) {
      const list = joinedServerInfo.list || [];
      const findIndex = list.findIndex(item => item.id === serverId);
      if (findIndex > -1) {
        const defaultChannelId = list[findIndex].defaultChannelId;
        navigate(`/main/channel/${serverId}/${defaultChannelId}`);
      }
    }
  }
  //删除本地的server
  const localDeleteServer = (serverMultiDeviceEvent) => {
    deleteServer(serverMultiDeviceEvent.data.serverId).then(res => {
      if (serverId === serverMultiDeviceEvent.data.serverId) {
        if (res.length > 0) {
          const { id, defaultChannelId } = res[0];
          navigate(`/main/channel/${id}/${defaultChannelId}`);
        } else {
          navigate(`/main/contacts/index`);
        }
      }
    })
  }
  //删除被移除的用户
  const localDeleteUser = (serverMultiDeviceEvent) => {
    let ls = serverMemberInfo?.list?.filter((item) => {
      return item.uid !== serverMultiDeviceEvent.data.userId;
    });
    setServerUserMap({
      serverId,
      userListInfo: {
        ...serverUserMap.get(serverId),
        list: ls
      }
    });
  }
  useEffect(() => {
    handleChannelEvent()
  }, [channelEvent])
  //thread相关事件
  useEffect(() => {
    if (deleteThreadEvent.event && deleteThreadEvent.event !== "") {
      deleteLocalThread(deleteThreadEvent.parentId, deleteThreadEvent.threadId).then(() => {
        if (threadId && threadId === deleteThreadEvent.threadId) {
          setThreadInfo({});
          handleThreadPanel(false);
          navigate(`/main/channel/${serverId}/${channelId}`);
        }
      })
    }
  }, [deleteThreadEvent])

  return (
    <div className={s.menuNav}>
      <div className={s.basis}>
        <div
          className={`${s.bgHover} ${s.avatarInfo} ${selected === "userInfo" ? s.selected : ""
            }`}
          onClick={() => {
            setSelected("userInfo");
            navigate("/main/user");
          }}
        >
          <AvatarInfo size={48} online={appUserInfo[userInfo.username].online} src={userInfo.avatarurl} />
        </div>
        <div
          className={`${s.bgHover} ${selected === "contacts" ? s.selected : ""
            }`}
          onClick={() => {
            setSelected("contacts");
            navigate("/main/contacts/index");
          }}
        >
          <div className={s.contacts}>
            <div className={s.contactsBg}></div>
            {totalUnreadNum() > 0 && (
              <div className={s.number}>
                <Number style={{ height: "16px", border: "2px solid #181818", lineHeight: "12px" }} number={totalUnreadNum()} /></div>
            )}
          </div>
        </div>
        <div className={s.divider}></div>
      </div>
      <div className={s.servers}>
        <div id={SCROLL_WARP_ID} className={s.serversList}>
          <InfiniteScroll
            dataLength={joinedServerInfo?.list?.length || 0}
            next={loadMoreData}
            hasMore={joinedServerInfo?.loadCount === LIMIT}
            loader={<></>}
            endMessage={<></>}
            scrollableTarget={SCROLL_WARP_ID}
          >
            {joinedServerInfo?.list?.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`${s.bgHover} ${selected === item.id ? s.selected : ""
                    }`}
                  onClick={() => {
                    setSelected(item.id);
                    navigate(
                      `/main/channel/${item.id}/${item.defaultChannelId}`
                    );
                  }}
                >
                  <AvatarInfo size={48} src={item.icon} isServer={true} />
                </div>
              );
            })}
          </InfiniteScroll>
          <div
            className={`${s.bgHover} ${selected === "createServer" ? s.selected : ""
              }`}
            onClick={() => {
              setServerFormVisible(true);
            }}
          >
            <div className={s.createServer}>
              <Icon name="plus" size="24px" iconClass={s.plus} />
            </div>
          </div>
        </div>
      </div>
      <div className={s.more}>
        <div
          className={`${s.bgHover} ${s.squareCon} ${selected === "serverSquare" ? s.selected : ""
            }`}
          onClick={() => {
            setSelected("serverSquare");
            navigate("/main/server");
          }}
        >
          <div className={s.square}>
            <Icon name="square_4" size="28px" iconClass={s.squareIcon} />
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ app, server, contact, thread }) => {
  return {
    loginSuccess: app.loginSuccess,
    userInfo: app.userInfo,
    appUserInfo: app.appUserInfo,
    serverRole: app.serverRole,
    chatMap: app.chatMap,
    conversationData: contact.conversationList,
    joinedServerInfo: server.joinedServerInfo,
    serverMultiDeviceEvent: server.serverMultiDeviceEvent,
    deleteThreadEvent: thread.deleteThreadEvent,
    channelEvent: server.channelEvent,
    applyNum: contact.applyInfo.length,
    serverUserMap: server.serverUserMap,
    selected: app.selectedTab,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setJoinedServerInfo: (params) => {
      return dispatch({
        type: "server/setJoinedServerInfo",
        payload: params
      });
    },
    setServerFormVisible: (params) => {
      return dispatch({
        type: "app/setVisible",
        payload: params
      });
    },
    setServerRole: (params) => {
      return dispatch({
        type: "app/setServerRole",
        payload: params,
      })
    },
    setCurrentChatInfo: (params) => {
      return dispatch({
        type: "app/setCurrentChatInfo",
        payload: params,
      })
    },
    setUnReadNumber: (params) => {
      return dispatch({
        type: "app/setUnReadNumber",
        payload: params
      });
    },
    handleThreadPanel: (params) => {
      return dispatch({
        type: "thread/setThreadPanelStatus",
        payload: params
      })
    },
    setThreadInfo: (params) => {
      return dispatch({
        type: "thread/setThreadInfo",
        payload: params
      })
    },
    setServerUserMap: (params) => {
      return dispatch({
        type: "server/setServerUserMap",
        payload: params
      });
    },
    setSelected: (params) => {
      return dispatch({
        type: "app/setSelectedTab",
        payload: params
      });
    },
  };
};
export default memo(connect(mapStateToProps, mapDispatchToProps)(ScrollBar));
