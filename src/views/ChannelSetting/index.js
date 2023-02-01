import React, { memo, useState } from "react";
import s from "./index.module.less";
import { connect } from "react-redux";
import Sidebar from "@/components/SettingSideBar";
import { useParams, useNavigate } from "react-router-dom";
import OverView from "./components/OverView";
import Setting from "./components/Setting"
import {
    getConfirmModalConf,
    deleteLocalChannel,
    leaveRtcChannel
} from "@/utils/common";
import WebIM from "@/utils/WebIM";
import { Modal, message } from 'antd';
import { USER_ROLE } from "@/consts";

const getOperationList = ({ isDefaultChannel, selfRole }) => {
    const list = [
        {
            op: "overView",
            title: "概览",
            iconName: "info-01"
        },
        {
            op: "setting",
            title: "设置",
            iconName: "gear"
        }
    ];
    if (!isDefaultChannel && selfRole === USER_ROLE.owner) {
        list.push({
            op: "destroyChannel",
            title: "删除频道",
            iconName: "trash"
        })
    }
    return list;
}

const ServerSetting = (props) => {
    const { joinedServerInfo, currentChannelInfo, serverRole, settingChannelInfo, curRtcChannelInfo } = props;
    const selfRole = serverRole && serverRole[settingChannelInfo.serverId];
    const { serverId, channelId } = useParams();
    const [currentTab, setTab] = useState(0);
    const navigate = useNavigate();
    const onTabChange = (index) => {
        if (index !== 2) {
            setTab(index)
        } else {
            const conf = getConfirmModalConf({
                title: <div style={{ color: "#fff" }}>删除频道</div>,
                content: (
                    <div style={{ color: "#fff" }}>
                        {`确认删除频道`}&nbsp;<span style={{ fontWeight: 700 }}>{settingChannelInfo?.name}</span>{`？本操作不可恢复`}。
                    </div>
                ),
                onOk: () => {
                    WebIM.conn.destroyChannel({ serverId, channelId }).then(() => {
                        message.success("删除频道成功");
                        if (curRtcChannelInfo?.channelId === channelId) {
                            leaveRtcChannel({ needLeave: false, serverId, channelId }).then(() => {
                                deleteCb(serverId,channelId)
                            })
                        }else{
                            deleteCb(serverId,channelId)
                        }
                    }).catch(e => {
                        message.error("删除频道失败，请重试！");
                    })
                }
            });
            Modal.confirm(conf);
        }
    }
    const deleteCb = (serverId, channelId)=>{
        deleteLocalChannel({
            serverId,
            channelCategoryId: settingChannelInfo.channelCategoryId,
            channelId,
            isDestroy: true,
            isTransfer: false
        });
        //删除频道后后跳转到默认频道路由
        const list = joinedServerInfo.list || [];
        const findIndex = list.findIndex(item => item.id === serverId);
        if (findIndex > -1) {
            const defaultChannelId = list[findIndex].defaultChannelId;
            navigate(`/main/channel/${serverId}/${defaultChannelId}`);
        }
    }
    const goBack = () => {
        //路由跳转
        navigate(`/main/channel/${currentChannelInfo.serverId}/${currentChannelInfo.channelId}`);
    }
    return (
        <div className={s.layout}>
            <Sidebar
                operationList={getOperationList({ isDefaultChannel: settingChannelInfo.defaultChannel, selfRole })}
                onTabChange={onTabChange}
                currentTab={currentTab}
                context={settingChannelInfo.name}
                goBack={goBack}
            />
            {currentTab === 0 && <OverView
                currentChannelInfo={settingChannelInfo}
            />}
            {currentTab === 1 && <Setting
                currentChannelInfo={settingChannelInfo}
            />}
        </div>
    );
};
const mapStateToProps = ({ server, app, channel }) => {
    return {
        joinedServerInfo: server.joinedServerInfo,
        currentChannelInfo: app.currentChannelInfo,
        serverRole: app.serverRole,
        settingChannelInfo: channel.settingChannelInfo,
        curRtcChannelInfo: channel.curRtcChannelInfo
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
export default memo(connect(mapStateToProps, mapDispatchToProps)(ServerSetting));

