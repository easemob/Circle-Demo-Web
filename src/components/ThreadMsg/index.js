import s from "./index.module.less";
import React, { memo } from "react";
import Icon from "../Icon";
import AvatarInfo from "../AvatarInfo";
import { getTimeDiff, renderTxt } from "@/utils/common";
import { connect } from "react-redux";

const ThreadMsg = (props) => {
  const { thread, clickCount, appUserInfo } = props;
  const formatMsg = (message) => {
    const type = message.type;
    var msg = "";
    switch (type) {
      case "txt":
        msg = renderTxt(message.msg);
        break;
      case "file":
        msg = "/文件/";
        break;
      case "img":
        msg = "/图片消息/";
        break;
      default:
        break;
    }
    return msg;
  };
  return (
    <div className={s.main}>
      <div className={s.flag}>
        <Icon name="bend_line_big" size="20px" color="#767676" />
      </div>
      <div className={s.thread} onClick={clickCount}>
        <div className={s.layout}>
          <div className={s.info}>
            <div className={s.infoLeft}>
              <span className={s.icon}><Icon name="hashtag_message" size="18px" /></span>
              <span className={s.threadName}>{thread.name}</span>
            </div>
            <div className={s.count}>
              <span className={s.messageCount}>
                {thread.messageCount
                  ? thread.messageCount < 100
                    ? thread.messageCount
                    : "99+"
                  : 0}
              </span>
              <Icon name="shevron_right" size="12px" color="#27AE60" />
            </div>
          </div>
          {thread.lastMessage && JSON.stringify(thread.lastMessage) !== "{}" ? (
            <div className={s.content}>
              <div className={s.avatar}>
                <AvatarInfo
                  size={24}
                  src={appUserInfo[thread.lastMessage.from]?.avatarurl}
                />
              </div>
              <div className={s.message}>
                <div className={s.messageInfo}>
                  <span className={s.sender}>
                    {appUserInfo[thread.lastMessage.from]?.nickname ||
                      thread.lastMessage.from}
                  </span>
                  <span className={s.time}>
                    {getTimeDiff(thread.lastMessage.time)}
                  </span>
                </div>
                <div className={s.text}>{formatMsg(thread.lastMessage)}</div>
              </div>
            </div>
          ) : (
            <div className={s.content}>暂无消息</div>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ app }) => {
  return {
    appUserInfo: app.appUserInfo
  };
};

export default memo(connect(mapStateToProps, null)(ThreadMsg));
