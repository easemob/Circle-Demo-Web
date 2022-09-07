import React, { memo, useEffect, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import s from "./index.module.less";
import { connect } from "react-redux";
import CustomModal from "@/components/CustomModal";
import HeaderWrap from "@/components/HeaderWrap";
import MemberItem from "@/components/MemberItem";
import WebIM from "@/utils/WebIM";
import { useParams } from "react-router-dom";
import { getUsersInfo } from "@/utils/common";
import { message } from "antd";
import Icon from "@/components/Icon";
import MemberOpt from "../MemberOpt";
import { USER_ROLE } from "@/consts";

const PAGE_SIZE = 20;

const SCROLL_WARP_ID = "memberScrollWrap";

const Title = () => {
  return (
    <HeaderWrap style={{ position: "unset", width: "100%" }}>
      <span className={`${s.name} ${s.public}`}><span className={s.person}><Icon name="person_2" color="#fff" size="26px" /></span>社区成员</span>
      {/* <div className={`${s.iptWrap}`}>
        <Icon name="magnify" color="#fff" />
        <Input placeholder="搜索社区成员" autoComplete="off" />
      </div> */}
    </HeaderWrap>
  );
};

const MemberMenuChildren = (selfRole, userRole, item) => {
  let menu = [];
  if (userRole === USER_ROLE.owner || selfRole === USER_ROLE.user) return menu;
  if (selfRole === USER_ROLE.owner) {
    let menu1 = {};
    if (userRole === USER_ROLE.user) {
      menu1 = {
        label: (
          <div>
            <Icon name="person_nut" size="24px" />
            <span>设为管理员</span>
          </div>
        ),
        key: "setAdmin"
      };
    } else if (userRole === USER_ROLE.moderator) {
      menu1 = {
        label: (
          <div>
            <Icon name="person_normal" size="22px" />
            <span>取消管理员</span>
          </div>
        ),
        key: "removeAdmin"
      };
    }
    menu.push(menu1);
  }
  if (item?.uid !== WebIM.conn.user) {
    menu.push({
      label: (
        <div>
          <Icon name="minus_in_circle" size="16px" />
          <span>踢出社区</span>
        </div>
      ),
      key: "kick"
    });
  }
  return menu;
};

const MemberMenuItems = (selfRole, userRole) => [
  {
    label: <Icon iconClass='opIcon' name="ellipsis" />,
    key: "SubMenu",
    children: MemberMenuChildren(selfRole, userRole)
  }
];

const MemberModal = (props) => {
  const {
    visible,
    setVisible,
    appUserInfo,
    setServerUserMap,
    serverUserMap,
    serverRole
  } = props;

  const { serverId, channelId } = useParams();
  const selfRole = serverRole && serverRole[serverId];
  const serverMemberInfo = useMemo(() => {
    return serverUserMap.get(serverId) || {};
  }, [serverId, serverUserMap]);

  // 踢出列表
  const onKick = (uid) => {
    let ls = serverMemberInfo?.list?.filter((item) => {
      return item.uid !== uid;
    });
    setServerUserMap({
      serverId,
      userListInfo: {
        ...serverUserMap.get(serverId),
        list: ls
      }
    });
  };
  //设置角色后更新社区成员角色
  const updateUserRole = (serverId, uid, role) => {
    const userList = [...serverMemberInfo?.list] || [];
    let fIndex = userList.findIndex((item) => {
      return item.uid === uid;
    });
    if (fIndex > -1) {
      let find = { ...userList[fIndex] };
      find.role = role;
      userList.splice(fIndex, 1, find);
      setServerUserMap({
        serverId,
        userListInfo: {
          ...serverUserMap.get(serverId),
          list: userList
        }
      });
    }
  };

  const onMenuClick = (e, { uid, serverId }) => {
    if (e.key === "kick") {
      WebIM.conn
        .removeServerMember({
          serverId,
          userId: uid
        })
        .then(() => {
          onKick(uid);
          message.success("踢出成功");
        });
    } else if (e.key === "setAdmin") {
      let options = {
        serverId: serverId,
        userId: uid
      };
      WebIM.conn.setServerAdmin(options).then(() => {
        updateUserRole(serverId, uid, USER_ROLE.moderator);
      });
    } else if (e.key === "removeAdmin") {
      let options = {
        serverId: serverId,
        userId: uid
      };
      WebIM.conn.removeServerAdmin(options).then(() => {
        updateUserRole(serverId, uid, "user");
      });
    }
  };

  const getServerMembers = ({ cursor = "" }) => {
    WebIM.conn
      .getServerMembers({
        serverId: serverId,
        pageSize: PAGE_SIZE,
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

        if (cursor !== "") {
          ls = [...serverMemberInfo.list, ...userRoleList];
        } else {
          ls = userRoleList;
        }

        setServerUserMap({
          serverId,
          userListInfo: {
            list: ls,
            cursor: res.data.cursor,
            loadCount: res.data.list.length
          }
        });
      });
  };

  const loadMoreData = () => {
    getServerMembers({ cursor: serverMemberInfo.cursor });
  };

  useEffect(() => {
    visible && getServerMembers({ cursor: "" });
  }, [visible]);

  return (
    <CustomModal
      title={<Title />}
      visible={visible}
      onCancel={() => {
        setVisible(false);
      }}
    >
      <div id={SCROLL_WARP_ID} className={s.scrollWrap}>
        <InfiniteScroll
          dataLength={serverMemberInfo?.list?.length || 0}
          next={loadMoreData}
          hasMore={serverMemberInfo.loadCount === PAGE_SIZE}
          loader={<></>}
          endMessage={<></>}
          scrollableTarget={SCROLL_WARP_ID}
        >
          {serverMemberInfo?.list?.map((item) => {
            return (
              <MemberItem
                style={{ padding: 0 }}
                info={appUserInfo[item.uid]}
                key={item.uid}
                uid={item.uid}
                operationReactNode={
                  <MemberOpt
                    isServer={true}
                    serverId={serverId}
                    {...item}
                    onMenuClick={onMenuClick}
                    menuItems={MemberMenuItems(selfRole, item.role)}
                    isShowChat={item.uid !== WebIM.conn.user}
                    showOpIcon={
                      MemberMenuChildren(selfRole, item.role, item).length > 0
                    }
                    selfRole={selfRole}
                  />
                }
              />
            );
          })}
        </InfiniteScroll>
      </div>
    </CustomModal>
  );
};

const mapStateToProps = ({ channel, app, server }) => {
  return {
    visible: channel.memberVisible,
    appUserInfo: app.appUserInfo,
    serverUserMap: server.serverUserMap,
    serverRole: app.serverRole
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
    setServerUserMap: (params) => {
      return dispatch({
        type: "server/setServerUserMap",
        payload: params
      });
    }
  };
};

export default memo(connect(mapStateToProps, mapDispatchToProps)(MemberModal));
