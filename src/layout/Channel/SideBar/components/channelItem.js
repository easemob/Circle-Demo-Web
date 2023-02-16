import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import s from "../index.module.less";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import WebIM from "@/utils/WebIM";
import { getThreadParentMsg, filterData, deleteLocalChannel, insertChannelList, getUsersInfo, getConfirmModalConf, joinRtcRoom, leaveRtcChannel } from "@/utils/common";
import { THREAD_PAGE_SIZE, INVITE_TYPE, USER_ROLE } from "@/consts";
import { Collapse, message, Dropdown, Modal } from "antd";
import { CHANNEL_MENU_TYPES, getChannelMenu, getRtcMemberMenu, RTC_MEMBER_MENU } from "../../const"
import Icon from "@/components/Icon";
import RtcMember from "./RtcMember";


const { Panel } = Collapse;
const MEMBER_LIMIT = 20;

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
      {/* <div style={{ width: "22px", textAlign: "left" }}>
        <Icon name="shevron_right" color="#858585" size="14px"></Icon>
      </div> */}
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
    channelInfo,
    mode,
    active,
    name,
    channelId,
    serverId,
    setThreadMap,
    threadMap,
    setThreadInfo,
    isPublic,
    setIsCreatingThread,
    serverRole,
    categoryId,
    categoryInfo,
    setInviteVisible,
    setInviteChannelInfo,
    channelUserMap,
    setChannelUserMap,
    userInfo,
    appUserInfo,
    curRtcChannelInfo,
    setServerChannelMap,
    serverChannelMap,
    currentChannelInfo,
    setCurrentChannelInfo,
    setSettingChannelInfo,
  } = props;
  const selfRole = serverRole && serverRole[serverId];
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
    setThreadInfo({ threadInfo: { ...threadInfo, parentMessage } });
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
          message.warning({ content: "该子区已经被销毁" });
        }
      });
  };

  useEffect(() => {
    if (!threadMap.has(channelId) && channelInfo?.mode === 0) {
      //用户在频道则拉取thread列表
      WebIM.conn.isInChannel({ serverId, channelId }).then((res) => {
        if (res.data.result) {
          getChannelThread({ channelId, cursor: "" });
        }
      })
    }
  }, [channelId]);
  const channelMemberInfo = useMemo(() => {
    return channelUserMap.get(channelId) || {};
  }, [channelId, channelUserMap]);

  //获取频道成员
  const getChannelMembers = ({ cursor = "", muteList = null }) => {
    WebIM.conn
      .getChannelMembers({
        serverId,
        channelId,
        pageSize: MEMBER_LIMIT,
        cursor
      })
      .then((res) => {
        const uidList = res.data.list.map((item) => item.userId);

        let userRoleList = res.data.list.map((item) => {
          return {
            role: item.role,
            uid: item.userId
          };
        });

        let ls = [];

        getUsersInfo(uidList);

        if (channelMemberInfo.list && cursor !== "") {
          ls = [...channelMemberInfo.list, ...userRoleList];
        } else {
          ls = userRoleList;
        }
        setChannelUserMap({
          channelId,
          userListInfo: {
            muteList: muteList,
            ...channelMemberInfo,
            list: ls,
            cursor: res.data.cursor,
            loadCount: res.data.list.length
          }
        });
      });
  };

  const getUnReadNum = (id) => {
    return serverChannelMap[serverId]?.[id] || 0;
  };

  const hasUnread = getUnReadNum(channelId) > 0;

  //右击频道
  const clickChannelMenu = (e, serverId, channelId) => {
    e.domEvent.stopPropagation();
    switch (e.key) {
      case CHANNEL_MENU_TYPES.invite:
        setInviteChannelInfo({ inviteChannelInfo: channelInfo });
        setInviteVisible(INVITE_TYPE.inviteChannel);
        break;
      case CHANNEL_MENU_TYPES.setUnread:
        setServerChannelMap({
          serverId: serverId,
          channelId,
          unReadNum: 0,
        })
        break;
      case CHANNEL_MENU_TYPES.editChannel:
        setSettingChannelInfo(channelInfo);
        navigate(`/main/channel/${serverId}/${channelId}/setting`);
        break;
      default:
        WebIM.conn.transferChannel({
          serverId,
          channelId,
          newCategoryId: e.key
        }).then(() => {
          const info = { ...channelInfo, categoryId: e.key }
          //被移动前的分组删除channel
          deleteLocalChannel({
            serverId,
            categoryId: channelInfo.categoryId,
            channelId,
            isDestroy: true,
            isTransfer: true,
          })
          //移动到的分组增加channel
          insertChannelList(serverId, channelId, info);
          if (currentChannelInfo.channelId === channelInfo.channelId) {
            setCurrentChannelInfo({ ...info })
          }
          message.success("移动频道到其他分组成功");
        }).catch(() => {
          message.error("移动频道到其他分组失败，请重试！");
        })
        break;
    }
  }
  const [openMemberPanel, setOpenMemberPanel] = useState(false)
  //监听频道子菜单打开、关闭
  const onChange = (key) => {
    if (key.indexOf("rtc") > -1) {
      setOpenMemberPanel(true);
      //获取语聊房成员
      getChannelMembers({ channelId, cursor: "" });
    } else {
      setOpenMemberPanel(false);
    }
  }
  //点击频道
  const clickChannelItem = () => {
    WebIM.conn.isInChannel({ serverId, channelId }).then((res) => {
      if (!res.data.result && selfRole === USER_ROLE.user && !isPublic) {
        message.error({ content: "此频道为私有频道，您需要被邀请才能加入" });
        return
      } else {
        if (mode === 0) {
          navigate(`/main/channel/${serverId}/${channelId}`);
          //清空未读
          setServerChannelMap({
            serverId,
            channelId,
            unReadNum: 0,
          })
          if (!threadMap.has(channelId) && channelInfo?.mode === 0) {
            //用户在频道则拉取thread列表
            WebIM.conn.isInChannel({ serverId, channelId }).then((res) => {
              if (res.data.result) {
                getChannelThread({ channelId, cursor: "" });
              }
            })
          }
        } else {
          //每次点击rtc channel都需要调用加入频道接口
          if (JSON.stringify(curRtcChannelInfo) === "{}") {
            WebIM.conn
              .joinChannel({
                serverId,
                channelId
              }).then(() => {
                joinRtcRoom(channelInfo);
              }).catch(e => {
                if (JSON.parse(e.data).error_description === "The number of channel users is full.") {
                  message.error({ content: "语聊房已满！" });
                } else if (JSON.parse(e.data).error_description === "The current user has no operation permission.") {
                  message.error({ content: "此频道为私有频道，您需要被邀请才能加入" });
                }
              })
          } else {
            if (curRtcChannelInfo?.channelId !== channelId) {
              //提示已经在别的rtc频道了
              const conf = getConfirmModalConf({
                title: <div style={{ color: "#fff" }}>加入语聊房频道</div>,
                content: (
                  <div style={{ color: "#fff" }}>
                    {`您已经在一个语聊房频道内了，确认要切换到`}&nbsp;<span style={{ fontWeight: 700 }}>{name}</span> {`吗？`}。
                  </div>
                ),
                cancelText: "我再想想",
                onOk: () => {
                  leaveRtcChannel({ needLeave: true, serverId: curRtcChannelInfo.serverId, channelId: curRtcChannelInfo.channelId }).then(() => {
                    //加入新频道
                    WebIM.conn
                      .joinChannel({
                        serverId,
                        channelId
                      }).then(() => {
                        joinRtcRoom(channelInfo);
                      }).catch(e => {
                        if (JSON.parse(e.data).error_description === "The number of channel users is full.") {
                          message.error({ content: "语聊房已满！" });
                        } else if (JSON.parse(e.data).error_description === "The current user has no operation permission.") {
                          message.error({ content: "此频道为私有频道，您需要被邀请才能加入" });
                        } else {
                          message.error({ content: "加入语聊房失败，请重试！" });
                        }
                      })
                  }).catch((e) => {
                    message.error({ content: "加入语聊房失败，请重试！" });
                  })
                }
              });
              Modal.confirm(conf);
            }
          }
        }
      }
    })

  }

  const clickRtcMember = (e, data) => {
    switch (e.key) {
      case RTC_MEMBER_MENU.chat:
        navigate(`/main/contacts/chat/${data.uid}`);
        break;
      case RTC_MEMBER_MENU.delete:
        WebIM.conn.removeChannelMember({
          serverId,
          channelId,
          userId: data.uid,
        }).then(() => {

          message.success("操作成功！");
        }).catch(() => {
          message.error("操作失败，请重试！");
        })
        break;
      default:
        break;
    }
  }
  const getCountInfo = () => {
    if (openMemberPanel) {
      return (channelMemberInfo?.list?.length || 0) + "/" + channelInfo.maxusers
    } else {
      return channelInfo.maxusers
    }
  }
  const menuDisable = mode === 1 && curRtcChannelInfo?.channelId !== channelId && selfRole === "user"

  return (
    <div className={s.channelItemWrap}>
      <Dropdown
        menu={{
          items: getChannelMenu({
            isInRtcChannel: curRtcChannelInfo?.channelId === channelId,
            mode,
            categoryId,
            pos: "list",
            role: selfRole,
            categorylist: categoryInfo?.list || []
          }),
          onClick: (e) => clickChannelMenu(e, serverId, channelId, channelInfo),
          triggerSubMenuAction: "hover",
        }}
        overlayClassName="circleDropDown"
        destroyPopupOnHide={true}
        disabled={menuDisable}
        trigger={['contextMenu']}
      >
        <div
          onClick={clickChannelItem}
          className={active ? `${s.channel} ${s.active}` : s.channel}
        >
          <span className={s.channelNameWrap}>
            <span className={s.iconBg}>
              {mode === 0 && isPublic && <Icon name="hashtag" size="16px" color={active ? "#fff" : "rgba(255,255,255,.74)"} />}
              {mode === 0 && !isPublic && <Icon name="hashtag_lock" size="16px" color={active ? "#fff" : "rgba(255,255,255,.74)"} />}
              {mode === 1 && isPublic && <Icon name="voice-01" size="16px" color={active ? "#fff" : "rgba(255,255,255,.74)"} />}
              {mode === 1 && !isPublic && <Icon name="mic_n_lock" size="16px" color={active ? "#fff" : "rgba(255,255,255,.74)"} />}
            </span>
            <span className={s.name}>{name}</span>
          </span>
          {mode === 0 && <div
            className={s.unReadWrap}
          >
            {hasUnread && (
              <div className={s.unReadCount}>{getUnReadNum(channelId)}</div>
            )}
            {/* <Icon name="shevron_right" color="#858585" size="14px"></Icon> */}
          </div>}
          {mode === 1 && <div className={s.countCon}>
            {curRtcChannelInfo?.channelId === channelId && <div className={`${s.seatCount} ${s.hasBg}`}>{getCountInfo()}</div>}
            {curRtcChannelInfo?.channelId !== channelId && <div className={s.seatCount}>{getCountInfo()}</div>}
          </div>}
        </div>
      </Dropdown>

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
        onChange={onChange}
      >
        {mode === 0 && channelThreadInfo?.list?.length && (
          <Panel className={s.customCollapsePanel} header={"子区"} key="1">
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
        {mode === 1 &&
          <Panel className={`${s.customCollapsePanel} ${s.childrenPanel}`} header={"语聊房成员"} key="rtc">
            {channelMemberInfo?.list?.map((item) => {
              return (
                <div key={item.uid}>
                  <Dropdown
                    menu={{
                      items: getRtcMemberMenu(selfRole, item),
                      onClick: (e) => clickRtcMember(e, item),
                      triggerSubMenuAction: "click",
                    }}
                    overlayClassName="circleDropDown"
                    destroyPopupOnHide={true}
                    trigger={['contextMenu']}
                    disabled={item.uid === userInfo.username}
                  >
                    <div>
                      <RtcMember userInfo={appUserInfo[item.uid]} isInChannel={curRtcChannelInfo?.channelId === channelId} />
                    </div>
                  </Dropdown>
                </div>

              );
            })}
            {channelMemberInfo?.loadCount === MEMBER_LIMIT ? (
              <LoadBtn
                onClick={() => {
                  getChannelMembers({
                    cursor: channelMemberInfo?.cursor
                  });
                }}
              />
            ) : (
              <></>
            )}
          </Panel>
        }
      </Collapse>
    </div>
  );
};

const mapStateToProps = ({ app, channel }) => {
  return {
    threadMap: channel.threadMap,
    serverRole: app.serverRole,
    channelUserMap: channel.channelUserMap,
    appUserInfo: app.appUserInfo,
    userInfo: app.userInfo,
    curRtcChannelInfo: channel.curRtcChannelInfo,
    serverChannelMap: app.serverChannelMap,
    currentChannelInfo: app.currentChannelInfo,
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
    },
    setInviteVisible: (params) => {
      return dispatch({
        type: "channel/setInviteVisible",
        payload: params
      });
    },
    setInviteChannelInfo: (params) => {
      return dispatch({
        type: "channel/setInviteChannelInfo",
        payload: params
      });
    },
    setChannelUserMap: (params) => {
      return dispatch({
        type: "channel/setChannelUserMap",
        payload: params
      });
    },
    setUnReadNumber: (params) => {
      return dispatch({
        type: "app/setUnReadNumber",
        payload: params
      });
    },
    setServerChannelMap: (params) => {
      return dispatch({
        type: "app/setServerChannelMap",
        payload: params
      });
    },
    setCurrentChannelInfo: (params) => {
      return dispatch({
        type: "app/setCurrentChannelInfo",
        payload: params,
      })
    },
    setSettingChannelInfo: (params) => {
      return dispatch({
        type: "channel/setSettingChannelInfo",
        payload: params,
      })
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(memo(ChannelItem));
