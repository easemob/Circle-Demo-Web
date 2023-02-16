import React, { useMemo, memo } from "react";
import s from "./index.module.less";
import AvatarInfo from "@/components/AvatarInfo";
import Icon from "@/components/Icon";
import { connect } from "react-redux";
import { Tooltip, message } from "antd";
import { rtc } from "@/utils/basicVoiceCall"
import { useParams, useNavigate } from "react-router-dom";
import { leaveRtcChannel } from "@/utils/common";
import { INVITE_TYPE } from "@/consts";


const RtcRoom = (props) => {
    const { userInfo, curRtcChannelInfo, rtcUserInfo, serverList, setInviteChannelInfo, setInviteVisible } = props;
    const handleMicState = (state) => {
        rtc.localAudioTrack.setEnabled(state);
    }
    const serverInfo = serverList.find((item) => item.id === curRtcChannelInfo.serverId);
    const navigate = useNavigate();
    const { serverId } = useParams();
    const goToCurServer = () => {
        if (curRtcChannelInfo.serverId !== serverId) {
            navigate(`/main/channel/${curRtcChannelInfo.serverId}/${serverInfo.defaultChannelId}`);
        }
    }
    //是否在语音频道
    const isInRtcRoom = useMemo(() => {
        return JSON.stringify(curRtcChannelInfo) === "{}" ? false : true;
    }, [curRtcChannelInfo])
    // 退出语音频道
    const leaveRtcRoom = () => {
        const { serverId, channelId } = curRtcChannelInfo;
        leaveRtcChannel({ needLeave: true, serverId, channelId }).then(() => {
            message.success({ content: "退出频道成功" });
        }).catch(() => {
            message.error({ content: "操作失败，请重试！" });
        })
    }
    //邀请用户加入语音频道
    const inviteUser = () => {
        setInviteChannelInfo({ inviteChannelInfo: curRtcChannelInfo });
        setInviteVisible(INVITE_TYPE.inviteChannel);
    }
    return (
        <div className={s.layout}>
            {isInRtcRoom && <div className={s.main}>
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
                            <div className={s.invite} onClick={inviteUser}>
                                <Icon name="person_plus" size="20px" color="#bdbdbd" />
                            </div>
                        </Tooltip>
                        <Tooltip
                            title="退出该语音频道"
                            overlayClassName="toolTip2"
                        >
                            <div className={s.close} onClick={leaveRtcRoom}>
                                <Icon name="power_line-01" iconClass={s.closeIcon} />
                            </div>
                        </Tooltip>
                    </div>
                </div>
                <div className={s.channelName} onClick={goToCurServer}>{serverInfo.name} - #{curRtcChannelInfo.name}</div>
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
            </div>}

        </div >
    );
};

const mapStateToProps = ({ app, channel, rtc, server }) => {
    return {
        userInfo: app.userInfo,
        curRtcChannelInfo: channel.curRtcChannelInfo,
        rtcUserInfo: rtc.rtcUserInfo,
        serverList: server.joinedServerInfo.list || []
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
    };
};
export default memo(connect(mapStateToProps, mapDispatchToProps)(RtcRoom));
