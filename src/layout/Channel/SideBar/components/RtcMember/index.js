import React, { memo } from "react";
import AvatarInfo from "@/components/AvatarInfo"
import { connect } from "react-redux";
import s from "./index.module.less";
import Icon from "@/components/Icon";
import { rtc } from "@/utils/basicVoiceCall"

const RtcMember = ({ curUser, isInChannel, userInfo, rtcUserInfo }) => {
    return (
        <div className={s.layout}>
            <div className={s.info}>
                <div className={s.ava}>
                    <AvatarInfo size={26} src={userInfo?.avatarurl} />
                    {rtcUserInfo[userInfo?.uid]?.volume >= 60 && ((userInfo?.uid !== curUser.username && rtcUserInfo[userInfo?.uid]?.enabled) || (userInfo?.uid === curUser.username && rtc.localAudioTrack?.enabled)) && <div className={s.avaBorder}></div>}
                </div>
                <div className={s.name}>{userInfo?.nickname || userInfo?.uid}</div>
            </div>
            {((userInfo?.uid !== curUser.username && !rtcUserInfo[userInfo?.uid]?.enabled) ||
                ((userInfo?.uid === curUser.username) && (!rtc.localAudioTrack?.enabled))) &&
                isInChannel &&
                <div className={s.enabled}>
                    <Icon name="mic_slash" color="#767676" size="20px" />
                </div>}
        </div>
    );
};
const mapStateToProps = ({ app, rtc, channel }) => {
    return {
        curUser: app.userInfo,
        rtcUserInfo: rtc.rtcUserInfo,
        curRtcChannelInfo: channel.curRtcChannelInfo
    };
};
export default memo(connect(mapStateToProps, null)(RtcMember));
