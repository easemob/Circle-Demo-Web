import React, { memo, useState, useEffect } from "react";
import s from "./index.module.less";
import { connect } from "react-redux";
import Sidebar from "@/components/SettingSideBar";
import { useParams, useNavigate } from "react-router-dom";
import OverView from "./components/OverView";
import Setting from "./components/Setting"
import {
    getConfirmModalConf,
    deleteLocalChannel
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
    const { joinedServerInfo, setChannelInfo, currentChannelInfo, serverRole } = props;
    const selfRole = serverRole && serverRole[currentChannelInfo.serverId];
    const { serverId, channelId } = useParams();
    const [currentTab, setTab] = useState(0);
    const navigate = useNavigate();
    useEffect(() => {
        WebIM.conn.getChannelDetail({ serverId, channelId }).then((res) => {
            setChannelInfo(res.data);
        });
    }, [])
    const onTabChange = (index) => {
        if (index !== 2) {
            setTab(index)
        } else {
            const conf = getConfirmModalConf({
                title: <div style={{ color: "#fff" }}>删除频道</div>,
                content: (
                    <div style={{ color: "#fff" }}>
                        {`确认删除频道`}&nbsp;<span style={{ fontWeight: 700 }}>{currentChannelInfo?.name}</span>{`？本操作不可恢复`}。
                    </div>
                ),
                onOk: () => {
                    WebIM.conn.destroyChannel({ serverId, channelId }).then(() => {
                        message.success("删除频道成功");
                        deleteLocalChannel({
                            serverId,
                            channelCategoryId: currentChannelInfo.channelCategoryId,
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
                    }).catch(e => {
                        message.error("删除频道失败，请重试！");
                    })
                }
            });
            Modal.confirm(conf);
        }
    }
    const goBack = () => {
        //路由跳转
        navigate(`/main/channel/${serverId}/${channelId}`);
    }
    return (
        <div className={s.layout}>
            <Sidebar
                operationList={getOperationList({ isDefaultChannel: currentChannelInfo.defaultChannel, selfRole })}
                onTabChange={onTabChange}
                currentTab={currentTab}
                context={currentChannelInfo.name}
                goBack={goBack}
            />
            {currentTab === 0 && <OverView
                currentChannelInfo={currentChannelInfo}
            />}
            {currentTab === 1 && <Setting
                currentChannelInfo={currentChannelInfo}
            />}
        </div>
    );
};
const mapStateToProps = ({ server, app }) => {
    return {
        joinedServerInfo: server.joinedServerInfo,
        currentChannelInfo: app.currentChannelInfo,
        serverRole: app.serverRole,
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

