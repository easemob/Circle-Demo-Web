import React, { memo, useState, useEffect } from "react";
import s from "./index.module.less";
import HeaderWrap from "@/components/HeaderWrap";
import Icon from "@/components/Icon";
import { Popover, Menu, Tooltip } from "antd";
import { USER_ROLE } from "@/consts";
import ThreadList from "@/views/Thread/components/ThreadList";
import WebIM from "@/utils/WebIM";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteLocalChannel } from "@/utils/common"

const ChannelHeader = (props) => {
  const {
    onHandleOperation,
    channelId,
    serverId,
    setChannelInfo,
    channelInfo,
    serverRole,
    joinedServerInfo,
    channelMemberVisible
  } = props;
  //操作thread列表
  const [visibleThread, setVisibleThread] = useState(false);
  const userRole = serverRole[serverId];
  const getChannelInfo = ({ serverId, channelId }) => {
    WebIM.conn.getChannelDetail({ serverId, channelId }).then((res) => {
      setChannelInfo(res.data);
    });
  };

  const hideThreadList = () => {
    setVisibleThread(false);
  };
  const handleVisibleThreadListChange = (newVisible) => {
    setVisibleThread(newVisible);
  };

  useEffect(() => {
    getChannelInfo({
      serverId,
      channelId
    });
  }, [channelId, serverId]);

  let navigate = useNavigate();
  const onMenuClick = (e) => {
    if (e.key === "deleteChannel") {
      WebIM.conn.destroyChannel({ serverId, channelId }).then(() => {
        deleteLocalChannel(serverId, channelId, true);
        const list = joinedServerInfo.list || [];
        const findIndex = list.findIndex(item => item.id === serverId);
        if (findIndex > -1) {
          const defaultChannelId = list[findIndex].defaultChannelId;
          navigate(`/main/channel/${serverId}/${defaultChannelId}`);
        }
      })
    }
  }
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
          visible={visibleThread}
          onVisibleChange={handleVisibleThreadListChange}
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
        {channelInfo.defaultChannel === 0 && userRole && userRole === USER_ROLE.owner && (
          <Menu
            onClick={onMenuClick}
            style={{ padding: 0 }}
            theme={"dark"}
            selectable={false}
            triggerSubMenuAction="click"
            mode="horizontal"
            items={getChannelItems()}
          ></Menu>
        )}

      </div>
    </HeaderWrap >
  );
};
const getChannelItems = () => {
  return [
    {
      label: (
        <div className={s.iconCon}>
          <Icon iconClass={s.icon} name="ellipsis" size="24px" />
        </div>
      ),
      key: "SubMenu",
      children: [
        {
          label: (
            <div className={s.menuWrap}>
              <Icon name="trash" size="22px" />
              <span>删除频道</span>
            </div>
          ),
          key: "deleteChannel"
        },
      ]
    }
  ];
};
const mapStateToProps = ({ app, server, channel }) => {
  return {
    channelInfo: app.currentChannelInfo,
    serverRole: app.serverRole,
    joinedServerInfo: server.joinedServerInfo,
    channelMemberVisible: channel.channelMemberVisible,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setChannelInfo: (params) => {
      return dispatch({
        type: "app/setCurrentChannelInfo",
        payload: params
      });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(memo(ChannelHeader));
