import React, { memo, useState } from "react";
import { connect } from "react-redux";
import s from "./index.module.less";
import HeaderWrap from "@/components/HeaderWrap";
import Icon from "@/components/Icon";
import { Switch, message, Slider } from 'antd';
import WebIM from "@/utils/WebIM";
import { updateLocalChannelDetail } from "@/utils/common"
import { useParams } from "react-router-dom";

const ChannelSetting = (props) => {
    const { currentChannelInfo, currentSettingChannelInfo, setCurrentChannelInfo, setSettingChannelInfo } = props;
    const { serverId, channelId } = useParams();
    const [isPublic, setIsPublic] = useState(currentSettingChannelInfo.isPublic)
    const Header = () => {
        return (<div className={s.header}>
            <span className={s.icon}><Icon name="gear" size="24px" /></span>
            <span className={s.title}>频道设置</span>
        </div>)
    }
    const editChannel = (type, value) => {
        WebIM.conn
            .updateChannel({
                [type]: value,
                serverId,
                channelId,
            })
            .then((res) => {
                message.success("编辑频道成功");
                setSettingChannelInfo({ ...res.data })
                if (currentChannelInfo.channelId === currentSettingChannelInfo.channelId) {
                    setCurrentChannelInfo({ ...res.data })
                }
                updateLocalChannelDetail("edit", serverId, currentSettingChannelInfo.channelCategoryId, { ...res.data, id: channelId });
            })
            .catch(() => {
                message.error("编辑频道失败");
            });
    }
    const [count, setCount] = useState(currentSettingChannelInfo?.seatCount || 8)

    return (
        <div className={s.layout}>
            <HeaderWrap children={Header()} />
            <div className={s.main}>
                {currentSettingChannelInfo.mode === 1 && <div className={s.type}>
                    <div className={s.title}>用户数</div>
                    <div className={s.setItem}>
                        <div className={s.content}>
                            <div className={s.range}>
                                <span className={s.isPublic}>人数上限</span>
                                <div className={s.sliderCon}>
                                    <Slider
                                        min={1}
                                        max={20}
                                        defaultValue={count}
                                        style={{ width: "660px" }}
                                        tooltip={{
                                            open: false,
                                        }}
                                        onChange={(count) => { setCount(count); editChannel("seatCount", count) }}
                                    />
                                </div>
                            </div>
                            <div className={s.totalNum}>{count}</div>
                        </div>
                    </div>
                    <div className={s.desc}>仅通过邀请的用户可以加入私密频道</div>
                </div>}
                <div className={s.type}>
                    <div className={s.title}>频道类型</div>
                    <div className={s.setItem}>
                        <div className={s.content}>
                            <span className={s.isPublic}>是否为公开频道</span>
                            <Switch checked={isPublic} onChange={(checked) => { editChannel("isPublic", checked); setIsPublic(checked) }} />
                        </div>
                    </div>
                    <div className={s.desc}>仅通过邀请的用户可以加入私密频道</div>
                </div>
            </div>
        </div>
    );
};
const mapStateToProps = ({ app }) => {
    return {
        currentChannelInfo: app.currentChannelInfo,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        setCurrentChannelInfo: (params) => {
            return dispatch({
                type: "app/setCurrentChannelInfo",
                payload: params,
            })
        },
        setSettingChannelInfo: (params) => {
            return dispatch({
                type: "channel/setSettingChannelInfo",
                payload: params,
            })
        },
    };
};
export default memo(connect(mapStateToProps, mapDispatchToProps)(ChannelSetting));

