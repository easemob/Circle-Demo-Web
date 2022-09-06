import React, { memo, useCallback, useMemo, useState } from "react";
import { Collapse, message, List, Tooltip } from "antd";
import Desc from "./components/serverDesc";
import ChannelItem from "./components/channelItem";
import s from "./index.module.less";
import { Menu, Modal } from "antd";
import { getServerMenuChildren, SERVER_MENU_TYPES } from "../const";
import { connect } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Icon from "@/components/Icon";
import { SERVER_OPT_TYPE, INVITE_TYPE, USER_ROLE } from "@/consts";
import WebIM from "@/utils/WebIM";
import { useEffect } from "react";
import InviteUser from "../InviteUser";
import {
  getConfirmModalConf,
  filterData,
  deleteServer,
  getServerCover
} from "@/utils/common";
import InfiniteScroll from "react-infinite-scroll-component";
import TagItem from "./components/tagItem";

const SCROLL_WARP_ID = "publicScrollWrap";

const LIMIT = 15;

const { Panel } = Collapse;

const TEXT_COLLAPSE = "TEXT";

const DEFAULT_TEXT = "DEFAULT_TEXT";

const TextHeader = ({ setChannelVisible, selfRole }) => {
  return (
    <div className={s.headerWrap}>
      <div className={s.textHeader}>文字频道</div>
      {selfRole === USER_ROLE.owner && (
        <Tooltip title="创建频道" overlayClassName="toolTip">
          <div
            className={s.addIcon}
            onClick={(e) => {
              e.stopPropagation();
              setChannelVisible(true);
            }}
          />
        </Tooltip>
      )}
    </div>
  );
};
const ServerMenuItems = (role) => {
  return [
    {
      label: (
        <div className={`${s.icon}`}>
          <Icon name="ellipsis" color="#fff" size="28px" />
        </div>
      ),
      key: "SubMenu",
      children: getServerMenuChildren(role)
    }
  ];
};

const getServerInfoById = ({ serverId = "", serverList = [] }) => {
  let ls = serverList.filter((item) => {
    return item.id === serverId;
  });

  if (ls.length) {
    return ls[0];
  } else {
    return {};
  }
};

const getChannelInfo = ({ serverId = "", channelMap = new Map() }) => {
  return channelMap.get(serverId);
};

const SideBar = (props) => {
  const {
    setVisible,
    setChannelVisible,
    setInviteVisible,
    setServerFormVisible,
    joinedServerInfo,
    channelMap,
    setServerChannelMap,
    currentChannelInfo,
    serverRole,
    tags,
    setTags,
  } = props;

  const [activeKeys, setActiveKeys] = useState([TEXT_COLLAPSE]);
  const navigate = useNavigate();
  const { serverId, channelId, threadId } = useParams();
  const selfRole = serverRole && serverRole[serverId];
  const serverInfo = useMemo(() => {
    return getServerInfoById({ serverId, serverList: joinedServerInfo.list });
  }, [serverId, joinedServerInfo]);
  const channelInfo = useMemo(() => {
    return getChannelInfo({ serverId, channelMap });
  }, [channelMap, serverId]);

  const { name, description = "" } = serverInfo;
  const dataSource = channelInfo
    ? [...channelInfo?.public, ...channelInfo?.private]
    : [];

  const loadMoreData = () => {
    if (!hasMorePublic) {
      getPrivateChannel({ cursor: channelInfo?.privateCursor });
    } else {
      getPublicChannel({ cursor: channelInfo?.publicCursor });
    }
  };

  const onChange = (e) => {
    if (e?.length) {
      setActiveKeys([TEXT_COLLAPSE]);
    } else {
      setActiveKeys([DEFAULT_TEXT]);
    }
  };

  const onMenuClick = (e) => {
    if (e.key === SERVER_MENU_TYPES.create) {
      setChannelVisible(true);
    } else if (e.key === SERVER_MENU_TYPES.viewMember) {
      //路由跳转
      navigate(`/main/channel/${serverId}/${channelId}`);
      if (threadId) {
        setTimeout(() => {
          setVisible(true);
        }, 0)
      } else {
        setVisible(true);
      }
    } else if (e.key === SERVER_MENU_TYPES.editServer) {
      setServerFormVisible(SERVER_OPT_TYPE.edit);
    } else if (e.key === SERVER_MENU_TYPES.leaveServer) {
      const conf = getConfirmModalConf({
        title: <div style={{ color: "#fff" }}>退出社区</div>,
        content: (
          <div style={{ color: "#fff", marginTop: "37px" }}>
            {`确认退出社区 ${name}？`}
          </div>
        ),
        onOk: () => {
          WebIM.conn
            .leaveServer({
              serverId
            })
            .then((res) => {
              message.success("退出社区成功");
              deleteServer(serverId).then((res) => {
                if (res.length > 0) {
                  const { id, defaultChannelId } = res[0];
                  navigate(`/main/channel/${id}/${defaultChannelId}`);
                } else {
                  navigate(`/main/contacts/index`);
                }
              });
            });
        }
      });
      Modal.confirm(conf);
    } else {
      const conf = getConfirmModalConf({
        title: <div style={{ color: "#fff" }}>解散社区</div>,
        content: (
          <div style={{ color: "#fff", marginTop: "37px" }}>
            {`确认解散社区 ${name}？本操作不可恢复`}。
          </div>
        ),
        onOk: () => {
          WebIM.conn
            .destroyServer({
              serverId
            })
            .then((res) => {
              message.success("解散社区成功");
              deleteServer(serverId).then((res) => {
                if (res.length > 0) {
                  const { id, defaultChannelId } = res[0];
                  navigate(`/main/channel/${id}/${defaultChannelId}`);
                } else {
                  navigate(`/main/contacts/index`);
                }
              });
            });
        }
      });
      Modal.confirm(conf);
    }
  };
  const [hasMorePublic, setHasMorePublic] = useState(true);
  const getPublicChannel = useCallback(
    ({ cursor = "" }) => {
      WebIM.conn
        .getPublicChannels({
          serverId,
          pageSize: LIMIT,
          cursor
        })
        .then((res) => {
          let ls = [];
          if (!channelInfo?.public) {
            ls = res.data.list;
          } else {
            const resList = filterData(
              channelInfo?.public,
              res.data.list,
              "channelId"
            );
            ls = [...channelInfo?.public, ...resList];
          }
          const dt = {
            public: ls,
            publicCursor: res.data.cursor,
            private: [],
            privateCursor: "",
            loadCount: res.data.list.length
          };
          if (res.data.list.length < LIMIT) {
            setHasMorePublic(false);
            WebIM.conn
              .getVisiblePrivateChannels({
                serverId,
                pageSize: LIMIT,
                cursor: ""
              })
              .then((privateRes) => {
                const privateList = channelInfo?.private || [];
                const resList = filterData(
                  privateList,
                  privateRes.data.list,
                  "channelId"
                );
                let ls = [...privateList, ...resList];
                setServerChannelMap({
                  serverId,
                  channelInfo: {
                    ...dt,
                    private: ls,
                    privateCursor: privateRes?.data?.cursor,
                    loadCount: privateRes.data.list.length
                  }
                });
              });
          } else {
            setServerChannelMap({
              serverId,
              channelInfo: dt
            });
          }
        });
    },
    [channelInfo?.private, channelInfo?.public, serverId, setServerChannelMap]
  );

  const getPrivateChannel = ({ cursor = "" }) => {
    WebIM.conn
      .getVisiblePrivateChannels({
        serverId,
        pageSize: LIMIT,
        cursor
      })
      .then((res) => {
        const privateList = channelInfo?.private || [];
        const resList = filterData(privateList, res.data.list, "channelId");
        let ls = [...privateList, ...resList];
        setServerChannelMap({
          serverId,
          channelInfo: {
            ...channelInfo,
            private: ls,
            privateCursor: res.data.cursor,
            loadCount: res.data.list.length
          }
        });
      });
  };

  useEffect(() => {
    if (!channelMap.has(serverId)) {
      getPublicChannel({ cursor: "" });
    }
  }, [serverId, channelMap, getPublicChannel]);

  useEffect(() => {
    WebIM.conn.getServerTags({ serverId }).then((res) => {
      setTags(res.data.tags);
    });
  }, [serverId]);
  return (
    <div className={s.sideBarWrap}>
      <>
        <div
          className={s.serverCover}
          style={{
            backgroundImage: `url(${getServerCover(serverId)})`
          }}
        >
          <div className={s.shadow}></div>
          <div className={s.infoWrap}>
            <div className={s.serverName}>{name}</div>
            <div className={s.iconWarp}>
              <div
                className={`${s.icon}`}
                onClick={() => {
                  setInviteVisible(INVITE_TYPE.inviteServer);
                }}
              >
                <Icon
                  name="person_plus"
                  size="28px"
                  color="#fff"
                  style={{ marginRight: "8px" }}
                />
              </div>

              <InviteUser
                serverName={name}
                channelName={currentChannelInfo?.name}
              />
              <Menu
                onClick={onMenuClick}
                style={{ padding: 0 }}
                theme={"dark"}
                selectable={false}
                triggerSubMenuAction="click"
                mode="horizontal"
                items={ServerMenuItems(selfRole)}
              ></Menu>
            </div>
          </div>
          <div className={s.tagWrap}>
            {tags.map((item) => {
              return <TagItem item={item} key={item.tagId} />;
            })}
          </div>
        </div>
        {description && <Desc desc={description} />}
      </>
      <div className={s.channelWrap}>
        <Collapse
          className={s.customCollapse}
          bordered={false}
          activeKey={activeKeys}
          expandIcon={({ isActive }) => {
            return (
              <Icon
                iconClass={isActive ? s.expand : s.fold}
                name={"shevron_down"}
                color="#c7c7c7"
                size="14px"
              />
            );
          }}
          onChange={onChange}
        >
          <Panel
            className={s.customCollapsePanel}
            header={
              <TextHeader
                setChannelVisible={setChannelVisible}
                selfRole={selfRole}
              />
            }
            key={TEXT_COLLAPSE}
          >
            <div id={SCROLL_WARP_ID} className={s.channelContentWrap}>
              <InfiniteScroll
                dataLength={dataSource.length || 0}
                next={loadMoreData}
                hasMore={channelInfo?.loadCount === LIMIT}
                loader={<></>}
                endMessage={<></>}
                scrollableTarget={SCROLL_WARP_ID}
              >
                <List
                  dataSource={dataSource}
                  renderItem={(item) => (
                    <List.Item key={item.channelId}>
                      <ChannelItem
                        {...item}
                        key={item.channelId}
                        active={!threadId && channelId === item.channelId}
                      />
                    </List.Item>
                  )}
                />
              </InfiniteScroll>
            </div>
          </Panel>
          {/* 收起展示默认Panel */}
          <Panel
            showArrow={false}
            className={s.customCollapsePanel}
            key={DEFAULT_TEXT}
          >
            <List
              dataSource={[currentChannelInfo]}
              renderItem={(item) => (
                <List.Item key={item.channelId}>
                  <ChannelItem
                    {...item}
                    key={item.channelId}
                    active={!threadId && channelId === item.channelId}
                  />
                </List.Item>
              )}
            />
          </Panel>
        </Collapse>
      </div>
    </div>
  );
};

const mapStateToProps = ({ server, app }) => {
  return {
    joinedServerInfo: server.joinedServerInfo,
    channelMap: server.channelMap,
    currentChannelInfo: app.currentChannelInfo,
    serverRole: app.serverRole,
    tags: server.currentServerTag,
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
    setChannelVisible: (params) => {
      return dispatch({
        type: "channel/setChannelVisible",
        payload: params
      });
    },
    setInviteVisible: (params) => {
      return dispatch({
        type: "channel/setInviteVisible",
        payload: params
      });
    },
    setServerFormVisible: (params) => {
      return dispatch({
        type: "app/setVisible",
        payload: params
      });
    },
    setServerChannelMap: (params) => {
      return dispatch({
        type: "server/setChannelMap",
        payload: params
      });
    },
    setTags: (params) => {
      return dispatch({
        type: "server/setCurrentServerTag",
        payload: params
      });
    },
  };
};

export default memo(connect(mapStateToProps, mapDispatchToProps)(SideBar));
