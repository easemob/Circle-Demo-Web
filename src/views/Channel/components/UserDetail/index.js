import React, { memo, useMemo, useEffect, useState } from "react";
import s from "./index.module.less";
import AvatarInfo from "@/components/AvatarInfo";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Icon from "@/components/Icon";
import { Menu, message } from "antd";
import { UN_MUTE, MUTE, KICK, USER_ROLE } from "@/consts";
import WebIM from "@/utils/WebIM";

const ChannelUserDetail = (props) => {
  const { userId, appUserInfo, currentChannelInfo, serverRole, setSelected } = props;

  const [muteId, setMuteId] = useState([]);
  const { serverId, channelId } = useParams();

  // 当前操作者的用户角色
  const optRole = serverRole[serverId];

  const canOpt = !(optRole === USER_ROLE.user);

  const navigate = useNavigate();
  //私聊
  const toChat = () => {
    setSelected("contacts");
    navigate(`/main/contacts/chat/${userId}`);
  };

  const muteUser = () => {
    WebIM.conn
      .muteChannelMember({
        serverId,
        channelId,
        userId,
        duration: -1
      })
      .then(() => {
        setMuteId([...muteId, userId]);
      }).catch(err => {
        if (err.type === 17 && JSON.parse(err.data).error_description === "User is not in server.") {
          message.warn({ content: "用户已退出社区" });
          console.log("err=====")
        }
      });
  };

  const unMuteUser = () => {
    WebIM.conn.unmuteChannelMember({
      serverId,
      channelId,
      userId
    }).then(() => {
      let ids = muteId.filter((item) => !item.includes(userId));
      setMuteId(ids);
    }).catch(err => {
      if (err.type === 17 && JSON.parse(err.data).error_description === "User is not in server.") {
        message.warn({ content: "用户已退出社区" });
      }
    });
  };

  const kickOut = () => {
    WebIM.conn.removeChannelMember({
      serverId,
      channelId,
      userId
    }).catch(err => {
      if (err.type === 17 && JSON.parse(err.data).error_description === "User is not in server.") {
        message.warn({ content: "用户已退出社区" });
      }
    });
  };

  const onMenuClick = (e) => {
    switch (e.key) {
      case "mute":
        muteUser();
        break;
      case "unmute":
        unMuteUser();
        break;
      case "kick":
        kickOut();
        break;
      default:
        break;
    }
  };

  const getMutedlist = () => {
    WebIM.conn
      .getChannelMutelist({
        serverId,
        channelId
      })
      .then((res) => {
        const ids = res.data.list.map((item) => item.userId);
        setMuteId(ids);
      });
  };

  const UserMenuChildren = useMemo(() => {
    let roleMenu = [];
    if (muteId.includes(userId)) {
      roleMenu.push(UN_MUTE);
    } else {
      roleMenu.push(MUTE);
    }
    currentChannelInfo?.defaultChannel !== 1 && roleMenu.push(KICK);
    return roleMenu;
  }, [muteId, currentChannelInfo]);

  useEffect(() => {
    if (canOpt) {
      getMutedlist();
    }
  }, []);

  const UserMenuItems = [
    {
      label: <Icon size="22px" color="#fff" name="ellipsis" />,
      key: "SubMenu",
      children: UserMenuChildren
    }
  ];

  return (
    <div className={s.userDetail}>
      <div className={s.infoCon}>
        <div className={s.left}>
          <div className={s.avatar}>
            <AvatarInfo size={56} src={appUserInfo[userId]?.avatarurl} />
          </div>
          <div className={s.info}>
            <div className={s.nickname}>
              {appUserInfo[userId]?.nickname || userId}
            </div>
            <div className={s.idName}>环信ID：{userId}</div>
          </div>
        </div>
        {canOpt && (
          <div className={s.op}>
            <Menu
              className={s.menuWrap}
              onClick={(e) => {
                onMenuClick(e);
              }}
              style={{ padding: 0 }}
              theme={"dark"}
              selectable={false}
              triggerSubMenuAction="click"
              mode="horizontal"
              items={UserMenuItems}
            ></Menu>
          </div>
        )}
      </div>
      <div className={s.toChat}>
        <span className={s.chatCon} onClick={toChat}>
          <Icon name="message" size="24px" color="rgba(255,255,255,.74)" />
          <span className={s.private}>私聊</span>
        </span>
      </div>
    </div>
  );
};
const mapStateToProps = ({ app, contact }) => {
  return {
    appUserInfo: app.appUserInfo,
    serverRole: app.serverRole,
    contactsList: contact.contactsList,
    hasSentApply: contact.hasSentApply,
    currentChannelInfo: app.currentChannelInfo
  };
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

export default memo(connect(mapStateToProps, mapDispatchToProps)(ChannelUserDetail));
