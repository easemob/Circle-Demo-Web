import React, { memo, useState, useEffect } from "react";
import s from "./index.module.less";
import AvatarInfo from "@/components/AvatarInfo";
import WebIM from "@/utils/WebIM";

const InviteModal = (props) => {
  const { serverId, isServerInvite, channelName } = props;
  const [serverInfo, setServerInfo] = useState({});

  useEffect(() => {
    WebIM.conn.getServerDetail({ serverId }).then((res) => {
      setServerInfo(res.data);
    });
  }, [serverId]);

  return (
    <div className={s.modalWrap}>
      <div className={s.joinServer}>
        <div className={s.info}>
          <div className={s.avatar}>
            <AvatarInfo size={56} isServer={true} src={serverInfo.icon} />
          </div>
          <div className={s.welcome}>
            <span className={s.title}>欢迎加入</span>
            {isServerInvite ? <span className={s.name}>{serverInfo.name}</span> : <span className={s.name}>{`${serverInfo.name}-#${channelName}`}</span>}
          </div>
        </div>
        <div className={s.desc}>{serverInfo.description}</div>
      </div>
    </div>
  );
};

export default memo(InviteModal);
