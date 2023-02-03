import React, { memo } from "react";
import s from "./index.module.less";
import AvatarInfo from "@/components/AvatarInfo";
import Icon from "@/components/Icon";
import { connect } from "react-redux";
import { Tooltip } from "antd";
import { rtc } from "@/utils/basicVoiceCall"

const RtcRoom = (props) => {
    const { userInfo, invite, leave, curRtcChannelInfo, rtcUserInfo, serverInfo } = props;
    const handleMicState = (state) => {
        rtc.localAudioTrack.setEnabled(state);
    }
    return (
        <div className={s.layout}>
            <div className={s.main}>
                <div className={s.states}>
                    <div className={s.flags}>
                        <div className={s.rtc}>
                            <Icon name="voice-01" size="16px" />
                        </div>
                        <div className={s.status}>{rtc.client.connectionState === "CONNECTED" ? "语聊已连接" : "语聊连接中..."}</div>
                        <div className={s.signal}>
                            {rtc.client.connectionState === "CONNECTED" ? <span className={s.link}></span> : <span className={s.linking}></span>}
                        </div>
                    </div>
                    <div className={s.operation}>
                        <Tooltip
                            title="邀请好友"
                            overlayClassName="toolTip2"
                        >
                            <div className={s.invite} onClick={invite}>
                                <Icon name="person_plus" size="20px" color="#bdbdbd" />
                            </div>
                        </Tooltip>
                        <Tooltip
                            title="退出该语音频道"
                            overlayClassName="toolTip2"
                        >
                            <div className={s.close} onClick={leave}>
                                <Icon name="power_line-01" iconClass={s.closeIcon} />
                            </div>
                        </Tooltip>
                    </div>
                </div>
                <div className={s.channelName}>{serverInfo.name} - #{curRtcChannelInfo.name}</div>
                <div className={s.line}></div>
                <div className={s.user}>
                    <div className={s.userInfo}>
                        <div className={`${s.avatarCon} ${rtcUserInfo[userInfo?.username]?.volume >= 60 ? s.hasBorder : null}`}>
                            <AvatarInfo size={24} src={userInfo.avatarurl} />
                        </div>
                        <span className={s.userName}>{userInfo.nickname || userInfo.username}</span>
                    </div>
                    <Tooltip
                        title={rtc.localAudioTrack.enabled ? "静音" : "取消静音"}
                        overlayClassName="toolTip2"
                    >
                        {rtc.localAudioTrack.enabled && <span className={s.micLight}>
                            <Icon name="mic" iconClass={s.micIcon} onClick={() => handleMicState(false)} />
                        </span>}
                        {!rtc.localAudioTrack.enabled && <span className={s.mic}>
                            <Icon name="mic_slash" iconClass={s.micIcon} onClick={() => { handleMicState(true) }} /></span>}

                </Tooltip>
            </div>
        </div>
        </div >
    );
};

const mapStateToProps = ({ app, channel, rtc, server }) => {
    return {
        userInfo: app.userInfo,
        curRtcChannelInfo: channel.curRtcChannelInfo,
        rtcUserInfo: rtc.rtcUserInfo,
    };
};
export default memo(connect(mapStateToProps, null)(RtcRoom));
