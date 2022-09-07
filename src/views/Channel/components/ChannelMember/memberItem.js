import React, { memo, useMemo } from "react";
import s from "./index.module.less";
import { useParams } from "react-router-dom";
import WebIM from "@/utils/WebIM";
import AvatarInfo from "@/components/AvatarInfo";
import BasicInfo from "@/components/BasicInfo";
import Icon from "@/components/Icon";
import MemberOpt from "../MemberOpt";
import { useNavigate } from "react-router-dom";
import { USER_ROLE, CHAT, UN_MUTE, MUTE, KICK } from "@/consts";
import { connect } from "react-redux";
import { message } from "antd";

const MemberItem = (props) => {
  const navigate = useNavigate();
  const { serverId, channelId } = useParams();

  const {
    info,
    uid,
    basicShowOnline,
    role,
    serverRole,
    channelMemberInfo,
    setChannelUserMap,
    muteList = [],
    channelInfo,
    setSelected,
  } = props;

  const selfRole = serverRole && serverRole[serverId];

  const muteUser = (uid) => {
    WebIM.conn
      .muteChannelMember({
        serverId,
        channelId,
        userId: uid,
        duration: -1
      })
      .then(() => {
        setChannelUserMap({
          channelId,
          userListInfo: {
            ...channelMemberInfo,
            muteList: muteList.length
              ? [...muteList, { userId: uid }]
              : [
                {
                  userId: uid
                }
              ]
          }
        });
      }).catch(err => {
        if (err.type === 17 && JSON.parse(err.data).error_description === "User is not in server.") {
          message.warn({ content: "用户已退出社区" });
        }
      });
  };

  const unMuteUser = (uid) => {
    WebIM.conn
      .unmuteChannelMember({
        serverId,
        channelId,
        userId: uid
      })
      .then(() => {
        let ls = [];
        if (muteList?.length) {
          ls = muteList;
          let idx = ls.findIndex((item) => {
            return item.userId === uid;
          });
          ls.splice(idx, 1);
        }
        setChannelUserMap({
          channelId,
          userListInfo: {
            ...channelMemberInfo,
            muteList: ls
          }
        });
      }).catch(err => {
        if (err.type === 17 && JSON.parse(err.data).error_description === "User is not in server.") {
          message.warn({ content: "用户已退出社区" });
        }
      });
  };

  const kickOut = (uid) => {
    WebIM.conn.removeChannelMember({
      serverId,
      channelId,
      userId: uid
    }).then(() => {
      const list = [...channelMemberInfo.list];
      const findIndex = list.findIndex(item => uid === item.uid)
      if (findIndex > -1) {
        list.splice(findIndex, 1)
        setChannelUserMap({
          channelId,
          userListInfo: {
            ...channelMemberInfo,
            list,
          }
        });
      }
    }).catch(err => {
      if (err.type === 17 && JSON.parse(err.data).error_description === "User is not in server.") {
        message.warn({ content: "用户已退出社区" });
      }
    });
  };
  const muteUid = muteList.map((item) => {
    return item.userId;
  });

  const isMuted = muteUid.includes(uid);

  const MemberMenuChildren = useMemo(() => {
    let roleMenu = [];
    if (WebIM.conn.user !== uid) {
      roleMenu.push(CHAT);
    }
    if (selfRole === USER_ROLE.owner && role !== USER_ROLE.owner) {
      if (isMuted) {
        roleMenu.push(UN_MUTE);
      } else {
        roleMenu.push(MUTE);
      }
      channelInfo.defaultChannel !== 1 && roleMenu.push(KICK);
    } else if (selfRole === USER_ROLE.moderator && role === USER_ROLE.user) {
      if (isMuted) {
        roleMenu.push(UN_MUTE);
      } else {
        roleMenu.push(MUTE);
      }
      channelInfo.defaultChannel !== 1 && roleMenu.push(KICK);
    }

    return roleMenu;
  }, [uid, selfRole, role, isMuted, channelInfo.defaultChannel]);

  const MemberMenuItems = [
    {
      label: <Icon iconClass={s.icon} name="ellipsis" />,
      key: "SubMenu",
      children: MemberMenuChildren
    }
  ];

  const onMenuClick = (e, { uid }) => {
    switch (e.key) {
      case "chat":
        setSelected("contacts");
        navigate(`/main/contacts/chat/${uid}`);
        break;
      case "mute":
        muteUser(uid);
        break;
      case "unmute":
        unMuteUser(uid);
        break;
      case "kick":
        kickOut(uid);
        break;
      default:
        break;
    }
  };

  return (
    <div className={s.contactsItem}>
      <div className={s.avatar}>
        <AvatarInfo
          size={36}
          name={info?.nickname || uid}
          src={info?.avatarurl}
          online={info?.online}
        />
      </div>
      <div className={s.mainInfo}>
        <div className={s.basicInfo}>
          <BasicInfo
            name={
              <div className={s.ellipsis}>
                <span className={s.name}>{info?.nickname || uid}</span>
                {isMuted && (
                  <span className={s.muteIcon}><Icon
                    style={{ marginLeft: "4px" }}
                    size="16px"
                    name="person_wave_slash"
                  /></span>
                )}
              </div>
            }
            icon={info?.avatar}
            online={info?.online}
            showOnline={basicShowOnline}
          />
        </div>
        <div className={s.operation}>
          {
            <MemberOpt
              serverId={serverId}
              isShowChat={false}
              showOpIcon={MemberMenuChildren.length > 0}
              uid={uid}
              role={role}
              onMenuClick={onMenuClick}
              menuItems={MemberMenuItems}
            />
          }
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setSelected: (params) => {
      return dispatch({
        type: "app/setSelectedTab",
        payload: params
      });
    },
  }
}
export default memo(connect(null, mapDispatchToProps)(MemberItem));