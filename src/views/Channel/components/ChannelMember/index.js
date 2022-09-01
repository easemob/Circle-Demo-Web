import React, { memo, useEffect, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import s from "./index.module.less";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import WebIM from "@/utils/WebIM";
import { getUsersInfo } from "@/utils/common";
import MemberItem from "./memberItem";

const LIMIT = 50;

const SCROLL_WARP_ID = "channelMemberScrollWrap";

const ChannelMember = (props) => {
  const {
    appUserInfo,
    channelUserMap,
    setChannelUserMap,
    serverRole,
    channelInfo
  } = props;

  const { serverId, channelId } = useParams();

  const channelMemberInfo = useMemo(() => {
    return channelUserMap.get(channelId) || {};
  }, [channelId, channelUserMap]);

  const selfRole = serverRole && serverRole[serverId];

  const loadMoreData = () => {
    getChannelMembers({ cursor: channelMemberInfo?.cursor });
  };

  const getMutedlist = () => {
    WebIM.conn
      .getChannelMutelist({
        serverId,
        channelId
      })
      .then((res) => {
        getChannelMembers({ cursor: "", muteList: res.data.list });
      });
  };

  const getChannelMembers = ({ cursor = "", muteList = null }) => {
    WebIM.conn
      .getChannelMembers({
        serverId,
        channelId,
        pageSize: LIMIT,
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

  useEffect(() => {
    if (selfRole !== "user") {
      getMutedlist();
    } else {
      getChannelMembers({ cursor: "" });
    }
  }, [serverId, channelId, selfRole]);

  return (
    <div className={s.scrollWrap} id={SCROLL_WARP_ID}>
      <InfiniteScroll
        scrollableTarget={SCROLL_WARP_ID}
        dataLength={channelMemberInfo?.list?.length || 0}
        next={loadMoreData}
        hasMore={channelMemberInfo.loadCount === LIMIT}
        loader={<></>}
        endMessage={<></>}
      >
        {channelMemberInfo?.list?.map((item) => {
          return (
            <MemberItem
              style={{ padding: 0 }}
              info={appUserInfo[item.uid]}
              key={item.uid}
              uid={item.uid}
              role={item.role}
              serverRole={serverRole}
              channelMemberInfo={channelMemberInfo}
              setChannelUserMap={setChannelUserMap}
              muteList={channelMemberInfo?.muteList || []}
              channelInfo={channelInfo}
            ></MemberItem>
          );
        })}
      </InfiniteScroll>
    </div>
  );
};

const mapStateToProps = ({ app, channel }) => {
  return {
    appUserInfo: app.appUserInfo,
    channelUserMap: channel.channelUserMap,
    serverRole: app.serverRole,
    channelInfo: app.currentChannelInfo
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setChannelUserMap: (params) => {
      return dispatch({
        type: "channel/setChannelUserMap",
        payload: params
      });
    }
  };
};

export default memo(
  connect(mapStateToProps, mapDispatchToProps)(ChannelMember)
);
