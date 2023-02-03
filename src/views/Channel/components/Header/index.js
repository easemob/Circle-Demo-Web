import React, { memo, useState, useMemo } from "react";
import s from "./index.module.less";
import HeaderWrap from "@/components/HeaderWrap";
import Icon from "@/components/Icon";
import { Popover, Menu, Tooltip, message } from "antd";
import { USER_ROLE, INVITE_TYPE } from "@/consts";
import ThreadList from "@/views/Thread/components/ThreadList";
import WebIM from "@/utils/WebIM";
import { connect } from "react-redux";
import { insertChannelList, deleteLocalChannel } from "@/utils/common"
import { CHANNEL_MENU_TYPES, getChannelMenu } from "@/layout/Channel/const"

const getCategoryInfo = ({ serverId = "", categoryMap = new Map() }) => {
  return categoryMap.get(serverId);
};
const getChannelItems = (channelInfo, userRole, categoryInfo) => {
  return [
    {
      label: (
        <div className={s.iconCon}>
          <Icon iconClass={s.icon} name="ellipsis" size="24px" />
        </div>
      ),
      key: "SubMenu",
      children: getChannelMenu({
        isInRtcChannel: false,
        mode: channelInfo?.mode,
        channelCategoryId: channelInfo?.channelCategoryId,
        pos: "bar",
        role: userRole,
        categorylist: categoryInfo?.list || []
      }),
    }
  ];
}

const ChannelHeader = (props) => {
  const {
    onHandleOperation,
    channelId,
    serverId,
    channelInfo,
    serverRole,
    channelMemberVisible,
    categoryMap,
    setInviteVisible,
    setInviteChannelInfo,
    setServerChannelMap,
    setCurrentChannelInfo
  } = props;
  //操作thread列表
  const [visibleThread, setVisibleThread] = useState(false);
  const userRole = serverRole[serverId];

  const hideThreadList = () => {
    setVisibleThread(false);
  };
  const handleVisibleThreadListChange = (newVisible) => {
    setVisibleThread(newVisible);
  };

  const onMenuClick = (e) => {
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
      default:
        WebIM.conn.transferChannel({
          serverId,
          channelId,
          channelCategoryId: e.key
        }).then(() => {
          const info = { ...channelInfo, channelCategoryId: e.key }
          //被移动前的分组删除channel
          deleteLocalChannel({
            serverId,
            channelCategoryId: channelInfo.channelCategoryId,
            channelId,
            isDestroy: true,
            isTransfer: true,
          })
          //移动到的分组增加channel
          insertChannelList(serverId, channelId, info);
          setCurrentChannelInfo({ ...info })
          message.success("移动频道到其他分组成功");
        }).catch(() => {
          message.error("移动频道到其他分组失败，请重试！");
        })
        break;
    }
  }
  //分组信息
  const categoryInfo = useMemo(() => {
    return getCategoryInfo({ serverId, categoryMap });
  }, [categoryMap, serverId]);
  //菜单信息
  const menuInfo = useMemo(()=>{
    return getChannelItems(channelInfo, userRole, categoryInfo)
  },[channelInfo, userRole, categoryInfo])
  return (
    <HeaderWrap>
      <span className={`${s.name} ${channelInfo?.isPublic
        ? `${s.channelNameWrap} ${s.base} `
        : `${s.channelNameWrap} ${s.private}`}`}
      >{channelInfo?.name}</span>
      <div className={s.optWrap}>
        <Popover
          placement="bottomRight"
          content={
            <ThreadList
              onClose={hideThreadList}
              onHandleOperation={onHandleOperation}
              visibleThread={visibleThread}
            />
          }
          trigger="click"
          open={visibleThread}
          onOpenChange={handleVisibleThreadListChange}
          overlayClassName={s.popover}
        >
          <Tooltip title="子区列表" overlayClassName="toolTip">
            <span>
              <Icon iconClass={s.icon} size="24px" name="hashtag_message" />
            </span>
          </Tooltip>
        </Popover>
        <Tooltip title={channelMemberVisible ? "隐藏成员名单" : "显示成员名单"} overlayClassName="toolTip">
          <div
            onClick={() => {
              onHandleOperation("showMember");
            }}
          >
            <Icon iconClass={s.icon} size="24px" name="person_2" />
          </div>
        </Tooltip>
        {userRole && userRole !== USER_ROLE.user && (
          <Tooltip title="频道设置" overlayClassName="toolTip">
            <div
              onClick={() => {
                onHandleOperation("setting");
              }}
            >
              <Icon iconClass={s.icon} size="24px" name="gear" />
            </div>
          </Tooltip>
        )}
        <Menu
          onClick={onMenuClick}
          style={{ padding: 0 }}
          theme={"dark"}
          selectable={false}
          triggerSubMenuAction="click"
          mode="horizontal"
          items={menuInfo}
        ></Menu>
      </div>
    </HeaderWrap >
  );
};


const mapStateToProps = ({ app, server, channel }) => {
  return {
    channelInfo: app.currentChannelInfo,
    serverRole: app.serverRole,
    channelMemberVisible: channel.channelMemberVisible,
    categoryMap: server.categoryMap,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(memo(ChannelHeader));
