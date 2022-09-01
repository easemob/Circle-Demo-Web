import React, { memo } from "react";
import s from "./index.module.less";
import MessageLeft from "@/components/MessageLeft";
import WebIM from "@/utils/WebIM";
import { connect } from "react-redux";
import { MESSAGE_ITEM_SOURCE } from "@/consts"

const OriginalMsg = (props) => {
    const { isCreatingThread, currentThreadInfo, appUserInfo } = props;
    const getName = (uid) => {
        return appUserInfo[uid]?.nickname ? appUserInfo[uid].nickname : uid
    }
    return (
        <div className={s.layout}>
            <div className={s.owner}>创建者：{isCreatingThread ? getName(WebIM.conn.user) : getName(currentThreadInfo.owner)}</div>
            {currentThreadInfo.parentMessage && JSON.stringify(currentThreadInfo.parentMessage) !== "{}" ? <div className={s.messageCon}>
                <MessageLeft message={currentThreadInfo.parentMessage} source={MESSAGE_ITEM_SOURCE.threadParentMsg} />
                <span className={s.up}>以上为原始消息</span>
            </div> : <div className={s.noMsg}>抱歉，无法加载原始消息</div>}
            <div className={s.lineCon}>
                <hr className={s.line} />
            </div>
        </div>
    );
};
const mapStateToProps = ({ app, channel, thread }) => {
    return {
        currentThreadInfo: thread.currentThreadInfo,
        isCreatingThread: thread.isCreatingThread,
        appUserInfo: app.appUserInfo
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleThreadPanel: (params) => {
            return dispatch({
                type: "thread/setThreadPanelStatus",
                payload: params
            })
        }
    };
};
export default memo(connect(mapStateToProps, mapDispatchToProps)(OriginalMsg));

